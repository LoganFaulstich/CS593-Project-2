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
