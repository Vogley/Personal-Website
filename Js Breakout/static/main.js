//Globals needed for Misc game operations
var ballSpeed, paddleSpeed;
var score = 0;
var levelCleared = false;
var bricks = [], ball, paddle; 
var interval;
var pause = false;
var balls = [];

//Canvas Setup
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//Ball and Paddle Measurments
var ballRadius = (canvas.width*canvas.height)/60000;
var paddleHeight = canvas.height/60;
var paddleWidth = canvas.width/7;

//Starting Point Position Variables
var ballX = canvas.width/2;         
var ballY = canvas.height - 30 - Math.floor(canvas.height*.05);
var paddleX = (canvas.width-paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight - Math.floor(canvas.height*.022);

//Brick Varaibles
var brickRowCount, brickColCount, brickOffsetLeft;
var brickWidth = canvas.width/15;
var brickHeight = canvas.height/20;
var brickPadding = canvas.width/30;
var brickOffsetTop = canvas.height/15;

//Brick Color Variants
var brickColors = ["blue", "green", "yellow", "orange", "red"];

//Control Variables
var rightPressed = false;           //If these are true, then add or subtract to the paddles positioning
var leftPressed = false;
var leftOverwritten = false;        //These four variables are to check if the paddle was overtaken by the other key, and if this key has been turned off or not during the overtakening.
var rightOverwritten = false;
var leftReset = true;
var rightReset = true;
var rightOrLeft = "";

//Player Info
var lives = 3;
var currentLevel = 1;
var invincible = false;
var multiball = false;

//Overlay Variables
var overlay = document.getElementById("overlay");
var overlayText = document.getElementById("mainText");

//Audio Statics
var music = document.getElementById("music");



/*-------------------------------------------------- Object Constructors -------------------------------------------------- */
//I know this isn't needed, I just wanted to learn object classes again.
class Ball {
    constructor(xPos, yPos, randomSpeed) {
        this.radius = ballRadius; 
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = getRandomColor();
        

        //Ball Inital Speed
        if(!randomSpeed){       //Normal
            this.dx = ballSpeed;
            this.dy = -ballSpeed;
        }
        else{
            this.dx = (Math.random()*8 - 4);
            this.dy = -(Math.random()*3 + 1);
        }
    }
}

class Paddle {
    constructor(xPos, yPos, width, height) {
        this.width = width; 
        this.height = height;
        this.xPos = xPos;
        this.yPos = yPos;
        this.color = "white";
    }
}

class Brick {
    constructor(xPos, yPos, width, height, level) {
        this.width = width;
        this.height = height;
        this.xPos = xPos;
        this.yPos = yPos;
        if(level == 0)
        {
            this.color = "black"
        }
        else
        {
            this.color = brickColors[level - 1];
        }

        //Level
        //This will have bricks that are harder to break (Take two shots)
        this.level = level;
    }
    //Meant to reset the color everytime the brick is hit
    setColor(){
        this.color = brickColors[this.level - 1];
    }
}

/*-------------------------------------------------- Game Helper Functions -------------------------------------------------- */
function getRandomColor(){
    do{
        var colorRGB = [Math.random()*255, Math.random()*255, Math.random()*255];
        //Check if the color is light enough (dark background)
    }
    while(!(colorRGB[0] > 128 || colorRGB[1] > 128 || colorRGB[2] > 128));

    return "#" + Math.floor(colorRGB[0]).toString(16) + Math.floor(colorRGB[1]).toString(16) + Math.floor(colorRGB[2]).toString(16);
}

function getRandomLevel(){
    var num = Math.floor(Math.random()*6);
    if(num > 2 && Math.random()*100 > 50)           //Reduces the chances for higher level blocks
    {
        num=1;
    }
    return num;
}


//Makes ball in the place the user clicked
function addBall(e){
    var outline = canvas.getBoundingClientRect();           //Bondaries of the canvas
    
    var xPos = ballX;       
    var yPos = ballY;
    var newBall = new Ball(xPos, yPos, true);
    balls.push(newBall);
}


/*-------------------------------------------------- Game Static Functions -------------------------------------------------- */
//Establishing Game level and brick location
function setupLevelEnvironment(userLevel){
    /*
        Level 1

        - - - - - - - - - (9)
          - - - - - - -   (7)
            - - - - -     (5)
              - - -       (3)

        All bricks are level 1
        Ball Speed is 2
    */
   if(userLevel == 1){
        brickRowCount = 4;
        brickColCount = 9;
        brickOffsetLeft = (canvas.width-((brickColCount*brickWidth)+((brickColCount-1)*brickPadding)))/2; //Centers bricks
        
        ballSpeed = 2;

        for(var row = 0; row < brickRowCount; row++)
        {
            bricks[row] = []
            for(var col = 0; col < brickColCount; col++)
            {
                var brickX = (col*(brickPadding+brickWidth)) + brickOffsetLeft;
                var brickY = (row*(brickPadding+brickHeight)) + brickOffsetTop;
                bricks[row][col] = new Brick(brickX, brickY, brickWidth, brickHeight, 1);
                if(row > col || brickColCount -1 - col < row)
                {
                    bricks[row][col].level = 0;    //Remove the brick from the gameboard
                }
            }
        }
    }

    /*
        Level 2

        - - - - - - - - - (9)
        - - -       - - - (8)
        - - -       - - - (4)
            - - - - -     (5)

        Bottom layer has double the health
        Ball Speed is 2.5
    */
    if(userLevel == 2){
        brickRowCount = 4;
        brickColCount = 9;
        brickOffsetLeft = (canvas.width-((brickColCount*brickWidth)+((brickColCount-1)*brickPadding)))/2; //Centers bricks
        
        ballSpeed = 2.5;

        for(var row = 0; row < brickRowCount; row++)
        {
            bricks[row] = []
            for(var col = 0; col < brickColCount; col++)
            {
                var brickX = (col*(brickPadding+brickWidth)) + brickOffsetLeft;
                var brickY = (row*(brickPadding+brickHeight)) + brickOffsetTop;
                //Set Brick Levels
                if(row < 3)
                {
                    bricks[row][col] = new Brick(brickX, brickY, brickWidth, brickHeight, 1);
                }
                else
                {
                    bricks[row][col] = new Brick(brickX, brickY, brickWidth, brickHeight, 2);
                }

                //Create Brick Pattern
                if(row > 0 && (((col <= 5 && col >= 3) && row < 3) || ((col < 2 || col > 6) && row == 3)))
                {
                    bricks[row][col].level = 0;    //Remove the brick from the gameboard
                }
            }
        }
    }

    /*
        Level 2

            - - - - - - - (7)
        - - - - - - -     (7)
            - - - - - - - (7)
        - - - - - - -     (7)

        Layers have different health going down
        Ball Speed is 3
    */
    if(userLevel == 3){
        brickRowCount = 4;
        brickColCount = 9;
        brickOffsetLeft = (canvas.width-((brickColCount*brickWidth)+((brickColCount-1)*brickPadding)))/2; //Centers bricks
        
        ballSpeed = 3;

        for(var row = 0; row < brickRowCount; row++)
        {
            bricks[row] = []
            for(var col = 0; col < brickColCount; col++)
            {
                var brickX = (col*(brickPadding+brickWidth)) + brickOffsetLeft;
                var brickY = (row*(brickPadding+brickHeight)) + brickOffsetTop;
                //Set Brick Levels
                bricks[row][col] = new Brick(brickX, brickY, brickWidth, brickHeight, row + 1);

                //Create Brick Pattern
                if((row%2 == 0 && col < 2) || (row%2 == 1 && col > 6))
                {
                    bricks[row][col].level = 0;    //Remove the brick from the gameboard
                }
            }
        }
    }

    //Random Levels From Here Until 10
    if(userLevel > 3){
        brickRowCount = 4;
        brickColCount = 9;
        brickOffsetLeft = (canvas.width-((brickColCount*brickWidth)+((brickColCount-1)*brickPadding)))/2; //Centers bricks
        
        ballSpeed = (currentLevel+2)/4+2;

        for(var row = 0; row < brickRowCount; row++)
        {
            bricks[row] = []
            for(var col = 0; col < brickColCount; col++)
            {
                var brickX = (col*(brickPadding+brickWidth)) + brickOffsetLeft;
                var brickY = (row*(brickPadding+brickHeight)) + brickOffsetTop;
                //Set Brick Levels
                bricks[row][col] = new Brick(brickX, brickY, brickWidth, brickHeight, getRandomLevel());
            }
        }
    }

}


function levelSetup(){
    //Objects
    bricks = [];
    setupLevelEnvironment(currentLevel);
    ball = new Ball(ballX, ballY, false);
    paddle = new Paddle(paddleX, paddleY, paddleWidth, paddleHeight);
    paddleSpeed = currentLevel+7;
}


function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.xPos, ball.yPos, ball.radius, 0, Math.PI*2, false);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

 
//ONLY FOR MULTIBALL
function drawBalls(){
    balls.forEach(b =>{
        ctx.beginPath();
        ctx.arc(b.xPos, b.yPos, b.radius, 0, Math.PI*2, false);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.xPos, paddle.yPos, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
}


function drawBricks(){
    var bricksLeft = 0;
    for(var r = 0; r < brickRowCount; r++)
    {
        for(var c = 0; c < brickColCount; c++)
        {
            brick = bricks[r][c];
            if(brick.level > 0){
                ctx.beginPath();
                ctx.rect(brick.xPos, brick.yPos, brick.width, brick.height);
                ctx.fillStyle = brick.color;
                ctx.fill();
                ctx.closePath();

                bricksLeft++;
            }
        }
    }

    //Win Condition
    if(bricksLeft == 0)
    {
        if(currentLevel == 5)
        {
            //Stop game and send to level_cleared screen
            alert("Game Completed!");
            endGame(1);
        }
        else
        {
            clearInterval(interval);
            currentLevel++;
            
            //Reset Ball/s
            balls = [ball];
            ball.xPos = ballX;
            ball.yPos = ballY;

            overlayText.innerHTML = "Level " + currentLevel;
            setupGame();        //Next Level

        }
    }
}


function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20, canvas.width);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 70, 20, canvas.width);
}

function brickHit(brick){
    score += 100;                        //Updates Score
    brick.level -= 1;               //Remove a level
    brick.setColor();               //Reset the color
    ball.color = getRandomColor();
    //Audio Effect
    var brickSound = new Audio("static/audio/brickSound.m4a")
    brickSound.volume = 0.5;
    brickSound.play();
}





/*-------------------------------------------------- Game Dynamic Functions -------------------------------------------------- */
/* 
    Checks if the ball has touch any wall.
    It will change the velocity of the ball when it touch the top, left, or right wall.
    The bottom wall will result in a lost life. 
*/
function checkWall(myBall){
    //Top Wall
    if(myBall.yPos + myBall.dy < ballRadius)
    {
        //Change y velocity
        myBall.dy = -myBall.dy;
        //Change the color for fun
        myBall.color = getRandomColor();
        
        //Audio Effect
        var wallSound = new Audio("static/audio/ballSound_" + Math.floor(Math.random()*9) + ".mp3");
        wallSound.volume = 0.5;
        wallSound.play();
    }

    //Left and Right Walls
    if(myBall.xPos + myBall.dx < ballRadius || myBall.xPos + myBall.dx > canvas.width - myBall.radius)
    {
        //Change x velocity
        myBall.dx = -myBall.dx;
        //Change the color for fun
        myBall.color = getRandomColor();
        
        //Audio Effect
        var wallSound = new Audio("static/audio/ballSound_" + Math.floor(Math.random()*9) + ".mp3");
        wallSound.volume = 0.5;
        wallSound.play();
    }

    //Bottom Wall --> Lose Life (This will be implemented later)
    if(myBall.yPos + ball.dy > canvas.height)
    {
        if(!invincible)    //Normal Mode
        {
            lives--;
        
            //Audio Effect
            var lostLifeSound = new Audio("static/audio/badPingPong.mp3");
            lostLifeSound.play();
            
            if(score > 2500 || score < 0)         //Update Score
            {
                score -= 2500;
            }
            else
            {
                score = 0;
            }

    
    
            if(lives == 0)
            {
                endGame(0);              //Lost Game
            }
            //Lives remaining
            else
            {
                clearInterval(interval);
                myBall.xPos = ballX;
                myBall.yPos = ballY;
    
                overlayText.innerHTML = "Lives Remaining: " + lives;
                setupGame();        //Restart Level
            }
        }
        else
        {
            //Cheater
            
            //Change y velocity
            myBall.dy = -myBall.dy;
            //Change the color for fun
            myBall.color = getRandomColor();
        
            //Audio Effect
            var wallSound = new Audio("static/audio/ballSound_" + Math.floor(Math.random()*9) + ".mp3");
            wallSound.volume = 0.5;
            wallSound.play();
        }

    }

}



/* 
    Checks if the ball has touch the top side of the paddle. 

    Like the real break out, I want to be able to make the ball change velocity with the way it hits the paddle.
    For now, I am using hte side of the paddle that it hits to change the x velocity. 
    //I want to implement side hits eventually...
*/
function checkPaddle(myBall){
    var paddleXCords = [paddle.xPos, paddle.xPos + paddleWidth];        //[left, right]
    var paddleYCords = [paddle.yPos, paddle.yPos + paddleHeight];       //[top, bottom]

    //Sections of the paddle that cause different velocity changes
    var sections = [paddle.xPos, paddle.xPos + paddleWidth/4, paddle.xPos + paddleWidth/2, paddle.xPos + 3*paddleWidth/4, paddle.xPos + paddleWidth];

    if(myBall.yPos + myBall.dy + myBall.radius >= paddleYCords[0] && (myBall.xPos + myBall.dx >= (paddleXCords[0] - myBall.radius) && myBall.xPos + myBall.dx <= (paddleXCords[1] + myBall.radius))) //Added in extra space for the ball's sides and not just the center.
    {
        /*---Change y velocity---*/
        //Section 1
        if(myBall.xPos <= paddle.xPos + paddleWidth/4){
            myBall.dx -= ballSpeed;
        }
        //Section 2
        else if(myBall.xPos > paddle.xPos + paddleWidth/4 && myBall.xPos <= paddle.xPos + paddleWidth/2){
            myBall.dx -= ballSpeed/2;
        }
        //Section 3
        else if(myBall.xPos > paddle.xPos + paddleWidth/4 && myBall.xPos <= paddle.xPos + paddleWidth/2){
            myBall.dx += ballSpeed/2;
        }
        //Section 4
        else{
            myBall.dx += ballSpeed;
        }

        //Increase ball velocity slowly
        myBall.dy += myBall.dy/20;
        myBall.dy = -myBall.dy;

        //Increase paddleSpeed very slowly
        paddleSpeed += 0.5;

        //Change the color for fun
        myBall.color = getRandomColor();

        //Audio Effect
        var paddleSound = new Audio("static/audio/ballSound_" + Math.floor(Math.random()*9) + ".mp3");
        paddleSound.volume = 0.5;
        paddleSound.play();

        //Score will be removed the more times it hits the paddle
        if(score > 40 | score < 0)
        {
            score -= 40;
        }
        else
        {
            score = 0;
        }
    }
}


/* 
    Checks if the ball has touch a brick. 

    All sides of the brick need to be accounted for.
    Should I implement corner bounces?
*/
function checkBrick(myBall){
    var brick, brickXCords, brickYCords;
    for(var r = 0; r < brickRowCount; r++)
    {
        for(var c = 0; c < brickColCount; c++)
        {
            brick = bricks[r][c];
            brickXCords = [brick.xPos, brick.xPos+brick.width];     //Left, Right
            brickYCords = [brick.yPos, brick.yPos+brick.height];    //Top, Bottom

            /*---Check if the myBall has touched any of the sides of the box---*/
            if(brick.level != 0){
                //Top Side
                if((myBall.yPos + myBall.dy + myBall.radius >= brickYCords[0] && myBall.yPos + myBall.radius <= brickYCords[0]) && (myBall.xPos + myBall.dx + myBall.radius >= brickXCords[0] && myBall.xPos + myBall.dx - myBall.radius <= brickXCords[1])){
                    myBall.dy = -myBall.dy;
                    brickHit(brick);
                }
                //Bottom Side
                else if((myBall.yPos + myBall.dy - myBall.radius <= brickYCords[1] && myBall.yPos - myBall.radius >= brickYCords[1]) && (myBall.xPos + myBall.dx + myBall.radius >= brickXCords[0] && myBall.xPos + myBall.dx - myBall.radius <= brickXCords[1])){
                    myBall.dy = -myBall.dy;
                    brickHit(brick);
                }
                //Right Side
                else if((myBall.yPos + myBall.dy + myBall.radius >= brickYCords[0] && myBall.yPos + myBall.dy - myBall.radius <= brickYCords[1]) && (myBall.xPos + myBall.dx - myBall.radius <= brickXCords[1] && myBall.xPos - myBall.radius >= brickXCords[1])){
                    myBall.dx = -myBall.dx;
                    brickHit(brick);
                }
                else if((myBall.yPos + myBall.dy + myBall.radius >= brickYCords[0] && myBall.yPos + myBall.dy - myBall.radius <= brickYCords[1]) && (myBall.xPos + myBall.dx + myBall.radius >= brickXCords[0] && myBall.xPos + myBall.radius <= brickXCords[0])){
                    myBall.dx = -myBall.dx;
                    brickHit(brick);
                }
            }
        }
    }
}







/*-------------------------------------------------- Game Main -------------------------------------------------- */
function main(){
    //Reset the Canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //Redraw the ball, bricks, paddle, lives and score
    if(multiball)
        drawBalls();
    else
        drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    
    //Paddle logic
    if(rightPressed && paddle.xPos <= (canvas.width - paddle.width - 1)){
        paddle.xPos += paddleSpeed;
    }
    if(leftPressed && paddle.xPos >= 1){
        paddle.xPos -= paddleSpeed;
    }

    if(multiball){
        for(var i = 0; i < balls.length; i++)
        {
            //Check if a ball has hit a wall
            checkWall(balls[i]);

            //Check if a ball has hit the paddle
            checkPaddle(balls[i]);

            //Check if a ball has hit a brick
            checkBrick(balls[i]);
            
            //Move the ball
            balls[i].xPos += balls[i].dx;
            balls[i].yPos += balls[i].dy;
        }
    }
    else{
        //Check if a ball has hit a wall
        checkWall(ball);

        //Check if a ball has hit the paddle
        checkPaddle(ball);

        //Check if a ball has hit a brick
        checkBrick(ball);

        //Move the ball
        ball.xPos += ball.dx;
        ball.yPos += ball.dy;
    }
    
    



}




/*-------------------------------------------------- Game Event Handlers -------------------------------------------------- */
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
        rightReset = false;
        
        //Helps break stalling of the paddle
        if(rightOrLeft == "left"){
            leftPressed = false;
            leftOverwritten = true;
        }
        rightOrLeft = "right";
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        leftReset = false;
        
        //Helps break stalling of the paddle
        if(rightOrLeft == "right"){
            rightPressed = false;
            rightOverwritten = true;
        }
        rightOrLeft = "left";
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
        rightReset = true;
        rightOverwritten = false; //Reset so there are no false positives

        //If one of the keys is released, but the other is still held down, the paddle should continue to move
        if(leftOverwritten && !leftReset){
            leftPressed = true;
            leftOverwritten = false;
            rightOrLeft = "left";
        }
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
        leftReset = true;
        leftOverwritten = false; //Reset so there are no false positives

        //If one of the keys is released, but the other is still held down, the paddle should continue to move
        if(rightOverwritten && !rightReset){
            rightPressed = true;
            rightOverwritten = false;
            rightOrLeft = "right";
        }
    }
}




/*-------------------------------------------------- Game Dev Options -------------------------------------------------- */
//Key to change level
function keyPressHandler(e){
    //Cheat Functions
    if(e.key == "n" && currentLevel != 5){      //Change Level
        clearInterval(interval);
        currentLevel++;
        score = -100000;             //Cheaters get no points
        levelSetup();
        interval = setInterval(main, 10);
    }   
    if(e.key == "i"){                           //Invincible
        if(!invincible)
        {
            invincible = true;
            score = -100000;             //Cheaters get no points
        }
        else
        {
            invincible = false;
        }
    }
    //Multiball UNIMPLEMENTED
    if(e.key == "m"){
        if(!multiball){
            multiball = true;
            balls.push(ball);
            score = -100000;
        }
        else{
            multiball = false;
        }
    }
    if(e.key == "b" && multiball){
        addBall();
    }






    if(e.key == "p"){                           //Pause Game
        if(pause == false)
        {
            overlayText.innerHTML = "Pause";
            overlay.style.display = "block";
            music.volume = 0.1;                 //Muffles Music
            clearInterval(interval);
            pause = true;
        }
        else
        {
            overlay.style.display = "none";
            interval = setInterval(main, 10);
            music.volume = 0.3;                 //Returns Music
            pause = false;
        }
    }
}



/*-------------------------------------------------- Game Start -------------------------------------------------- */
function startGame()
{
    //Remove Overlay
    overlay.style.display = "none";

    //Event Listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keypress", keyPressHandler, false);

    //Initial Interval
    interval = setInterval(main, 10);
}



/*-------------------------------------------------- Game End -------------------------------------------------- */
function endGame(end)
{
    clearInterval(interval);

    if(end == 1){           //Game Completed
        //Audio Effect
        var winSound = new Audio("static/audio/win.mp3");
        winSound.volume = 0.5;
        winSound.play();

        overlayText.innerHTML = "Completed! Score: " + score;
        overlay.style.display = "block";
        clearInterval(interval); // Needed for Chrome to end game
        overlay.style.cursor = "pointer";
        overlay.addEventListener("click", function(){
            document.location.reload();
        });
    }    
    else
    {
        music.pause();;   //Stop Music

        clearInterval(interval); // Needed for Chrome to end game
        ball.xPos = ballX;
        ball.yPos = ballY;
        drawScore();
        overlayText.innerHTML = "Game Over | Score: " + score;
        overlay.style.display = "block";
        overlay.style.cursor = "pointer";
        overlay.addEventListener("click", function(){
            document.location.reload();
        });
    }        
}





/*
    *    *    *    *    *    *    *
*     *     *    *    *    *    *
    *
*           Program Starts Here
    *
    *    *    *    *    *    *    *
*     *     *    *    *    *    *
*/



/*-------------------------------------------------- Overlay Effect and beginning functions -------------------------------------------------- */
function setupGame(){                               //Begins onload of the program
    overlay.style.display = "block";                //Display Overlay
    document.getElementById("body").style.cursor = "none";
    overlay.style.cursor = "none";                  //Remove cursor
    //Begins Music
    music.play();
    music.volume = 0.3;

    //Starts Game
    levelSetup();
    main();
    setTimeout(startGame, 1000);
}


