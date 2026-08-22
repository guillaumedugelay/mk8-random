import { useState } from 'react';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

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
    // Dans une WebView Android, navigator.share n'est pas fiable : on passe
    // par le plugin natif dès qu'on tourne dans l'app, et on garde l'API web
    // pour le navigateur. Dernier recours : la copie.
    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({ title: 'MK8 Racers', text: message, dialogTitle: 'Inviter au tournoi' });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: 'MK8 Racers', text: message });
        return;
      }
    } catch {
      // Partage annulé par l'utilisateur : ne pas enchaîner sur la copie,
      // ce serait agir sans qu'il l'ait demandé.
      return;
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
