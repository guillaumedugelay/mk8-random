import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update, push, remove } from 'firebase/database';
import { MALUS as DEFAULT_MALUS } from '../data/data';

export function useMalus() {
  const [malus, setMalus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const malusRef = ref(db, 'malus');
    const unsub = onValue(malusRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        setMalus(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      } else {
        // Premier lancement : on seed avec la liste par défaut
        const seed = {};
        DEFAULT_MALUS.forEach((m, i) => {
          seed[`default_${i}`] = m;
        });
        set(malusRef, seed);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function addMalus(item) {
    const newRef = push(ref(db, 'malus'));
    set(newRef, item);
  }

  function updateMalus(id, item) {
    update(ref(db, `malus/${id}`), item);
  }

  function deleteMalus(id) {
    remove(ref(db, `malus/${id}`));
  }

  return { malus, loading, addMalus, updateMalus, deleteMalus };
}
