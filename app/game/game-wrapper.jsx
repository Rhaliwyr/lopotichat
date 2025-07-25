"use client";

import Game from "./game";
import { useSearchParams } from "next/navigation";

export default function GameWrapper() {
  const searchParams = useSearchParams();
  const artist = searchParams.get("artist");

  return <Game artist={artist} />;
}
