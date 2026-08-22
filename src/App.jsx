import { useState, useEffect } from 'react';
import { usePlayers } from './hooks/usePlayers';
import { useTournament } from './hooks/useTournament';
import { useAuth } from './hooks/useAuth';
import { useWakeLock } from './hooks/useWakeLock';
import Welcome from './components/Welcome';
import Setup from './components/Setup';
import Tournament, { combineScores } from './components/Tournament';
import ManagePlayers from './components/ManagePlayers';
import Stats from './components/Stats';
import SpinPhase from './components/SpinPhase';
import ChefLogin from './components/ChefLogin';
import ChefBureau from './components/ChefBureau';
import TournamentCode from './components/TournamentCode';
import JoinTournament from './components/JoinTournament';
import History from './components/History';
import HistoryDetail from './components/HistoryDetail';
import AccountSettings from './components/AccountSettings';
import WhoAreYou from './components/WhoAreYou';
import { tirerPourJoueurs, vitrineDe, MAX_VITRINE } from './data/stickers';
import { useMalus } from './hooks/useMalus';
import { createTournamentCode, cleanupStaleTournaments } from './lib/tournamentCode';
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
  const [creating, setCreating] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [historyEntry, setHistoryEntry] = useState(null);

  const { user, uid, isAnonymous, loading: authLoading, error: authError, linkGoogle, removeAccount } = useAuth();
  const {
    players, loaded: playersLoaded, addPlayer, deletePlayer, recordResults,
    updateCircuitMaudit, updateAvatar, updateCitation, claimPlayer, unclaimPlayer,
    grantSticker, setShowcase,
  } = usePlayers();
  const { malus } = useMalus();
  const {
    tournament, loading: tournamentLoading, code, activateCode, clearCode,
    startSpin, triggerSpin, advanceSpin, markSpinDone, finishSpin,
    revealCircuits, chooseCircuit, nextRound,
    saveHalftimeScores, confirmHalftime, saveFinalScores, savePodium,
    endTournament, flipCard, saveStickerDrops,
  } = useTournament(uid);

  // L'écran reste allumé tant qu'un tournoi tourne.
  useWakeLock(!!tournament);

  // Ménage des tournois abandonnés, une fois par lancement.
  useEffect(() => {
    if (!uid) return;
    cleanupStaleTournaments().catch(() => {});
  }, [uid]);

  async function handleLaunch() {
    setCreating(true);
    setCodeError('');
    try {
      const newCode = await createTournamentCode(uid);
      activateCode(newCode);
      setScreen('code');
    } catch (err) {
      setCodeError(err.message || 'Impossible de créer le tournoi.');
    } finally {
      setCreating(false);
    }
  }

  async function handleCancelCode() {
    await endTournament();
    clearCode();
    setScreen('welcome');
  }

  // Deux tirages par tournoi : un à la mi-temps, un à la fin. Le résultat est
  // écrit dans le tournoi pour que tous les téléphones voient la même annonce,
  // et pas seulement celui qui a appuyé sur le bouton.
  function tirerStickers(moment) {
    const joueurs = Array.isArray(tournament?.joueurs)
      ? tournament.joueurs
      : Object.values(tournament?.joueurs || {});
    if (joueurs.length === 0) return;
    const gains = tirerPourJoueurs(joueurs);
    if (gains.length === 0) return;
    for (const g of gains) grantSticker(g.joueur, g.stickerId);
    saveStickerDrops(moment, gains);
  }

  function handleConfirmHalftime() {
    tirerStickers('halftime');
    confirmHalftime();
  }

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
    savePodium(podiumResult);
    tirerStickers('final');
    saveFinalScores(scores);
  }

  async function handleRestart() {
    await endTournament();
    clearCode();
    setScreen('welcome');
  }

  const me = uid ? players.find(p => p.uid === uid) : null;

  if (authLoading || (code && tournamentLoading)) {
    return <div className="app loading">Chargement...</div>;
  }

  // Sans utilisateur, les règles Firebase refuseront tout : mieux vaut le dire
  // franchement que laisser l'app à moitié fonctionner.
  if (authError) {
    return (
      <div className="app">
        <div className="screen auth-error-screen">
          <h2>Connexion impossible</h2>
          <p>
            L'app n'arrive pas à ouvrir de session
            {authError === 'auth/network-request-failed'
              ? " : vérifie ta connexion réseau."
              : " (" + authError + ")."}
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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
          onConfirmHalftime={handleConfirmHalftime}
          onFinalScoresDone={handleFinalScoresDone}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  // Le tournoi existe mais n'a pas encore démarré : celui qui l'a créé
  // configure, ceux qui ont rejoint patientent sur l'écran du code.
  if (tournament?.status === 'lobby' && screen !== 'setup') {
    const connectedCount = Object.keys(tournament.connected || {}).length;
    return (
      <div className="app">
        <TournamentCode
          code={code}
          connectedCount={connectedCount}
          onContinue={() => setScreen('setup')}
          onCancel={handleCancelCode}
        />
      </div>
    );
  }

  // Proposé une seule fois, et jamais au milieu d'une partie.
  if (!me && playersLoaded && uid && !tournament && screen === 'welcome') {
    return (
      <div className="app">
        <WhoAreYou
          players={players}
          onPick={p => {
            if (p.uid && p.uid !== uid && !window.confirm(`${p.name} est déjà associé à un autre téléphone. Prendre sa place ?`)) return;
            claimPlayer(p.id, uid);
          }}
          onCreate={nom => {
            const id = addPlayer(nom);
            if (id) claimPlayer(id, uid);
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {screen === 'welcome' && (
        <Welcome
          players={players}
          me={me}
          creating={creating}
          error={codeError}
          onStart={handleLaunch}
          onJoin={() => setScreen('join')}
          onStats={() => setScreen('stats')}
          onManage={() => setScreen('manage')}
          onHistory={() => setScreen('history')}
          onAccount={() => setScreen('account')}
          onChef={() => { setChefUnlocked(false); setScreen('chef-login'); }}
        />
      )}
      {screen === 'setup' && (
        <Setup
          players={players}
          onAdd={addPlayer}
          onDone={handleSetupDone}
          onBack={() => setScreen('code')}
        />
      )}
      {screen === 'join' && (
        <JoinTournament
          onJoined={c => { activateCode(c); setScreen('welcome'); }}
          onBack={() => setScreen('welcome')}
        />
      )}
      {screen === 'history' && (
        <History
          players={players}
          onOpen={entry => { setHistoryEntry(entry); setScreen('history-detail'); }}
          onBack={() => setScreen('welcome')}
        />
      )}
      {screen === 'history-detail' && historyEntry && (
        <HistoryDetail
          entry={historyEntry}
          players={players}
          onBack={() => setScreen('history')}
        />
      )}
      {screen === 'account' && (
        <AccountSettings
          me={me}
          onChangeIdentity={() => { if (me) unclaimPlayer(me.id); }}
          isAnonymous={isAnonymous}
          email={user?.email}
          onLinkGoogle={linkGoogle}
          onDeleteAccount={async () => { await removeAccount(); setScreen('welcome'); }}
          onBack={() => setScreen('welcome')}
        />
      )}
      {screen === 'stats' && (
        <Stats players={players} me={me} onBack={() => setScreen('welcome')} />
      )}
      {screen === 'manage' && (
        <ManagePlayers
          players={players}
          me={me}
          onClaim={p => claimPlayer(p.id, uid)}
          onUnclaim={p => unclaimPlayer(p.id)}
          onAdd={addPlayer}
          onDelete={deletePlayer}
          onUpdateCircuitMaudit={updateCircuitMaudit}
          onUpdateAvatar={updateAvatar}
          onUpdateCitation={updateCitation}
          onToggleSticker={(p, stickerId) => {
            // On part de ce qui est réellement affiché : sans choix explicite,
            // la vitrine montre les plus rares, et un clic dessus doit les
            // retirer — pas repartir d'une liste vide.
            const actuelle = vitrineDe(p).map(s => s.id);
            // slice(-MAX_VITRINE) : avec une seule place, choisir remplace.
            const suivante = actuelle.includes(stickerId)
              ? actuelle.filter(x => x !== stickerId)
              : [...actuelle, stickerId].slice(-MAX_VITRINE);
            setShowcase(p.id, suivante);
          }}
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
