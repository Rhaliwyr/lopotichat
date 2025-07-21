// Exemple Vercel serverless function (api/lyrics.js)
export default async function handler(req, res) {
  const { artist, title } = req.query;
  const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
