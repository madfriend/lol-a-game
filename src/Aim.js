import { GameObject } from './GameObject';

export class Aim extends GameObject {
  constructor (color) {
    super(color);
    this.color = color;
    this.isAiming = false;
    this.x = null;
    this.y = null;
    this.radius = 5;
  }

  isStatic () { return !this.isAiming; }

  isVisible () {
    return true;
  }

  preDraw (newState) {
    this.isAiming = newState.isAiming;
    this.x = newState.aimX;
    this.y = newState.aimY;
  }

  draw (screen) {
    if (!this.isAiming) return;

    screen.fillStyle = this.color;
    screen.strokeStyle = this.color;
    screen.setLineDash([2, 5]);

    screen.beginPath();
    screen.arc(
      this.x[0],
      this.y[0],
      this.radius,
      0,
      2 * Math.PI
    );

    screen.fill();

    screen.moveTo(this.x[0], this.y[0]);
    screen.lineTo(this.x[1], this.y[1]);

    screen.stroke();

  }
}