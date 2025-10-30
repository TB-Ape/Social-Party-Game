import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './db/connection';
import { setupSocketHandlers } from './socket';
import { RoomManager } from './models/RoomManager';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-party-game';

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize room manager
const roomManager = new RoomManager();

// Setup Socket.io handlers
setupSocketHandlers(io, roomManager);

// Connect to database (optional - will work in-memory if connection fails)
connectDatabase(MONGODB_URI);

// Start server
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎮 Social Party Game Server v2.0    ║
╚════════════════════════════════════════╝

  🌐 Server running on: http://localhost:${PORT}
  🔌 WebSocket ready for connections
  📁 Mode: In-Memory + MongoDB (optional)

  Ready for players! 🚀
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
