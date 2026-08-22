import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Avatar from './Avatar';
import { DestinyBadge } from './Round';
import { StickerDrops, StickerRow } from './Stickers';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function FinalRanking({ ranking, scores, playersList, luckyPlayer, wantedPlayer, stickerDrops, onRestart }) {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  }, []);

  const citationMap = Object.fromEntries(playersList.map(p => [p.name, p.citation]));
  const avatarMap = Object.fromEntries(playersList.map(p => [p.name, p.avatarId]));
  const playerMap = Object.fromEntries(playersList.map(p => [p.name, p]));

  return (
    <div className="screen final-ranking-screen">
      <h2>🏆 Classement final</h2>

      <StickerDrops drops={stickerDrops} />
      <div className="final-ranking-list">
        {ranking.map((joueur, idx) => {
          const s = scores[joueur] || {};
          const medal = MEDALS[idx] ?? `${idx + 1}e`;
          return (
            <div key={joueur} className={`final-ranking-row rank-pos-${Math.min(idx + 1, 4)}`}>
              <span className="rank-medal">{medal}</span>
              <Avatar avatarId={avatarMap[joueur]} size={40} />
              <div className="rank-info">
                <span className="rank-name">{joueur}<StickerRow player={playerMap[joueur]} /> <DestinyBadge joueur={joueur} luckyPlayer={luckyPlayer} wantedPlayer={wantedPlayer} /></span>
                {citationMap[joueur] && (
                  <span className="rank-citation">"{citationMap[joueur]}"</span>
                )}
              </div>
              <div className="rank-pts">
                <span className="rank-champ">{s.champPoints ?? 0} pts champ.</span>
                <span className="rank-ingame">{s.inGamePoints ?? 0} pts jeu</span>
              </div>
            </div>
          );
        })}
      </div>
      <button className="btn btn-secondary btn-large" onClick={onRestart} style={{ marginTop: 32 }}>
        Retour à l'accueil
      </button>
    </div>
  );
}
