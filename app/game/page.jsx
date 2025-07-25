import { Suspense } from "react";
import GameWrapper from "./game-wrapper";

export default function GamePage() {
  return (
    <Suspense fallback={<div>Chargement du jeu...</div>}>
      <GameWrapper />
    </Suspense>
  );
}
