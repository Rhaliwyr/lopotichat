export default async function handler(req, res) {
  const { q } = req.query;
  const apiKey = process.env.MUSIXMATCH_API_KEY;

  if (!q || q.length < 2) return res.status(400).json([]);

  try {
    const apiRes = await fetch(
      `https://api.musixmatch.com/ws/1.1/artist.search?q_artist=${encodeURIComponent(q)}&apikey=${apiKey}`
    );
    const data = await apiRes.json();

    const artists = data.message.body.artist_list.map(
      (item) => item.artist.artist_name
    );

    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json({ error: 'Erreur API Musixmatch' });
  }
}
