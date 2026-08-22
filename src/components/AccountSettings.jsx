import { useState } from 'react';

const PRIVACY_URL = 'https://guizor.github.io/mk8-racers/confidentialite.html';

export default function AccountSettings({ isAnonymous, email, onLinkGoogle, onDeleteAccount, onBack }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleLink() {
    setBusy(true);
    setError('');
    try {
      await onLinkGoogle();
    } catch (err) {
      setError(
        err?.code === 'auth/credential-already-in-use'
          ? 'Ce compte Google est déjà lié à une autre installation.'
          : "La liaison a échoué. Réessaie dans un instant."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Supprimer ton compte ? Les joueurs, les stats et l\'historique de la bande ne sont pas effacés.')) return;
    setBusy(true);
    setError('');
    try {
      await onDeleteAccount();
    } catch {
      setError('Suppression impossible. Relance l\'app et réessaie.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen account-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Retour</button>
      <h2>Mon compte</h2>

      <div className="account-card">
        <h3>Sauvegarder mon accès</h3>
        {isAnonymous ? (
          <>
            <p className="account-text">
              Ton compte est lié à cette installation. Si tu changes de téléphone ou
              réinstalles l'app, tu repars de zéro.
            </p>
            <button className="btn btn-primary" onClick={handleLink} disabled={busy}>
              Lier un compte Google
            </button>
          </>
        ) : (
          <p className="account-text">
            Compte lié{email ? ` à ${email}` : ''}. Tu retrouveras l'app sur n'importe quel téléphone.
          </p>
        )}
      </div>

      <div className="account-card">
        <h3>Supprimer mon compte</h3>
        <p className="account-text">
          Efface ton identifiant. Les joueurs, les statistiques et l'historique
          appartiennent à la bande et restent en place.
        </p>
        <button className="btn btn-danger" onClick={handleDelete} disabled={busy}>
          Supprimer mon compte
        </button>
      </div>

      {error && <p className="account-error">{error}</p>}

      <a className="account-link" href={PRIVACY_URL} target="_blank" rel="noreferrer">
        Politique de confidentialité
      </a>
    </div>
  );
}
