import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function PodiumResult({ result, players = [], onRestart }) {
  const positions = Object.keys(result).map(Number).sort((a, b) => a - b);

  // Map nom → citation
  const citationMap = Object.fromEntries(players.map(p => [p.name, p.citation || '']));

  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    const t1 = setTimeout(() => confetti({ particleCount: 80, angle: 60,  spread: 60, origin: { x: 0, y: 0.7 } }), 400);
    const t2 = setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="podium-result">
      <h2>Résultats du tournoi</h2>
      <div className="podium-display">
        {positions.map(pos => (
          <div key={pos} className={`podium-place place-${pos}`}>
            <div className="podium-medal">{MEDALS[pos] || `${pos}e`}</div>
            <div className="podium-names">
              {result[pos].map(joueur => (
                <div key={joueur} className="podium-name-block">
                  <span className="podium-name">{joueur}</span>
                  {citationMap[joueur] && (
                    <span className="podium-citation">"{citationMap[joueur]}"</span>
                  )}
                </div>
              ))}
            </div>
            <div className="podium-pos-label">{pos === 1 ? '1er' : `${pos}ème`}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-large" onClick={onRestart}>🏠 Retour à l'accueil</button>
    </div>
  );
}
