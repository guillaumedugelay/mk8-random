// Stickers à collectionner. Deux tirages par tournoi et par joueur — un à la
// mi-temps, un à la fin — avec une faible chance à chaque fois.
//
// Les doublons sont possibles et comptés : la collection ne se « termine »
// jamais, et un sticker légendaire en double reste une bonne nouvelle.

export const DROP_RATE = 0.20; // 20 % par joueur, à chacun des deux moments

// Quatre paliers, du plus courant au plus rare. La probabilité porte sur le
// PALIER, pas sur chaque sticker : le tirage choisit d'abord une couleur, puis
// un sticker au hasard dedans. Ces pourcentages restent donc exacts même si on
// ajoute des stickers dans un palier plus tard.
export const RARETES = {
  vert:  { label: 'Vert',  proba: 0.50, classe: 'rarete-vert' },
  bleu:  { label: 'Bleu',  proba: 0.30, classe: 'rarete-bleu' },
  rouge: { label: 'Rouge', proba: 0.15, classe: 'rarete-rouge' },
  dore:  { label: 'Doré',  proba: 0.05, classe: 'rarete-dore' },
};

export const ORDRE_RARETE = ['dore', 'rouge', 'bleu', 'vert'];

export const STICKERS = [
  // ---- Vert (50 %) : les fonds de tiroir, ceux qui font soupirer ----
  { id: 'banane',        emoji: '🍌',  nom: 'Banane',              rarete: 'vert' },
  { id: 'piece',         emoji: '🪙',  nom: 'Pièce',               rarete: 'vert' },
  { id: 'carapace',      emoji: '🐢',  nom: 'Carapace verte',      rarete: 'vert' },
  { id: 'cone',          emoji: '🚧',  nom: 'Cône de chantier',    rarete: 'vert' },
  { id: 'caillou',       emoji: '🪨',  nom: 'Caillou',             rarete: 'vert' },
  { id: 'eponge',        emoji: '🧽',  nom: 'Roue Éponge',         rarete: 'vert' },
  { id: 'fromage',       emoji: '🧀',  nom: 'Bout de fromage',     rarete: 'vert' },
  { id: 'herbe',         emoji: '🌱',  nom: "Brin d'herbe",        rarete: 'vert' },
  { id: 'boulon',        emoji: '🔩',  nom: 'Boulon desserré',     rarete: 'vert' },
  { id: 'petard',        emoji: '🥱',  nom: 'Pétard mouillé',      rarete: 'vert' },

  // ---- Bleu (30 %) : corrects, ça dépanne ----
  { id: 'champignon',    emoji: '🍄',  nom: 'Champignon',          rarete: 'bleu' },
  { id: 'obus',          emoji: '💨',  nom: 'Champignon turbo',    rarete: 'bleu' },
  { id: 'carapacerouge', emoji: '🔴',  nom: 'Carapace rouge',      rarete: 'bleu' },
  { id: 'feu',           emoji: '🔥',  nom: 'Boule de feu',        rarete: 'bleu' },
  { id: 'boo',           emoji: '👻',  nom: 'Boo',                 rarete: 'bleu' },
  { id: 'encre',         emoji: '🦑',  nom: 'Bloops',              rarete: 'bleu' },
  { id: 'glace',         emoji: '🧊',  nom: 'Bloc de glace',       rarete: 'bleu' },
  { id: 'trefle',        emoji: '🍀',  nom: 'Trèfle porte-bonheur', rarete: 'bleu' },
  { id: 'os',            emoji: '🦴',  nom: 'Skelex',              rarete: 'bleu' },
  { id: 'musique',       emoji: '🎺',  nom: 'Piste Musicale',      rarete: 'bleu' },

  // ---- Rouge (15 %) : ça fait mal ----
  { id: 'eclair',        emoji: '⚡',  nom: 'Éclair',              rarete: 'rouge' },
  { id: 'bombe',         emoji: '💣',  nom: 'Bob-omb',             rarete: 'rouge' },
  { id: 'fusee',         emoji: '🚀',  nom: 'Champignon doré',     rarete: 'rouge' },
  { id: 'dino',          emoji: '🦖',  nom: 'Yoshi déchaîné',      rarete: 'rouge' },
  { id: 'volcan',        emoji: '🌋',  nom: 'Volcan Grondin',      rarete: 'rouge' },
  { id: 'chateau',       emoji: '🏰',  nom: 'Château de Bowser',   rarete: 'rouge' },
  { id: 'diamant',       emoji: '💎',  nom: 'Diamant',             rarete: 'rouge' },
  { id: 'cible',         emoji: '🎯',  nom: 'Dans le mille',       rarete: 'rouge' },
  { id: 'bouclier',      emoji: '🛡️',  nom: 'Super Klaxon',        rarete: 'rouge' },
  { id: 'drapeau',       emoji: '🏁',  nom: 'Damier',              rarete: 'rouge' },

  // ---- Doré (5 %) : l'artillerie lourde, celle dont on se vante ----
  { id: 'carapacebleue', emoji: '🔵',  nom: 'Carapace bleue',      rarete: 'dore' },
  { id: 'arcenciel',     emoji: '🌈',  nom: 'Route Arc-en-ciel',   rarete: 'dore' },
  { id: 'etoile',        emoji: '⭐',  nom: 'Étoile invincible',   rarete: 'dore' },
  { id: 'couronne',      emoji: '👑',  nom: 'Couronne',            rarete: 'dore' },
  { id: 'trophee',       emoji: '🏆',  nom: 'Coupe dorée',         rarete: 'dore' },
  { id: 'medaille',      emoji: '🥇',  nom: "Médaille d'or",       rarete: 'dore' },
  { id: 'puissance',     emoji: '💫',  nom: 'Étoile de puissance', rarete: 'dore' },
  { id: 'comete',        emoji: '☄️',  nom: 'Comète',              rarete: 'dore' },
  { id: 'dragon',        emoji: '🐉',  nom: 'Bowser déchaîné',     rarete: 'dore' },
  { id: 'feudartifice',  emoji: '🎆',  nom: "Feu d'artifice",      rarete: 'dore' },
];

export const STICKER_PAR_ID = Object.fromEntries(STICKERS.map(s => [s.id, s]));

export const MAX_VITRINE = 3;

// D'abord le palier, ensuite un sticker au hasard dans ce palier.
export function tirerSticker() {
  let n = Math.random();
  for (const palier of ['vert', 'bleu', 'rouge', 'dore']) {
    n -= RARETES[palier].proba;
    if (n <= 0) {
      const pool = STICKERS.filter(s => s.rarete === palier);
      if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  const secours = STICKERS.filter(s => s.rarete === 'vert');
  return secours[Math.floor(Math.random() * secours.length)];
}

// Un tirage par joueur. Renvoie [{ joueur, stickerId }] — souvent vide.
export function tirerPourJoueurs(joueurs = []) {
  const gains = [];
  for (const joueur of joueurs) {
    if (Math.random() < DROP_RATE) {
      gains.push({ joueur, stickerId: tirerSticker().id });
    }
  }
  return gains;
}

// Firebase ne stocke pas les objets vides : une collection absente vaut {}.
export function collectionDe(player) {
  const brut = player?.stickers;
  if (!brut || typeof brut !== 'object') return [];
  return Object.entries(brut)
    .filter(([id, n]) => STICKER_PAR_ID[id] && n > 0)
    .map(([id, n]) => ({ ...STICKER_PAR_ID[id], nombre: n }))
    .sort((a, b) => ORDRE_RARETE.indexOf(a.rarete) - ORDRE_RARETE.indexOf(b.rarete));
}

// Les stickers mis en avant à côté du nom. À défaut de choix explicite, on
// prend les plus rares : la vitrine est jolie sans que personne ait rien réglé.
export function vitrineDe(player) {
  const collection = collectionDe(player);
  const choisis = Array.isArray(player?.showcase) ? player.showcase : null;
  if (choisis && choisis.length) {
    return choisis
      .map(id => collection.find(s => s.id === id))
      .filter(Boolean)
      .slice(0, MAX_VITRINE);
  }
  return collection.slice(0, MAX_VITRINE);
}
