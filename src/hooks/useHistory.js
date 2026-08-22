import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, remove, query, orderByChild, limitToLast } from 'firebase/database';

// L'historique des soirées, de la plus récente à la plus ancienne.
export function useHistory(max = 20) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(ref(db, 'history'), orderByChild('finishedAt'), limitToLast(max));
    const unsub = onValue(q, snapshot => {
      const data = snapshot.val();
      const list = data
        ? Object.entries(data)
            .map(([id, val]) => ({ id, ...val }))
            .sort((a, b) => (b.finishedAt || 0) - (a.finishedAt || 0))
        : [];
      setEntries(list);
      setLoading(false);
    });
    return () => unsub();
  }, [max]);

  // Une soirée archivée ne peut pas être modifiée — mais elle peut être
  // effacée, pour rattraper un tournoi qui s'est archivé de travers.
  function deleteEntry(id) {
    return remove(ref(db, `history/${id}`));
  }

  return { entries, loading, deleteEntry };
}

// Firebase transforme les tableaux en objets dès qu'il y a un trou.
// Toutes les vues d'historique passent par là plutôt que de le redécouvrir.
export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

// Le classement d'une soirée archivée, reconstruit depuis les scores cumulés.
export function rankingOf(entry) {
  const joueurs = toArray(entry.joueurs);
  const h = entry.halftimeScores || {};
  const f = entry.finalScores || {};
  const totals = Object.fromEntries(joueurs.map(j => [j, {
    champPoints: (h[j]?.champPoints || 0) + (f[j]?.champPoints || 0),
    inGamePoints: (h[j]?.inGamePoints || 0) + (f[j]?.inGamePoints || 0),
  }]));
  const sorted = [...joueurs].sort((a, b) => {
    const cd = (totals[b]?.champPoints || 0) - (totals[a]?.champPoints || 0);
    if (cd !== 0) return cd;
    return (totals[b]?.inGamePoints || 0) - (totals[a]?.inGamePoints || 0);
  });
  return { sorted, totals };
}

export function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
