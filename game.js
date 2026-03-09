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
  walk: false,
  decelerateLeft: false,
  decelerateRight: false,
  walkImpulse: 2,
  walkCap: 10,
  color: "green",
  canJump: true,
  facing: "right"
};
let score = 0;
const decelerationRate = 2.5;
const jumpImpulse = -20;
//Game State
const STATES = { MENU: "menu", PLAYING: "playing", GAMEOVER: "gameover" };
let currentState = STATES.MENU;
//Action Map
let ACTION_MAP = {
  " ": "fire",
  "ArrowUp": "jump",
  "ArrowLeft": "left",
  "ArrowRight": "right",
};

//Objects
let obstacles = [];
let platforms = [];
//projectiles
let lemons = [];


const GROUND_Y = 600;
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
function fireLemon() {
    if(player.facing === "right"){
        lemons.push({
            x: player.x + player.w, 
            y: player.y + player.h / 2, 
            r: 6, 
            xSpeed: 8,
            facing: "right",
            color: "orange" 
        })
    }
    if(player.facing === "left"){
        lemons.push({
            x: player.x + player.w, 
            y: player.y + player.h / 2, 
            r: 6, 
            xSpeed: -8,
            facing: "left",
            color: "orange" 
        })
    }
}
function drawLemon() {
  lemons.forEach(lemon => { 
    ctx.fillStyle = lemon.color; 
      ctx.beginPath(); 
      ctx.arc(lemon.x, lemon.y, lemon.r, 0, Math.PI * 2); 
                ctx.fill(); 
  })
}
function updatePlaying() {
  // Physics
  playerUpdate()
  lemonUpdate()
}

function lemonUpdate() {
  for (let i = lemons.length - 1; i >= 0; i--) { 
                lemons[i].x += lemons[i].xSpeed; 
            if (lemons[i].x - lemons[i].r > canvas.width || lemons[i].x + lemons[i].r < 0) { 
                lemons.splice(i, 1); 
                }
            } 
}

function playerUpdate() {
  player.ySpeed += GRAVITY;
  player.y += player.ySpeed;
  if(player.decelerateLeft) {
    player.xSpeed += decelerationRate;
    if(player.xSpeed >= 0){
      player.xSpeed = 0;
      player.decelerateLeft = false; 
    } 
  }
  if(player.decelerateRight) {
    player.xSpeed -= decelerationRate;
    if(player.xSpeed <= 0){
      player.xSpeed = 0;
      player.decelerateRight = false;
    } 
  }
  if(player.walk) {
    switch(player.facing) {
      case 'right':
        if(player.x < canvas.width - player.w){
          player.xSpeed += player.walkImpulse;
        }
        break;
      case 'left':
        if (player.x > 0){
          player.xSpeed -= player.walkImpulse;
        }
        break;
    }
  }
  player.x += player.xSpeed;
  if(player.x >= canvas.width - player.w) {
    player.x = canvas.width - player.w;
  }
  if(player.x <= 0){
    player.x = 0
  }
  if (player.y + player.h >= GROUND_Y) {
    player.y = GROUND_Y - player.h;
    player.ySpeed = 0;
    player.canJump = true;
  }
}

document.addEventListener("keydown", (e) => {
  const action = ACTION_MAP[e.key];
  if(action) e.preventDefault();
  if(currentState === STATES.PLAYING){
    if (action === "fire") {
      fireLemon()
    }
    if (action === "jump" && player.canJump) {
      player.ySpeed = jumpImpulse;
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
  }
  else if(currentState === STATES.MENU) {
    if (action === "fire") {
      currentState = STATES.PLAYING;
    }
  }
  else if (currentState === STATES.GAMEOVER) {
    if (action === "fire") {
      currentState = STATES.MENU;
    }
  }
});

document.addEventListener("keyup", (e) => {
  const action = ACTION_MAP[e.key];
  if(action) e.preventDefault();
  if(currentState === STATES.PLAYING){
    if (action === "left" ) {
      player.decelerateLeft = true;
      if (player.facing === "left"){
      player.walk = false;
      }
      //variable means in game loop, the player is reducing their speed at this
      // point, to make the transition between pressing a direciton and not smoother.
      // Once 0 is hit or exceeded in the loop this variable should be returned to false.
    }
    if (action === "right" ) {
      player.decelerateRight = true;
      if (player.facing === "right"){
        player.walk = false;
      }
      //variable means in game loop, the player is reducing their speed at this
      // point, to make the transition between pressing a direciton and not smoother.
      // Once 0 is hit or exceeded in the loop this variable should be returned to false.
    }
  }
});

function drawMenu() {
  ctx.fillStyle = '#111'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);  
  ctx.fillStyle = '#ffffff'; 
  ctx.textAlign = 'center'; 
  ctx.font = 'bold 48px Arial'; 
  ctx.fillText('Platform Shooter', canvas.width / 2, 150); 
  ctx.font = '22px Arial'; 
  ctx.fillText('Press SPACE to start', canvas.width / 2, 220); 
  ctx.fillText('During play: SPACE = shoot', canvas.width / 2, 255); 
  ctx.fillText('Arrow Left/Right = move', canvas.width / 2, 290);
  ctx.fillText('Arrow Up = jump', canvas.width / 2, 325)
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
        ctx.fillStyle = '#ff4d4d'; 
        ctx.textAlign = 'center'; 
        ctx.font = 'bold 52px Arial'; 
        ctx.fillText('GAME OVER', canvas.width / 2, 170); 
 
        ctx.fillStyle = '#ffffff'; 
        ctx.font = '24px Arial'; 
//        ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2, 225); 
        ctx.fillText('Press SPACE for menu', canvas.width / 2, 270); 
}
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
    facing: "right",
    canJump: true
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
  drawLemon();
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

gameLoop();
resetGame();
