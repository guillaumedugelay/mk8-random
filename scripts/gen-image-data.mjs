// Génère scripts/image-sources.json (le manifeste des URLs d'origine) puis
// réécrit src/data/circuitImages.js et src/data/avatars.js pour pointer sur
// les fichiers locaux.
//
// Le manifeste existe pour que fetch-images.mjs reste utilisable : une fois
// les fichiers de données localisés, ils ne contiennent plus d'URL et ne
// peuvent plus servir de source. Il permet de tout re-télécharger si le
// dossier src/assets est perdu.
//
//   node scripts/gen-image-data.mjs            régénère depuis le manifeste
//   node scripts/gen-image-data.mjs --from-git reconstruit d'abord le
//                                              manifeste depuis le commit HEAD

import { writeFile, readFile, mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('../', import.meta.url);
const MANIFEST = new URL('image-sources.json', import.meta.url);

const fileNameOf = url => decodeURIComponent(url.split('/').pop());

// Corrections de données constatées à la reprise : ces fichiers n'existent
// pas sur le wiki et l'image était donc déjà cassée sur le site.
const FIXES = {
  '120px-MK8D_GBA_Rainbow_Road_Course_Icon_Full.png':
    '120px-MK8D_Wii_Rainbow_Road_Course_Icon_Full.png', // GBA absent de MK8 Deluxe
};

async function buildManifestFromGit() {
  const dir = await mkdtemp(join(tmpdir(), 'mk8-img-'));
  const load = async (path, name) => {
    const src = execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'utf8', cwd: new URL('.', ROOT) });
    const tmp = join(dir, name);
    await writeFile(tmp, src);
    return import('file://' + tmp.replace(/\\/g, '/'));
  };
  const { CIRCUIT_IMAGES } = await load('src/data/circuitImages.js', 'circuits.mjs');
  const { AVATARS } = await load('src/data/avatars.js', 'avatars.mjs');
  const manifest = {
    circuits: Object.fromEntries(Object.entries(CIRCUIT_IMAGES).map(([n, u]) => [n, u])),
    avatars: AVATARS.map(a => ({ id: a.id, name: a.name, url: a.url })),
  };
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log('manifeste reconstruit depuis HEAD');
  return manifest;
}

let manifest;
if (process.argv.includes('--from-git') || !existsSync(MANIFEST)) {
  manifest = await buildManifestFromGit();
} else {
  manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
}

// ---------- circuitImages.js ----------
const groups = new Map();
for (const [name, url] of Object.entries(manifest.circuits)) {
  const coupe = name.includes(' - ') ? name.split(' - ').pop() : 'Autres';
  const raw = fileNameOf(url);
  if (!groups.has(coupe)) groups.set(coupe, []);
  groups.get(coupe).push([name, FIXES[raw] || raw]);
}

let out = `// Vignettes des circuits, embarquées dans l'app — généré par
// scripts/gen-image-data.mjs. Ne pas éditer à la main.
//
// import.meta.glob plutôt que des chemins en dur : Vite transforme chaque
// fichier en URL hachée, valable quelle que soit la base du site. C'est ce
// qui permettra à Capacitor de servir l'app depuis un schéma local.

const FILES = import.meta.glob('../assets/circuits/*.png', { eager: true, import: 'default' });

function asset(file) {
  const url = FILES[\`../assets/circuits/\${file}\`];
  if (!url && import.meta.env.DEV) console.warn('Vignette manquante :', file);
  return url;
}

export const CIRCUIT_IMAGES = {
`;
for (const [coupe, entries] of groups) {
  out += `  // ${coupe}\n`;
  for (const [name, file] of entries) {
    out += `  ${JSON.stringify(name)}: asset(${JSON.stringify(file)}),\n`;
  }
  out += '\n';
}
out = out.trimEnd() + '\n};\n';
await writeFile(new URL('src/data/circuitImages.js', ROOT), out);

// ---------- avatars.js ----------
let av = `// Avatars des joueurs, embarqués dans l'app — généré par
// scripts/gen-image-data.mjs. Ne pas éditer à la main.

const FILES = import.meta.glob('../assets/avatars/*.png', { eager: true, import: 'default' });

function asset(id) {
  const url = FILES[\`../assets/avatars/\${id}.png\`];
  if (!url && import.meta.env.DEV) console.warn('Avatar manquant :', id);
  return url;
}

export const AVATARS = [
`;
for (const a of manifest.avatars) {
  av += `  { id: ${JSON.stringify(a.id)}, name: ${JSON.stringify(a.name)}, url: asset(${JSON.stringify(a.id)}) },\n`;
}
av += '];\n';
await writeFile(new URL('src/data/avatars.js', ROOT), av);

console.log(`circuitImages.js : ${Object.keys(manifest.circuits).length} circuits`);
console.log(`avatars.js       : ${manifest.avatars.length} avatars`);
