import { useState } from 'react';
import { usePlayers } from './hooks/usePlayers';
import { useTournament } from './hooks/useTournament';
import Welcome from './components/Welcome';
import Setup from './components/Setup';
import Tournament, { combineScores } from './components/Tournament';
import ManagePlayers from './components/ManagePlayers';
import Stats from './components/Stats';
import SpinPhase from './components/SpinPhase';
import ChefLogin from './components/ChefLogin';
import ChefBureau from './components/ChefBureau';
import { useMalus } from './hooks/useMalus';
import './App.css';

function randInt(max) { return Math.floor(Math.random() * max); }

function pickYoshi(manches) { return randInt(manches) + 1; }

function pickSansObjet(manches, yoshiRound) {
  const half = Math.floor(manches / 2);
  let pool = yoshiRound <= half
    ? Array.from({ length: manches - half - 1 }, (_, i) => half + 2 + i)
    : Array.from({ length: half - 1 }, (_, i) => 2 + i);
  if (pool.length === 0) pool = Array.from({ length: manches }, (_, i) => i + 1).filter(i => i !== yoshiRound);
  if (pool.length === 0) return -1;
  return pool[randInt(pool.length)];
}

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [chefUnlocked, setChefUnlocked] = useState(false);
  const { players, addPlayer, deletePlayer, recordResults, updateCircuitMaudit, updateAvatar, updateCitation } = usePlayers();
  const { malus } = useMalus();
  const { tournament, loading, startSpin, triggerSpin, advanceSpin, markSpinDone, finishSpin, revealCircuits, chooseCircuit, nextRound, saveHalftimeScores, confirmHalftime, saveFinalScores, endTournament, flipCard } = useTournament();

  function handleSetupDone(cfg) {
    const circuitsMaudits = Object.fromEntries(
      players.filter(p => p.circuitMaudit).map(p => [p.name, p.circuitMaudit])
    );
    const yoshiTarget = pickYoshi(cfg.manches);
    const sansObjetTarget = pickSansObjet(cfg.manches, yoshiTarget);
    // Tirage des cartes du destin : deux joueurs distincts si possible
    const luckyPlayer = cfg.joueurs[randInt(cfg.joueurs.length)];
    const others = cfg.joueurs.filter(j => j !== luckyPlayer);
    const wantedPlayer = others.length > 0 ? others[randInt(others.length)] : luckyPlayer;
    startSpin({
      manches: cfg.manches,
      joueurs: cfg.joueurs,
      circuitsMaudits,
      malusList: malus,
      yoshiTarget,
      sansObjetTarget,
      luckyPlayer,
      wantedPlayer,
    });
  }

  function handleFinalScoresDone(scores, participants) {
    // Cumul mi-temps + 2e moitié pour le classement
    const totals = combineScores(tournament?.halftimeScores, scores, participants);
    const sorted = [...participants].sort((a, b) => {
      const cd = (totals[b]?.champPoints || 0) - (totals[a]?.champPoints || 0);
      if (cd !== 0) return cd;
      return (totals[b]?.inGamePoints || 0) - (totals[a]?.inGamePoints || 0);
    });
    // Construire podiumResult pour recordResults (grouper les ex-aequo parfaits)
    const podiumResult = {};
    for (let i = 0; i < sorted.length; i++) {
      let rank = i + 1;
      for (let j = 0; j < i; j++) {
        if ((totals[sorted[j]]?.champPoints || 0) === (totals[sorted[i]]?.champPoints || 0)
          && (totals[sorted[j]]?.inGamePoints || 0) === (totals[sorted[i]]?.inGamePoints || 0)) {
          rank = j + 1;
          break;
        }
      }
      if (!podiumResult[rank]) podiumResult[rank] = [];
      podiumResult[rank].push(sorted[i]);
    }
    recordResults(podiumResult, participants, {
      luckyPlayer: tournament?.luckyPlayer,
      wantedPlayer: tournament?.wantedPlayer,
    });
    saveFinalScores(scores);
  }

  if (loading) return <div className="app loading">Chargement...</div>;

  // Tirage en cours → tout le monde voit les roues
  if (tournament?.status === 'spinning') {
    return (
      <div className="app">
        <SpinPhase
          tournament={tournament}
          onTriggerSpin={triggerSpin}
          onAdvanceSpin={advanceSpin}
          onMarkDone={markSpinDone}
          onFinishSpin={finishSpin}
          onFlipCard={flipCard}
        />
      </div>
    );
  }

  // Tournoi en cours → tout le monde voit le tournoi
  if (tournament?.status === 'playing') {
    return (
      <div className="app">
        <Tournament
          tournament={tournament}
          playersMap={Object.fromEntries(players.map(p => [p.name, p.avatarId]))}
          playersList={players}
          onReveal={revealCircuits}
          onChoose={chooseCircuit}
          onNext={nextRound}
          onSaveHalftimeScores={saveHalftimeScores}
          onConfirmHalftime={confirmHalftime}
          onFinalScoresDone={handleFinalScoresDone}
          onRestart={endTournament}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {screen === 'welcome' && (
        <Welcome
          players={players}
          onStart={() => setScreen('setup')}
          onStats={() => setScreen('stats')}
          onManage={() => setScreen('manage')}
          onChef={() => { setChefUnlocked(false); setScreen('chef-login'); }}
        />
      )}
      {screen === 'setup' && (
        <Setup
          players={players}
          onAdd={addPlayer}
          onDone={handleSetupDone}
          onBack={() => setScreen('welcome')}
        />
      )}
      {screen === 'stats' && (
        <Stats players={players} onBack={() => setScreen('welcome')} />
      )}
      {screen === 'manage' && (
        <ManagePlayers
          players={players}
          onAdd={addPlayer}
          onDelete={deletePlayer}
          onUpdateCircuitMaudit={updateCircuitMaudit}
          onUpdateAvatar={updateAvatar}
          onUpdateCitation={updateCitation}
          onBack={() => setScreen('welcome')}
        />
      )}
      {screen === 'chef-login' && (
        chefUnlocked
          ? <ChefBureau onBack={() => setScreen('welcome')} />
          : <ChefLogin onSuccess={() => setChefUnlocked(true)} onBack={() => setScreen('welcome')} />
      )}
    </div>
  );
}
