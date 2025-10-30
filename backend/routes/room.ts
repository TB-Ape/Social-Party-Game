// routes/room.ts
import { Router } from 'express';
import Room from '../models/Room';
import Player from '../models/Player';
const router = Router();

function generateRoomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

router.post('/create', async (req, res) => {
  let code = generateRoomCode();
  // Vermeide Kollisionen (sehr selten)
  while (await Room.exists({ code })) {
    code = generateRoomCode();
  }
  const newRoom = new Room({ code, players: [] });
  await newRoom.save();
  res.json({ code });
});
router.post('/join', async (req, res) => {
    const { code, playerName } = req.body;
    const room = await Room.findOne({ code });
    if (!room) {
      return res.status(404).json({ error: 'Raum nicht gefunden' });
    }
    const newPlayer = new Player({ name: playerName });
    await newPlayer.save();
    room.players.push(newPlayer._id);
    await room.save();
  
    // Hole alle Spieler für Anzeige, inkl. frisch hinzugefügtem
    const roomWithPlayers = await Room.findOne({ code }).populate('players').lean();
  
    res.json(roomWithPlayers);
  });
export default router;
