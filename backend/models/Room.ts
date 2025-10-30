// models/Room.ts
import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
  code: { type: String, unique: true },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
});

export default model('Room', RoomSchema);
