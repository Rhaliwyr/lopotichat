
document.getElementById("artistForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const artist = document.getElementById("artist").value.trim();
  if (artist) {
    window.location.href = `game.html?artist=${encodeURIComponent(artist)}`;
  }
});
