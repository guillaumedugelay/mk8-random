import { useState } from 'react';
import Setup from './components/Setup';
import Tournament from './components/Tournament';
import Welcome from './components/Welcome';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [config, setConfig] = useState(null);

  function handleSetupDone(cfg) {
    setConfig(cfg);
    setScreen('tournament');
  }

  function handleRestart() {
    setConfig(null);
    setScreen('welcome');
  }

  return (
    <div className="app">
      {screen === 'welcome' && <Welcome onStart={() => setScreen('setup')} />}
      {screen === 'setup' && <Setup onDone={handleSetupDone} />}
      {screen === 'tournament' && <Tournament config={config} onRestart={handleRestart} />}
    </div>
  );
}
