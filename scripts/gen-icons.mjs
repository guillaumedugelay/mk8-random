// Génère les icônes Android et l'icône du Play Store à partir d'une source
// carrée unique.
//
//   node scripts/gen-icons.mjs [chemin/vers/source.png]
//
// La source fournie était un carré à coins arrondis posé sur du blanc.
// Android applique son propre masque : garder ces coins ferait apparaître un
// liseré blanc autour de l'icône. On détecte donc le blanc EXTÉRIEUR par
// remplissage depuis les bords — ce qui préserve les blancs internes du
// circuit, du dé et du casque — puis on le remplace par le bleu du fond.

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const SRC = process.argv[2] || 'C:/Users/guill/Downloads/ChatGPT Image 22 août 2026, 20_38_42.png';
const RES = new URL('../android/app/src/main/res/', import.meta.url);
const STORE = new URL('../store/', import.meta.url);

// Densités Android : dossier → taille de l'icône classique (dp 48) et de
// l'avant-plan adaptatif (dp 108).
const DENSITES = [
  ['mipmap-mdpi', 48, 108],
  ['mipmap-hdpi', 72, 162],
  ['mipmap-xhdpi', 96, 216],
  ['mipmap-xxhdpi', 144, 324],
  ['mipmap-xxxhdpi', 192, 432],
];

// L'avant-plan adaptatif est rogné par le masque du système : seuls les 66 dp
// centraux sur 108 sont garantis visibles. On y loge l'illustration.
const PART_VISIBLE = 0.76;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

// ---- 1. Remplissage depuis les bords sur les pixels quasi blancs ----
const dehors = new Uint8Array(W * H);
const pile = [];
const estBlanc = i => data[i * C] > 232 && data[i * C + 1] > 232 && data[i * C + 2] > 232;

for (let x = 0; x < W; x++) {
  for (const y of [0, H - 1]) { const i = y * W + x; if (estBlanc(i)) { dehors[i] = 1; pile.push(i); } }
}
for (let y = 0; y < H; y++) {
  for (const x of [0, W - 1]) { const i = y * W + x; if (estBlanc(i)) { dehors[i] = 1; pile.push(i); } }
}
while (pile.length) {
  const i = pile.pop();
  const x = i % W, y = (i / W) | 0;
  if (x > 0)     { const j = i - 1; if (!dehors[j] && estBlanc(j)) { dehors[j] = 1; pile.push(j); } }
  if (x < W - 1) { const j = i + 1; if (!dehors[j] && estBlanc(j)) { dehors[j] = 1; pile.push(j); } }
  if (y > 0)     { const j = i - W; if (!dehors[j] && estBlanc(j)) { dehors[j] = 1; pile.push(j); } }
  if (y < H - 1) { const j = i + W; if (!dehors[j] && estBlanc(j)) { dehors[j] = 1; pile.push(j); } }
}

// ---- 2. Bleu de bordure ----
// Pas au contact du dehors : l'illustration porte une ombre grise sur son
// pourtour, qu'on prendrait pour la couleur de fond. On s'enfonce donc de
// quelques dizaines de pixels vers le centre avant d'échantillonner.
const RECUL = 28;
const cx = W / 2, cy = H / 2;
let r = 0, v = 0, b = 0, n = 0;
for (let i = 0; i < W * H; i++) {
  if (dehors[i]) continue;
  const x = i % W, y = (i / W) | 0;
  const voisinDehors =
    (x > 0 && dehors[i - 1]) || (x < W - 1 && dehors[i + 1]) ||
    (y > 0 && dehors[i - W]) || (y < H - 1 && dehors[i + W]);
  if (!voisinDehors) continue;
  const dx = cx - x, dy = cy - y;
  const d = Math.hypot(dx, dy) || 1;
  const sx = Math.round(x + (dx / d) * RECUL);
  const sy = Math.round(y + (dy / d) * RECUL);
  if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
  const j = sy * W + sx;
  if (dehors[j]) continue;
  r += data[j * C]; v += data[j * C + 1]; b += data[j * C + 2]; n++;
}
const FOND = n
  ? { r: Math.round(r / n), g: Math.round(v / n), b: Math.round(b / n) }
  : { r: 0, g: 43, b: 123 };
const hex = c => '#' + [c.r, c.g, c.b].map(x => x.toString(16).padStart(2, '0')).join('');
console.log(`bleu de bordure : ${hex(FOND)}  (${n} pixels de contour)`);

// ---- 3. Reconstruction : le dehors devient le bleu du fond ----
const plein = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) {
  if (dehors[i]) { plein[i * 3] = FOND.r; plein[i * 3 + 1] = FOND.g; plein[i * 3 + 2] = FOND.b; }
  else { plein[i * 3] = data[i * C]; plein[i * 3 + 1] = data[i * C + 1]; plein[i * 3 + 2] = data[i * C + 2]; }
}

// ---- 4. Carré centré, bord à bord ----
const cote = Math.min(W, H);
const carre = await sharp(plein, { raw: { width: W, height: H, channels: 3 } })
  .extract({ left: ((W - cote) / 2) | 0, top: ((H - cote) / 2) | 0, width: cote, height: cote })
  .png()
  .toBuffer();

// ---- 5. Sorties ----
await mkdir(STORE, { recursive: true });

for (const [dossier, taille, tailleFg] of DENSITES) {
  const dir = new URL(`${dossier}/`, RES);
  await mkdir(dir, { recursive: true });

  const classique = await sharp(carre).resize(taille, taille, { fit: 'cover' }).png().toBuffer();
  await writeFile(new URL('ic_launcher.png', dir), classique);
  await writeFile(new URL('ic_launcher_round.png', dir), classique);

  // Avant-plan adaptatif : illustration centrée dans la zone sûre, le reste
  // transparent — la couche de fond fournit le bleu.
  const dedans = Math.round(tailleFg * PART_VISIBLE);
  const marge = Math.round((tailleFg - dedans) / 2);
  const fg = await sharp({
    create: { width: tailleFg, height: tailleFg, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: await sharp(carre).resize(dedans, dedans).png().toBuffer(), top: marge, left: marge }])
    .png()
    .toBuffer();
  await writeFile(new URL('ic_launcher_foreground.png', dir), fg);
}

// Couche de fond : aplat du bleu de bordure, pour que l'illustration s'y fonde.
await writeFile(
  new URL('values/ic_launcher_background.xml', RES),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${hex(FOND)}</color>\n</resources>\n`,
);

// L'avant-plan est désormais un PNG par densité : le drawable vectoriel
// généré par Capacitor n'a plus lieu d'être et masquerait l'illustration.
for (const nom of ['ic_launcher.xml', 'ic_launcher_round.xml']) {
  await writeFile(
    new URL(`mipmap-anydpi-v26/${nom}`, RES),
    `<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@color/ic_launcher_background"/>\n    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n    <monochrome android:drawable="@mipmap/ic_launcher_foreground"/>\n</adaptive-icon>\n`,
  );
}

// Play Store : 512×512, sans transparence.
await writeFile(new URL('icon-512.png', STORE), await sharp(carre).resize(512, 512).png().toBuffer());

console.log('icônes générées :');
console.log(`  ${DENSITES.length} densités × (classique + ronde + avant-plan)`);
console.log('  store/icon-512.png');
