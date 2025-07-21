export default async function handler(req, res) {
  const { artist, title } = req.query;

  const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Lyrics not found" });
    }

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
