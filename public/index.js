const input = document.getElementById("artist");
const form = document.getElementById("artistForm");
const suggestionsEl = document.getElementById("suggestions");

let knownArtists = [];

fetch("artists.json")
  .then((res) => res.json())
  .then((data) => {
    knownArtists = Object.keys(data);
  })
  .catch((err) => {
    console.error("Erreur lors du chargement des artistes :", err);
  });

input.addEventListener("input", () => {
  const q = input.value.toLowerCase();
  suggestionsEl.innerHTML = "";

  if (q.length < 1) return;

  const filtered = knownArtists.filter((name) =>
    name.toLowerCase().includes(q)
  );

  filtered.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("click", () => {
      input.value = name;
      suggestionsEl.innerHTML = "";
    });
    suggestionsEl.appendChild(li);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const artist = input.value.trim();
  if (artist && knownArtists.includes(artist)) {
    window.location.href = `game.html?artist=${encodeURIComponent(artist)}`;
  } else {
    alert("Artiste non reconnu.");
  }
});
