import { useState } from 'react';

export default function Round({ round, joueurs, chosen, onChoose, onNext }) {
  const [revealed, setRevealed] = useState(false);
  const { num, choices, isSansObjet, isYoshi, malusParJoueur } = round;
  const hasMalus = Object.keys(malusParJoueur).length > 0;

  return (
    <div className="round-card">
      <div className="round-header">
        <h3>Manche {num}</h3>
        {isSansObjet && <span className="badge badge-warning">Course sans objets !</span>}
        {isYoshi && <span className="badge badge-yoshi">Yoshi-course !</span>}
      </div>

      {(isSansObjet || isYoshi) && (
        <div className="special-alert">
          {isSansObjet && <p>Aucun objet autorisé pour tous les joueurs cette manche !</p>}
          {isYoshi && <p>Choisissez la Yoshimoto ou la Moto Sport GP pour cette manche !</p>}
        </div>
      )}

      {hasMalus && (
        <div className="malus-section">
          <h4>Malus / Bonus du tour</h4>
          {joueurs.map(joueur => {
            const ml = malusParJoueur[joueur];
            if (!ml) return (
              <div key={joueur} className="malus-row no-malus">
                <span className="joueur-name">{joueur}</span>
                <span>Aucun malus</span>
              </div>
            );
            return (
              <div key={joueur} className={`malus-row ${ml.type === 'bonus' ? 'is-bonus' : 'is-malus'}`}>
                <span className="joueur-name">{joueur}</span>
                <div className="malus-content">
                  <span className={`badge ${ml.type === 'bonus' ? 'badge-bonus' : 'badge-malus'}`}>
                    {ml.type === 'bonus' ? 'BONUS' : 'MALUS'}
                  </span>
                  <span>{ml.texte}</span>
                  {ml.extraValue && <span className="extra-value">→ {ml.extraValue}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="circuit-section">
        <h4>Choisissez votre circuit</h4>
        {!revealed ? (
          <button className="btn btn-primary reveal-btn" onClick={() => setRevealed(true)}>
            Révéler les 3 circuits !
          </button>
        ) : (
          <div className="circuit-choices">
            {choices.map((c, i) => (
              <button
                key={i}
                className={`circuit-btn ${chosen === c ? 'selected' : ''}`}
                onClick={() => onChoose(c)}
              >
                <span className="circuit-num">{i + 1}</span>
                <span className="circuit-name">{c}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {chosen && (
        <div className="chosen-confirm">
          <p>Circuit choisi : <strong>{chosen}</strong></p>
          <p className="retire-msg">Ce circuit est retiré de la liste pour la suite du tournoi.</p>
          <button className="btn btn-primary" onClick={onNext}>Manche suivante</button>
        </div>
      )}
    </div>
  );
}
