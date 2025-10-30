import { GameRoom, Player } from './types';

// In-memory room storage (works with or without MongoDB)
export class RoomManager {
  private rooms: Map<string, GameRoom> = new Map();

  createRoom(hostPlayer: Player): GameRoom {
    const code = this.generateRoomCode();
    const room: GameRoom = {
      id: code,
      code,
      hostId: hostPlayer.id,
      players: [hostPlayer],
      gameState: null,
      createdAt: new Date()
    };
    this.rooms.set(code, room);
    return room;
  }

  getRoom(code: string): GameRoom | undefined {
    return this.rooms.get(code);
  }

  addPlayer(code: string, player: Player): GameRoom | null {
    const room = this.rooms.get(code);
    if (!room) return null;

    // Check if name is already taken
    if (room.players.some(p => p.name === player.name)) {
      throw new Error('Name already taken');
    }

    room.players.push(player);
    return room;
  }

  removePlayer(code: string, playerId: string): GameRoom | null {
    const room = this.rooms.get(code);
    if (!room) return null;

    room.players = room.players.filter(p => p.id !== playerId);

    // If room is empty, delete it
    if (room.players.length === 0) {
      this.rooms.delete(code);
      return null;
    }

    // If host left, assign new host
    if (room.hostId === playerId && room.players.length > 0) {
      room.hostId = room.players[0].id;
      room.players[0].isHost = true;
    }

    return room;
  }

  updateRoom(code: string, updates: Partial<GameRoom>): GameRoom | null {
    const room = this.rooms.get(code);
    if (!room) return null;

    Object.assign(room, updates);
    return room;
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Check if code already exists
    if (this.rooms.has(code)) {
      return this.generateRoomCode();
    }
    return code;
  }

  getAllRooms(): GameRoom[] {
    return Array.from(this.rooms.values());
  }
}
