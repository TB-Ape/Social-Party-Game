export interface GamePlayer {
  id: string;
  name: string;
  isHost?: boolean;
  teamId?: string;
  score?: number;
  isOnline?: boolean;
  lastActive?: Date;
  color?: string;
}
