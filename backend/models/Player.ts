// models/Player.ts
import { Schema, model } from 'mongoose';

const PlayerSchema = new Schema({
  name: String,
});

export default model('Player', PlayerSchema);

