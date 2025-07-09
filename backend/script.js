const songs = [
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    lyrics: "Is this the real life? Is this just fantasy?"
  },
  {
    title: "Lose Yourself",
    artist: "Eminem",
    lyrics: "His palms are sweaty, knees weak, arms are heavy..."
  }
];

const song = songs[Math.floor(Math.random() * songs.length)];
document.getElementById("lyrics").innerText = song.lyrics;

function checkAnswer() {
  const guess = document.getElementById("guess").value.trim().toLowerCase();
  const result = document.getElementById("result");

  if (guess === song.title.toLowerCase()) {
    result.innerText = "Bravo, c'est bien ça ! 🎉";
  } else {
    result.innerText = `Non, la bonne réponse était "${song.title}"`;
  }
}
