"use client";

import { useEffect, useState } from "react";
import "./game.css";

export default function Game({ artist }) {
  const [lyrics, setLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadSong() {
      try {
        const res = await fetch(`/api/lyrics?artist=${encodeURIComponent(artist)}`);
        const data = await res.json();

        if (data.lyrics) {
          setLyrics(data.lyrics);
          setTitle(data.title);
        } else {
          setFeedback("Paroles non trouvées.");
        }
      } catch (e) {
        setFeedback("Erreur lors du chargement.");
      }
    }

    if (artist) loadSong();
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
