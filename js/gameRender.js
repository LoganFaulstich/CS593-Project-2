var image;
var player_happy = new Image();
player_happy.src = "assets/Player_Happy.png";
var player_jump = new Image();
player_jump.src = "assets/Player_Jump.png";
var player_sad = new Image();
player_sad.src = "assets/Player_Sad.png";

var enemyImage;
enemyImage = new Image();
enemyImage.src = "assets/Enemy.png";

var shakeIntensity = 0;
var shakeDecay = 0.9;

function triggerShake(amount) {
  shakeIntensity = amount;
}

function applyShake() {
  if (shakeIntensity > 0.1) {
    const shakeX = (Math.random() - 0.5) * shakeIntensity;
    const shakeY = (Math.random() - 0.5) * shakeIntensity;
    ctx.translate(shakeX, shakeY);
    shakeIntensity *= shakeDecay;
  }
}


function drawMenu() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 48px Arial";
  ctx.fillText("Platform Shooter", canvas.width / 2, 150);
  ctx.font = "22px Arial";
  ctx.fillText("Press SPACE to start", canvas.width / 2, 220);
  ctx.fillText("Use WASD or Arrow Keys to move", canvas.width / 2, 255);
  ctx.fillText("Use SPACE to shoot", canvas.width / 2, 290);
}

function drawGameOver() {
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

function drawHUD() {
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.font = "20px Arial";
  ctx.fillText(`Health: ${player.health}`, 20, 34);
  ctx.fillText(`High: ${gameState.highScore}`, 20, 62);
  ctx.fillText(`Score: ${gameState.score}`, 20, 90)
}
/*
function drawGround() {
  ctx.fillStyle = "#2f2f2f";
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
}
*/
function drawPlatforms() {
  platforms.forEach((plat) => {
    ctx.fillStyle = plat.color;
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color || "red";
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.w, enemy.h);
  });
}

function drawLemon() {
  lemons.forEach((lemon) => {
    ctx.fillStyle = lemon.color;
    ctx.beginPath();
    ctx.arc(lemon.x, lemon.y, lemon.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlayer() {
  if (player.state === "happy") {
    image = player_happy;
  } else if (player.state === "jump") {
    image = player_jump;
  } else if (player.state === "sad") {
    image = player_sad;
  }
  ctx.fillStyle = "#7dd3fc";
  ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

function drawPlaying() {
  ctx.save();

  applyShake();

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //drawGround();
  drawHUD();
  drawLemon();
  drawPlatforms();
  drawEnemies();
  drawPlayer();

  ctx.fillStyle = "#f97316";
  for (var i = 0; i < obstacles.length; i++) {
    var obstacle = obstacles[i];
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
  }

  ctx.restore();
}
