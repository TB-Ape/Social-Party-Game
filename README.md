# Social-Party-Game

An expandable, modular party game platform.

---

## Overview

A browser-based, modular party game system inspired by **Jackbox**, designed for quick, social gameplay on shared screens and smartphones.

- **Instant Join:** Anyone can join instantly—no registration required—using only their name and a room code.
- **Modular Design:** Easily add new minigames with a plug-and-play system.

---

## Architecture

### Backend

- **Node.js** + **Express** & **Socket.io**

### Frontend

- **React** (mobile-first, split views for player and big screen)

### Database

- **MongoDB** (rooms, game states, prompts)

---

## Repository Layout

```
/backend/    # Server code (Node.js, Express, Socket.io)
/frontend/   # Client code (React)
/games/      # Minigame modules (each game in its own folder)
/docs/       # Documentation, diagrams, specs
```

---
