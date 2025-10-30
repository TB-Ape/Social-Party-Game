import { Player } from './Player';
import { Team } from './Team';
import { RoundConfig } from './RoundConfig';
import { GameState } from './GameState';

export interface GameRoom {
  id: string;
  hostId: string;
  players: Player[];
  isActive: boolean;
  roundSettings: {
    selectedGames: string[];
    rounds: RoundConfig[];
    teams?: Team[];
  };
  currentRound: number;
  gameState: GameState;
  lastActivity: Date;
}
