import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}

interface GameRoom {
  id: string;
  code: string;
  hostId: string;
  players: Player[];
}

export default function Host() {
  const { socket, connected } = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [room, setRoom] = useState<GameRoom | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_created', (data: { room: GameRoom }) => {
      setRoom(data.room);
    });

    socket.on('room_update', (data: { room: GameRoom }) => {
      setRoom(data.room);
    });

    socket.on('error', (data: { message: string }) => {
      alert(`Fehler: ${data.message}`);
    });

    socket.on('game_started', () => {
      alert('Spiel gestartet! (Game-Logik kommt bald...)');
    });

    return () => {
      socket.off('room_created');
      socket.off('room_update');
      socket.off('error');
      socket.off('game_started');
    };
  }, [socket]);

  const createRoom = () => {
    if (!playerName.trim()) {
      alert('Bitte Namen eingeben!');
      return;
    }
    socket?.emit('create_room', { playerName: playerName.trim() });
  };

  const startGame = () => {
    if (!room) return;
    socket?.emit('start_game', { roomCode: room.code });
  };

  if (!room) {
    return (
      <div className="container">
        <h1>🎮 Social Party Game</h1>
        <h2>Host erstellen</h2>

        <div className="form">
          <input
            type="text"
            placeholder="Dein Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
          />
          <button onClick={createRoom} disabled={!connected}>
            {connected ? 'Raum erstellen' : 'Verbinde...'}
          </button>
        </div>

        <div className="status">
          Status: {connected ? '🟢 Verbunden' : '🔴 Getrennt'}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>🎮 Raum: {room.code}</h1>
      <div className="room-code">
        <h2>Code: <span className="code">{room.code}</span></h2>
        <p>Spieler können mit diesem Code beitreten!</p>
      </div>

      <div className="players">
        <h3>Spieler ({room.players.length})</h3>
        <ul>
          {room.players.map((player) => (
            <li key={player.id}>
              {player.name} {player.isHost && '👑'}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={startGame}
        disabled={room.players.length < 2}
        className="start-button"
      >
        {room.players.length < 2
          ? 'Warte auf Spieler...'
          : 'Spiel starten!'}
      </button>
    </div>
  );
}
