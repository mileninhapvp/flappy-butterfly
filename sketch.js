function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}let butterfly;
let pipes = [];
let coins = [];
let sparkles = [];
let gravity = 0.6;
let lift = -12;
let score = 0;
let coinScore = 0;

function setup() {
  createCanvas(400, 600);
  butterfly = new Butterfly();
  pipes.push(new Pipe());
}

function draw() {
  background(135, 206, 250); // Céu azul
  drawBackground();

  butterfly.update();
  butterfly.show();

  // Canos
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].hits(butterfly)) {
      noLoop();
      textSize(32);
      fill(255, 0, 0);
      textAlign(CENTER);
      text('GAME OVER', width / 2, height / 2);
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
      score++;
      coins.push(new Coin());
    }
  }

  // Moedas
  for (let i = coins.length - 1; i >= 0; i--) {
    coins[i].show();
    coins[i].update();

    if (coins[i].collected(butterfly)) {
      coinScore++;
      sparkles.push(new Sparkle(coins[i].x, coins[i].y));
      coins.splice(i, 1);
    }
  }

  // Brilhos
  for (let i = sparkles.length - 1; i >= 0; i--) {
    sparkles[i].show();
    sparkles[i].update();
    if (sparkles[i].finished()) {
      sparkles.splice(i, 1);
    }
  }

  if (frameCount % 100 === 0) {
    pipes.push(new Pipe());
  }

  // Pontuação
  textSize(20);
  fill(255);
  textAlign(LEFT);
  text('Score: ' + score, 10, 30);
  text('Moedas: ' + coinScore, 10, 55);
}

// Borboleta sobe com clique do mouse
function mousePressed() {
  if (mouseButton === LEFT) {
    butterfly.up();
  }
}

function drawBackground() {
  noStroke();
  fill(0, 200, 0);
  rect(0, height - 50, width, 50); // Grama
  fill(150, 75, 0);
  rect(0, height - 40, width, 10); // Terra
}

class Butterfly {
  constructor() {
    this.x = 64;
    this.y = height / 2;
    this.velocity = 0;
    this.flapState = 0;
  }

  up() {
    this.velocity = lift;
  }

  update() {
    this.velocity += gravity;
    this.y += this.velocity;

    if (this.y > height - 50) {
      this.y = height - 50;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }

    if (frameCount % 10 === 0) {
      this.flapState = (this.flapState + 1) % 2;
    }
  }

  show() {
    // sombra
    noStroke();
    fill(50, 50, 50, 100);
    ellipse(this.x + 5, this.y + 20, 20, 6);

    // corpo preto
    fill(0);
    rect(this.x, this.y, 6, 6);

    if (this.flapState === 0) {
      // asas abertas
      fill(255, 100, 200);
      rect(this.x - 14, this.y - 8, 14, 14);
      fill(255, 200, 100);
      rect(this.x + 6, this.y - 8, 14, 14);
    } else {
      // asas fechadas
      fill(255, 100, 200);
      rect(this.x - 10, this.y - 4, 10, 10);
      fill(255, 200, 100);
      rect(this.x + 6, this.y - 4, 10, 10);
    }

    // detalhes brancos
    fill(255);
    rect(this.x - 6, this.y, 4, 4);
    rect(this.x + 8, this.y, 4, 4);

    // antenas
    stroke(0);
    line(this.x + 2, this.y, this.x - 2, this.y - 10);
    line(this.x + 4, this.y, this.x + 8, this.y - 10);
  }
}

class Pipe {
  constructor() {
    this.spacing = 150;
    this.top = random(height / 6, (3 / 4) * height);
    this.bottom = this.top + this.spacing;
    this.x = width;
    this.w = 40;
    this.speed = 3;
  }

  hits(butterfly) {
    if (butterfly.y < this.top || butterfly.y > this.bottom) {
      if (butterfly.x > this.x && butterfly.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  show() {
    fill(0, 180, 0);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }
}

class Coin {
  constructor() {
    this.x = width;
    this.y = random(100, height - 150);
    this.size = 14;
    this.speed = 3;
  }

  show() {
    fill(255, 215, 0);
    rect(this.x, this.y, this.size, this.size);
    fill(255, 255, 150);
    rect(this.x + 3, this.y + 3, this.size - 6, this.size - 6);
  }

  update() {
    this.x -= this.speed;
  }

  collected(butterfly) {
    let d = dist(this.x, this.y, butterfly.x, butterfly.y);
    return d < 15;
  }
}

class Sparkle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lifetime = 20;
  }

  show() {
    noStroke();
    fill(255, 255, 0, map(this.lifetime, 0, 20, 0, 255));
    ellipse(this.x, this.y, 20 - this.lifetime, 20 - this.lifetime);
    fill(255, 255, 255, map(this.lifetime, 0, 20, 0, 255));
    ellipse(this.x, this.y, 10 - this.lifetime/2, 10 - this.lifetime/2);
  }

  update() {
    this.lifetime--;
  }

  finished() {
    return this.lifetime <= 0;
  }
}
