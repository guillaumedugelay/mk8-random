import Avatar from './Avatar';
import { rankingOf, toArray, formatDate } from '../hooks/useHistory';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function HistoryDetail({ entry, players = [], onBack }) {
  const { sorted, totals } = rankingOf(entry);
  const schedule = toArray(entry.schedule);
  const chosen = entry.chosen || {};
  const avatarOf = Object.fromEntries(players.map(p => [p.name, p.avatarId]));

  return (
    <div className="screen history-detail-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Historique</button>

      <h2>{formatDate(entry.finishedAt)}</h2>
      <p className="history-detail-sub">{entry.manches} manches · code {entry.code || '—'}</p>

      <div className="history-podium">
        {sorted.slice(0, 3).map((name, i) => (
          <div key={name} className={`history-podium-item place-${i + 1}`}>
            <span className="history-medal">{MEDALS[i]}</span>
            <Avatar avatarId={avatarOf[name]} size={36} />
            <span className="history-podium-name">{name}</span>
          </div>
        ))}
      </div>

      <h3 className="history-section-title">Classement</h3>
      <div className="stats-table">
        <div className="stats-header history-scores-header">
          <span>#</span>
          <span>Joueur</span>
          <span>Champ.</span>
          <span>En jeu</span>
        </div>
        {sorted.map((name, i) => (
          <div key={name} className="stats-row history-scores-row">
            <span className="stats-rank">{i + 1}</span>
            <span className="stats-name">
              <Avatar avatarId={avatarOf[name]} size={24} />
              {name}
            </span>
            <span className="stats-val">{totals[name]?.champPoints ?? 0}</span>
            <span className="stats-val muted">{totals[name]?.inGamePoints ?? 0}</span>
          </div>
        ))}
      </div>

      {(entry.luckyPlayer || entry.wantedPlayer) && (
        <>
          <h3 className="history-section-title">Cartes du destin</h3>
          <div className="history-destiny">
            {entry.luckyPlayer && (
              <div className="history-destiny-card lucky">
                <span className="history-destiny-icon">🍀</span>
                <span className="history-destiny-label">Petit Veinard</span>
                <span className="history-destiny-name">{entry.luckyPlayer}</span>
              </div>
            )}
            {entry.wantedPlayer && (
              <div className="history-destiny-card wanted">
                <span className="history-destiny-icon">🐈‍⬛</span>
                <span className="history-destiny-label">Chat Noir</span>
                <span className="history-destiny-name">{entry.wantedPlayer}</span>
              </div>
            )}
          </div>
        </>
      )}

      <h3 className="history-section-title">Déroulé</h3>
      <div className="history-rounds">
        {schedule.map(round => {
          const malusParJoueur = round.malusParJoueur || {};
          const noms = Object.keys(malusParJoueur);
          return (
            <div key={round.num} className="history-round">
              <div className="history-round-head">
                <span className="history-round-num">Manche {round.num}</span>
                <span className="history-round-circuit">{chosen[round.num] || '—'}</span>
                {round.isYoshi && <span className="badge badge-yoshi">Yoshi-course</span>}
                {round.isSansObjet && <span className="badge badge-warning">Sans objets</span>}
              </div>
              {noms.length > 0 && (
                <ul className="history-round-malus">
                  {noms.map(nom => {
                    const m = malusParJoueur[nom];
                    return (
                      <li key={nom} className={m.type === 'bonus' ? 'is-bonus' : 'is-malus'}>
                        <b>{nom}</b> — {m.texte}
                        {m.extraValue ? ` : ${m.extraValue}` : ''}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
