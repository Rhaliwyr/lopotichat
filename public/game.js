const lyricsBox = document.getElementById('lyrics');
const guessForm = document.getElementById('guessForm');
const guessInput = document.getElementById('guess');
const feedback = document.getElementById('feedback');
const triesBar = document.getElementById('triesBar');
const scoreDisplay = document.getElementById('scoreDisplay');
const replayBtn = document.getElementById('replay');
const artistDisplay = document.getElementById('artistName');
const bestScoreDisplay = document.getElementById('bestScore');

let artist = localStorage.getItem('selectedArtist') || 'Orelsan';
let currentTitle = '';
let fullLyrics = '';
let revealedLines = 1;
let maxTries = 5;
let tries = 0;
let score = 0;

// Utilitaire pour générer les pastilles d'essai
function updateTriesDisplay() {
  triesBar.innerHTML = '';
  for (let i = 0; i < maxTries; i++) {
    const dot = document.createElement('div');
    dot.classList.add(i < tries ? 'used' : '');
    triesBar.appendChild(dot);
  }
}

// Affiche les N premières lignes des paroles
function showLyrics(linesToShow = revealedLines) {
  const allLines = fullLyrics.split('\n').filter(line => line.trim() !== '');
  const visible = allLines.slice(0, linesToShow).join('\n');
  lyricsBox.textContent = visible || '[Paroles non disponibles]';
}

// Recharge une nouvelle chanson aléatoire
async function loadRandomSong() {
  feedback.textContent = '';
  lyricsBox.textContent = 'Chargement des paroles...';
  tries = 0;
  revealedLines = 1;
  updateTriesDisplay();

  try {
    const res = await fetch(`https://api.lyrics.ovh/suggest/${encodeURIComponent(artist)}`);
    const data = await res.json();
    const tracks = data.data.filter(track => track.artist.name.toLowerCase() === artist.toLowerCase());

    if (tracks.length === 0) throw new Error('Aucune chanson trouvée');

    const song = tracks[Math.floor(Math.random() * tracks.length)];
    currentTitle = song.title;
    artistDisplay.textContent = `Artiste : ${song.artist.name}`;

    const lyricsRes = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist.name)}/${encodeURIComponent(song.title)}`);
    const lyricsData = await lyricsRes.json();
    fullLyrics = lyricsData.lyrics || 'Paroles indisponibles.';

    showLyrics();

  } catch (err) {
    lyricsBox.textContent = 'Erreur lors du chargement des paroles.';
    console.error(err);
  }
}

// Formulaire de validation
guessForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const userGuess = guessInput.value.trim().toLowerCase();
  const correctTitle = currentTitle.trim().toLowerCase();

  if (!userGuess) return;

  tries++;
  updateTriesDisplay();

  if (userGuess === correctTitle) {
    feedback.textContent = '🎉 Bonne réponse !';
    score += Math.max(0, 6 - tries);
    scoreDisplay.textContent = `Score : ${score}`;
    replayBtn.style.display = 'inline-block';
    guessForm.style.display = 'none';

    // Stockage du meilleur score
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0');
    if (score > bestScore) {
      localStorage.setItem('bestScore', score);
      bestScoreDisplay.textContent = `🏆 Meilleur score : ${score}`;
    }

  } else {
    feedback.textContent = `❌ Mauvaise réponse (${tries}/${maxTries})`;
    revealedLines++;
    showLyrics();

    if (tries >= maxTries) {
      feedback.textContent = `😢 Perdu ! La réponse était : ${currentTitle}`;
      replayBtn.style.display = 'inline-block';
      guessForm.style.display = 'none';
    }
  }

  guessInput.value = '';
});

replayBtn.addEventListener('click', () => {
  replayBtn.style.display = 'none';
  guessForm.style.display = 'block';
  guessInput.value = '';
  feedback.textContent = '';
  loadRandomSong();
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  bestScoreDisplay.textContent = `🏆 Meilleur score : ${localStorage.getItem('bestScore') || 0}`;
  loadRandomSong();
});
