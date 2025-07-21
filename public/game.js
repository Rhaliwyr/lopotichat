let currentArtist = localStorage.getItem("selectedArtist") || "";
let currentSong = null;
let currentLyricsLines = [];
let displayedLines = 2;
let tryCount = 0;
let maxTries = 5;
let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore") || "0");

const lyricsDisplay = document.getElementById("lyrics");
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("scoreDisplay");

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

function displayLyrics() {
  lyricsDisplay.textContent = currentLyricsLines.slice(0, displayedLines).join("\n");
}

function showLoading() {
  lyricsDisplay.innerHTML = `<em>Chargement des paroles...</em>`;
}

function endRound(success) {
  if (success) {
    feedback.textContent = "🎉 Bravo ! C'était bien : " + currentSong;
    score += (maxTries - tryCount + 1);
    updateBestScore(score);
  } else {
    feedback.textContent = "❌ Perdu ! C'était : " + currentSong;
  }

  scoreDisplay.textContent = `Score : ${score}`;
  displayBestScore();
  updateTriesBar();

  setTimeout(() => {
    loadRandomSong();
  }, 3000);
}

async function loadRandomSong() {
  showLoading();
  feedback.textContent = "";
  guessInput.value = "";
  tryCount = 0;
  displayedLines = 2;

  // Récupérer la liste des chansons
  const trackListUrl = `https://api.lyrics.ovh/suggest/${encodeURIComponent(currentArtist)}`;
  try {
    const res = await fetch(trackListUrl);
    const data = await res.json();
    const songs = data.data.filter((song) => song.artist.name.toLowerCase() === currentArtist.toLowerCase());
    if (!songs.length) {
      lyricsDisplay.textContent = "Aucune chanson trouvée pour cet artiste.";
      return;
    }

    // Choisir une chanson au hasard
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    currentSong = randomSong.title;
    const lyricsUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(currentArtist)}/${encodeURIComponent(currentSong)}`;

    const lyricsRes = await fetch(lyricsUrl);
    const lyricsData = await lyricsRes.json();

    if (!lyricsData.lyrics) {
      lyricsDisplay.textContent = "Paroles introuvables.";
      return;
    }

    currentLyricsLines = lyricsData.lyrics.split("\n").filter((line) => line.trim() !== "");
    displayLyrics();
    updateTriesBar();
    displayBestScore();
  } catch (err) {
    lyricsDisplay.textContent = "Erreur lors du chargement.";
    console.error(err);
  }
}

guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userGuess = guessInput.value.trim().toLowerCase();
  const correctTitle = currentSong.trim().toLowerCase();

  tryCount++;

  if (userGuess === correctTitle) {
    endRound(true);
  } else if (tryCount < maxTries) {
    displayedLines += 2;
    displayLyrics();
    feedback.textContent = "❌ Mauvaise réponse, essaye encore.";
    updateTriesBar();
  } else {
    endRound(false);
  }
});

// Lancement initial
loadRandomSong();
