import { useState } from 'react';

export default function ChefLogin({ onSuccess, onBack }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === 'mario') {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="screen chef-login-screen">
      <button className="btn btn-secondary btn-sm back-btn" onClick={onBack}>← Retour</button>

      <div className="chef-login-card">
        <div className="chef-icon">👨‍💼</div>
        <h2>Bureau du Chef</h2>
        <p className="chef-subtitle">Accès réservé au grand patron</p>

        <form onSubmit={handleSubmit} className="chef-form">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe..."
            autoFocus
            className={error ? 'input-error' : ''}
          />
          {error && <p className="chef-error">❌ Mot de passe incorrect !</p>}
          <button type="submit" className="btn btn-primary btn-large">Entrer</button>
        </form>
      </div>
    </div>
  );
}
