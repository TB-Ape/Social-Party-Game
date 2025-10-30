import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Host from './pages/Host';
import Player from './pages/Player';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/host" element={<Host />} />
        <Route path="/play" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="container home">
      <h1>🎮 Social Party Game</h1>
      <p className="subtitle">Jackbox-ähnliches Multiplayer Party-Spiel</p>

      <div className="home-buttons">
        <Link to="/host" className="button primary">
          🖥️ Host erstellen
          <span className="hint">Für den Hauptbildschirm</span>
        </Link>

        <Link to="/play" className="button secondary">
          📱 Spieler beitreten
          <span className="hint">Für dein Smartphone</span>
        </Link>
      </div>

      <div className="info">
        <h3>Wie funktioniert es?</h3>
        <ol>
          <li>Eine Person erstellt einen Host (Hauptbildschirm)</li>
          <li>Andere Spieler treten mit dem Raumcode bei</li>
          <li>Host startet das Spiel</li>
          <li>Viel Spaß! 🎉</li>
        </ol>
      </div>
    </div>
  );
}
