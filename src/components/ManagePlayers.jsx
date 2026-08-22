import { useState } from 'react';
import { CIRCUITS } from '../data/data';
import Avatar from './Avatar';
import AvatarPicker from './AvatarPicker';
import { StickerRow, StickerCollection } from './Stickers';

export default function ManagePlayers({ players, me = null, onClaim, onUnclaim, onAdd, onDelete, onUpdateCircuitMaudit, onUpdateAvatar, onUpdateCitation, onToggleSticker, onBack }) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTab, setEditTab] = useState('avatar'); // 'avatar' | 'circuit' | 'citation' | 'stickers'

  // La fiche de celui qui tient le téléphone remonte en tête.
  const ordonnes = me
    ? [me, ...players.filter(p => p.id !== me.id)]
    : players;

  function handleAdd(e) {
    e.preventDefault();
    onAdd(newName);
    setNewName('');
  }

  return (
    <div className="screen manage-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Retour</button>
      <h2>Gestion des joueurs</h2>

      <form onSubmit={handleAdd} className="add-player-form">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nom du nouveau joueur"
        />
        <button type="submit" className="btn btn-primary" disabled={!newName.trim()}>Ajouter</button>
      </form>

      <div className="players-list">
        {players.length === 0 && <p className="empty-msg">Aucun joueur enregistré.</p>}
        {ordonnes.map(p => (
          <div key={p.id} className={`player-item-card ${me && p.id === me.id ? 'is-me' : ''}`}>
            <div className="player-item">
              <Avatar avatarId={p.avatarId} size={36} />
              <div className="player-item-info">
                <span className="player-item-name">
                  {p.name}
                  <StickerRow player={p} />
                  {me && p.id === me.id && <span className="me-badge">toi</span>}
                </span>
                {p.citation && <span className="player-item-citation">"{p.citation}"</span>}
              </div>
              <span className="player-item-stats">{p.stats.played} tournoi{p.stats.played > 1 ? 's' : ''}</span>
              {me && p.id === me.id ? (
                <button className="btn-link btn-claim" onClick={() => onUnclaim(p)} title="Ce n'est pas moi">
                  ce n'est pas moi
                </button>
              ) : (
                <button className="btn-link btn-claim" onClick={() => onClaim(p)} title="Associer cette fiche à ce téléphone">
                  c'est moi
                </button>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setEditingId(editingId === p.id ? null : p.id); setEditTab('avatar'); }}
              >
                {editingId === p.id ? 'Fermer' : 'Éditer'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm(`Supprimer ${p.name} ?`)) onDelete(p.id); }}>✕</button>
            </div>

            {editingId === p.id && (
              <div className="edit-panel">
                <div className="edit-tabs">
                  <button className={`edit-tab ${editTab === 'avatar' ? 'active' : ''}`} onClick={() => setEditTab('avatar')}>Avatar</button>
                  <button className={`edit-tab ${editTab === 'circuit' ? 'active' : ''}`} onClick={() => setEditTab('circuit')}>Circuit maudit</button>
                  <button className={`edit-tab ${editTab === 'citation' ? 'active' : ''}`} onClick={() => setEditTab('citation')}>Citation</button>
                  <button className={`edit-tab ${editTab === 'stickers' ? 'active' : ''}`} onClick={() => setEditTab('stickers')}>Stickers</button>
                </div>

                {editTab === 'avatar' && (
                  <div className="avatar-edit">
                    <AvatarPicker
                      value={p.avatarId}
                      onChange={(id) => onUpdateAvatar(p.id, id)}
                    />
                  </div>
                )}

                {editTab === 'citation' && (
                  <div className="citation-edit">
                    <input
                      type="text"
                      value={p.citation || ''}
                      onChange={e => onUpdateCitation(p.id, e.target.value)}
                      placeholder="Ta devise, ton cri de guerre..."
                      maxLength={80}
                    />
                    <span className="citation-hint">{(p.citation || '').length}/80</span>
                  </div>
                )}

                {editTab === 'stickers' && (
                  <StickerCollection player={p} onToggle={id => onToggleSticker(p, id)} />
                )}

                {editTab === 'circuit' && (
                  <div className="circuit-maudit-edit">
                    <select
                      value={p.circuitMaudit || ''}
                      onChange={e => onUpdateCircuitMaudit(p.id, e.target.value)}
                    >
                      <option value="">— Aucun —</option>
                      {CIRCUITS.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                    {p.circuitMaudit && (
                      <p className="circuit-maudit-preview">Circuit maudit : <strong>{p.circuitMaudit}</strong></p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
