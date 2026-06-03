import { useState } from 'react';

export default function Setup({ onDone }) {
  const [manches, setManches] = useState('');
  const [joueurs, setJoueurs] = useState(['']);

  function addJoueur() {
    setJoueurs([...joueurs, '']);
  }

  function removeJoueur(i) {
    setJoueurs(joueurs.filter((_, idx) => idx !== i));
  }

  function updateJoueur(i, val) {
    const copy = [...joueurs];
    copy[i] = val;
    setJoueurs(copy);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nb = parseInt(manches);
    const players = joueurs.map(j => j.trim()).filter(Boolean);
    if (!nb || nb < 1 || players.length < 1) return;
    onDone({ manches: nb, joueurs: players });
  }

  return (
    <div className="screen setup-screen">
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
          <label>Joueurs</label>
          {joueurs.map((j, i) => (
            <div key={i} className="joueur-row">
              <input
                type="text"
                value={j}
                onChange={e => updateJoueur(i, e.target.value)}
                placeholder={`Joueur ${i + 1}`}
                required
              />
              {joueurs.length > 1 && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeJoueur(i)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addJoueur}>+ Ajouter un joueur</button>
        </div>

        <button type="submit" className="btn btn-primary btn-large">Démarrer le tournoi !</button>
      </form>
    </div>
  );
}
