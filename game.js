const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 100, y: 200, w: 40, h: 40, ySpeed: 0, xSpeed: 0, decelerateLeft: false, deccelerateRight: false, jumpImpulse: 10,
    walkImpulse: 2, walkCap: 20, color: "green", canJump: true };
const STATES = { MENU: 'menu', PLAYING: 'playing', GAMEOVER: 'gameover' }; 
let ACTION_MAP = { " ": "jump", "ArrowUp": "jump", "ArrowLeft": "left", "ArrowRight": "right"}
let currentState = STATES.MENU

let obstacles = [];
let platforms = [];


function generatePlatform(width, height, xPos, yPos, typeColor =  "blue") {
    platforms.push({
        w: width,
        h: height,
        x: xPos,
        y: yPos,
        color: typeColor
    })
}
function generateObstacles(xPos, yPos, typeColor =  "blue") {
    obstacles.push({
        w: 40,
        h: 40,
        x: xPos,
        y: yPos,
        color: typeColor
    })
}

function aabb(a, b) { 
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; 
} 


//if a object is higher than b
function isAbove(a,b) {
    return a.y < b.y
}

function playerPlatformCollide() {
    for (let i = 0; i < platforms.length; i++)
    {
        if(aabb(platforms[i], player))
        {
            player.ySpeed = 0;
            if (isAbove(player, platforms[i])){
                canJump = true;
                player.y = platforms.y + player.h;
            }
        }
    }
}

document.addEventListener('keydown', (e) =>
{
    const action = ACTION_MAP;
    if(action[e.key] = "jump" && player.canJump){
        player.ySpeed = player.jumpImpulse;
        player.canJump = false;
    }
    if(action[e.key] = "left" && player.xSpeed > -walkCap){
        player.xSpeed -= player.xSpeed;
        decelerateLeft = false;
    }
    if(action[e.key] = "right" && player.xSpeed < walkCap){
        player.xSpeed += player.xSpeed;
        decelerateRight = false;
    }

});
document.addEventListener('keyup', (e) =>
{
    const action = ACTION_MAP;
    if(action[e.key] = "left" && player.xSpeed < 0 ){
        decelerateLeft = true;
        //variable means in game loop, the player is reducing their speed at this 
        // point, to make the transition between pressing a direciton and not smoother.
        // Once 0 is hit or exceeded in the loop this variable should be returned to false.
    }
    if(action[e.key] = "left" && player.xSpeed < 0){
        decelerateRIght = true;
        //Same as above.
    }
});

function resetGame() {
    obstacles = [];
    platforms = []
    player = { x: 100, y: 200, w: 40, h: 40, ySpeed: 0, xSpeed: 0, decelerateLeft: false, deccelerateRight: false, jumpImpulse: 10,
    walkImpulse: 2, walkCap: 20, color: "green", canJump: true };
}