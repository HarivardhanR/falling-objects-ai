class Player {
  constructor(brain) {
    this.y = height - 16;
    this.x = width / 2;
    this.speed = 5;
    this.d = 32;
    if (brain instanceof Brain) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new Brain();
    }
    this.score = 0;
    this.fitness = 0;
  }

  resetPosition() {
    this.y = height - 16;
    this.x = width / 2;
  }

  dispose() {
    this.brain.dispose();
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  copy() {
    return new Player(this.brain);
  }

  show() {
    imageMode(CENTER);
    image(playerImg, this.x, this.y, this.d, this.d);
  }

  think(bricks) {
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < bricks.length; i++) {
      let diff = this.y - bricks[i].y;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = bricks[i];
      }
    }

    if (closest != null) {
      closest.highlight = true;
      let inputs = [];
      // bottom position of closest brick
      inputs[0] = map(closest.y + 30, 0, height, 0, 1);
      // left of closest brick opening
      inputs[1] = map(closest.x, 0, width, 0, 1);
      // right of closest brick opening
      inputs[2] = map(closest.x + 80, 0, width, 0, 1);
      // players's y position
      inputs[3] = map(this.x, 0, width, 0, 1);

      let action = this.brain.predict(inputs);
      const maxIndex = action.indexOf(Math.max(...action));

      if (maxIndex === 0) {
        this.left();
      } else if (maxIndex === 1) {
        this.right();
      } // Do nothing if maxIndex is 2
    }
  }

  left() {
    this.x -= this.speed;
  }

  right() {
    this.x += this.speed;
  }

  killed(canvasWidth) {
    if (this.x <= 0 || this.x >= canvasWidth) {
      return true;
    }
    return false;
  }
  update() {
    this.score++;
  }
}

function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}
