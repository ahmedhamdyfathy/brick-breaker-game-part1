// the references
//Conor Bailey => youtube channal 
//https://github.com/conorbailey90/breakout-game/blob/master/app.js
//https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// set width and height canvas
canvas.width = 500;
canvas.height = 400;
var speed = 3;

/* creat ball object {
  x:position the ball in x-axis canvas.width/2,
  y:position the ball in y-axis canvas.height - 50 from the bottom canvas,
  dx:direction x speed the ball ,
  dy:direction y -speed the ball,  radius:7,
  draw(): method to draw the ball,
}*/
var ball = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  dx: speed,
  dy: -speed + 1,
  radius: 7,
  draw: function () {
    ctx.beginPath();
    ctx.fillStyle = "#6e4e8f";
    ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.fill();
  }
};
/* creat paddle object {
   x:position the paddle in x-axis canvas.width/2,
  y:position the paddle in y-axis canvas.height - 20 from the bottom canvas,
  dx:direction x speed the paddle ,
  dy:direction y -speed the paddle,  
  draw(): method to draw the paddle,
}
 */
var paddle = {
  width: 100,
  height: 10,
  x: canvas.width / 2 - 100 / 2, //  width/2 to be the ball at the middle of the paddle
  drawPaddle: function () {
    ctx.beginPath();
    ctx.fillStyle = "#00ff00";
    ctx.rect(
      this.x,
      canvas.height,
      this.width,
      this.height - 20
    );
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
  }
};

//creat function to move the ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  // to  prevent the ball exit the game frame  on the x-axis
  if (
    ball.x + ball.radius > canvas.width ||
    ball.x - ball.radius < 0
  ) {
    ball.dx *= -1;
  }
  // to  prevent the ball exit the game frame  on the y-axis
  if (
    ball.y + ball.radius > canvas.height ||
    ball.y - ball.radius < 0
  ) {
    ball.dy *= -1;
  }
}

//creat function to move the paddle
let rightPressed = false;
let leftPressed = false;

//add event listenr the rightArrow and the leftArrow (to be checked)
document.addEventListener(
  "keydown",
  keydownHandler
);
document.addEventListener("keyup", keyupHandler);
function keydownHandler(e) {
  /* console.log(e); can  more  strict the condition  by 
  || e.keyCode ==="ArrowRight" || e.keyCode ==="ArrowLeft"*/
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

/*can  more  strict the condition  by   
|| e.keyCode==="ArrowRight"  || e.keyCode ==="ArrowLeft"*/
function keyupHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function movePaddle() {
  if (rightPressed) {
    paddle.x += 10;
    // to  prevent the paddle exit the game frame  on the x-axis when pressed rightArrow
    if (paddle.x + paddle.width >= canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  } else if (leftPressed) {
    paddle.x -= 10;
    // to  prevent the paddle exit the game frame  on the x-axis when pressed lefttArrow
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}
/*When the ball hits the bat the direction of the ball 
should be reversed and bounce*/
function bounce() {
  if (
    ball.x >= paddle.x &&
    ball.x <= paddle.width + paddle.x &&
    ball.y + ball.radius >=
      canvas.height - paddle.height
  ) {
    ball.dy *= -1;
  }
}

// function bulid the bricks and generated
// variables special to bricks
var brickRowCount = 5;
var brickColumnCount = 8;
var brickWidth = 50;
var brickHeight = 10;
var brickpadding = 10;
var breckOffsetTop = 30;
var brickOffsetLeft = 10;
// create array variable to load the bricks
var bricks = [];
// function to generated the bricks => call this function outer
// when call the function inside play function is error
function generateBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

//creat function to draw the bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX =
          c * (brickWidth + brickpadding) +
          brickOffsetLeft;
        var brickY =
          r * (brickHeight + brickpadding) +
          breckOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(
          brickX,
          brickY,
          brickWidth,
          brickHeight
        );
        ctx.fillStyle = "#555";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

/* function to make the ball collision with 
the bricks and to make the bricks disappeared */

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status === 1) {
        if (
          ball.x >= b.x &&
          ball.x <= b.x + brickWidth &&
          ball.y >= b.y &&
          ball.y <= b.y + brickHeight
        ) {
          ball.dy *= -1;
          b.status = -1;
          score++;
        }
      }
    }
  }
}

// draw score
var score = 0;
function drawScore() {
  ctx.font = "15px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("score:" + score, 10, 20);
}

/* generate function to move the next level (levelUP function)
 when the score arrived 40 checks t the value of score if arrived 40 
 again generate (generatBricks function and increment the speed of ball)
 40 number of bricks => 5*8 => RowCount*ColumnCount
*/
let gameLevelUp = true;

function levelUP() {
  if (score % 40 === 0 && score !== 0) {
    if (ball.y > canvas.height / 2) {
      generateBricks();
    }
    if (gameLevelUp) {
      if (ball.dy > 0) {
        ball.dy += 1;
        gameLevelUp = false;
      } else if (ball.dy < 0) {
        // speed of ball if less than 0 then the value are negative so to + negative 1
        ball.dy -= 1;
        gameLevelUp = false;
      }
    }
    if (score % 40 !== 0) {
      gameLevelUp = true;
    }
  }
}

const scoreDisplay = document.querySelector(
  ".high-score"
);
// let hightScore = parseInt(localStorage.getItem("hightScore"));

// if(isNaN('hightScoer')){
//   hightScore = 0;

// }
// scoreDisplay.innerHTML = `Hight score:${hightScore}`;

// creat the main function to call another function
function play() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
  ball.draw();
  paddle.drawPaddle();

  drawBricks();

  movePaddle();
  collisionDetection();
  levelUP();
  drawScore();
  moveBall();

  bounce();
  //reset score
  //localStorage.getItem("key=>string","value=>string")
  // convert the value of (score ) who number to sting by method toString()
  if (ball.y + ball.radius > canvas.height) {
    if (
      score >
      parseInt(localStorage.getItem("hightScore"))
    ) {
      localStorage.setItem(
        "hightScore",
        score.toString()
      );
      scoreDisplay.innerHTML = `Hight score:${score}`;
    }
    score = 0;
    generateBricks();
    ball.dx = speed;
    ball.dy = -speed + 1;
  }
  // generateBricks();call this function here. the big mistake => thing and opposite thing at the same time
  requestAnimationFrame(play);
}

generateBricks();
play();
