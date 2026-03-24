const menuMusic = new Audio("assets/audio/Menu_Music.mp3");
const gameMusic = new Audio("assets/audio/Game_Music.mp3");
const gameOverMusic = new Audio("assets/audio/GameOver_Music.mp3");

const shootSound = new Audio("assets/audio/Shoot_SFX.mp3");
const jumpSound = new Audio("assets/audio/Jump_SFX.mp3");
const damageSound = new Audio("assets/audio/Damage_SFX.mp3");
const enemyDamageSound = new Audio("assets/audio/EnemyDamage_SFX.mp3");

menuMusic.loop = true;
gameMusic.loop = true;
gameOverMusic.loop = true;

var trackedState = null;
var startPlaying = false;

function updateMusic() {
  if (gameState.currentState !== trackedState && startPlaying) {
    trackedState = gameState.currentState;
    switch (trackedState) {
      case STATES.MENU:
        playMenuMusic();
        break;
      case STATES.PLAYING:
        playGameMusic();
        break;
      case STATES.GAMEOVER:
        playGameOverMusic();
        break;
    }
  }
}


function playMenuMusic() {
  stopAllMusic();
  menuMusic.play();
}

function playGameMusic() {
  stopAllMusic();
  gameMusic.play();
}

function playGameOverMusic() {
  stopAllMusic();
  gameOverMusic.play();
}

function stopAllMusic() {
  menuMusic.pause();
  menuMusic.currentTime = 0;
  gameMusic.pause();
  gameMusic.currentTime = 0;
  gameOverMusic.pause();
  gameOverMusic.currentTime = 0;
}

function playShootSound() {
  shootSound.currentTime = 0;
  shootSound.play();
}

function playJumpSound() {
  jumpSound.currentTime = 0;
  jumpSound.play();
}

function playDamageSound() {
  damageSound.currentTime = 0;
  damageSound.play();
}

function playEnemyDamageSound() {
  enemyDamageSound.currentTime = 0;
  enemyDamageSound.play();
}   

