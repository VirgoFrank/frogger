var ctx = document.querySelector("canvas").getContext("2d");
var canvas = document.createElement('canvas')
var height = 0
var width =0
setHeightAndWidth()
let PlayerImg = new Image();
PlayerImg.src = 'images/frogger.png';
var KeyPressed = false
var inputTimeoutSet = false
var CarMovingSpeed = 50
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;
let obstacles = [];
let rows = 16
let cols = 16
let rowHeight = height/rows
let rowWidth = width/rows
let colWidth = width/cols
let colHeight = height/cols
var playerPosY = height-colHeight*14;
var playerPosX = rowWidth*7;

var PlayerPosXOrg;
var OnRaft = false;
var inGame = false;
var pause = false
var timeStampBeforePause;
var godMode = false
var gameOver = false
var playerMoving = false;
var PlayerMovingSpeed = 180
var direction = "";
var amountMoved = 0;
var container = document.querySelector(".container")
var landscape = true;
var clientX;
var clientY;


function setHeightAndWidth(){
    
    var container = document.querySelector(".container")

    if(document.documentElement.clientHeight > document.documentElement.clientWidth){
        height = document.documentElement.clientWidth;
        width =  document.documentElement.clientWidth;
        container.style.paddingTop = (document.documentElement.clientHeight - height)/2 + "px"
        landscape = false
    }
    else{
        landscape = true
        height = document.documentElement.clientHeight;
        width = document.documentElement.clientHeight;
        container.style.paddingLeft = (document.documentElement.clientWidth - width)/2 + "px"
    }
}

function MovePlayer(dir){
    direction = dir
    switch(dir){
        case "left":
            // playerPosX -= rowWidth
            playerMoving = true
            PlayerPosXOrg = playerPosX
        break
        case "right":
            playerMoving = true
            PlayerPosXOrg = playerPosX
            // playerPosX += rowWidth
        break
        case "up":
            // playerPosY -= colHeight
            playerMoving = true
            PlayerPosYOrg = playerPosY
        break
        case "down":
            // playerPosY += colHeight
            playerMoving = true
            PlayerPosYOrg = playerPosY
        break
    }

}

function setInputListeners(){

    container.addEventListener("touchstart", (e) => {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    })

    container.addEventListener("touchend", (e) => {

        if(playerMoving){
            return
        }
        if(KeyPressed === true){
            return
        }

        var touchendX = e.changedTouches[0].clientX
        var touchendY = e.changedTouches[0].clientY

        console.log("touchend",touchendX, touchendY)
        console.log("Y",touchendY, clientY)
        if((touchendX > clientX) && (touchendX - clientX > Math.abs(touchendY - clientY))){
            KeyPressed = true;
            MovePlayer("right")
        }
        else if((touchendX < clientX) &&  -1*(touchendX - clientX) > Math.abs(touchendY - clientY)){
            KeyPressed = true;
            MovePlayer("left")
        }
        else if(touchendY < clientY){
            KeyPressed = true;
            MovePlayer("up")
        }
        else if(touchendY > clientY){
            KeyPressed = true;
            MovePlayer("down")
        }
        if(KeyPressed === true){
            setTimeout(() => {
                KeyPressed = false
            }, 300);
        }
    })

    document.addEventListener("keydown", () =>{

        console.log("playerPosY", playerPosY)
        console.log("playerPosY", playerPosY)
        console.log(playerPosX)
        console.log(playerMoving)
        console.log(document.documentElement.clientWidth - width)
        manageInput()
    })



}
function manageInput(){
    if(playerMoving){
        return
    }
    if(KeyPressed === true){
        return
    }
        
    if(event.keyCode === 83 || event.keyCode === 40)
    {
        KeyPressed = true;
        MovePlayer("down")
    }
    else if(event.keyCode === 87 || event.keyCode === 38) {
        KeyPressed = true;
        MovePlayer("up")
    }
    else if(event.keyCode === 68 || event.keyCode === 39){
        KeyPressed = true;
        MovePlayer("right")
    }
    else if(event.keyCode === 65 || event.keyCode === 37){
        KeyPressed = true;
        MovePlayer("left")
    }
    else if(event.keyCode === 80){
        console.log(pause)
        pause = !pause
        if(!pause)
            window.requestAnimationFrame(loop)
    }
    else if(event.keyCode === 79){
       godMode = !godMode
    }


    if(KeyPressed === true){
        setTimeout(() => {
            KeyPressed = false
        }, 300);
    }
}


class Obstacle{
    constructor(x, y, w, h, speed, style, raft, img){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.style = style
        this.speed = speed
        this.startingX = x
        this.startingY = y
        this.returning = false
        this.raft = raft
        this.img = new Image()
        this.img.src = img
    }


}

function initCars(){

    for (let i = 1; i < 5; i++) {
        
        obstacles.push(new Obstacle(rowWidth*i*3, height-colHeight*6, rowWidth, colHeight, -200, "red", false, "images/car2.png"))
        
    }
    // obstacles.push(new Obstacle(-rowWidth*3, height-colHeight*6, rowWidth, colHeight, -200, "red", false, 'images/car2.png' ))

    for (let i = 1; i < 5; i++) {

        obstacles.push(new Obstacle(rowWidth*3*i , height-colHeight*3, rowWidth, colHeight, 200, "blue", false, 'images/car1.png'))
        
    }

    for (let i = 1; i < 6; i++) {

        obstacles.push(new Obstacle(rowWidth*4*i , height-colHeight*8, rowWidth, colHeight, 160, "pink", false, 'images/car3.png'))
        
    }
    obstacles.push(new Obstacle(-rowWidth*3 , height-colHeight*3, rowWidth, colHeight, 200, "blue", false, 'images/car3.png'))

    obstacles.push(new Obstacle(-rowWidth*4, height-colHeight*4, rowWidth*2, colHeight, 120, "red", false, 'images/car5.png'))
    obstacles.push(new Obstacle(rowWidth*8, height-colHeight*4, rowWidth*2, colHeight, 120, "red", false, 'images/car5.png'))
    obstacles.push(new Obstacle(rowWidth*8, height-colHeight*5, rowWidth, colHeight, 150, "green", false, 'images/car7.png'))
    obstacles.push(new Obstacle(rowWidth*4, height-colHeight*5, rowWidth, colHeight, 150, "green", false, 'images/car7.png'))
    obstacles.push(new Obstacle(rowWidth, height-colHeight*5, rowWidth, colHeight, 150, "green", false, 'images/car7.png'))
    obstacles.push(new Obstacle(rowWidth, height-colHeight*7, rowWidth*3, colHeight, -150, "yellow", false, 'images/car6.png'))
    obstacles.push(new Obstacle(rowWidth*6, height-colHeight*7, rowWidth*3, colHeight, -150, "yellow", false, 'images/car6.png'))

    for (let i = 1; i < 5; i++) {

        obstacles.push(new Obstacle(rowWidth*4*i, height-colHeight*10, rowWidth*2, colHeight, 100, "brown", true, "images/log.png"))
    }

    for (let i = 1; i < 5; i++) {

        obstacles.push(new Obstacle(rowWidth*4*i, height-colHeight*11, rowWidth*2, colHeight, -100, "brown", true, "images/log.png"))
    }
    for (let i = 1; i < 5; i++) {

        obstacles.push(new Obstacle(rowWidth*4*i, height-colHeight*12, rowWidth*2, colHeight, 120, "brown", true, "images/log.png"))
    }
    for (let i = 1; i < 5; i++) {

        obstacles.push(new Obstacle(rowWidth*4*i, height-colHeight*13, rowWidth*2, colHeight, -150, "brown", true, "images/log.png"))
    }
    for (let i = 1; i < 5; i++) {

        obstacles.push(new Obstacle(rowWidth*4*i, height-colHeight*14, rowWidth*2, colHeight, 130, "brown", true, "images/log.png"))
    }

    // obstacles.push(new Obstacle(rowWidth*8, height-colHeight*10, rowWidth*2, colHeight, 100, "brown", true, "images/log.png"))
    // obstacles.push(new Obstacle(rowWidth*-3, height-colHeight*10, rowWidth*2, colHeight, 100, "brown", true, "images/log.png"))

    // obstacles.push(new Obstacle(rowWidth*3, height-colHeight*11, rowWidth*2, colHeight, 120, "brown", true, "images/log.png"))
    // obstacles.push(new Obstacle(rowWidth*-4, height-colHeight*11, rowWidth*2, colHeight, 120, "brown", true, "images/log.png"))

    // obstacles.push(new Obstacle(rowWidth*3, height-colHeight*12, rowWidth*2, colHeight, -150, "brown", true, "images/log.png"))
    // obstacles.push(new Obstacle(rowWidth*-4, height-colHeight*12, rowWidth*2, colHeight, -150, "brown", true, "images/log.png"))
    // obstacles.push(new Obstacle(rowWidth*10, height-colHeight*12, rowWidth*2, colHeight, -150, "brown", true, "images/log.png"))

    // obstacles.push(new Obstacle(rowWidth*5, height-colHeight*13, rowWidth*2, colHeight, -130, "brown", true, "images/log.png"))
    // obstacles.push(new Obstacle(rowWidth*-6, height-colHeight*13, rowWidth*2, colHeight, -130, "brown", true, "images/log.png"))
    // obstacles.push(new Obstacle(rowWidth*14, height-colHeight*13, rowWidth*2, colHeight, -130, "brown", true, "images/log.png"))

    // obstacles.push(new Obstacle(rowWidth*7, height-colHeight*14, rowWidth*4, colHeight, 100, "brown", true, "images/log.png"))
    // obstacles.push(new Obstacle(rowWidth*-10, height-colHeight*14, rowWidth*2, colHeight, 100, "brown", true, "images/log.png"))
    // obstacles.push(new Obstacle(rowWidth*2, height-colHeight*14, rowWidth*2, colHeight, 100, "brown", true, "images/log.png"))

}

function ResetPlayer(){
    if(godMode)
        return
    playerPosY = height-colHeight*2;
    playerPosX = rowWidth*7;
    playerMoving = false
}



function Update(deltaTime){

    OnRaft = false

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.x += (obstacle.speed*deltaTime)
        
        if(((playerPosX > obstacle.x && playerPosX < obstacle.x + obstacle.w) ||(playerPosX + rowWidth > obstacle.x && playerPosX + rowWidth < obstacle.x + obstacle.w ))
        && (playerPosY >= obstacle.y-10 && playerPosY <= obstacle.y + obstacle.h-10) && !obstacle.raft){
            ResetPlayer()
        }
        else if(((playerPosX > obstacle.x && playerPosX < obstacle.x + obstacle.w) ||(playerPosX + rowWidth > obstacle.x && playerPosX + rowWidth < obstacle.x + obstacle.w ))
        && (playerPosY >= obstacle.y-10 && playerPosY <= obstacle.y + obstacle.h-10) && obstacle.raft-10){
            OnRaft = true
            if(playerPosY !== height-colHeight*9){
                playerPosX += (obstacle.speed*deltaTime)
                PlayerPosXOrg += (obstacle.speed*deltaTime)
                
            }
        }
        
        if((obstacle.x > width-10 ||obstacle.x + obstacle.w < 0) && !obstacle.returning){
            if(obstacle.speed < 0){
                obstacle.x = width;
            }
            else
                obstacle.x = 0 - obstacle.w * 2;
            
            obstacle.returning = true
        }

        if(obstacle.x < width-10 && obstacle.x + obstacle.w > 0)
            obstacle.returning = false
    }
    // if((playerPosX > width-10 ||playerPosX < 0) || playerPosY < 0){
    //     playerMoving = false
    // }
    

    if(playerPosY < colHeight*2){
        gameOver = true
    }

    if((playerPosY < colHeight*7-10 && playerPosY > colHeight*2-10) && !OnRaft){
        console.log("onraft ", playerPosY, colHeight)
        ResetPlayer()
    }
    if(playerMoving){
        UpdatePlayer(deltaTime)
    }
    
}

function UpdatePlayer(deltaTime){

    switch(direction){
        case "left":
            if((PlayerPosXOrg - rowWidth < 0)){
                playerMoving = false
                return
            }
            if(PlayerPosXOrg - rowWidth >= playerPosX-5){
                playerMoving = false
                playerPosX = PlayerPosXOrg - rowWidth
                console.log(playerPosX)
            }
            else{
                amountMoved -= (PlayerMovingSpeed*deltaTime)
                playerPosX -= (PlayerMovingSpeed*deltaTime)
            }
        break
        case "right":
            if(PlayerPosXOrg + rowWidth > width-10){
                playerMoving = false
                return
            }
            if(PlayerPosXOrg + rowWidth <  playerPosX+ 5){
                playerMoving = false
                playerPosX = PlayerPosXOrg + rowWidth
            }
            else
                playerPosX += (PlayerMovingSpeed*deltaTime)
        break
        case "up":
            if(PlayerPosYOrg - colHeight >  playerPosY- 5){
                playerMoving = false
                playerPosY = PlayerPosYOrg - colHeight
            }
            else
                playerPosY -= (PlayerMovingSpeed*deltaTime)
        break
        case "down":
            if(playerPosY === colHeight*14){
                playerMoving = false
                return
            }
            if(PlayerPosYOrg + colHeight <  playerPosY+ 5){
                playerMoving = false
                playerPosY = PlayerPosYOrg + colHeight
            }
            else
                playerPosY += (PlayerMovingSpeed*deltaTime)
        break
    }

   
}

function Draw(){
    DrawMap()

    // for (let i = 0; i < 16; i++) {
    //     ctx.beginPath();
    //     ctx.rect(0, 0, width, colHeight * (i+1));
    //     ctx.strokeStyle = "white";
    //     ctx.stroke();

    //     ctx.beginPath();
    //     ctx.rect(0, 0, rowWidth * (i+1) , height);
    //     ctx.strokeStyle = "white";
    //     ctx.stroke();
        
    // }

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        ctx.fillStyle = obstacle.style
        ctx.beginPath();
        // ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.w, obstacle.h);

    }

    DrawPlayer()
    
}

function DrawPlayer(){
    ctx.drawImage(PlayerImg, playerPosX, playerPosY, rowWidth, colHeight);
}

function DrawMap(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, colHeight);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, colHeight*16);
    
    ctx.fillStyle = "green"
    ctx.beginPath();
    ctx.fillRect(0, colHeight, width, colHeight);

    ctx.fillStyle = "blue"
    ctx.beginPath();
    ctx.fillRect(0, colHeight*2 , width, colHeight*6);

    ctx.fillStyle = "teal"
    ctx.beginPath();
    ctx.fillRect(0, colHeight*7, width, colHeight);

    ctx.fillStyle = "black"
    ctx.beginPath();
    ctx.fillRect(0, colHeight*8, width, colHeight*6);

    ctx.fillStyle = "teal"
    ctx.beginPath();
    ctx.fillRect(0, colHeight*14, width, colHeight);


}

function loop(timeStamp){
    if(pause){
        console.log("pause time stamp", timeStamp)
        timeStampBeforePause = timeStamp
        return
    }
    if(timeStampBeforePause != 0 && timeStampBeforePause != null && timeStampBeforePause != undefined)
    {
        console.log("time stamps",timeStampBeforePause, timeStamp)

        timeStamp = timeStampBeforePause
        console.log("time stamps after",timeStampBeforePause, timeStamp)
        timeStampBeforePause = 0
    }
    if(gameOver){
        Menu("YOU WIN", "Press any key to restart")
        return
    }
   
    setHeightAndWidth()
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
   
    
    ctx.canvas.height = height;
    ctx.canvas.width  = width;
    Update(secondsPassed)
    Draw()
    window.requestAnimationFrame(loop);
}

function ResetGame(){
    godMode = false
    ResetPlayer()
    obstacles = []
    initCars()
}

function startGame(){
    if(gameOver){
        gameOver = false
        clearInterval(interval)
        ResetGame()
        window.requestAnimationFrame(loop)
       
    }
    if(inGame)
        return
    clearInterval(interval)
    initCars()
    setInputListeners()
    inGame = true
    window.requestAnimationFrame(loop)
}

function Menu(title, Bottom_text){
    var alpha = 1.0
    var up = false
    
    interval = setInterval(function () {
    setHeightAndWidth()
    ctx.canvas.height = height;
    ctx.canvas.width  = width;

    DrawMap()
    ctx.font = width/10 + "px Retro"
    ctx.fillStyle = "red";
    ctx.textAlign = "center"
    ctx.fillText(title, width/2, colHeight*4.5)

    ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
    ctx.font = width/20 + "px Retro";
    ctx.fillText(Bottom_text, width/2, colHeight*10)
    if (alpha < 0 && !up) {
        up = true
    }
    else if(alpha > 0.9 && up){
        up = false
    }
    if(up)
        alpha = alpha + 0.1;
    else
        alpha = alpha - 0.1;
    }, 80); 

    document.addEventListener("keydown", () =>{
        startGame()
    })
    container.addEventListener("touchstart", (e) => {
        startGame()
    })
}
setHeightAndWidth()
Menu("Frogger clone", "Press any key to start")

