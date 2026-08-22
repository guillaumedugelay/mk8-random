import { useState } from 'react';
import Avatar from './Avatar';
import { useHistory, rankingOf, toArray, formatDate } from '../hooks/useHistory';

export default function History({ players = [], onOpen, onBack }) {
  const { entries, loading, deleteEntry } = useHistory();
  const [error, setError] = useState('');
  const avatarOf = Object.fromEntries(players.map(p => [p.name, p.avatarId]));

  async function handleDelete(entry) {
    const quand = formatDate(entry.finishedAt);
    if (!window.confirm(`Supprimer la soirée du ${quand} ? Les statistiques des joueurs ne sont pas affectées.`)) return;
    setError('');
    try {
      await deleteEntry(entry.id);
    } catch {
      // Sans ça, le clic ne produit rien du tout et on croit l'app cassée.
      setError("Suppression refusée par la base. Les règles de sécurité n'autorisent pas encore d'effacer une soirée.");
    }
  }

  return (
    <div className="screen history-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Retour</button>
      <h2>Historique des soirées</h2>

      {loading && <p className="empty-msg">Chargement...</p>}

      {!loading && entries.length === 0 && (
        <p className="empty-msg">
          Aucune soirée enregistrée pour l'instant.<br />Le prochain tournoi sera le premier.
        </p>
      )}

      {error && <p className="history-error">{error}</p>}

      <div className="history-list">
        {entries.map(entry => {
          const { sorted } = rankingOf(entry);
          const winner = sorted[0];
          const joueurs = toArray(entry.joueurs);
          return (
            <div key={entry.id} className="history-item">
              <button className="history-row" onClick={() => onOpen(entry)}>
                <div className="history-row-main">
                  <span className="history-date">{formatDate(entry.finishedAt)}</span>
                  <span className="history-winner">
                    {winner ? <>🥇 {winner}</> : 'Sans vainqueur'}
                  </span>
                </div>
                <div className="history-row-meta">
                  <span className="history-manches">{entry.manches} manches</span>
                  <span className="history-avatars">
                    {joueurs.map(name => (
                      <Avatar key={name} avatarId={avatarOf[name]} size={22} />
                    ))}
                  </span>
                  <span className="history-count">{joueurs.length} joueurs</span>
                </div>
              </button>
              <button
                className="history-delete"
                onClick={() => handleDelete(entry)}
                aria-label={`Supprimer la soirée du ${formatDate(entry.finishedAt)}`}
                title="Supprimer cette soirée"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
