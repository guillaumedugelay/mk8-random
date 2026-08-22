// Rapatrie en local les vignettes de circuits et les avatars, aujourd'hui
// chargés depuis mario.wiki.gallery. Sans ça, l'app est nue hors-ligne et
// dépend d'un wiki bénévole qui peut couper le lien du jour au lendemain.
//
//   node scripts/fetch-images.mjs           télécharge
//   node scripts/fetch-images.mjs --dry     liste sans rien écrire

import { mkdir, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { CIRCUIT_IMAGES } from '../src/data/circuitImages.js';
import { AVATARS } from '../src/data/avatars.js';

const DRY = process.argv.includes('--dry');
const OUT = new URL('../src/assets/', import.meta.url);

// Le nom de fichier distant est déjà unique et stable : on le garde comme
// identifiant local plutôt que d'inventer des slugs depuis des noms français
// accentués.
function fileNameOf(url) {
  return decodeURIComponent(url.split('/').pop());
}

const targets = [];
for (const [name, url] of Object.entries(CIRCUIT_IMAGES)) {
  targets.push({ dir: 'circuits', key: name, url, file: fileNameOf(url) });
}
for (const a of AVATARS) {
  targets.push({ dir: 'avatars', key: a.id, url: a.url, file: `${a.id}.png` });
}

// Plusieurs circuits partagent la même vignette (les Routes Arc-en-ciel) :
// on ne télécharge chaque URL qu'une fois.
const unique = new Map();
for (const t of targets) unique.set(`${t.dir}/${t.file}`, t);

console.log(`${targets.length} références, ${unique.size} fichiers distincts`);
if (DRY) {
  for (const k of [...unique.keys()].slice(0, 5)) console.log('  ', k);
  console.log('   ...');
  process.exit(0);
}

for (const dir of ['circuits', 'avatars']) {
  await mkdir(new URL(`${dir}/`, OUT), { recursive: true });
}

let ok = 0, skipped = 0, failed = [];
for (const [rel, t] of unique) {
  const dest = new URL(rel, OUT);
  if (existsSync(dest)) { skipped++; continue; }
  try {
    const res = await fetch(t.url, { headers: { 'User-Agent': 'mk8-racers-asset-fetch/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    // Le wiki renvoie sa page d'erreur en HTTP 200 quand le fichier n'existe
    // pas : sans ce contrôle, on enregistre 75 Ko de HTML sous un nom .png.
    if (!buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) {
      throw new Error("la réponse n'est pas un PNG (fichier absent du wiki ?)");
    }
    await writeFile(dest, buf);
    ok++;
    if (ok % 20 === 0) console.log(`  ${ok} téléchargés...`);
  } catch (err) {
    failed.push(`${rel} — ${err.message}`);
  }
  await new Promise(r => setTimeout(r, 60)); // on ne martèle pas le wiki
}

let total = 0;
for (const dir of ['circuits', 'avatars']) {
  const files = await readdir(new URL(`${dir}/`, OUT));
  let size = 0;
  for (const f of files) size += (await stat(new URL(`${dir}/${f}`, OUT))).size;
  console.log(`${dir.padEnd(10)} ${String(files.length).padStart(3)} fichiers  ${(size / 1024).toFixed(0)} Ko`);
  total += size;
}
console.log(`TOTAL      ${(total / 1024).toFixed(0)} Ko`);
console.log(`téléchargés ${ok}, déjà présents ${skipped}, échecs ${failed.length}`);
for (const f of failed) console.log('  ÉCHEC', f);
