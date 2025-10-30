import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// Temporäre Speicherstruktur für Räume und Spieler
interface Player {
  id: string;        // socket.id
  name: string;
}

interface Room {
  code: string;
  players: Player[];
}

const rooms = new Map<string, Room>();

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create_room', () => {
    const code = generateRoomCode();
    rooms.set(code, { code, players: [] });
    socket.join(code);
    socket.emit('room_created', { code });
    console.log(`Room ${code} created`);
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
    room.players.push({ id: socket.id, name: playerName });
    socket.join(code);
    // Update an alle im Raum senden
    io.to(code).emit('room_updated', { players: room.players });
    console.log(`Player ${playerName} joined room ${code}`);
  });

  socket.on('disconnect', () => {
    // Spieler aus Raum entfernen (optional)
    rooms.forEach(room => {
      const index = room.players.findIndex(p => p.id === socket.id);
      if (index !== -1) {
        const playerName = room.players[index].name;
        room.players.splice(index, 1);
        io.to(room.code).emit('room_updated', { players: room.players });
        console.log(`Player ${playerName} disconnected from room ${room.code}`);
      }
    });
  });
});

httpServer.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
