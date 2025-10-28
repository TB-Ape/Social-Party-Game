
# Minigame Module System

## Purpose

This document explains how minigames are structured, loaded, and integrated into the platform. Each minigame is a self-contained plugin module that follows a standard interface.

---

## Minigame Module Interface

Each minigame exports an object implementing the following TypeScript interface:
export interface MinigameModule {
definition: MinigameDefinition;
validateInput?: (input: any, gameState: GameState, playerId: string) => boolean;
score?: (gameState: GameState) => GameState;
onPhaseChange?: (oldPhase: string, newPhase: string, gameState: GameState) => GameState;
getCustomView?: (phase: string) => React.ComponentType;
}
### MinigameDefinition
interface MinigameDefinition {
id: string;
title: string;
description: string;
phases: string[];
defaultTimer?: { [phase: string]: number };
playerCount?: { min: number; max: number };
prompts: MinigamePrompt[];
assets?: string[];
configOptions?: any;
}
### MinigamePrompt
interface MinigamePrompt {
id: string;
text: string;
hiddenRole?: boolean;
difficulty?: string;
category?: string;
}
---

## Example Module: "Who is...?"

Location: `/games/werist/index.ts`
import { MinigameModule, GameState } from "../../framework/interfaces";const definition = {
id: "werist",
title: "Who is...?",
description: "Vote for the player who best fits the prompt.",
phases: ["prompt", "vote", "results"],
defaultTimer: { prompt: 10, vote: 15, results: 10 },
playerCount: { min: 3, max: 12 },
prompts: [
{ id: "funny", text: "Who is the funniest?" },
{ id: "smart", text: "Who is the smartest?" }
]
};const validateInput = (input: any, gameState: GameState, playerId: string) => {
return typeof input === "string" && gameState.room.players.some(p => p.id === input);
};const score = (gameState: GameState): GameState => {
const voteCounts: { [id: string]: number } = {};
Object.values(gameState.inputs || {}).forEach(chosenId => {
voteCounts[chosenId] = (voteCounts[chosenId] || 0) + 1;
});
gameState.points = voteCounts;
return gameState;
};export const werist: MinigameModule = {
definition,
validateInput,
score
};
---

## How Modules Are Loaded

1. Backend scans `/games/` directory
2. Each subfolder with a valid `index.ts` is imported
3. Modules are registered by their `definition.id`
4. Frontend receives available game list via API/socket

---

## Creating a New Minigame

1. Create folder in `/games/<gameId>/`
2. Add `index.ts` with `MinigameModule` export
3. Define phases, prompts, and scoring logic
4. (Optional) Add custom UI components
5. Test module loading and gameplay

---

## Optional Features

### Custom Views

If your minigame needs specialized UI (e.g., drawing canvas, timer animations), implement `getCustomView`:
getCustomView: (phase: string) => {
if (phase === "drawing") return DrawingCanvas;
return null;
}
### Phase Change Hooks

Use `onPhaseChange` for custom logic when transitioning between phases:
onPhaseChange: (oldPhase, newPhase, gameState) => {
if (newPhase === "results") {
// Custom calculation or state modification
}
return gameState;
}
---

## Prompt Management

- Prompts can be stored in-module or loaded dynamically from database
- Use `MinigamePrompt.difficulty` or `category` for filtering/sorting
- Prompts with `hiddenRole: true` are shown only to specific players

---

## Tips

- Keep modules self-contained and testable
- Document any special requirements or dependencies
- Update this file when adding new interface fields or patterns

---

*For detailed examples, check existing modules in `/games/` and refer to [docs/architecture.md](architecture.md).*