import { StickerRow } from './Stickers';

export default function Welcome({
  onStart, onJoin, onStats, onManage, onHistory, onAccount, onChef,
  players, me = null, creating = false, error = '',
}) {
  const records = computeRecords(players);

  return (
    <div className="screen welcome-screen">
      <div className="title-block">
        <h1 className="game-title">MK8<br />Random<br />Racers</h1>
        <p className="subtitle">Le tournoi Mario Kart 8 Deluxe complètement déjanté !</p>
        {me && (
          <p className="welcome-hello">
            Salut {me.name} !<StickerRow player={me} size="md" />
          </p>
        )}
      </div>

      <div className="records-block">
        <h2>Panthéon des héros</h2>
        {records.map((r, i) => (
          <div key={i} className="record-item">
            <span className="record-label">{r.label}</span>
            <span className="record-detail">{r.detail}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-large" onClick={onStart} disabled={creating}>
        {creating ? 'Création du code...' : 'Lancer un tournoi !'}
      </button>
      <button className="btn btn-secondary btn-large" onClick={onJoin}>
        Rejoindre un tournoi
      </button>
      {error && <p className="welcome-error">{error}</p>}
      <div className="welcome-actions">
        <button className="btn btn-secondary" onClick={onStats}>Classement & Stats</button>
        <button className="btn btn-secondary" onClick={onManage}>Gérer les joueurs</button>
        <button className="btn btn-secondary" onClick={onHistory}>Historique</button>
        <button className="btn btn-secondary" onClick={onAccount}>Mon compte</button>
      </div>
      <button className="btn-chef-desk" onClick={onChef} title="Bureau du Chef">
        <span className="chef-desk-icon">👨‍💼</span>
        <span className="chef-desk-label">Bureau<br/>du Chef</span>
      </button>
    </div>
  );
}

function none() { return '—'; }

function computeRecords(players) {
  const hasPlayers = players && players.length > 0;

  // Record de victoires
  const byWins = hasPlayers ? [...players].sort((a, b) => b.stats.first - a.stats.first) : [];
  const topWins = byWins.length > 0 && byWins[0].stats.first > 0
    ? `${byWins.filter(p => p.stats.first === byWins[0].stats.first).map(p => p.name).join(' & ')} — ${byWins[0].stats.first} victoire${byWins[0].stats.first > 1 ? 's' : ''}`
    : none();

  // Roi du podium
  const byPodiums = hasPlayers ? [...players].sort((a, b) =>
    (b.stats.first + b.stats.second + b.stats.third) - (a.stats.first + a.stats.second + a.stats.third)
  ) : [];
  const topPodiumVal = byPodiums.length > 0 ? byPodiums[0].stats.first + byPodiums[0].stats.second + byPodiums[0].stats.third : 0;
  const topPodiums = topPodiumVal > 0
    ? `${byPodiums.filter(p => p.stats.first + p.stats.second + p.stats.third === topPodiumVal).map(p => p.name).join(' & ')} — ${topPodiumVal} podium${topPodiumVal > 1 ? 's' : ''}`
    : none();

  // Joueur le plus assidu
  const byPlayed = hasPlayers ? [...players].sort((a, b) => b.stats.played - a.stats.played) : [];
  const topPlayed = byPlayed.length > 0 && byPlayed[0].stats.played > 0
    ? `${byPlayed.filter(p => p.stats.played === byPlayed[0].stats.played).map(p => p.name).join(' & ')} — ${byPlayed[0].stats.played} tournoi${byPlayed[0].stats.played > 1 ? 's' : ''}`
    : none();

  // Record de série de victoires
  const byBestStreak = hasPlayers ? [...players].sort((a, b) => (b.bestStreak || 0) - (a.bestStreak || 0)) : [];
  const topBest = byBestStreak[0]?.bestStreak > 0
    ? `${byBestStreak.filter(p => (p.bestStreak || 0) === byBestStreak[0].bestStreak).map(p => p.name).join(' & ')} — ${byBestStreak[0].bestStreak} victoire${byBestStreak[0].bestStreak > 1 ? 's' : ''} d'affilée${byBestStreak[0].bestStreak > 1 ? 's' : ''}`
    : none();

  // Série en cours
  const streaking = hasPlayers ? players.filter(p => (p.streak || 0) > 0).sort((a, b) => b.streak - a.streak) : [];
  const topStreak = streaking.length > 0
    ? streaking.map(p => `${p.name} (${p.streak} victoire${p.streak > 1 ? 's' : ''})`).join(' · ')
    : none();

  // Le plus veinard (tiré Petit Veinard le plus souvent)
  const byLucky = hasPlayers ? [...players].sort((a, b) => (b.luckyCount || 0) - (a.luckyCount || 0)) : [];
  const topLucky = (byLucky[0]?.luckyCount || 0) > 0
    ? `${byLucky.filter(p => (p.luckyCount || 0) === byLucky[0].luckyCount).map(p => p.name).join(' & ')} — ${byLucky[0].luckyCount} fois`
    : none();

  // Le plus malchanceux (tiré Chat Noir le plus souvent)
  const byBlackCat = hasPlayers ? [...players].sort((a, b) => (b.blackCatCount || 0) - (a.blackCatCount || 0)) : [];
  const topBlackCat = (byBlackCat[0]?.blackCatCount || 0) > 0
    ? `${byBlackCat.filter(p => (p.blackCatCount || 0) === byBlackCat[0].blackCatCount).map(p => p.name).join(' & ')} — ${byBlackCat[0].blackCatCount} fois`
    : none();

  return [
    { label: '🥇 Record de victoires', detail: topWins },
    { label: '🏆 Roi du podium', detail: topPodiums },
    { label: '🎮 Joueur le plus assidu', detail: topPlayed },
    { label: '⚡ Record de série de victoires', detail: topBest },
    { label: '🔥 Série de victoires en cours', detail: topStreak },
    { label: '🍀 Le plus veinard', detail: topLucky },
    { label: '🐈 Le plus malchanceux', detail: topBlackCat },
  ];
}
