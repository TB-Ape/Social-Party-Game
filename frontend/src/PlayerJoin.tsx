import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function PlayerJoin() {
  const [inputCode, setInputCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    socket.on("room_updated", ({ players }) => {
      setPlayers(players);
    });
    return () => {
      socket.off("room_updated");
    };
  }, []);

  function joinRoom() {
    if (!inputCode || !playerName) {
      alert("Bitte Raumcode und Namen eingeben");
      return;
    }
    socket.emit("join_room", { code: inputCode, playerName });
  }

  return (
    <div>
      <h1>Raum beitreten</h1>
      <input
        placeholder="Raumcode"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
      />
      <input
        placeholder="Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={joinRoom}>Beitreten</button>

      <h2>Spieler im Raum</h2>
      <ul>
        {players.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
