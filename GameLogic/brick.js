class Brick {
  constructor() {
    this.x = random(width - 80);
    this.y = 0;
    this.w = 80;
    this.h = 30;
    this.speed = 10;
    this.highlight = false;
  }

  hits(playerObj) {
    let testX = playerObj.x;
    let testY = playerObj.y;

    if (playerObj.x < this.x) {
      testX = this.x;
    } else if (playerObj.x > this.x + this.w) {
      testX = this.x + this.w;
    }

    if (playerObj.y < this.y) {
      testY = this.y;
    } else if (playerObj.y > this.y + this.h) {
      testY = this.y + this.h;
    }

    let distance = dist(playerObj.x, playerObj.y, testX, testY);

    if (distance <= playerObj.d / 2) {
      return true;
    }
    this.highlight = false;
  }

  show() {
    if (this.highlight) {
      tint(255, 0, 0);
    } else {
      tint(255);
    }
    imageMode(CORNER);
    image(brickImage, this.x, this.y, this.w, this.h);
    noTint();
  }

  update() {
    this.y += this.speed;
  }

  offscreen() {
    if (this.y > height + this.h) {
      return true;
    } else {
      return false;
    }
  }
}
