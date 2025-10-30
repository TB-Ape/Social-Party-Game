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

export default function Player() {
  const { socket, connected } = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState<GameRoom | null>(null);

  useEffect(() => {
    if (!socket) return;

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
      socket.off('room_update');
      socket.off('error');
      socket.off('game_started');
    };
  }, [socket]);

  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      alert('Bitte Name und Raumcode eingeben!');
      return;
    }
    socket?.emit('join_room', {
      roomCode: roomCode.trim().toUpperCase(),
      playerName: playerName.trim()
    });
  };

  if (!room) {
    return (
      <div className="container">
        <h1>🎮 Social Party Game</h1>
        <h2>Raum beitreten</h2>

        <div className="form">
          <input
            type="text"
            placeholder="Dein Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
          />
          <input
            type="text"
            placeholder="Raumcode (z.B. ABCD)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={4}
          />
          <button onClick={joinRoom} disabled={!connected}>
            {connected ? 'Beitreten' : 'Verbinde...'}
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

      <div className="waiting">
        <h2>Warte auf Spielstart...</h2>
        <p>Der Host startet das Spiel gleich!</p>
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
    </div>
  );
}
