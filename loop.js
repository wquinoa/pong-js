const PAD_COL = "WHITE";
const PUCK_COL = "WHITE"
const BACKGROUND = "BLACK";
const DIFFICULTY = 0.1;
const PAD_SIZE = 100;

const cvs = document.getElementById("scene");
const ctx = cvs.getContext("2d");
const screenBox = cvs.getBoundingClientRect();
ctx.font = "45px monospace";

class Player {
  constructor(posX) {
    this.x = posX;//0,
    this.y = cvs.height / 2 - PAD_SIZE / 2;//cvs.height / 2 - PAD_SIZE / 2,

    this.width = 10;
    this.height = PAD_SIZE;
    this.score = 0;
  }

  updatePos() {
    this.top = this.y;
    this.bottom = this.y + this.height;
    this.left = this.x;
    this.right = this.x + this.width;
  }
}

class User extends Player {

  // move depending on mouse position
  unboundMove(e) {
    this.y = e.clientY - screenBox.top - this.height / 2;
    this.updatePos();
  }

  // bind 'this' so that the handler starts working
  move = this.unboundMove.bind(this);
}

class AI extends Player {
  move(puck) {
      this.y += (puck.y - (this.y + this.height / 2)) * DIFFICULTY;
      this.updatePos();
  }
}

class Puck {
  constructor() { this.reset(); }

  reset() {
    this.x = cvs.width / 2;
    this.y = cvs.height / 2;
    this.r = 10;
    this.speed = 5;
    this.dx = 5;
    this.dy = 5;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    this.top = this.y - this.r;
    this.bottom = this.y + this.r;
    this.left = this.x - this.r;
    this.right = this.x + this.r;
  }

  collide(plr) {
    // collide with walls: reverse y dir
    if (this.y + this.r >= cvs.height || this.y - this.r <= 0){
      this.dy = -this.dy;
    }

    //collide with players: reverse x dir
    if (this.right > plr.left && this.bottom > plr.top &&
        this.left < plr.right && this.top < plr.bottom) {
        this.dx = -this.dx;
    }
  }
}

const sep = {
  x: cvs.width / 2 - 1,
  y: 0,
  width: 2,
  height: 10
};


var p1 = new User(5);
var p2 = new AI(cvs.width - 15);
var puck = new Puck();

function drawBackground(){
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  // draw separator
  ctx.fillStyle = "#555";
  for (let i = 0; i <= cvs.height; i += 15){
    ctx.fillRect(sep.x, i, sep.width, sep.height);
  }

  // add score
  ctx.fillStyle = "white";
  ctx.fillText(p1.score, cvs.width / 4, cvs.height / 5);
  ctx.fillText(p2.score, 3 * cvs.width / 4, cvs.height / 5);
}

function drawPaddle(paddle){
  ctx.fillStyle = PAD_COL;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawPuck(x, y, r) {
  ctx.fillStyle = PUCK_COL;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

cvs.addEventListener("mousemove", p1.move);

function update() {

  puck.move();
  p2.move(puck);

  let player = (puck.x < cvs.width / 2) ? p1 : p2;

  puck.collide(player);
}

function render() {
  drawBackground();

  drawPaddle(p1);
  drawPaddle(p2);
  drawPuck(puck.x, puck.y, puck.r);
}

function loop() {
  update();
  render();
}

setInterval(loop, 20);
