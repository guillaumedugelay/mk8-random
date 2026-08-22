import { useState } from 'react';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Podium({ joueurs, onValidate }) {
  const [positions, setPositions] = useState(Object.fromEntries(joueurs.map(j => [j, ''])));

  function handleChange(joueur, val) {
    // Désélectionner si on reclique sur la même position
    setPositions(prev => ({ ...prev, [joueur]: prev[joueur] === val ? '' : val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = {};
    for (const [joueur, pos] of Object.entries(positions)) {
      if (!pos) continue; // ignorer les joueurs sans position
      const p = parseInt(pos);
      if (!result[p]) result[p] = [];
      result[p].push(joueur);
    }
    onValidate(result);
  }

  // Valide si au moins un joueur est en 1ère place
  const hasFirst = Object.values(positions).some(p => p === '1');

  return (
    <div className="podium-form">
      <h2>Saisie du podium</h2>
      <p className="podium-subtitle">Seul le 1er est obligatoire. Les ex-aequo sont autorisés (ex: 2 joueurs à la 2ème place). Les joueurs sans position sont hors podium.</p>
      <form onSubmit={handleSubmit}>
        <div className="podium-rows">
          {joueurs.map(joueur => (
            <div key={joueur} className="podium-row">
              <span className="joueur-name">{joueur}</span>
              <div className="position-btns">
                {[1, 2, 3].map(pos => (
                  <button
                    key={pos}
                    type="button"
                    className={`pos-btn ${positions[joueur] === String(pos) ? 'selected' : ''}`}
                    onClick={() => handleChange(joueur, String(pos))}
                  >
                    {MEDALS[pos]}
                  </button>
                ))}
              </div>
              {!positions[joueur] && (
                <span className="no-podium-label">hors podium</span>
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary btn-large" disabled={!hasFirst}>
          Voir le podium final
        </button>
      </form>
    </div>
  );
}
