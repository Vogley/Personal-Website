let canvas;
let ctx;

let birds = [];

let interval;

let xAttraction;
let yAttraction;

let SCALE = 7;
let ATTRACTION = 10000;
let REPULSION = 50;
let CENTER = 1000;
let SPEED = 10;

/*-------------------------------------------------- Canvas Functions -------------------------------------------------- */
function initCanvas()
{
  canvas = document.getElementById("canvas");
  if(canvas.getContext) ctx = canvas.getContext("2d");
  resizeCanvas();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawBirds();
}

/*-------------------------------------------------- Bird Initialization -------------------------------------------------- */
class Bird {
  constructor() {
      this.xPos = (canvas.width-100) * Math.random();
      this.yPos = (canvas.height-100) * Math.random();
      this.angle = Math.PI*Math.random()*(2*Math.random() - 1);
      this.xVelocity = SCALE*Math.cos(this.angle)/10;
      this.yVelocity = SCALE*Math.sin(this.angle)/10;
      this.color = 'white';
  }
}

function intiBirds(num) {
  for(i = 0; i < num; i++) {
    var newBird = new Bird();
    birds.push(newBird);
  }
}

function genBird(b) {
  let scale = SCALE;

  ctx.save();
  ctx.translate(b.xPos+(2*scale), b.yPos+(2*scale));
  ctx.rotate(b.angle)
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, (2*scale));
  ctx.moveTo(0, 0);
  ctx.lineTo((4*scale), (1*scale));
  ctx.lineTo(0, (2*scale));
  ctx.closePath();

  ctx.lineWidth = 2;
  ctx.strokeStyle = b.color;
  ctx.stroke();

  ctx.restore();

}

/*-------------------------------------------------- Movement Functions -------------------------------------------------- */
function turnBird(b, dx, dy) {
  b.xVelocity += dx;
  b.yVelocity += dy;
  let turnAngle =  Math.atan2(b.yVelocity, b.xVelocity);
  if(Math.abs(b.xVelocity) > 0.2 || Math.abs(b.yVelocity) > 0.2) b.angle = turnAngle;
}

function centerOfMass(bird) {
  let xCenter = 0;
  for(i = 0; i < birds.length; i++) {
    if(birds[i] != bird) xCenter += birds[i].xPos;
  }
  xCenter = xCenter/(birds.length-1);
  let yCenter = 0;
  for(i = 0; i < birds.length; i++) {
    if(birds[i] != bird) yCenter += birds[i].yPos;
  }
  yCenter = yCenter/(birds.length-1);

  let ret = {
    "dx" : (xCenter - bird.xPos)/(CENTER*SCALE),
    "dy" : (yCenter - bird.yPos)/(CENTER*SCALE)
  }

  return ret;
}

function keepAway(bird) {
  let ret = {
    "dx" : 0,
    "dy" : 0
  }

  for(i = 0; i < birds.length; i++) {
    if(birds[i] != bird) {
      if(Math.abs(bird.xPos - birds[i].xPos) < (5*SCALE)) {
        ret["dx"] += ((bird.xPos - birds[i].xPos))/(REPULSION*SCALE);
      }
      if(Math.abs(bird.yPos - birds[i].yPos) < (5*SCALE)) {
        ret["dy"] += ((bird.yPos - birds[i].yPos))/(REPULSION*SCALE);
      }

      // Super close birds get stuck
      if(Math.abs(bird.xPos - birds[i].xPos) < (SCALE)) {
        ret["dx"] += ((bird.xPos - birds[i].xPos))/(10*SCALE);
      }
      if(Math.abs(bird.yPos - birds[i].yPos) < (SCALE)) {
        ret["dy"] += ((bird.yPos - birds[i].yPos))/(10*SCALE);
      }

    }
  }

  return ret;
}

function centerOfScreen(bird) {
  let xCenter = xAttraction;
  let yCenter = yAttraction;

  let ret = {
    "dx" : (xCenter - bird.xPos)/(ATTRACTION*SCALE),
    "dy" : (yCenter - bird.yPos)/(ATTRACTION*SCALE)
  }

  return ret;
}

function matchVelocity(bird) {
  let birdsXVelocity = 0;
  let birdsYVelocity = 0;

  for(i = 0; i < birds.length; i++) {
    if(birds[i] != bird) {
      // We want the closest birds to have the largest effect on the currentBird.
      // We can accomplish this by bounding the distance between the birds between 0 and 1 with tanh.
      // And then we sub tract this number from 1 (closest have highest number)
      birdsXVelocity += birds[i].xVelocity*(1 - Math.abs(Math.tanh(bird.xPos - birds[i].xPos)));
      birdsYVelocity += birds[i].yVelocity*(1 - Math.abs(Math.tanh(bird.yPos - birds[i].yPos)));
    }
  }
  birdsXVelocity = birdsXVelocity/(birds.length-1);
  birdsYVelocity = birdsYVelocity/(birds.length-1);

  let ret = {
    "dx" : (birdsXVelocity - bird.xVelocity)/(SPEED*SCALE),
    "dy" : (birdsYVelocity - bird.yVelocity)/(SPEED*SCALE)
  }



  return ret;
}

/*-------------------------------------------------- Main Functions -------------------------------------------------- */
function init() {
  initCanvas();
  intiBirds(20);

  xAttraction = canvas.width/2;
  yAttraction = canvas.height/2;

  //Initial Interval
  interval = setInterval(main, 10);
}

function main() {
  //Reset the Canvas
  ctx.clearRect(0,0,canvas.width,canvas.height);
 
  drawBirds();

  birds.forEach(b =>{
    //Change in velocity rules
    centerOfMassRet = centerOfMass(b);
    turnBird(b, centerOfMassRet["dx"], centerOfMassRet["dy"]);

    keepAwayRet = keepAway(b);
    turnBird(b, keepAwayRet["dx"], keepAwayRet["dy"]);

    centerOfScreenRet = centerOfScreen(b);
    turnBird(b, centerOfScreenRet["dx"], centerOfScreenRet["dy"]);

    matchVelocityRet = matchVelocity(b);
    turnBird(b, matchVelocityRet["dx"], matchVelocityRet["dy"]);

    //Move the birds
    b.xPos += b.xVelocity;
    b.yPos += b.yVelocity;
  });
}

function drawBirds(){
  birds.forEach(b =>{
    genBird(b);
  });
}


/*-------------------------------------------------- Helper Functions -------------------------------------------------- */
function setCenter(e) {
  if(e.clientX < canvas.width - canvas.width*.25 || e.clientY < canvas.height - 100) {
    xAttraction = e.clientX;
    yAttraction = e.clientY;
  }
}

let attractionSlider = document.getElementById("attractionRange");
let repulsionSlider = document.getElementById("repulsionRange");
let centerSlider = document.getElementById("centerRange");
let speedSlider = document.getElementById("speedRange");

attractionSlider.oninput = function() {
  ATTRACTION = this.value*200;
  document.getElementById("attractionOutput").innerHTML = "Attraction: " + this.value;
}
repulsionSlider.oninput = function() {
  REPULSION = this.value;
  document.getElementById("repulsionOutput").innerHTML = "Repulsion: " + this.value;

}
centerSlider.oninput = function() {
  CENTER = this.value*20;
  document.getElementById("centerOutput").innerHTML = "Gravity: " + this.value;

}
speedSlider.oninput = function() {
  SPEED = this.value/5;
  document.getElementById("speedOutput").innerHTML = "Speed: " + this.value;

}


window.addEventListener('click', setCenter, false);
window.addEventListener('resize', resizeCanvas, false);
init();





function radians_to_degrees(radians) {
  var pi = Math.PI;
  return radians * (180/pi);
}
