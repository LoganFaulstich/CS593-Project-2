const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
//Player Variables
let player = {
  x: 100,
  y: 200,
  w: 40,
  h: 40,
  ySpeed: 0,
  xSpeed: 0,
  decelerateLeft: false,
  decelerateRight: false,
  jumpImpulse: -20,
  walkImpulse: 2,
  walkCap: 20,
  color: "green",
  canJump: true,
};
//Game State
const STATES = { MENU: "menu", PLAYING: "playing", GAMEOVER: "gameover" };
let currentState = STATES.PLAYING;
//Action Map
let ACTION_MAP = {
  " ": "jump",
  ArrowUp: "jump",
  ArrowLeft: "left",
  ArrowRight: "right",
};

//Objects
let obstacles = [];
let platforms = [];

const GROUND_Y = 356;
const GRAVITY = 0.65;

function generatePlatform(width, height, xPos, yPos, typeColor = "blue") {
  platforms.push({
    w: width,
    h: height,
    x: xPos,
    y: yPos,
    color: typeColor,
  });
}
function generateObstacles(xPos, yPos, typeColor = "blue") {
  obstacles.push({
    w: 40,
    h: 40,
    x: xPos,
    y: yPos,
    color: typeColor,
  });
}

function aabb(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

//if a object is higher than b
function isAbove(a, b) {
  return a.y < b.y;
}

function playerPlatformCollide() {
  for (let i = 0; i < platforms.length; i++) {
    if (aabb(platforms[i], player)) {
      player.ySpeed = 0;
      if (isAbove(player, platforms[i])) {
        canJump = true;
        player.y = platforms.y + player.h;
      }
    }
  }
}

function updatePlaying() {
  // Physics
  player.ySpeed += GRAVITY;
  player.y += player.ySpeed;

  player.x += player.xSpeed;

  if (player.y + player.h >= GROUND_Y) {
    player.y = GROUND_Y - player.h;
    player.ySpeed = 0;
    player.canJump = true;
  }
}

document.addEventListener("keydown", (e) => {
  const action = ACTION_MAP[e.key];
  if(action) e.preventDefault();
  if (action === "jump") {
    player.ySpeed = player.jumpImpulse;
    player.canJump = false;
  }
  if (action === "left" && player.xSpeed > -player.walkCap) {
    player.xSpeed = -player.walkImpulse;
    decelerateLeft = false;
  }
  if (action === "right" && player.xSpeed < player.walkCap) {
    player.xSpeed = player.walkImpulse;
    decelerateRight = false;
  }
});
document.addEventListener("keyup", (e) => {
  const action = ACTION_MAP[e.key];
  if (action === "left" || action === "right") {
    player.xSpeed = 0;
    //decelerateLeft = true;
    //variable means in game loop, the player is reducing their speed at this
    // point, to make the transition between pressing a direciton and not smoother.
    // Once 0 is hit or exceeded in the loop this variable should be returned to false.
  }
});

function resetGame() {
  obstacles = [];
  platforms = [];
  player = {
    x: 100,
    y: 200,
    w: 40,
    h: 40,
    ySpeed: 0,
    xSpeed: 0,
    decelerateLeft: false,
    decelerateRight: false,
    jumpImpulse: 10,
    walkImpulse: 2,
    walkCap: 20,
    color: "green",
    canJump: true,
  };
}

function drawGround() {
  ctx.fillStyle = "#2f2f2f";
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
}

function drawPlaying() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGround();

  ctx.fillStyle = "#7dd3fc";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#f97316";
  for (const obstacle of obstacles) {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
  }
}

function gameLoop() {
  switch (currentState) {
    case STATES.MENU:
      //drawMenu();
      break;
    case STATES.PLAYING:
      updatePlaying();
      drawPlaying();
      break;
    case STATES.GAMEOVER:
      //drawGameOver();
      break;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
resetGame();
