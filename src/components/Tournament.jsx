import { CIRCUITS, MALUS, PERSONNAGES, KARTS, ROUES } from '../data/data';
import Round from './Round';
import MiTemps from './MiTemps';
import ScoreEntry from './ScoreEntry';
import FinalRanking from './FinalRanking';

function randInt(max) {
  return Math.floor(Math.random() * max);
}

function pickDistinct3(pool) {
  const copy = [...pool];
  const chosen = [];
  while (chosen.length < Math.min(3, copy.length)) {
    const i = randInt(copy.length);
    chosen.push(copy[i]);
    copy.splice(i, 1);
  }
  return chosen;
}

// Génère les 3 choix pour une manche donnée en excluant les circuits déjà joués
export function generateChoices(alreadyChosen = []) {
  const pool = CIRCUITS.filter(c => !alreadyChosen.includes(c));
  return pickDistinct3(pool);
}

export function buildSchedule(manches, joueurs, circuitsMaudits = {}, specialRounds = {}, malusList = null, destiny = {}) {
  const cptMalus = Object.fromEntries(joueurs.map(j => [j, 0]));
  const NB_MALUS_MAX = 3;
  const { specialSansObjet, specialYoshi } = specialRounds;
  const effectiveMalus = (malusList && malusList.length > 0) ? malusList : MALUS;
  const { luckyPlayer, wantedPlayer } = destiny;
  // Compteur de bonus/malus reçus par type, pour les cartes du destin
  const typeCount = Object.fromEntries(joueurs.map(j => [j, { bonus: 0, malus: 0 }]));

  // On ne pré-génère PAS les choices ici — elles seront générées dynamiquement
  return Array.from({ length: manches }, (_, idx) => {
    const m = idx + 1;
    const isSansObjet = m === specialSansObjet;
    const isYoshi = m === specialYoshi;

    const malusParJoueur = {};
    const usedUnique = new Set();
    if (!isSansObjet && !isYoshi) {
      for (const joueur of joueurs) {
        const remaining = manches - m + 1;
        const malusRestants = NB_MALUS_MAX - cptMalus[joueur];
        if (malusRestants > 0 && Math.random() < malusRestants / remaining) {
          {
            let pool = effectiveMalus.filter(ml => !ml.unique || usedUnique.size === 0);
            // Cartes du destin : le veinard reçoit au moins 2 bonus,
            // le chat noir au moins 2 malus (le 3ème reste aléatoire)
            if (joueur === luckyPlayer && typeCount[joueur].bonus < 2) {
              const bonusPool = pool.filter(ml => ml.type === 'bonus');
              if (bonusPool.length > 0) pool = bonusPool;
            } else if (joueur === wantedPlayer && typeCount[joueur].malus < 2) {
              const malusPool = pool.filter(ml => ml.type === 'malus');
              if (malusPool.length > 0) pool = malusPool;
            }
            if (pool.length === 0) continue;
            const ml = pool[randInt(pool.length)];
            let extraValue = null;
            if (ml.extra === 'personnage') extraValue = PERSONNAGES[randInt(PERSONNAGES.length)];
            if (ml.extra === 'kart') extraValue = KARTS[randInt(KARTS.length)];
            if (ml.extra === 'roues') extraValue = ROUES[randInt(ROUES.length)];
            if (ml.extra === 'maudit') extraValue = circuitsMaudits[joueur] || '(non défini)';
            if (ml.unique) usedUnique.add(ml.texte);
            typeCount[joueur][ml.type === 'bonus' ? 'bonus' : 'malus']++;
            malusParJoueur[joueur] = { ...ml, extraValue };
          }
          cptMalus[joueur]++;
        }
      }
    }

    return { num: m, isSansObjet, isYoshi, malusParJoueur };
  });
}

// Combine les scores mi-temps + 2e moitié en totaux par joueur
export function combineScores(halftimeScores, finalScores, joueurs) {
  const h = halftimeScores && typeof halftimeScores === 'object' ? halftimeScores : {};
  const f = finalScores && typeof finalScores === 'object' ? finalScores : {};
  return Object.fromEntries(joueurs.map(j => [j, {
    champPoints: (h[j]?.champPoints || 0) + (f[j]?.champPoints || 0),
    inGamePoints: (h[j]?.inGamePoints || 0) + (f[j]?.inGamePoints || 0),
  }]));
}

function calculateFinalRanking(scores, joueurs) {
  return [...joueurs].sort((a, b) => {
    const cd = (scores[b]?.champPoints || 0) - (scores[a]?.champPoints || 0);
    if (cd !== 0) return cd;
    return (scores[b]?.inGamePoints || 0) - (scores[a]?.inGamePoints || 0);
  });
}

export default function Tournament({
  tournament, playersMap = {}, playersList = [],
  onReveal, onChoose, onNext,
  onSaveHalftimeScores, onConfirmHalftime,
  onFinalScoresDone, onRestart,
}) {
  const { manches, currentRound, chosen = {}, revealed = false, currentChoices = [], halftimeActive, halftimeScores, finalScores, luckyPlayer, wantedPlayer, stickerDrops = {} } = tournament;

  // Firebase convertit les tableaux en objets — on reconvertit
  const joueurs = Array.isArray(tournament.joueurs)
    ? tournament.joueurs
    : Object.values(tournament.joueurs || {});
  const schedule = Array.isArray(tournament.schedule)
    ? tournament.schedule
    : Object.values(tournament.schedule || {});

  // Calcul du cumul malus/bonus par joueur jusqu'à la manche en cours (incluse)
  const malusCount = Object.fromEntries(joueurs.map(j => [j, 0]));
  for (let i = 0; i <= currentRound && i < schedule.length; i++) {
    const r = schedule[i];
    const mlp = r?.malusParJoueur || {};
    for (const joueur of joueurs) {
      if (mlp[joueur]) malusCount[joueur]++;
    }
  }

  const isFinished = currentRound >= manches;
  const rawRound = schedule ? schedule[currentRound] : null;
  const choicesRaw = Array.isArray(currentChoices) ? currentChoices : Object.values(currentChoices || {});
  const alreadyChosen = Object.values(chosen).filter(Boolean);
  const choices = choicesRaw.length > 0 ? choicesRaw : generateChoices(alreadyChosen);
  const round = rawRound ? {
    ...rawRound,
    choices,
    malusParJoueur: rawRound.malusParJoueur || {},
  } : null;

  function handleChoose(circuit) {
    onChoose(round.num, circuit);
  }

  function handleNext() {
    const alreadyChosen = Object.values(chosen).filter(Boolean);
    onNext(currentRound + 1, alreadyChosen);
  }

  const header = (
    <div className="tournament-header">
      <button className="btn btn-secondary btn-sm back-btn" onClick={() => { if (window.confirm('Abandonner le tournoi en cours ?')) onRestart(); }}>← Quitter</button>
      <h2>Tournoi MK8 Random Racers</h2>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(Math.min(currentRound, manches) / manches) * 100}%` }} />
      </div>
      <span className="progress-label">Manche {Math.min(currentRound + 1, manches)} / {manches}</span>
      <div className="special-rounds-reminder">
        {schedule.find(r => r.isYoshi) && (
          <span className={`reminder-badge ${schedule[currentRound]?.isYoshi ? 'reminder-active' : ''}`}>
            🏎️ Yoshi-course : manche {schedule.find(r => r.isYoshi)?.num}
          </span>
        )}
        {schedule.find(r => r.isSansObjet) && (
          <span className={`reminder-badge ${schedule[currentRound]?.isSansObjet ? 'reminder-active' : ''}`}>
            🚫 Course sans objet : manche {schedule.find(r => r.isSansObjet)?.num}
          </span>
        )}
      </div>
    </div>
  );

  // Écran mi-temps (synchronisé via Firebase)
  if (halftimeActive) {
    return (
      <div className="screen tournament-screen">
        {header}
        <MiTemps
          joueurs={joueurs}
          savedScores={halftimeScores}
          stickerDrops={stickerDrops.halftime}
          onSaveScores={onSaveHalftimeScores}
          onContinue={onConfirmHalftime}
        />
      </div>
    );
  }

  return (
    <div className="screen tournament-screen">
      {header}

      {!isFinished ? (
        round && choices.length > 0 ? (
          <Round
            round={round}
            joueurs={joueurs}
            playersMap={playersMap}
            malusCount={malusCount}
            chosen={chosen[round.num]}
            revealed={revealed}
            onReveal={onReveal}
            onChoose={handleChoose}
            onNext={handleNext}
            luckyPlayer={luckyPlayer}
            wantedPlayer={wantedPlayer}
          />
        ) : (
          <div className="loading">
            <p>Chargement de la manche...</p>
            <p style={{ fontSize: '0.8rem', marginTop: 8, opacity: 0.5 }}>Si ça persiste, rechargez la page</p>
          </div>
        )
      ) : finalScores ? (
        (() => {
          const totals = combineScores(halftimeScores, finalScores, joueurs);
          return (
            <FinalRanking
              ranking={calculateFinalRanking(totals, joueurs)}
              scores={totals}
              playersList={playersList}
              luckyPlayer={luckyPlayer}
              wantedPlayer={wantedPlayer}
              stickerDrops={stickerDrops.final}
              onRestart={onRestart}
            />
          );
        })()
      ) : (
        <div className="finished">
          <h2>Manches terminées ! 🏁</h2>
          <p>Récapitulatif des circuits joués :</p>
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
          <div className="final-score-entry-section">
            <h3>Saisissez vos scores de la 2ème moitié</h3>
            <p className="score-entry-hint">Position et points en jeu du 2ème tournoi MK — le classement cumulera les deux moitiés</p>
            <ScoreEntry
              joueurs={joueurs}
              onSave={(scores) => onFinalScoresDone(scores, joueurs)}
              saveLabel="Calculer le classement 🏆"
            />
          </div>
        </div>
      )}
    </div>
  );
}
