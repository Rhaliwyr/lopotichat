export default async function handler(req, res) {
  const { artist, title } = req.query;

  if (!artist || !title) {
    return res.status(400).json({ error: 'Missing artist or title' });
  }

  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    if (!response.ok) throw new Error('Lyrics.ovh failed');
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
}
