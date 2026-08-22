import { RARETES, STICKER_PAR_ID, collectionDe, vitrineDe, MAX_VITRINE } from '../data/stickers';

// La vitrine affichée à côté d'un nom de joueur.
export function StickerRow({ player, size = 'sm' }) {
  const vitrine = vitrineDe(player);
  if (vitrine.length === 0) return null;
  return (
    <span className={`sticker-row sticker-${size}`}>
      {vitrine.map(s => (
        <span
          key={s.id}
          className={`sticker ${RARETES[s.rarete].classe}`}
          title={`${s.nom} — ${RARETES[s.rarete].label}`}
        >
          {s.emoji}
        </span>
      ))}
    </span>
  );
}

// Le bandeau de gains, affiché sur tous les téléphones : un tirage à 5 % qui
// passerait inaperçu ne vaudrait rien.
export function StickerDrops({ drops }) {
  const liste = Array.isArray(drops) ? drops : Object.values(drops || {});
  if (liste.length === 0) return null;
  return (
    <div className="sticker-drops">
      <h4 className="sticker-drops-title">✨ Stickers gagnés</h4>
      {liste.map((d, i) => {
        const s = STICKER_PAR_ID[d.stickerId];
        if (!s) return null;
        return (
          <p key={i} className="sticker-drop">
            <span className={`sticker sticker-lg ${RARETES[s.rarete].classe}`}>{s.emoji}</span>
            <b>{d.joueur}</b> décroche <b>{s.nom}</b>
            <span className={`rarete-pastille pastille-${s.rarete}`}>{RARETES[s.rarete].label}</span>
          </p>
        );
      })}
    </div>
  );
}

// La collection complète d'un joueur, avec choix des trois à mettre en avant.
export function StickerCollection({ player, onToggle }) {
  const collection = collectionDe(player);
  const vitrine = vitrineDe(player).map(s => s.id);

  if (collection.length === 0) {
    return (
      <p className="empty-msg sticker-empty">
        Aucun sticker pour l'instant. Il s'en tire un à la mi-temps et un à la fin
        de chaque tournoi, avec un peu de chance.
      </p>
    );
  }

  return (
    <div className="sticker-collection">
      <p className="sticker-collection-hint">
        Choisis jusqu'à {MAX_VITRINE} stickers à afficher à côté de ton nom.
      </p>
      <div className="sticker-grid">
        {collection.map(s => {
          const actif = vitrine.includes(s.id);
          const complet = vitrine.length >= MAX_VITRINE && !actif;
          return (
            <button
              key={s.id}
              className={`sticker-cell ${RARETES[s.rarete].classe} ${actif ? 'is-active' : ''}`}
              onClick={() => onToggle(s.id)}
              disabled={complet}
              title={complet ? `Retire d'abord un sticker (${MAX_VITRINE} maximum)` : `${s.nom} — ${RARETES[s.rarete].label}`}
            >
              <span className={`sticker sticker-lg ${RARETES[s.rarete].classe}`}>{s.emoji}</span>
              <span className="sticker-cell-nom">{s.nom}</span>
              {s.nombre > 1 && <span className="sticker-count">×{s.nombre}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
