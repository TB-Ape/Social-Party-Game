import { Server, Socket } from 'socket.io';
import { RoomManager } from './models/RoomManager';
import { Player } from './models/types';

export function setupSocketHandlers(io: Server, roomManager: RoomManager) {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Create room (host)
    socket.on('create_room', (data: { playerName: string }) => {
      try {
        const player: Player = {
          id: socket.id,
          name: data.playerName,
          score: 0,
          isHost: true,
          socketId: socket.id,
          isConnected: true
        };

        const room = roomManager.createRoom(player);
        socket.join(room.code);

        socket.emit('room_created', { room });
        console.log(`🏠 Room created: ${room.code} by ${player.name}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to create room' });
      }
    });

    // Join room (player)
    socket.on('join_room', (data: { roomCode: string; playerName: string }) => {
      try {
        const room = roomManager.getRoom(data.roomCode.toUpperCase());
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const player: Player = {
          id: socket.id,
          name: data.playerName,
          score: 0,
          isHost: false,
          socketId: socket.id,
          isConnected: true
        };

        roomManager.addPlayer(data.roomCode.toUpperCase(), player);
        socket.join(room.code);

        // Notify all players in room
        io.to(room.code).emit('room_update', { room });
        console.log(`👤 ${player.name} joined room ${room.code}`);
      } catch (error: any) {
        socket.emit('error', { message: error.message || 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('leave_room', (data: { roomCode: string }) => {
      handlePlayerLeave(socket, data.roomCode, io, roomManager);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);

      // Find and remove player from any room
      const rooms = roomManager.getAllRooms();
      for (const room of rooms) {
        const player = room.players.find(p => p.socketId === socket.id);
        if (player) {
          handlePlayerLeave(socket, room.code, io, roomManager);
          break;
        }
      }
    });

    // Start game
    socket.on('start_game', (data: { roomCode: string }) => {
      const room = roomManager.getRoom(data.roomCode);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Check if player is host
      const player = room.players.find(p => p.socketId === socket.id);
      if (!player || !player.isHost) {
        socket.emit('error', { message: 'Only host can start game' });
        return;
      }

      // TODO: Initialize game state
      console.log(`🎮 Game starting in room ${room.code}`);
      io.to(room.code).emit('game_started', { room });
    });
  });
}

function handlePlayerLeave(
  socket: Socket,
  roomCode: string,
  io: Server,
  roomManager: RoomManager
) {
  const room = roomManager.removePlayer(roomCode, socket.id);
  socket.leave(roomCode);

  if (room) {
    // Notify remaining players
    io.to(roomCode).emit('room_update', { room });
  } else {
    console.log(`🏠 Room ${roomCode} deleted (empty)`);
  }
}
