// /app/api/lyrics/route.js
import { NextResponse } from "next/server";
import artistsData from "@/data/artists.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get("artist");

  if (!artist) {
    return NextResponse.json({ error: "Paramètre 'artist' manquant" }, { status: 400 });
  }

  const artistSongs = artistsData[artist];

  if (!artistSongs || artistSongs.length === 0) {
    return NextResponse.json({ error: "Aucun titre connu pour cet artiste" }, { status: 404 });
  }

  // Choix aléatoire d’un titre
  const randomIndex = Math.floor(Math.random() * artistSongs.length);
  const randomSong = artistSongs[randomIndex].title;

  console.log(`🔍 Récupération des paroles : ${artist} - ${randomSong}`);

  try {
    const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(randomSong)}`);

    if (!res.ok) {
      console.error("❌ API lyrics.ovh a échoué avec status", res.status);
      return NextResponse.json({ error: "Paroles introuvables" }, { status: 404 });
    }

    const data = await res.json();

    if (!data.lyrics) {
      return NextResponse.json({ error: "Paroles manquantes dans la réponse" }, { status: 404 });
    }

    return NextResponse.json({
      lyrics: data.lyrics,
      title: randomSong,
    });
  } catch (error) {
    console.error("💥 Erreur dans /api/lyrics :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
