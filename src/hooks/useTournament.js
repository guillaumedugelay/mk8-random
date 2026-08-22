import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update } from 'firebase/database';
import { buildSchedule, generateChoices } from '../components/Tournament';

export function useTournament() {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tournRef = ref(db, 'tournament');
    const unsub = onValue(tournRef, snapshot => {
      setTournament(snapshot.val());
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Lance la phase de tirage (visible par tous)
  function startSpin({ manches, joueurs, circuitsMaudits, malusList, yoshiTarget, sansObjetTarget, luckyPlayer, wantedPlayer }) {
    set(ref(db, 'tournament'), {
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
    update(ref(db, 'tournament/flippedCards'), { [cardId]: true });
  }

  function triggerSpin() {
    update(ref(db, 'tournament'), { spinning: true });
  }

  function advanceSpin() {
    // Passe de yoshi → sansobjet
    update(ref(db, 'tournament'), { spinStep: 'sansobjet', spinning: false });
  }

  function markSpinDone() {
    // Les deux roues sont terminées, on attend le bouton
    update(ref(db, 'tournament'), { spinStep: 'done', spinning: false });
  }

  function finishSpin() {
    // Lance le vrai tournoi après les deux tirages
    const t = tournament;
    const specialRounds = { specialYoshi: t.yoshiTarget, specialSansObjet: t.sansObjetTarget };
    const schedule = buildSchedule(t.manches, Array.isArray(t.joueurs) ? t.joueurs : Object.values(t.joueurs), t.circuitsMaudits || {}, specialRounds, Array.isArray(t.malusList) ? t.malusList : Object.values(t.malusList || {}), { luckyPlayer: t.luckyPlayer, wantedPlayer: t.wantedPlayer });
    const joueurs = Array.isArray(t.joueurs) ? t.joueurs : Object.values(t.joueurs);
    const firstChoices = generateChoices([]);
    set(ref(db, 'tournament'), {
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
    update(ref(db, 'tournament'), { revealed: true });
  }

  function chooseCircuit(roundNum, circuitName) {
    update(ref(db, 'tournament/chosen'), { [roundNum]: circuitName });
  }

  function nextRound(newRound, alreadyChosen) {
    const nextChoices = generateChoices(alreadyChosen);
    const manches = tournament?.manches;
    const isHalftime = manches % 2 === 0 && newRound === manches / 2;
    update(ref(db, 'tournament'), {
      currentRound: newRound,
      currentChoices: nextChoices,
      revealed: false,
      ...(isHalftime ? { halftimeActive: true } : {}),
    });
  }

  function saveHalftimeScores(scores) {
    update(ref(db, 'tournament'), { halftimeScores: scores });
  }

  function confirmHalftime() {
    update(ref(db, 'tournament'), { halftimeActive: false });
  }

  function saveFinalScores(scores) {
    update(ref(db, 'tournament'), { finalScores: scores });
  }

  function savePodium(podiumResult) {
    update(ref(db, 'tournament'), { podiumResult });
  }

  function endTournament() {
    set(ref(db, 'tournament'), null);
  }

  return {
    tournament, loading,
    startSpin, triggerSpin, advanceSpin, markSpinDone, finishSpin, flipCard,
    revealCircuits, chooseCircuit, nextRound,
    saveHalftimeScores, confirmHalftime, saveFinalScores,
    savePodium, endTournament
  };
}
