setupInput();

function gameLoop(currentTime) {
  const deltaTime = Math.min((currentTime - time.lastTime) / 1000, 0.1) * 60;
  time.lastTime = currentTime;

  switch (gameState.currentState) {
    case STATES.MENU:
      drawMenu();
      resetGame();
      break;
    case STATES.PLAYING:
      updatePlaying(deltaTime);
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
