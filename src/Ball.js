import { GameObject } from './GameObject';

import { clamp, trajectory, within, niceColor, darken } from './utils';

export class Ball extends GameObject {
  constructor (x, y, toX, toY, color) {
    super(x, y, toX, toY, color);
    this.x = x;
    this.y = y;

    this.lastPoint = [x, y];

    this.next = trajectory(x, y, toX, toY);

    this.radius = 5;
    this.color = color;

    this.shadowColor = darken(this.color, 30);
  }

  isStatic () { return false; }

  get trajectory () {
    return this.next;
  }

  preDraw () {
    const [ x, y ] = this.next(this.x, this.y);
    this.x = x;
    this.y = y;
  }

  draw (screen) {
    screen.fillStyle = this.color;

    screen.shadowColor = this.shadowColor;
    screen.shadowBlur = 4;
    screen.shadowOffsetY = 1;

    screen.beginPath();
    screen.arc(
      this.x,
      this.y,
      this.radius,
      0,
      2 * Math.PI
    );

    screen.fill();

    // TODO: trace
  }

  drawTrajectory (screen) {
    const startX = this.x, startY = this.y;
    let finishX = startX, finishY = startY;

    while (finishX > 0 && finishY > 0 &&
      finishX < 1400 && finishY < 1000) {
      [ finishX, finishY ] = this.next(finishX, finishY);
    }
    screen.beginPath();
    screen.setLineDash([4, 4])
    screen.moveTo(startX, startY);
    screen.lineTo(finishX, finishY);
    screen.stroke();
  }

  isVisible (x1, y1, x2, y2) {
    return within(this.x, x1 - this.radius * 2, x2 + this.radius * 2) &&
           within(this.y, y1 - this.radius * 2, y2 + this.radius * 2);
  }

  willBounceOff (newTrajectory) {
    this.lastPoint = [this.x, this.y];
    this.next = newTrajectory;
  }

}