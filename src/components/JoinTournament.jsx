import { useState, useRef, useEffect } from 'react';
import { tournamentExists } from '../lib/tournamentCode';

const SLOTS = 4;

export default function JoinTournament({ onJoined, onBack }) {
  const [digits, setDigits] = useState(Array(SLOTS).fill(''));
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  function setDigit(index, value) {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      setDigits(prev => prev.map((d, i) => (i === index ? '' : d)));
      return;
    }
    setError('');
    // Un collage de "1234" remplit toutes les cases d'un coup.
    const next = [...digits];
    for (let i = 0; i < clean.length && index + i < SLOTS; i++) {
      next[index + i] = clean[i];
    }
    setDigits(next);
    const landed = Math.min(index + clean.length, SLOTS - 1);
    inputs.current[landed]?.focus();
    if (next.every(d => d !== '')) attempt(next.join(''));
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function attempt(code) {
    setChecking(true);
    setError('');
    try {
      const exists = await tournamentExists(code);
      if (exists) {
        onJoined(code);
      } else {
        setError("Aucun tournoi avec ce code. Vérifie auprès de la personne qui t'a invité.");
        setDigits(Array(SLOTS).fill(''));
        inputs.current[0]?.focus();
      }
    } catch {
      setError('Pas de connexion. Vérifie ton réseau et réessaie.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="screen join-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Retour</button>

      <h2>Rejoindre un tournoi</h2>
      <p className="join-hint">Saisis le code à 4 chiffres donné par celui qui a lancé la partie.</p>

      <div className="join-inputs">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={SLOTS}
            value={digit}
            disabled={checking}
            onChange={e => setDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`join-digit ${error ? 'input-error' : ''}`}
            aria-label={`Chiffre ${i + 1}`}
          />
        ))}
      </div>

      {checking && <p className="join-status">Recherche du tournoi...</p>}
      {error && <p className="join-error">{error}</p>}
    </div>
  );
}
