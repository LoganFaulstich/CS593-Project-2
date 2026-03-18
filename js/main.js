import {
  canvas,
  gameState,
  STATES,
  updatePlaying,
  resetGame,
} from "./gameLogic.js";
import { drawMenu, drawGameOver, drawPlaying } from "./gameRender.js";
import { setupInput } from "./input.js";

setupInput();

function gameLoop() {
  switch (gameState.currentState) {
    case STATES.MENU:
      drawMenu();
      break;
    case STATES.PLAYING:
      updatePlaying();
      drawPlaying();
      break;
    case STATES.GAMEOVER:
      drawGameOver();
      break;
  }
  requestAnimationFrame(gameLoop);
}

resetGame();
gameLoop();
