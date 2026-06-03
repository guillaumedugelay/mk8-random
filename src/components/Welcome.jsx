import { RECORDS } from '../data/data';

export default function Welcome({ onStart }) {
  return (
    <div className="screen welcome-screen">
      <div className="title-block">
        <h1 className="game-title">MK8<br />Random<br />Racers</h1>
        <p className="subtitle">Le tournoi Mario Kart 8 Deluxe ultime</p>
      </div>

      <div className="records-block">
        <h2>Panthéon des héros</h2>
        {RECORDS.map((r, i) => (
          <div key={i} className="record-item">
            <span className="record-label">{r.label}</span>
            <span className="record-detail">{r.detail}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-large" onClick={onStart}>
        Lancer l'aventure !
      </button>
    </div>
  );
}
