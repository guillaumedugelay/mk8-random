import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update, push, onDisconnect, serverTimestamp } from 'firebase/database';
import { buildSchedule, generateChoices } from '../components/Tournament';
import { readStoredCode, storeCode } from '../lib/tournamentCode';

// Le tournoi vit sous tournaments/{code} : plusieurs parties peuvent tourner
// en parallèle sans se voir. Avant, tout le monde écrivait sur /tournament et
// deux tournois lancés en même temps s'écrasaient en pleine manche.
//
// Le hook porte aussi le code actif, mémorisé sur l'appareil : c'est ce qui
// permet de fermer l'app en pleine soirée et de retomber sur la manche en cours.
export function useTournament(uid) {
  const [code, setCode] = useState(() => readStoredCode());
  const [snap, setSnap] = useState({ code: null, value: null });

  const activateCode = useCallback(newCode => {
    storeCode(newCode);
    setCode(newCode);
  }, []);

  const clearCode = useCallback(() => {
    storeCode(null);
    setCode(null);
  }, []);

  useEffect(() => {
    if (!code) return;
    const tournRef = ref(db, `tournaments/${code}`);
    const unsub = onValue(tournRef, snapshot => {
      const value = snapshot.val();
      if (value === null) {
        // Le tournoi a été terminé, ou le code mémorisé est périmé.
        storeCode(null);
        setCode(null);
        return;
      }
      setSnap({ code, value });
    });
    return () => unsub();
  }, [code]);

  // On ignore un instantané qui porte encore le code précédent : sinon, le
  // temps que la nouvelle souscription réponde, on afficherait l'ancien tournoi.
  const tournament = code && snap.code === code ? snap.value : null;
  const loading = code ? snap.code !== code : false;

  // Présence : purement informatif, ça ne conditionne jamais le démarrage.
  // Ce qui fait foi, c'est la sélection des joueurs dans le Setup.
  useEffect(() => {
    if (!code || !uid) return;
    const presence = ref(db, `tournaments/${code}/connected/${uid}`);
    set(presence, serverTimestamp());
    const cancel = onDisconnect(presence).remove();
    return () => {
      cancel.cancel().catch(() => {});
      set(presence, null).catch(() => {});
    };
  }, [code, uid]);

  const base = () => ref(db, `tournaments/${code}`);

  // Lance la phase de tirage (visible par tous)
  function startSpin({ manches, joueurs, circuitsMaudits, malusList, yoshiTarget, sansObjetTarget, luckyPlayer, wantedPlayer }) {
    update(base(), {
      status: 'spinning',
      manches,
      joueurs,
      circuitsMaudits,
      malusList: malusList || [],
      yoshiTarget,
      sansObjetTarget,
      luckyPlayer: luckyPlayer || null,
      wantedPlayer: wantedPlayer || null,
      flippedCards: { lucky: false, wanted: false },
      spinStep: 'yoshi',   // 'yoshi' | 'sansobjet' | 'done'
      spinning: false,      // la roue tourne-t-elle ?
    });
  }

  function flipCard(cardId) {
    update(ref(db, `tournaments/${code}/flippedCards`), { [cardId]: true });
  }

  function triggerSpin() {
    update(base(), { spinning: true });
  }

  function advanceSpin() {
    // Passe de yoshi → sansobjet
    update(base(), { spinStep: 'sansobjet', spinning: false });
  }

  function markSpinDone() {
    // Les deux roues sont terminées, on attend le bouton
    update(base(), { spinStep: 'done', spinning: false });
  }

  function finishSpin() {
    // Lance le vrai tournoi après les deux tirages
    const t = tournament;
    const specialRounds = { specialYoshi: t.yoshiTarget, specialSansObjet: t.sansObjetTarget };
    const schedule = buildSchedule(t.manches, Array.isArray(t.joueurs) ? t.joueurs : Object.values(t.joueurs), t.circuitsMaudits || {}, specialRounds, Array.isArray(t.malusList) ? t.malusList : Object.values(t.malusList || {}), { luckyPlayer: t.luckyPlayer, wantedPlayer: t.wantedPlayer });
    const joueurs = Array.isArray(t.joueurs) ? t.joueurs : Object.values(t.joueurs);
    const firstChoices = generateChoices([]);
    update(base(), {
      status: 'playing',
      manches: t.manches,
      joueurs,
      circuitsMaudits: t.circuitsMaudits,
      schedule,
      currentRound: 0,
      chosen: {},
      currentChoices: firstChoices,
      revealed: false,
      podiumResult: null,
      luckyPlayer: t.luckyPlayer || null,
      wantedPlayer: t.wantedPlayer || null,
    });
  }

  function revealCircuits() {
    update(base(), { revealed: true });
  }

  function chooseCircuit(roundNum, circuitName) {
    update(ref(db, `tournaments/${code}/chosen`), { [roundNum]: circuitName });
  }

  function nextRound(newRound, alreadyChosen) {
    const nextChoices = generateChoices(alreadyChosen);
    const manches = tournament?.manches;
    const isHalftime = manches % 2 === 0 && newRound === manches / 2;
    update(base(), {
      currentRound: newRound,
      currentChoices: nextChoices,
      revealed: false,
      ...(isHalftime ? { halftimeActive: true } : {}),
    });
  }

  function saveHalftimeScores(scores) {
    update(base(), { halftimeScores: scores });
  }

  function confirmHalftime() {
    update(base(), { halftimeActive: false });
  }

  function saveFinalScores(scores) {
    update(base(), { finalScores: scores });
  }

  function savePodium(podiumResult) {
    update(base(), { podiumResult });
  }

  // Archive puis supprime. Avant, endTournament faisait un set(null) sec et le
  // déroulé complet de la soirée partait à la poubelle.
  // On n'archive qu'un tournoi réellement terminé : un abandon ne mérite pas
  // une ligne dans l'historique.
  async function endTournament() {
    if (!code) return;
    const t = tournament;
    if (t && t.finalScores) {
      const { connected, ...rest } = t; // la présence n'a aucun intérêt à survivre
      void connected;
      await set(push(ref(db, 'history')), {
        ...rest,
        code,
        finishedAt: Date.now(),
      });
    }
    await set(ref(db, `tournaments/${code}`), null);
  }

  return {
    tournament, loading, code, activateCode, clearCode,
    startSpin, triggerSpin, advanceSpin, markSpinDone, finishSpin, flipCard,
    revealCircuits, chooseCircuit, nextRound,
    saveHalftimeScores, confirmHalftime, saveFinalScores,
    savePodium, endTournament
  };
}
