import { useState } from 'react';

export default function TournamentCode({ code, connectedCount, onContinue, onCancel }) {
  const [copied, setCopied] = useState(false);

  const message = `Rejoins le tournoi MK8 Racers ! Code : ${code}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleShare() {
    // Partage natif Android via Capacitor en phase 4 ; l'API web fait le
    // travail partout où elle existe, sinon on retombe sur la copie.
    if (navigator.share) {
      try {
        await navigator.share({ title: 'MK8 Racers', text: message });
        return;
      } catch {
        // partage annulé par l'utilisateur — rien à signaler
      }
    }
    handleCopy();
  }

  return (
    <div className="screen code-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onCancel}>← Annuler</button>

      <h2>Code du tournoi</h2>
      <p className="code-hint">Partage-le à ceux qui veulent suivre la partie sur leur téléphone.</p>

      <div className="code-display">
        {code.split('').map((digit, i) => (
          <span key={i} className="code-digit">{digit}</span>
        ))}
      </div>

      <div className="code-actions">
        <button className="btn btn-primary" onClick={handleShare}>Partager</button>
        <button className="btn btn-secondary" onClick={handleCopy}>
          {copied ? '✓ Copié' : 'Copier'}
        </button>
      </div>

      <div className="code-connected">
        <span className="code-connected-dot" />
        {connectedCount <= 1
          ? 'Ton téléphone est connecté'
          : `${connectedCount} téléphones connectés`}
      </div>
      <p className="code-connected-note">
        Purement informatif. Pas besoin d'attendre qui que ce soit&nbsp;: ce sont les
        joueurs sélectionnés à l'écran suivant qui comptent.
      </p>

      <button className="btn btn-primary btn-large" onClick={onContinue}>
        Continuer
      </button>
    </div>
  );
}
