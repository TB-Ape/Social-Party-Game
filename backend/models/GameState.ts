import { MinigamePrompt } from './MinigamePrompt';
import { Team } from './Team';

export interface GameState {
  roundIndex: number;
  phase: string;
  prompt?: string;
  promptDetails?: any;
  secretPrompts?: { [playerId: string]: MinigamePrompt };
  choices?: string[];
  inputType?: "vote" | "text" | "drawing" | "photo" | "multi" | null;
  inputOptions?: string[];
  timer?: number;
  timerActive?: boolean;
  activePlayer?: string;
  useTeams?: boolean;
  teams?: Team[];
  inputs: { [playerId: string]: any };
  guesses?: { [playerId: string]: any };
  result?: any;
  points?: { [playerId: string]: number };
  teamResults?: { [teamId: string]: number };
  extension?: any;
}
