
const params = new URLSearchParams(window.location.search);
const artist = params.get("artist") || "Eminem";
const title = "Mockingbird";

async function loadLyrics() {
  const res = await fetch(`/api/lyrics?artist=${artist}&title=${title}`);
  const data = await res.json();
  document.body.innerHTML += `<pre>${data.lyrics}</pre>`;
}

loadLyrics();
