var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var screenShake = 25;
var GRAVITY = 0.65;
var decelerationRate = 2.5;
var jumpImpulse = -15;
var iFramesDuration = 60;

var STATES = {
  MENU: "menu",
  PLAYING: "playing",
  GAMEOVER: "gameover",
};

var ACTION_MAP = {
  " ": "fire",
  ArrowUp: "jump",
  W: "jump",
  w: "jump",
  ArrowLeft: "left",
  A: "left",
  a: "left",
  ArrowRight: "right",
  D: "right",
  d: "right",
};

var LEVEL_MAP = {
  1: "Level 1",
  2: "Level 2",
  3: "Level 3",
};

var level1 = [
  [250, 40, 150, 450],
  [250, 40, 500, 450],
  [100, 40, 200, 300],
  [100, 40, 400, 300],
  [100, 40, 600, 300],
  [700, 40, 100, 600],
];


const  spawnPoints = [
  {x: 500, y: 500},
  {x: 500, y:260},
  {x: 260, y: 360},
  {x: 260, y: 500},

]

var time = {
  lastTime: 0,
};

var gameState = {
  currentState: STATES.MENU,
  score: 0,
  highScore: 0
};
// default state is objectively wrong values so that the checker can identify correct values.
const BORDERINIT = {
  left: 900,
  right: 0
};
var stageBorder = {... BORDERINIT};

const DIRECTION = {
  LEFT: "left",
  RIGHT: "right",
  UP: "above",
  DOWN: "below"
};

const playerModel = {
  x: 250,
  y: 100,
  w: 40,
  h: 40,
  ySpeed: 0,
  xSpeed: 0,
  walk: false,
  decelerateLeft: false,
  decelerateRight: false,
  walkImpulse: 0.5,
  walkCap: 7,
  color: "green",
  canJump: true,
  facing: "right",
  state: "happy",
  health: 6,
  iFrames: 0,
  knockbackL: 0,
  knockbackR: 0,
};
var player = { ...playerModel };

var obstacles = [];
var platforms = [];
var lemons = [];
var enemies = [];
var levelGenerated = false;

const ENEMYTYPE = {
    NORMAL: {type:"normal", xSpeed: 3, ySpeed: 0, gravity: true, canJump: false},
    FLYING: {type: "flying", xSpeed: 2, ySpeed: 2, gravity: false, canJump: false},
    SPRING: {type: "spring", xSpeed: 2, ySpeed: 0, gravity: true, canJump: true}
}

/*
var wave1 = [
  [
    [0, "red"],
    [1, "red"]
  ],
  [
    [0, "red", ENEMYTYPE.SPRING],
    [1, "red", ENEMYTYPE.FLYING]
  ]
]
  */
const typeList = [ENEMYTYPE.NORMAL, ENEMYTYPE.NORMAL, ENEMYTYPE.NORMAL, ENEMYTYPE.FLYING, ENEMYTYPE.FLYING, ENEMYTYPE.SPRING]
// Used to determine type frequency.
function generateWave(count){
  let spawns = []
  let spawnCount = spawnPoints.length
  let typeCount = typeList.length
  for(i = 0; i < count; i++){
    spawns.push([Math.floor(Math.random() * spawnCount), typeList[Math.floor(Math.random() * typeCount)]]);
  }
  return spawns;
}
function generatePlatform(width, height, xPos, yPos, typeColor = "blue") {
  platforms.push({ w: width, h: height, x: xPos, y: yPos, color: typeColor });
}

function generateLevel(level) {
  level.forEach((plat) => {
    generatePlatform(plat[0], plat[1], plat[2], plat[3]);
  });
  // create default enemies on the ground and a platform so they are visible
  spawnEnemies(generateWave(2))
  borderCheck();
  levelGenerated = true;
  
}

function generateObstacles(xPos, yPos, typeColor = "blue") {
  obstacles.push({ w: 40, h: 40, x: xPos, y: yPos, color: typeColor });
}

function generateEnemy(xPos, yPos, typeColor, eType = ENEMYTYPE.NORMAL) {
  enemies.push({
    w: 40,
    h: 40,
    x: xPos,
    y: yPos,
    type: eType,
    color: typeColor,
    falling: 0
  });
}
function spawnCollision(simulatedLoc) {
  if (enemies.length > 0)
  {
    enemies.forEach(enemy => {
      if(aabb(enemy, simulatedLoc)) {
        return true;
      }
    })
  }
  return false;
}
function spawnEnemies(enemyLoc) {
  let sim = {}
  enemyLoc.forEach(stats =>
  {
    sim = {x: spawnPoints[stats[0]].x, y: spawnPoints[stats[0]].y, w: 40, h: 40}
    if (!aabb(player, sim) && !spawnCollision(sim)){
      if(stats.length === 1){
        generateEnemy(sim.x, sim.y, "red");
      }
      else if(stats.length === 2){
        generateEnemy(spawnPoints[stats[0]].x, spawnPoints[stats[0]].y, "red",  stats[1]);
      }
    }
  }
  )
}
function borderCheck(){
  stageBorder = {... BORDERINIT}
  platforms.forEach(plat => {
    if(stageBorder.left > plat.x){
      stageBorder.left = plat.x
    }
    if (stageBorder.right < plat.x + plat.w){
      stageBorder.right = plat.x + plat.w
    }
  })
}

function aabb(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function rectCircle(rect, circle) { 
  try{
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w)); 
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h)); 
  const dx = circle.x - closestX; 
  const dy = circle.y - closestY; 
  return (dx * dx + dy * dy) <= circle.r * circle.r; 
  }
  catch (e){
    return false;
  }
} 

function isAbove(a, b) {
  return a.y < b.y;
}

function isBelow(a, b) {
  return a.y + a.h > b.y + b.h;
}

function isLeft(a, b) {
  return a.x > b.x;
}

function isRight(a, b) {
  return a.x + a.w < b.x + b.w;
}

function goThroughY(a, b, speedy, speedx) {
  if((a.x <= b.x + b.w && a.x + a.w >= b.x) ||(a.x + speedx <= b.x + b.w && a.x + speedx + a.w >= b.x)){
    if(isAbove(a, b) && a.y + speedy > b.y) {
      return DIRECTION.UP;
    }
    else if (isBelow(a,b) && a.y +a.h + speedy < b.y + b.h) {
      return DIRECTION.DOWN;
    }
  }
  else {
    return "clear";
  }
}

function goThroughX(a, b, speedx, speedy)
{
  if((a.y <= b.y + b.h && a.y + a.h >= b.y)||(a.y + speedy <= b.y + b.h && a.y + speedy + a.h >= b.y)) {
    if(isLeft(b,a) && a.x + speedx > b.x) {
      return DIRECTION.LEFT;
    } else if (isRight(b,a) && a.x + a.w + speedy < b.x + b.w){
      return DIRECTION.RIGHT;
    }
  }
  else {
    return "clear";
  }
}


function onPlat(a) {
  let onSolid = false;
  platforms.forEach((plat) => {
    if (
      a.y + a.h <= plat.y &&
      !isBelow(a, plat) &&
      a.y + a.h > plat.y - 10 &&
      a.x < plat.x + plat.w &&
      a.x + a.w > plat.x
    ) {
      onSolid = true;
    }
  });
  return onSolid;
}

function playerPlatformCollide() {
  for (let i = 0; i < platforms.length; i++) {
    if (aabb(platforms[i], player)) {
      player.ySpeed = 0;
      if (isAbove(player, platforms[i])) {
        player.canJump = true;
        player.y = platforms[i].y - player.h;
      }
      if (isBelow(player, platforms[i])) {
        player.y = platforms[i].y + platforms[i].h;
      }      
    }
  }
}

function playerEnemyCollide() {
  if (player.iFrames <= 0) {
    for (let i = 0; i < enemies.length; i++) {
      if (aabb(enemies[i], player)) {
        triggerShake(screenShake);
        player.health -= 1;
        player.iFrames = iFramesDuration;
        playDamageSound();
        if (isLeft(enemies[i], player)) {
          player.knockbackL = 10;
        } else if (isRight(enemies[i], player)) {
          player.knockbackR = 10;
        }
        if (player.health < 0) {
          player.health = 0;
        }
        if (player.health <= 0) {
          gameState.currentState = STATES.GAMEOVER;
        }
      }
    }
  }
}

function lemonPlatformCollide(lemonNo) {
  let i = lemonNo;
  let collision = false;
  for (let j = 0; j < platforms.length; j++) {
    if (rectCircle(platforms[j], lemons[i])) {
      collision = true;
      break;
    }
  } 
  return collision;
}

function lemonEnemyCollision(lemonNo) {
  let i = lemonNo;
  let collision = false;
  for (let j = 0; j < enemies.length; j++) {
    if (rectCircle(enemies[j], lemons[i])) {
      collision = true;
      enemyDamaged(j);
        playEnemyDamageSound();
      break;
    }
  } 
  return collision;
}

function enemyDamaged(enemy) {
  enemies.splice(enemy, 1);
  gameState.score += 10;
}

function playerIFrameUpdate(deltaTime) {
  if (player.iFrames > 0) {
    player.iFrames -= 1 * deltaTime;
    player.state = "sad";
  }
  if (player.iFrames < 0) {
    player.iFrames = 0;
    player.state = "happy";
  }
}

function playerKnockBack(deltaTime) {
  if (player.knockbackL <= player.knockbackR && player.knockbackR > 0) {
    player.x += 9 * deltaTime;
    player.y -= 3 * deltaTime;
    player.knockbackR -= 1 * deltaTime;
    player.knockbackL = 0;
    if (player.knockbackR < 0) {
      player.knockbackR = 0;
    }
  } else if (player.knockbackL > 0) {
    player.x -= 9 * deltaTime;
    player.y -= 3 * deltaTime;
    player.knockbackL -= 1 * deltaTime;
    player.knockbackR = 0;
    if (player.knockbackL < 0) {
      player.knockbackL = 0;
    }
  }
}

function fireLemon() {
  const speed = player.facing === "right" ? 8 : -8;
  lemons.push({
    x: player.x + player.w,
    y: player.y + player.h / 2,
    r: 6,
    xSpeed: speed,
    facing: player.facing,
    color: "orange",
  });
  playShootSound();
}

function lemonUpdate(deltaTime) {
  for (let i = lemons.length - 1; i >= 0; i--) {
    lemons[i].x += lemons[i].xSpeed * deltaTime;
    if (
      lemons[i].x - lemons[i].r > canvas.width ||
      lemons[i].x + lemons[i].r < 0 ||
      lemonPlatformCollide(i) || lemonEnemyCollision(i)
    ) {
      lemons.splice(i, 1);
    }
  }
}

function playerUpdate(deltaTime) {
  if (!onPlat(player)) {
    player.ySpeed += GRAVITY * deltaTime;
    player.state = "jump";
  } else {
    player.state = "happy";
  }

  playerPlatformCollide();
  player.y += player.ySpeed * deltaTime;

  if (player.decelerateLeft) {
    player.xSpeed += decelerationRate * deltaTime;
    if (player.xSpeed >= 0) {
      player.xSpeed = 0;
      player.decelerateLeft = false;
    }
  }

  if (player.decelerateRight) {
    player.xSpeed -= decelerationRate * deltaTime;
    if (player.xSpeed <= 0) {
      player.xSpeed = 0;
      player.decelerateRight = false;
    }
  }

  if (player.walk) {
    if (player.facing === "right") {
      if (player.x < canvas.width - player.w) {
        player.xSpeed += player.walkImpulse * deltaTime;
        if (player.xSpeed > player.walkCap) {
          player.xSpeed = player.walkCap;
        }
      }
    } else {
      if (player.x > 0) {
        player.xSpeed -= player.walkImpulse * deltaTime;
        if (player.xSpeed < -player.walkCap) {
          player.xSpeed = -player.walkCap;
        }
      }
    }
  }

  player.x += player.xSpeed * deltaTime;

  if (player.x >= canvas.width - player.w) {
    player.x = canvas.width - player.w;
  }
  if (player.x <= 0) {
    player.x = 0;
  }
  if(player.y >= canvas.height) {
    gameState.currentState = STATES.GAMEOVER
  }
  playerEnemyCollide();
  playerIFrameUpdate(deltaTime);
  playerKnockBack(deltaTime);
}

function enemyUpdate(deltaTime) {
  let enemy = {};
  for(i = 0; i < enemies.length; i++)
  {
    enemy = enemies[i];
    movement = enemy.type;
    grounded = onPlat(enemy);
    
    if(isLeft(enemy, player) 
      && enemy.x + enemy.w - movement.xSpeed*deltaTime > stageBorder.left) {
      enemy.x -= movement.xSpeed * deltaTime;
    }
    if(isRight(enemy, player) 
      && enemy.x+movement.xSpeed*deltaTime < stageBorder.right) {
      enemy.x += movement.xSpeed *deltaTime;
    }
    if(movement.gravity && !grounded) {
      enemy.falling += GRAVITY * deltaTime;
    }
    else {
      enemy.falling = 0;
    }
    if(player.y + player.h/4 < enemy.y + enemy.h) {
      enemy.y -= movement.ySpeed *deltaTime;
    }
    if(movement.canJump){
        if (grounded){
          enemy.falling = -15;
        }
    }
    if(player.y > enemy.y + enemy.h/4 ) {
      enemy.y += movement.ySpeed * deltaTime;
      
    }
    enemyPlatformCollide(enemy, movement, enemy.falling);
    enemy.y += enemy.falling * deltaTime;
    if(enemy.y > canvas.height)
    {
      enemies.splice(i, 1)
    }
  }
}

/*function enemyMove(enemy){
  switch(enemy.type) {
    case "normal":
      return ENEMYTYPE.NORMAL;
    case "flying":
      return ENEMYTYPE.FLYING;
    case "spring":
      return ENEMYTYPE.SPRING;
  }
} */

function enemyPlatformCollide(enemy, movement, falling) {
  let sideCollide = "clear"
  let horizonCollide = "clear"
  for (let j = 0; j < platforms.length; j++) {
    sideCollide = goThroughX(enemy, platforms[j], movement.xSpeed, movement.ySpeed + falling)
    horizonCollide = goThroughY(enemy, platforms[j], movement.ySpeed + falling, movement.xSpeed)
    if (aabb(enemy, platforms[j])) {
      enemy.falling = 0;
      if(isAbove(enemy, platforms[j])){
        enemy.y = platforms[j].y - enemy.h;
      }
      else if (isBelow(enemy, platforms[j])) {
        enemy.y =platforms[j].y + platforms[j].h;
      }
      break;
    }
    else{
      if (sideCollide === DIRECTION.UP){
        enemy.y = platforms[j].y - enemy.h;
      }
      if(sideCollide === DIRECTION.DOWN){
        enemy.y =platforms[j].y + platforms[j].h;
      }
    }
  } 
}

function updatePlaying(deltaTime) {
  if (!levelGenerated) {
    generateLevel(level1);
  }
  playerUpdate(deltaTime);
  lemonUpdate(deltaTime);
  enemyUpdate(deltaTime);
  if(enemies.length < 2){
    spawnEnemies(generateWave(2));
  }
}

function resetGame() {
  enemies.length = 0;
  platforms.length = 0;
  lemons.length = 0;
  obstacles.length = 0;
  levelGenerated = false;
  triggerShake(0);

  player = { ...playerModel };
  gameState.score = 0;
  /*
  player.x = 250;
  player.y = 100;
  player.w = 40;
  player.h = 40;
  player.ySpeed = 0;
  player.xSpeed = 0;
  player.walk = false;
  player.decelerateLeft = false;
  player.decelerateRight = false;
  player.walkImpulse = 0.5;
  player.walkCap = 7;
  player.color = "green";
  player.facing = "right";
  player.canJump = true;
  player.health = 3;
  player.iFrames = 0;
  player.knockbackL = 0;
  player.knockbackR = 0;
  */
}
