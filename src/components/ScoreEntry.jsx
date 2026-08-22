import { useState } from 'react';

const MK8_CHAMP = { 1:15, 2:12, 3:10, 4:9, 5:8, 6:7, 7:6, 8:5, 9:4, 10:3, 11:2, 12:1 };

export default function ScoreEntry({ joueurs, onSave, saveLabel = 'Enregistrer' }) {
  const [entries, setEntries] = useState(
    Object.fromEntries(joueurs.map(j => [j, { position: '', inGamePoints: '' }]))
  );

  function setField(joueur, field, val) {
    setEntries(prev => ({ ...prev, [joueur]: { ...prev[joueur], [field]: val } }));
  }

  function handleSave() {
    const scores = {};
    for (const j of joueurs) {
      const pos = parseInt(entries[j].position) || 0;
      scores[j] = {
        position: pos,
        champPoints: MK8_CHAMP[pos] || 0,
        inGamePoints: parseInt(entries[j].inGamePoints) || 0,
      };
    }
    onSave(scores);
  }

  const isValid = joueurs.every(j => entries[j].position !== '' && entries[j].inGamePoints !== '');

  return (
    <div className="score-entry">
      <div className="score-table">
        <div className="score-table-head">
          <span>Joueur</span>
          <span>Position</span>
          <span>Pts champ.</span>
          <span>Pts en jeu</span>
        </div>
        {joueurs.map(j => {
          const pos = parseInt(entries[j].position);
          const champ = MK8_CHAMP[pos];
          return (
            <div key={j} className="score-table-row">
              <span className="score-joueur">{j}</span>
              <select value={entries[j].position} onChange={e => setField(j, 'position', e.target.value)}>
                <option value="">—</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(p => (
                  <option key={p} value={p}>
                    {p === 1 ? '🥇 1er' : p === 2 ? '🥈 2e' : p === 3 ? '🥉 3e' : `${p}e`}
                  </option>
                ))}
              </select>
              <span className="champ-pts">{champ != null ? `${champ} pts` : '—'}</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={entries[j].inGamePoints}
                onChange={e => setField(j, 'inGamePoints', e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <button className="btn btn-primary btn-large" onClick={handleSave} disabled={!isValid}>
        {saveLabel}
      </button>
    </div>
  );
}
