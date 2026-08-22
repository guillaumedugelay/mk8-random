import Avatar from './Avatar';

export default function Stats({ players, onBack }) {
  const sorted = [...players].sort((a, b) => {
    if (b.stats.first !== a.stats.first) return b.stats.first - a.stats.first;
    if (b.stats.second !== a.stats.second) return b.stats.second - a.stats.second;
    return b.stats.third - a.stats.third;
  });

  return (
    <div className="screen stats-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Retour</button>
      <h2>Classement général</h2>

      {sorted.length === 0 && <p className="empty-msg">Aucune statistique disponible.</p>}

      <div className="stats-table">
        <div className="stats-header">
          <span>#</span>
          <span>Joueur</span>
          <span>🥇</span>
          <span>🥈</span>
          <span>🥉</span>
          <span>Tournois</span>
        </div>
        {sorted.map((p, i) => (
          <div key={p.id} className={`stats-row ${i === 0 && p.stats.first > 0 ? 'top-player' : ''}`}>
            <span className="stats-rank">{i + 1}</span>
            <span className="stats-name">
              <Avatar avatarId={p.avatarId} size={28} />
              {p.name}
            </span>
            <span className="stats-val gold">{p.stats.first}</span>
            <span className="stats-val silver">{p.stats.second}</span>
            <span className="stats-val bronze">{p.stats.third}</span>
            <span className="stats-val muted">{p.stats.played}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
