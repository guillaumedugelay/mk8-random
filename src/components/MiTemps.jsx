import { useState } from 'react';
import ScoreEntry from './ScoreEntry';

export default function MiTemps({ joueurs, savedScores, onSaveScores, onContinue }) {
  const [localSaved, setLocalSaved] = useState(false);
  // Scores saisis localement OU déjà présents dans Firebase (autre appareil)
  const scoresEntered = localSaved || !!savedScores;

  function handleSaveScores(scores) {
    onSaveScores(scores);
    setLocalSaved(true);
  }

  return (
    <div className="miTemps-screen">
      <div className="miTemps-header">
        <span className="miTemps-icon">🏁</span>
        <h2>Mi-temps !</h2>
        <p className="miTemps-subtitle">
          C'est le moment de souffler et de se désaltérer avant la deuxième moitié du tournoi !
        </p>
      </div>

      <div className="miTemps-scores-section">
        <h3>Scores — première moitié</h3>
        {!scoresEntered ? (
          <ScoreEntry
            joueurs={joueurs}
            onSave={handleSaveScores}
            saveLabel="Enregistrer les scores"
          />
        ) : (
          <p className="scores-saved-msg">✅ Scores enregistrés !</p>
        )}
      </div>

      <button
        className="btn btn-primary btn-large miTemps-continue-btn"
        onClick={onContinue}
        disabled={!scoresEntered}
        title={!scoresEntered ? 'Enregistrez d\'abord les scores' : undefined}
      >
        Reprendre le tournoi 🚀
      </button>
    </div>
  );
}
