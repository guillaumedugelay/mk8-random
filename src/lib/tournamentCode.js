import { db } from '../firebase';
import { ref, get, runTransaction, remove } from 'firebase/database';

const STORAGE_KEY = 'mk8.activeCode';
const STALE_MS = 24 * 60 * 60 * 1000; // 24 h

// Un code de session éphémère : 4 chiffres, pour que le téléphone ouvre le
// clavier numérique et qu'on puisse le crier à travers le salon.
function randomCode() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

export function isValidCode(code) {
  return typeof code === 'string' && /^\d{4}$/.test(code);
}

// Réserve un code libre. La transaction évite que deux téléphones qui lancent
// au même instant tombent sur le même code.
export async function createTournamentCode(hostUid) {
  for (let attempt = 0; attempt < 25; attempt++) {
    const code = randomCode();
    const node = ref(db, `tournaments/${code}`);
    const result = await runTransaction(node, current => {
      if (current !== null) return; // déjà pris → on abandonne cette tentative
      return {
        status: 'lobby',
        createdAt: Date.now(),
        hostUid: hostUid || null,
      };
    });
    if (result.committed) return code;
  }
  throw new Error('Impossible de trouver un code libre. Réessaie dans un instant.');
}

export async function tournamentExists(code) {
  const snap = await get(ref(db, `tournaments/${code}/status`));
  return snap.exists();
}

// Les tournois abandonnés sans être terminés ne se suppriment jamais tout
// seuls. Sans ce ménage, les codes fantômes finissent par manger les 10 000.
export async function cleanupStaleTournaments() {
  const snap = await get(ref(db, 'tournaments'));
  const all = snap.val();
  if (!all) return 0;
  const cutoff = Date.now() - STALE_MS;
  const dead = Object.entries(all).filter(([, t]) => (t?.createdAt || 0) < cutoff);
  await Promise.all(dead.map(([code]) => remove(ref(db, `tournaments/${code}`))));
  return dead.length;
}

// Le code actif est mémorisé sur l'appareil : c'est ce qui permet de fermer
// l'app en pleine soirée et de retomber sur la manche en cours.
export function readStoredCode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isValidCode(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeCode(code) {
  try {
    if (code) localStorage.setItem(STORAGE_KEY, code);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // navigation privée, stockage plein — on continue sans mémoriser
  }
}
