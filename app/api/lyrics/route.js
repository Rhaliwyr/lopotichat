// /app/api/lyrics/route.js

import { NextResponse } from "next/server";
import artistsData from "@/data/artists.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist");

  if (!artist || !artistsData[artist]) {
    return NextResponse.json({ error: "Artiste non trouvé" }, { status: 404 });
  }

  const songs = artistsData[artist];
  const randomTitle = songs[Math.floor(Math.random() * songs.length)];

  try {
    const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(randomTitle)}`);
    const data = await res.json();

    if (!data || !data.lyrics) {
      return NextResponse.json({ error: "Paroles non trouvées" }, { status: 404 });
    }

    return NextResponse.json({
      lyrics: data.lyrics,
      title: randomTitle,
    });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
