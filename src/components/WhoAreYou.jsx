import { useState } from 'react';
import Avatar from './Avatar';

// Proposé une seule fois, au premier lancement. Purement facultatif : se
// déclarer ne donne aucun droit, ça sert à mettre son nom en évidence.
export default function WhoAreYou({ players, onPick, onCreate }) {
  const [nouveau, setNouveau] = useState(false);
  const [nom, setNom] = useState('');

  const tries = [...players].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  function handleCreate(e) {
    e.preventDefault();
    const trimmed = nom.trim();
    if (!trimmed) return;
    onCreate(trimmed);
  }

  return (
    <div className="screen whoami-screen">
      <h2>Qui es-tu ?</h2>

      {!nouveau && (
        <>
          <div className="whoami-list">
            {tries.map(p => (
              <button key={p.id} className="whoami-choice" onClick={() => onPick(p)}>
                <Avatar avatarId={p.avatarId} size={32} />
                <span className="whoami-name">{p.name}</span>
                {p.uid && <span className="whoami-taken">déjà pris</span>}
              </button>
            ))}
          </div>

          <button className="btn btn-secondary" onClick={() => setNouveau(true)}>
            Je ne suis pas dans la liste
          </button>
        </>
      )}

      {nouveau && (
        <form onSubmit={handleCreate} className="whoami-form">
          <div className="field">
            <label htmlFor="whoami-nom">Ton nom de joueur</label>
            <input
              id="whoami-nom"
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="ex : alex"
              autoFocus
            />
          </div>
          <div className="whoami-form-btns">
            <button type="submit" className="btn btn-primary" disabled={!nom.trim()}>
              C'est moi
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setNouveau(false)}>
              Retour à la liste
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
