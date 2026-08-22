// Rapatrie les polices Google en local. Sans ça, l'app perd toute sa
// typographie hors-ligne et retombe sur la police système — et elle passe
// une requête à Google à chaque lancement, ce que le formulaire « Sécurité
// des données » du Play Store obligerait à déclarer.
//
//   node scripts/fetch-fonts.mjs

import { mkdir, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/assets/fonts/', import.meta.url);

// On demande le CSS en se faisant passer pour un navigateur récent : Google
// sert alors du woff2, deux fois plus léger que le woff des vieux agents.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const FAMILLES = [
  'Fredoka+One',
  'Nunito:wght@400;600;700;800;900',
];

const url = `https://fonts.googleapis.com/css2?${FAMILLES.map(f => `family=${f}`).join('&')}&display=swap`;

await mkdir(OUT, { recursive: true });

const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();

const liens = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]);
const uniques = [...new Set(liens)];
console.log(`${uniques.length} fichiers de police à récupérer`);

let local = css;
let n = 0;
for (const lien of uniques) {
  const nom = lien.split('/').slice(-3).join('-'); // famille-version-fichier.woff2
  const buf = Buffer.from(await (await fetch(lien, { headers: { 'User-Agent': UA } })).arrayBuffer());
  await writeFile(new URL(nom, OUT), buf);
  // Chemin relatif au CSS généré, qui vivra dans le même dossier.
  local = local.split(lien).join(`./${nom}`);
  n++;
  process.stdout.write(`\r  ${n}/${uniques.length}`);
}
process.stdout.write('\n');

const entete = `/* Polices embarquées — généré par scripts/fetch-fonts.mjs.
   Ne pas éditer à la main : relancer le script pour mettre à jour.
   Source : ${url} */\n\n`;

await writeFile(new URL('fonts.css', OUT), entete + local);
console.log('src/assets/fonts/fonts.css écrit');
