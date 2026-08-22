import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update } from 'firebase/database';

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const playersRef = ref(db, 'players');
    const unsub = onValue(playersRef, snapshot => {
      const data = snapshot.val();
      setPlayers(data ? Object.values(data) : []);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  function addPlayer(name) {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const existant = players.find(p => p.name.toLowerCase() === trimmed.toLowerCase());
    if (existant) return existant.id;
    const id = Date.now();
    set(ref(db, `players/${id}`), {
      id,
      name: trimmed,
      circuitMaudit: '',
      avatarId: '',
      citation: '',
      streak: 0,
      bestStreak: 0,
      stats: { played: 0, first: 0, second: 0, third: 0 }
    });
    return id;
  }

  function deletePlayer(id) {
    set(ref(db, `players/${id}`), null);
  }

  function updateCircuitMaudit(id, circuit) {
    update(ref(db, `players/${id}`), { circuitMaudit: circuit });
  }

  function recordResults(podiumResult, participants = [], destiny = {}) {
    const { luckyPlayer, wantedPlayer } = destiny;
    for (const player of players) {
      const didParticipate = participants.includes(player.name);
      if (!didParticipate) continue; // n'a pas joué → streak inchangé

      const pos = Object.entries(podiumResult).find(([, names]) => names.includes(player.name));
      const place = pos ? parseInt(pos[0]) : null;
      const isFirst = place === 1;
      const currentStreak = player.streak || 0;
      const newStreak = isFirst ? currentStreak + 1 : 0;
      const newBestStreak = Math.max(player.bestStreak || 0, newStreak);

      update(ref(db, `players/${player.id}`), {
        streak: newStreak,
        bestStreak: newBestStreak,
        luckyCount: (player.luckyCount || 0) + (player.name === luckyPlayer ? 1 : 0),
        blackCatCount: (player.blackCatCount || 0) + (player.name === wantedPlayer ? 1 : 0),
        stats: {
          played: player.stats.played + 1,
          first: player.stats.first + (isFirst ? 1 : 0),
          second: player.stats.second + (place === 2 ? 1 : 0),
          third: player.stats.third + (place === 3 ? 1 : 0),
        }
      });
    }
  }

  function updateAvatar(id, avatarId) {
    update(ref(db, `players/${id}`), { avatarId });
  }

  function updateCitation(id, citation) {
    update(ref(db, `players/${id}`), { citation });
  }

  // « C'est moi » : rattache une fiche joueur à l'appareil. Sert uniquement à
  // l'affichage — mettre son nom en évidence, saluer à l'accueil. Ça ne donne
  // aucun droit particulier : tout le monde continue de pouvoir tout éditer,
  // sans quoi les fiches de ceux qui n'ont pas l'app deviendraient intouchables.
  function claimPlayer(id, uid) {
    if (!uid) return;
    // Un appareil ne peut être qu'un seul joueur : on libère l'ancienne fiche.
    for (const p of players) {
      if (p.uid === uid && p.id !== id) update(ref(db, `players/${p.id}`), { uid: null });
    }
    update(ref(db, `players/${id}`), { uid });
  }

  // Les doublons comptent : on incrémente plutôt que d'écraser.
  function grantSticker(playerName, stickerId) {
    const player = players.find(p => p.name === playerName);
    if (!player) return;
    const actuel = (player.stickers && player.stickers[stickerId]) || 0;
    update(ref(db, `players/${player.id}/stickers`), { [stickerId]: actuel + 1 });
    // Le tout premier sticker se met en vitrine tout seul : sans ça, il faudrait
    // aller le sélectionner dans les réglages pour que quiconque le voie.
    const dejaEnVitrine = Array.isArray(player.showcase) && player.showcase.length > 0;
    if (!dejaEnVitrine) update(ref(db, `players/${player.id}`), { showcase: [stickerId] });
  }

  function setShowcase(id, showcase) {
    update(ref(db, `players/${id}`), { showcase: showcase.length ? showcase : null });
  }

  function unclaimPlayer(id) {
    update(ref(db, `players/${id}`), { uid: null });
  }

  return {
    players, loaded, addPlayer, deletePlayer, recordResults,
    updateCircuitMaudit, updateAvatar, updateCitation,
    claimPlayer, unclaimPlayer, grantSticker, setShowcase,
  };
}
