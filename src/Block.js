import { GameObject } from './GameObject';
import { BlockFadeoutMixin } from './mixins/BlockFadeoutMixin';

import { darken, trajectory } from './utils';

export class Block extends GameObject {
  constructor (x, y, width, height, color) {
    super(x, y, width, height, color);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.shadowColor = darken(this.color, 30);
  }

  draw (screen) {
    screen.fillStyle = this.color;

    screen.shadowColor = this.shadowColor;
    screen.shadowBlur = 4;
    screen.shadowOffsetY = 1;

    screen.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  ghostOff () {
    this.addMixin(BlockFadeoutMixin);
  }

  collidesWithBall (ball) {
    return !(
      ball.x + ball.radius < this.x ||
      ball.y + ball.radius < this.y ||
      ball.x - ball.radius > this.x + this.width ||
      ball.y - ball.radius > this.y + this.height
    );
  }

  bounceOffBall (ball) {
    const [ x, y ] = ball.lastPoint;
    const xDiff = ball.x - x;
    const yDiff = ball.y - y;

    let nextX = x, nextY = y;

    if (ballIsAbove(this, ball)) {
      nextX = ball.x + xDiff;
    } else if (ballIsRight(this, ball)) {
      nextY = ball.y + yDiff;
    } else if (ballIsBelow(this, ball)) {
      nextX = ball.x + xDiff;
    } else { // ballIsLeft
      nextY = ball.y + yDiff;
    }

    return trajectory(ball.x, ball.y, nextX, nextY);
  }
}

function ballIsAbove (block, ball) {
  // Todo: corner cases
  return block.y >= ball.y - ball.radius * 2;
}

function ballIsRight (block, ball) {
  return block.x + block.width <= ball.x + ball.radius * 2;
}

function ballIsBelow (block, ball) {
  return block.y + block.height <= ball.y + ball.radius * 2;
}