import mongoose, { Schema, Document } from 'mongoose';
import { GameRoom } from './types';

interface RoomDocument extends Omit<GameRoom, 'id'>, Document {}

const roomSchema = new Schema<RoomDocument>({
  code: { type: String, required: true, unique: true },
  hostId: { type: String, required: true },
  players: { type: Schema.Types.Mixed, default: [] },
  gameState: { type: Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const RoomModel = mongoose.model<RoomDocument>('Room', roomSchema);
