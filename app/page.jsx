/* --- /app/page.jsx --- */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function Home() {
  const [artistInput, setArtistInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [knownArtists, setKnownArtists] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/artists')
    .then(res => res.json())
    .then(data => setKnownArtists(data));
}, []);

  const handleInput = (e) => {
    const value = e.target.value;
    setArtistInput(value);
    if (value.length < 1) return setSuggestions([]);

    const filtered = knownArtists.filter(name =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (artistInput.trim()) {
      router.push(`/game?artist=${encodeURIComponent(artistInput.trim())}`);
    }
  };

  return (
    <div className="container">
      <img src="/logo.png" alt="Logo Musiquiz" className="logo" />
      <h1>Bienvenue sur Musiquiz 🎵</h1>
      <p>Choisis un artiste pour commencer :</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={artistInput}
          onChange={handleInput}
          placeholder="Nom de l'artiste"
          required
        />
        <ul className="suggestions">
          {suggestions.map((name, idx) => (
            <li key={idx} onClick={() => setArtistInput(name)}>{name}</li>
          ))}
        </ul>
        <button type="submit">Jouer</button>
      </form>
    </div>
  );
}
