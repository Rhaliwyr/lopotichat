// Local Score

let bestScore = parseInt(localStorage.getItem("bestScore") || "0");

function updateBestScore(score) {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
}

function displayBestScore() {
  const bestScoreEl = document.getElementById("bestScore");
  bestScoreEl.textContent = `🏆 Meilleur score : ${bestScore}`;
}

// Tries counter

function updateTriesBar() {
  const triesBar = document.getElementById("triesBar");
  triesBar.innerHTML = "";
  for (let i = 0; i < maxTries; i++) {
    const dot = document.createElement("div");
    dot.style.width = "20px";
    dot.style.height = "20px";
    dot.style.borderRadius = "50%";
    dot.style.backgroundColor = i < tryCount ? "#e74c3c" : "#ccc";
    triesBar.appendChild(dot);
  }
}

// Game Logic

const urlParams = new URLSearchParams(window.location.search);
const artist = urlParams.get("artist");

const lyricsDisplay = document.getElementById("lyrics");
const artistNameDisplay = document.getElementById("artistName");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("scoreDisplay");
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const newSongBtn = document.getElementById("newSongBtn");

let lyricsLines = [];
let currentLineCount = 4;
let currentSong = "";
let tryCount = 0;
const maxTries = 5;

async function loadRandomSong() {
  feedback.textContent = "";
  scoreDisplay.textContent = "";
  newSongBtn.style.display = "none";
  guessInput.disabled = false;

  tryCount = 0;
  currentLineCount = 2;

  const res = await fetch("songs/artists.json");
  const data = await res.json();

  const songs = data[artist];
  if (!songs || songs.length === 0) {
    lyricsDisplay.textContent = "Aucune chanson disponible pour cet artiste.";
    guessForm.style.display = "none";
    return;
  }

  const randomIndex = Math.floor(Math.random() * songs.length);
  currentSong = songs[randomIndex];

  artistNameDisplay.textContent = `Artiste : ${artist}`;
  guessForm.style.display = "block";
  guessInput.value = "";

  const lyricsRes = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(currentSong)}`);
  const lyricsData = await lyricsRes.json();

  if (!lyricsData.lyrics) {
    lyricsDisplay.textContent = "Paroles indisponibles.";
    return;
  }

  lyricsLines = lyricsData.lyrics.split("\n").filter(line => line.trim() !== "");
  displayLyrics();
  displayBestScore();
  updateTriesBar();
}

function displayLyrics() {
  lyricsDisplay.textContent = lyricsLines.slice(0, currentLineCount).join("\n");
}

guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const guess = guessInput.value.trim().toLowerCase();
  const correct = currentSong.trim().toLowerCase();

  tryCount++;
  updateTriesBar();

  if (guess === correct) {
    const score = Math.max(0, 6 - tryCount); // 5 pts si 1er essai, ... 1 pt au 5e
    feedback.textContent = `✅ Bravo ! C'était "${currentSong}"`;
    scoreDisplay.textContent = `Score : ${score} point${score > 1 ? "s" : ""}`;
    endRound();
  } else if (tryCount < maxTries) {
    feedback.textContent = `❌ Mauvaise réponse. Essaie encore.`;
    currentLineCount += 4;
    displayLyrics();
  } else {
    feedback.textContent = `❌ Échec ! La bonne réponse était "${currentSong}"`;
    scoreDisplay.textContent = `Score : 0 point`;
    endRound();
  }

  guessInput.value = "";
});

function endRound() {
  guessInput.disabled = true;
  newSongBtn.style.display = "inline-block";
  updateBestScore(score);
  displayBestScore();
  updateTriesBar();
}

newSongBtn.addEventListener("click", () => {
  loadRandomSong();
});

if (artist) {
  loadRandomSong();
} else {
  lyricsDisplay.textContent = "Aucun artiste spécifié.";
  guessForm.style.display = "none";
}

