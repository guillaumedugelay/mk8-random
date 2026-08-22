import WheelSpin from './WheelSpin';
import CardDraw from './CardDraw';

export default function SpinPhase({ tournament, onTriggerSpin, onAdvanceSpin, onMarkDone, onFinishSpin, onFlipCard }) {
  const { manches, yoshiTarget, sansObjetTarget, spinStep, spinning, luckyPlayer, wantedPlayer, flippedCards } = tournament;

  return (
    <div className="spin-phase-screen">
      <h2 className="spin-phase-title">Tirage au sort</h2>

      <div className="spin-phase-row">
      <div className="spin-phase-wheels">
        <WheelSpin
          manches={manches}
          targetNum={yoshiTarget}
          label="🏎️ Yoshi-course"
          spinning={spinning && spinStep === 'yoshi'}
          done={spinStep === 'sansobjet' || spinStep === 'done'}
          onTrigger={onTriggerSpin}
          onDone={onAdvanceSpin}
          active={spinStep === 'yoshi'}
        />

        {(spinStep === 'sansobjet' || spinStep === 'done') && (
          <WheelSpin
            manches={manches}
            targetNum={sansObjetTarget}
            label="🚫 Sans objets"
            spinning={spinning && spinStep === 'sansobjet'}
            done={spinStep === 'done'}
            onTrigger={onTriggerSpin}
            onDone={onMarkDone}
            active={spinStep === 'sansobjet'}
          />
        )}
      </div>

      {spinStep === 'done' && (
        <CardDraw
          luckyPlayer={luckyPlayer}
          wantedPlayer={wantedPlayer}
          flippedCards={flippedCards || {}}
          onFlip={onFlipCard}
        />
      )}
      </div>

      {spinStep === 'done' && (
        flippedCards?.lucky && flippedCards?.wanted ? (
          <button className="btn btn-primary btn-large spin-start-btn" onClick={onFinishSpin}>
            🏁 Lancer la Manche 1 !
          </button>
        ) : (
          <p className="cards-pending-msg">Révélez les 2 cartes du destin pour lancer la manche 1 !</p>
        )
      )}
    </div>
  );
}
