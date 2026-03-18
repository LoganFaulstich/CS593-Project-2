import {
  ctx,
  canvas,
  GROUND_Y,
  gameState,
  player,
  obstacles,
  platforms,
  lemons,
  enemies,
} from "./gameLogic.js";

export function drawMenu() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 48px Arial";
  ctx.fillText("Platform Shooter", canvas.width / 2, 150);
  ctx.font = "22px Arial";
  ctx.fillText("Press SPACE to start", canvas.width / 2, 220);
  ctx.fillText("During play: SPACE = shoot", canvas.width / 2, 255);
  ctx.fillText("Arrow Left/Right = move", canvas.width / 2, 290);
  ctx.fillText("Arrow Up = jump", canvas.width / 2, 325);
}

export function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ff4d4d";
  ctx.textAlign = "center";
  ctx.font = "bold 52px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2, 170);
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Arial";
  ctx.fillText("Press SPACE for menu", canvas.width / 2, 270);
}

export function drawGround() {
  ctx.fillStyle = "#2f2f2f";
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
}

export function drawPlatforms() {
  platforms.forEach((plat) => {
    ctx.fillStyle = plat.color;
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
  });
}

export function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color || "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  });
}

export function drawLemon() {
  lemons.forEach((lemon) => {
    ctx.fillStyle = lemon.color;
    ctx.beginPath();
    ctx.arc(lemon.x, lemon.y, lemon.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawPlaying() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGround();
  drawLemon();
  drawPlatforms();
  drawEnemies();
  ctx.fillStyle = "#7dd3fc";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#f97316";
  for (const obstacle of obstacles) {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
  }
}
