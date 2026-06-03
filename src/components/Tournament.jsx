import { useState } from 'react';
import { CIRCUITS, MALUS, BONUS_EMEU, PERSONNAGES, KARTS, ROUES, CIRCUITS_MAUDITS } from '../data/data';
import Round from './Round';

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function pickDistinct3(pool) {
  const indices = [];
  while (indices.length < Math.min(3, pool.length)) {
    const i = randInt(pool.length);
    if (!indices.includes(i)) indices.push(i);
  }
  return indices;
}

function buildSchedule(manches, joueurs) {
  const pool = [...CIRCUITS];
  const cptMalus = Object.fromEntries(joueurs.map(j => [j, 0]));
  const NB_MALUS_MAX = 3;

  const specialSansObjet = randInt(manches) + 1;
  let specialYoshi;
  do { specialYoshi = randInt(manches) + 1; } while (specialYoshi === specialSansObjet);

  return Array.from({ length: manches }, (_, idx) => {
    const m = idx + 1;
    const localIndices = pickDistinct3(pool);
    const choices = localIndices.map(i => pool[i]);
    const isSansObjet = m === specialSansObjet;
    const isYoshi = m === specialYoshi;

    const malusParJoueur = {};
    if (!isSansObjet && !isYoshi) {
      for (const joueur of joueurs) {
        const remaining = manches - m + 1;
        const malusRestants = NB_MALUS_MAX - cptMalus[joueur];
        if (malusRestants > 0 && Math.random() < malusRestants / remaining) {
          if (joueur.toLowerCase() === 'emeu') {
            malusParJoueur[joueur] = { texte: BONUS_EMEU[randInt(BONUS_EMEU.length)], type: 'bonus', extraValue: null };
          } else {
            const ml = MALUS[randInt(MALUS.length)];
            let extraValue = null;
            if (ml.extra === 'personnage') extraValue = PERSONNAGES[randInt(PERSONNAGES.length)];
            if (ml.extra === 'kart') extraValue = KARTS[randInt(KARTS.length)];
            if (ml.extra === 'roues') extraValue = ROUES[randInt(ROUES.length)];
            if (ml.extra === 'maudit') extraValue = CIRCUITS_MAUDITS[joueur] || '???';
            malusParJoueur[joueur] = { ...ml, extraValue };
          }
          cptMalus[joueur]++;
        }
      }
    }

    return { num: m, choices, localIndices, isSansObjet, isYoshi, malusParJoueur };
  });
}

export default function Tournament({ config, onRestart }) {
  const { manches, joueurs } = config;
  const [schedule] = useState(() => buildSchedule(manches, joueurs));
  const [currentRound, setCurrentRound] = useState(0);
  const [chosen, setChosen] = useState({});

  function handleChoose(roundNum, circuitName) {
    setChosen(prev => ({ ...prev, [roundNum]: circuitName }));
  }

  function handleNext() {
    setCurrentRound(r => r + 1);
  }

  const isFinished = currentRound >= manches;
  const round = schedule[currentRound];

  return (
    <div className="screen tournament-screen">
      <div className="tournament-header">
        <h2>Tournoi MK8 Random Racers</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentRound / manches) * 100}%` }} />
        </div>
        <span className="progress-label">Manche {Math.min(currentRound + 1, manches)} / {manches}</span>
      </div>

      {!isFinished ? (
        <Round
          round={round}
          joueurs={joueurs}
          chosen={chosen[round.num]}
          onChoose={(circuit) => handleChoose(round.num, circuit)}
          onNext={handleNext}
        />
      ) : (
        <div className="finished">
          <h2>Tournoi terminé !</h2>
          <p>Récapitulatif des manches jouées :</p>
          <div className="summary">
            {schedule.map(r => (
              <div key={r.num} className="summary-row">
                <span className="summary-num">Manche {r.num}</span>
                <span className="summary-circuit">{chosen[r.num] || '—'}</span>
                {r.isSansObjet && <span className="badge badge-warning">Sans objets</span>}
                {r.isYoshi && <span className="badge badge-yoshi">Yoshi-course</span>}
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-large" onClick={onRestart}>Nouveau tournoi</button>
        </div>
      )}
    </div>
  );
}
