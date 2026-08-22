import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update } from 'firebase/database';

export function usePlayers() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const playersRef = ref(db, 'players');
    const unsub = onValue(playersRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        setPlayers(Object.values(data));
      } else {
        setPlayers([]);
      }
    });
    return () => unsub();
  }, []);

  function addPlayer(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (players.find(p => p.name.toLowerCase() === trimmed.toLowerCase())) return;
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

  return { players, addPlayer, deletePlayer, recordResults, updateCircuitMaudit, updateAvatar, updateCitation };
}
