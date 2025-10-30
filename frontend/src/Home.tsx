import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Raum erstellen bei Laden
    socket.emit("create_room");

    socket.on("room_created", ({ code }) => {
      setRoomCode(code);
    });

    socket.on("room_updated", ({ players }) => {
      setPlayers(players);
    });

    return () => {
      socket.off("room_created");
      socket.off("room_updated");
    };
  }, []);

  return (
    <div>
      {roomCode ? (
        <>
          <h1>Raumcode: {roomCode}</h1>
          <h2>Spieler im Raum:</h2>
          <ul>
            {players.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Raum wird erstellt...</p>
      )}
    </div>
  );
}
