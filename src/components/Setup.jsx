import { useState } from 'react';

export default function Setup({ players, onAdd, onDone, onBack }) {
  const [manches, setManches] = useState('');
  const [selected, setSelected] = useState([]);
  const [newName, setNewName] = useState('');

  function togglePlayer(name) {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  }

  function handleAddNew(e) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setSelected(prev => [...prev, trimmed]);
    setNewName('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nb = parseInt(manches);
    if (!nb || nb < 1 || selected.length < 1) return;
    onDone({ manches: nb, joueurs: selected });
  }

  return (
    <div className="screen setup-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Retour</button>
      <h2>Configuration du tournoi</h2>
      <form onSubmit={handleSubmit} className="setup-form">

        <div className="field">
          <label>Nombre de manches</label>
          <input
            type="number" min="1" max="96"
            value={manches}
            onChange={e => setManches(e.target.value)}
            placeholder="ex: 8"
            required
          />
        </div>

        <div className="field">
          <label>Qui joue ? ({selected.length} sélectionné{selected.length > 1 ? 's' : ''})</label>
          <div className="players-select">
            {players.map(p => (
              <button
                key={p.id}
                type="button"
                className={`player-chip ${selected.includes(p.name) ? 'selected' : ''}`}
                onClick={() => togglePlayer(p.name)}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="add-player-form">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nouveau joueur..."
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddNew}
              disabled={!newName.trim()}
            >
              + Ajouter
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={!manches || selected.length < 1}
        >
          Démarrer le tournoi !
        </button>
      </form>
    </div>
  );
}
