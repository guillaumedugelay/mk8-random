// Silhouette de chat noir (l'emoji 🐈‍⬛ ne s'affiche pas sur tous les systèmes)
export function BlackCat({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="#0d0d12" style={{ filter: 'drop-shadow(0 0 6px rgba(154,127,208,0.8))' }}>
      <path d="M20 14 L16 4 L26 10 Z" />
      <path d="M44 14 L48 4 L38 10 Z" />
      <circle cx="32" cy="22" r="13" />
      <ellipse cx="32" cy="45" rx="15" ry="14" />
      <path d="M46 45 Q58 40 56 28 Q60 42 50 50 Z" />
      <circle cx="27" cy="20" r="2.2" fill="#ffd200" />
      <circle cx="37" cy="20" r="2.2" fill="#ffd200" />
    </svg>
  );
}

export default function CardDraw({ luckyPlayer, wantedPlayer, flippedCards = {}, onFlip }) {
  const cards = [
    {
      id: 'lucky',
      icon: '🍀',
      title: 'Petit Veinard',
      player: luckyPlayer,
      note: 'Reçoit au moins 2 bonus',
      theme: 'card-lucky',
    },
    {
      id: 'wanted',
      icon: <BlackCat />,
      title: 'Chat Noir',
      player: wantedPlayer,
      note: 'Subit au moins 2 malus',
      theme: 'card-wanted',
    },
  ];

  return (
    <div className="card-draw-section">
      <h3 className="card-draw-title">✨ Cartes du destin ✨</h3>
      <div className="card-draw-row">
        {cards.map(c => {
          const flipped = !!flippedCards[c.id];
          return (
            <div
              key={c.id}
              className={`flip-card ${c.theme} ${flipped ? 'is-flipped' : ''}`}
              onClick={() => { if (!flipped) onFlip(c.id); }}
            >
              <div className="flip-card-inner">
                <div className="flip-card-back">
                  <span className="card-back-logo">{c.icon}</span>
                  <span className="card-back-hint">Cliquer pour révéler</span>
                </div>
                <div className="flip-card-front">
                  <span className="card-front-icon">{c.icon}</span>
                  <span className="card-front-title">{c.title}</span>
                  <span className="card-front-player">{c.player || '—'}</span>
                  <span className="card-front-note">{c.note}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
