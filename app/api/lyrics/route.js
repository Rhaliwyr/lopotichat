// /app/api/lyrics/route.js

import { NextResponse } from "next/server";
import artistsData from "@/public/artists.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist");

  if (!artist || !artistsData[artist]) {
    return NextResponse.json({ error: "Artiste non trouvé" }, { status: 404 });
  }

  const songs = artistsData[artist];
  const random = songs[Math.floor(Math.random() * songs.length)];

  return NextResponse.json({
    lyrics: random.lyrics,
    title: random.title,
  });
}
