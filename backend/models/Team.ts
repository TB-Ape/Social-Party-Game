export interface Team {
  id: string;
  name: string;
  members: string[]; // player.id
  color?: string;
  score?: number;
}
