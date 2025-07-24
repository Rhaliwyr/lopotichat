import { Suspense } from "react";
import Game from "./game";

export default function GamePage() {
  return (
    <Suspense fallback={<div>Chargement du jeu...</div>}>
      <Game />
    </Suspense>
  );
}