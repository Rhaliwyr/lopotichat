"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./game.css"; // ou adapte selon ton organisation CSS

export default function Game() {
  const searchParams = useSearchParams();
  const artist = searchParams.get("artist");

  const [lyrics, setLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadSong() {
      try {
        const res = await fetch(`/api/lyrics?artist=${encodeURIComponent(artist)}`);
        const data = await res.json();

        setLyrics(data.lyrics);
        setTitle(data.title);
      } catch (e) {
        setFeedback("Erreur lors du chargement des paroles.");
      }
    }

    if (artist) {
      loadSong();
    }
  }, [artist]);

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim().toLowerCase() === title.toLowerCase()) {
      setFeedback("🎉 Bonne réponse !");
    } else {
      setFeedback("❌ Mauvaise réponse, essaie encore.");
    }
  }

  return (
    <div className="container">
      <h1>Devine la chanson de {artist}</h1>
      <pre>{lyrics}</pre>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Titre de la chanson"
          required
        />
        <button type="submit">Valider</button>
      </form>

      <p>{feedback}</p>
    </div>
  );
}
