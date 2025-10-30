// Core type definitions for the game platform

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  socketId: string;
  isConnected: boolean;
}

export interface GameRoom {
  id: string;
  code: string;
  hostId: string;
  players: Player[];
  gameState: GameState | null;
  createdAt: Date;
}

export interface GameState {
  gameId: string;
  roundIndex: number;
  phase: 'prompt' | 'vote' | 'results';
  currentPrompt?: MinigamePrompt;
  inputs: { [playerId: string]: any };
  votes: { [playerId: string]: string };
  scores: { [playerId: string]: number };
  timer?: {
    phase: string;
    secondsLeft: number;
  };
}

export interface MinigamePrompt {
  id: string;
  text: string;
  category?: string;
}

export interface MinigameDefinition {
  id: string;
  title: string;
  description: string;
  phases: string[];
  defaultTimer: { [phase: string]: number };
  playerCount: { min: number; max: number };
  prompts: MinigamePrompt[];
}
