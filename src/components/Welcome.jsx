export default function Welcome({ onStart, onStats, onManage, onChef, players }) {
  const records = computeRecords(players);

  return (
    <div className="screen welcome-screen">
      <div className="title-block">
        <h1 className="game-title">MK8<br />Random<br />Racers</h1>
        <p className="subtitle">Le tournoi Mario Kart 8 Deluxe complètement déjanté !</p>
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

      <button className="btn btn-primary btn-large" onClick={onStart}>
        Lancer un tournoi !
      </button>
      <div className="welcome-actions">
        <button className="btn btn-secondary" onClick={onStats}>Classement & Stats</button>
        <button className="btn btn-secondary" onClick={onManage}>Gérer les joueurs</button>
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

const B  = 'https://mario.wiki.gallery/images/thumb';
const NS = 'https://mario.wiki.gallery/images/thumb';

// Personnages portraits
const mario    = `${B}/d/d9/MK8_Mario_Icon.png/70px-MK8_Mario_Icon.png`;
const bowser   = `${B}/4/47/MK8_Bowser_Icon.png/70px-MK8_Bowser_Icon.png`;
const yoshi    = `${B}/9/91/MK8_Yoshi_Icon.png/70px-MK8_Yoshi_Icon.png`;
const peach    = `${B}/c/c2/MK8_Peach_Icon.png/70px-MK8_Peach_Icon.png`;
const dk       = `${B}/0/08/MK8_DKong_Icon.png/70px-MK8_DKong_Icon.png`;
const toad     = `${B}/4/45/MK8_Toad_Icon.png/70px-MK8_Toad_Icon.png`;
const luigi    = `${B}/5/51/MK8_Luigi_Icon.png/70px-MK8_Luigi_Icon.png`;
const waluigi  = `${B}/7/78/MK8_Waluigi_Icon.png/70px-MK8_Waluigi_Icon.png`;
const daisy    = `${B}/3/32/MK8_Daisy_Icon.png/70px-MK8_Daisy_Icon.png`;
const wario    = `${B}/c/c2/MK8_Wario_Icon.png/70px-MK8_Wario_Icon.png`;
const rosalina = `${B}/8/89/MK8_Rosalina_Icon.png/70px-MK8_Rosalina_Icon.png`;
const drybones = `${B}/3/3f/MK8DX_Dry_Bones_Icon.png/70px-MK8DX_Dry_Bones_Icon.png`;
const koopa    = `${B}/b/bc/MK8_Koopa_Icon.png/70px-MK8_Koopa_Icon.png`;
const toadette = `${B}/8/8e/MK8_Toadette_Icon.png/70px-MK8_Toadette_Icon.png`;

// Perso dans kart/moto (NSO icons)
const marioKart   = `${NS}/1/1c/NSO_MK8D_May_2022_Week_1_-_Character_-_Mario_in_Standard_Kart.png/120px-NSO_MK8D_May_2022_Week_1_-_Character_-_Mario_in_Standard_Kart.png`;
const luigiKart   = `${NS}/f/f1/NSO_MK8D_May_2022_Week_4_-_Character_-_Luigi_in_Mach_8.png/120px-NSO_MK8D_May_2022_Week_4_-_Character_-_Luigi_in_Mach_8.png`;
const peachBike   = `${NS}/5/57/NSO_MK8D_May_2022_Week_3_-_Character_-_Peach_in_Standard_Bike.png/120px-NSO_MK8D_May_2022_Week_3_-_Character_-_Peach_in_Standard_Bike.png`;
const bowserATV   = `${NS}/2/24/NSO_MK8D_May_2022_Week_2_-_Character_-_Bowser_in_Standard_ATV.png/120px-NSO_MK8D_May_2022_Week_2_-_Character_-_Bowser_in_Standard_ATV.png`;
const tanookiKart = `${NS}/6/66/NSO_MK8D_May_2022_Week_2_-_Character_-_Tanooki_Mario_in_Tanooki_Kart.png/120px-NSO_MK8D_May_2022_Week_2_-_Character_-_Tanooki_Mario_in_Tanooki_Kart.png`;
const waluigiMoto = `${NS}/d/d8/NSO_MK8D_May_2022_Week_5_-_Character_-_Waluigi_in_The_Duke.png/120px-NSO_MK8D_May_2022_Week_5_-_Character_-_Waluigi_in_The_Duke.png`;
const dkBike      = `${NS}/e/e9/NSO_MK8D_May_2022_Week_3_-_Character_-_Donkey_Kong_in_Standard_Bike_with_Boomerang.png/120px-NSO_MK8D_May_2022_Week_3_-_Character_-_Donkey_Kong_in_Standard_Bike_with_Boomerang.png`;
const rosalinaATV = `${NS}/2/2b/NSO_MK8D_May_2022_Week_5_-_Character_-_Rosalina_in_Standard_ATV.png/120px-NSO_MK8D_May_2022_Week_5_-_Character_-_Rosalina_in_Standard_ATV.png`;
const yoshiKart   = `${NS}/0/00/NSO_MK8D_May_2022_Week_5_-_Character_-_Yoshi_in_Mach_8.png/120px-NSO_MK8D_May_2022_Week_5_-_Character_-_Yoshi_in_Mach_8.png`;
const daisyKart   = `${NS}/d/d7/NSO_MK8D_May_2022_Week_3_-_Character_-_Daisy_in_Cat_Cruiser.png/120px-NSO_MK8D_May_2022_Week_3_-_Character_-_Daisy_in_Cat_Cruiser.png`;
const toadetteBike = `${NS}/9/9b/NSO_MK8D_May_2022_Week_2_-_Character_-_Toadette_in_Mr._Scooty.png/120px-NSO_MK8D_May_2022_Week_2_-_Character_-_Toadette_in_Mr._Scooty.png`;
const warioKart   = `${NS}/6/61/NSO_MK8D_May_2022_Week_1_-_Character_-_Wario_in_Badwagon_with_Piranha_Plant.png/120px-NSO_MK8D_May_2022_Week_1_-_Character_-_Wario_in_Badwagon_with_Piranha_Plant.png`;

// left/right = % dans le panneau latéral (0% = bord écran, 60% = côté contenu central)
const DECO_LEFT = [
  { url: mario,    style: { top:  '1%', left: '50%', width: 72, animationDelay: '0s',   animationDuration: '3.5s' } },
  { url: bowser,   style: { top: '11%', left: '10%', width: 80, animationDelay: '0.5s', animationDuration: '4.2s' } },
  { url: yoshi,    style: { top: '21%', left: '55%', width: 70, animationDelay: '1.0s', animationDuration: '3.8s' } },
  { url: peach,    style: { top: '31%', left:  '8%', width: 72, animationDelay: '0.3s', animationDuration: '4.5s' } },
  { url: dk,       style: { top: '42%', left: '50%', width: 78, animationDelay: '0.8s', animationDuration: '3.6s' } },
  { url: toad,     style: { top: '52%', left: '12%', width: 64, animationDelay: '1.3s', animationDuration: '4.0s' } },
  { url: koopa,    style: { top: '62%', left: '52%', width: 68, animationDelay: '0.6s', animationDuration: '3.9s' } },
  { url: toadette, style: { top: '72%', left:  '8%', width: 70, animationDelay: '1.1s', animationDuration: '4.3s' } },
  { url: wario,    style: { top: '82%', left: '50%', width: 74, animationDelay: '0.4s', animationDuration: '3.7s' } },
  { url: drybones, style: { top: '91%', left: '10%', width: 66, animationDelay: '0.9s', animationDuration: '4.1s' } },
];

const DECO_RIGHT = [
  { url: luigi,    style: { top:  '1%', right: '50%', width: 72, animationDelay: '0.4s', animationDuration: '4.1s' } },
  { url: waluigi,  style: { top: '11%', right: '10%', width: 78, animationDelay: '0.9s', animationDuration: '3.7s' } },
  { url: daisy,    style: { top: '21%', right: '55%', width: 70, animationDelay: '0.2s', animationDuration: '4.4s' } },
  { url: rosalina, style: { top: '31%', right:  '8%', width: 74, animationDelay: '0.7s', animationDuration: '3.5s' } },
  { url: bowser,   style: { top: '42%', right: '50%', width: 80, animationDelay: '1.2s', animationDuration: '4.2s' } },
  { url: koopa,    style: { top: '52%', right: '12%', width: 66, animationDelay: '0.4s', animationDuration: '3.8s' } },
  { url: toadette, style: { top: '62%', right: '52%', width: 70, animationDelay: '1.0s', animationDuration: '4.0s' } },
  { url: drybones, style: { top: '72%', right:  '8%', width: 68, animationDelay: '0.6s', animationDuration: '4.5s' } },
  { url: mario,    style: { top: '82%', right: '50%', width: 72, animationDelay: '0.3s', animationDuration: '3.6s' } },
  { url: yoshi,    style: { top: '91%', right: '10%', width: 70, animationDelay: '1.1s', animationDuration: '4.2s' } },
];
