import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameRoom } from './models/GameRoom';
import { Player } from './models/Player';
import { GameState } from './models/GameState';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// Speicherstruktur für GameRooms
const rooms = new Map<string, GameRoom>();

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create_room', ({ playerName }) => {
    const code = generateRoomCode();
    const hostPlayer: Player = {
      id: socket.id,
      name: playerName,
      isHost: true,
      isOnline: true,
      lastActive: new Date(),
      score: 0
    };

    const initialGameState: GameState = {
      roundIndex: 0,
      phase: 'lobby',
      inputs: {},
      points: {}
    };

    const gameRoom: GameRoom = {
      id: code,
      hostId: socket.id,
      players: [hostPlayer],
      isActive: false,
      roundSettings: {
        selectedGames: [],
        rounds: []
      },
      currentRound: 0,
      gameState: initialGameState,
      lastActivity: new Date()
    };

    rooms.set(code, gameRoom);
    socket.join(code);
    socket.emit('room_created', { code, room: gameRoom });
    console.log(`Room ${code} created by ${playerName}`);
  });

  socket.on('join_room', ({ code, playerName }) => {
    const room = rooms.get(code);
    if (!room) {
      socket.emit('error_message', 'Raum nicht gefunden');
      return;
    }

    if (room.players.find(p => p.id === socket.id)) {
      socket.emit('error_message', 'Du bist schon in dem Raum');
      return;
    }

    const newPlayer: Player = {
      id: socket.id,
      name: playerName,
      isHost: false,
      isOnline: true,
      lastActive: new Date(),
      score: 0
    };

    room.players.push(newPlayer);
    room.lastActivity = new Date();
    socket.join(code);

    // Update an alle im Raum senden
    io.to(code).emit('room_updated', { room });
    console.log(`Player ${playerName} joined room ${code}`);
  });

  socket.on('disconnect', () => {
    // Spieler aus Raum entfernen
    rooms.forEach(room => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const playerName = room.players[playerIndex].name;
        room.players.splice(playerIndex, 1);
        room.lastActivity = new Date();
        
        // Wenn der Host disconnected, neuen Host bestimmen
        if (room.hostId === socket.id && room.players.length > 0) {
          room.hostId = room.players[0].id;
          room.players[0].isHost = true;
        }
        
        io.to(room.id).emit('room_updated', { room });
        console.log(`Player ${playerName} disconnected from room ${room.id}`);
        
        // Raum löschen wenn leer
        if (room.players.length === 0) {
          rooms.delete(room.id);
          console.log(`Room ${room.id} deleted (empty)`);
        }
      }
    });
  });
});

httpServer.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
