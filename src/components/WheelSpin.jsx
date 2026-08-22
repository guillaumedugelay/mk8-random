import { useEffect, useRef, useState } from 'react';

const ITEM_HEIGHT = 48;
const VISIBLE = 5;
const DURATION = 3500;

function easeOut(t) {
  return 1 - Math.pow(1 - t, 4);
}

export default function WheelSpin({ manches, targetNum, label, spinning, done, active, onTrigger, onDone }) {
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const calledDone = useRef(false);

  const numbers = [];
  const REPEATS = 8;
  for (let r = 0; r < REPEATS; r++) {
    for (let i = 1; i <= manches; i++) numbers.push(i);
  }

  const lastCycleStart = (REPEATS - 1) * manches;
  const targetIndex = lastCycleStart + (targetNum - 1);
  const targetOffset = targetIndex * ITEM_HEIGHT - Math.floor(VISIBLE / 2) * ITEM_HEIGHT;

  // Démarre l'animation quand spinning passe à true
  useEffect(() => {
    if (spinning && !animating && !done) {
      setAnimating(true);
      calledDone.current = false;
      startTimeRef.current = null;

      function animate(timestamp) {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / DURATION, 1);
        setOffset(easeOut(progress) * targetOffset);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setOffset(targetOffset);
          setAnimating(false);
          if (!calledDone.current) {
            calledDone.current = true;
            setTimeout(() => onDone(), 800);
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [spinning]);

  // Si done depuis Firebase (autre appareil a terminé), on place directement sur la cible
  useEffect(() => {
    if (done) setOffset(targetOffset);
  }, [done]);

  return (
    <div className="wheel-screen">
      <h3 className="wheel-title">{label}</h3>

      <div className="wheel-wrapper">
        <div className="wheel-window">
          <div className="wheel-highlight" />
          <div className="wheel-strip" style={{ transform: `translateY(-${offset}px)` }}>
            {numbers.map((n, i) => (
              <div key={i} className={`wheel-item ${done && n === targetNum && i === targetIndex ? 'active' : ''}`}>
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>

      {active && !spinning && !animating && !done && (
        <button className="btn btn-primary reveal-btn" onClick={onTrigger}>
          Tourner la roue !
        </button>
      )}

      {(animating || (spinning && !done)) && (
        <p className="wheel-spinning-msg">La roue tourne...</p>
      )}

      {done && (
        <div className="wheel-result">
          <p>Manche <strong>{targetNum}</strong></p>
        </div>
      )}
    </div>
  );
}
