import {
  ACTION_MAP,
  STATES,
  gameState,
  player,
  onPlat,
  fireLemon,
} from "./gameLogic.js";

export function setupInput() {
  document.addEventListener("keydown", (e) => {
    const action = ACTION_MAP[e.key];
    if (action) e.preventDefault();

    if (gameState.currentState === STATES.PLAYING) {
      if (action === "fire") {
        fireLemon();
      }
      if (action === "jump" && player.canJump && onPlat(player)) {
        player.ySpeed = -15;
        player.canJump = false;
      }
      if (action === "left" && player.xSpeed > -player.walkCap) {
        player.decelerateLeft = false;
        player.facing = "left";
        player.walk = true;
      }
      if (action === "right" && player.xSpeed < player.walkCap) {
        player.decelerateRight = false;
        player.facing = "right";
        player.walk = true;
      }
    } else if (gameState.currentState === STATES.MENU) {
      if (action === "fire") {
        gameState.currentState = STATES.PLAYING;
      }
    } else if (gameState.currentState === STATES.GAMEOVER) {
      if (action === "fire") {
        gameState.currentState = STATES.MENU;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    const action = ACTION_MAP[e.key];
    if (action) e.preventDefault();

    if (gameState.currentState === STATES.PLAYING) {
      if (action === "left") {
        player.decelerateLeft = true;
        if (player.facing === "left") {
          player.walk = false;
        }
      }
      if (action === "right") {
        player.decelerateRight = true;
        if (player.facing === "right") {
          player.walk = false;
        }
      }
    }
  });
}
