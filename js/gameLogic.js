var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var GROUND_Y = 600;
var GRAVITY = 0.65;
var decelerationRate = 2.5;
var jumpImpulse = -15;

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
  [600, 40, 150, 450],
  [100, 40, 200, 300],
  [100, 40, 400, 300],
  [100, 40, 600, 300],
  [700, 40, 100, 600],
];

var time = {
  lastTime: 0,
};

var gameState = {
  currentState: STATES.MENU,
  score: 0,
};

var player = {
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
};

var obstacles = [];
var platforms = [];
var lemons = [];
var enemies = [];
var levelGenerated = false;

function generatePlatform(
  width,
  height,
  xPos,
  yPos,
  typeColor = "blue",
) {
  platforms.push({ w: width, h: height, x: xPos, y: yPos, color: typeColor });
}

function generateLevel(level) {
  level.forEach((plat) => {
    generatePlatform(plat[0], plat[1], plat[2], plat[3]);
  });
  // create default enemies on the ground and a platform so they are visible
  generateEnemy(500, GROUND_Y - 40, "red");
  generateEnemy(210, 260, "red");
  levelGenerated = true;
}

function generateObstacles(xPos, yPos, typeColor = "blue") {
  obstacles.push({ w: 40, h: 40, x: xPos, y: yPos, color: typeColor });
}

function generateEnemy(xPos, yPos, typeColor) {
  enemies.push({ w: 40, h: 40, x: xPos, y: yPos, color: typeColor });
}

function aabb(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function isAbove(a, b) {
  return a.y < b.y;
}

function isBelow(a, b) {
  return a.y + a.h > b.y + b.h;
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
}

function lemonUpdate(deltaTime) {
  for (let i = lemons.length - 1; i >= 0; i--) {
    lemons[i].x += lemons[i].xSpeed * deltaTime;
    if (
      lemons[i].x - lemons[i].r > canvas.width ||
      lemons[i].x + lemons[i].r < 0
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

  if (player.y + player.h >= GROUND_Y) {
    player.y = GROUND_Y - player.h;
    player.ySpeed = 0;
    player.canJump = true;
  }
}

function enemyUpdate(deltaTime) {

}

function updatePlaying(deltaTime) {
  if (!levelGenerated) {
    generateLevel(level1);
  }
  playerUpdate(deltaTime);
  lemonUpdate(deltaTime);
  enemyUpdate(deltaTime);
}

function resetGame() {
  enemies.length = 0;
  platforms.length = 0;
  lemons.length = 0;
  obstacles.length = 0;
  levelGenerated = false;

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
}
