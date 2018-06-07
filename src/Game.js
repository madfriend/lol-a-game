import { Ball } from './Ball';
import { Aim } from './Aim';
import { Block } from './Block';

import { niceColor, darken, distance, copyObjects } from './utils';

const aimColor = darken(niceColor(), 30);
const MIN_AIM_DIST = 7;

let isFirstDraw = true;
let scheduledReset = false;

export class Game {
  constructor (canvas) {
    this.screen = canvas.getContext('2d');
    this.bounds = canvas.getBoundingClientRect();

    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.objects = [ new Aim(aimColor) ];
    this.state = {};

    this.tick = this.tick.bind(this);

    this.addMouseListeners();
  }

  start () {
    this._initialObjects = copyObjects(this.objects);
    this._timer = requestAnimationFrame(this.tick);
  }

  stop () {
    cancelAnimationFrame(this._timer);
  }

  resetScreen () {
    this.screen.shadowColor = null;
    this.screen.shadowBlur = 0;
    this.screen.shadowOffsetY = 0;
    this.screen.setLineDash([]);
    this.screen.globalAlpha = 1;
  }

  resetObjects () {
    isFirstDraw = true;
    this.objects = copyObjects(this._initialObjects);
  }

  draw () {
    this.screen.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.objects.forEach(object => {
      object.draw(this.screen);
      this.resetScreen();
    });
  }

  tick () {
    const hasChangingObjects = this.hasChangingObjects();
    const hadBall = !!this.ball;

    this.preDraw();

    if (hasChangingObjects || isFirstDraw) {
      isFirstDraw = false;
      this.draw();
      this.removeInvisibleObjects();
      this.collideBall();
    } else if (scheduledReset) {
      scheduledReset = false;
      this.resetObjects();
    }

    const ballIsGone = !this.ball;

    if (hadBall && ballIsGone) {
      scheduledReset = true;
    }

    this._timer = requestAnimationFrame(this.tick);
  }

  preDraw () {
    this.objects.forEach(object => object.preDraw(this.state));
  }

  addObjects (objects) {
    this.objects.unshift(...objects);
  }

  hasChangingObjects () {
    return this.objects.filter(obj => !obj.isStatic()).length;
  }

  removeInvisibleObjects () {
    this.objects = this.objects.filter(object => {
      return object.isVisible(0, 0, this.canvasWidth, this.canvasHeight);
    });
  }

  get blocks () {
    return this.objects.filter(isBlock);
  }

  addBall (x, y, toX, toY) {
    const ball = new Ball(x, y, toX, toY, aimColor);
    this.objects.push(ball);
    // this.stop();
    // ball.drawTrajectory(this.screen);
  }

  get ball () {
    return this.objects.filter(isBall)[0];
  }

  collideBall () {
    const ball = this.ball;
    if (!ball) return;

    // Since we allow only one ball, there could
    // only be one colliding block
    const collidingBlock = this.blocks.find(b => b.collidesWithBall(ball));

    if (collidingBlock) {
      ball.willBounceOff(collidingBlock.bounceOffBall(ball));
      collidingBlock.ghostOff();
    }
  }

  addMouseListeners () {
    window.addEventListener('mousedown', this.onMousedown.bind(this));
    window.addEventListener('mousemove', this.onMousemove.bind(this));
    window.addEventListener('mouseup', this.onMouseup.bind(this));
  }

  onMousedown (e) {
    const xy = this.mouseXY(e);

    if (!this.onScreen(xy)) return false;

    this.resetObjects();

    this.state.isAiming = true;
    this.state.aimX = [xy.x, xy.x];
    this.state.aimY = [xy.y, xy.y];
  }

  onMousemove (e) {
    if (!this.state.isAiming) return false;

    const xy = this.mouseXY(e);
    this.state.aimX[1] = xy.x;
    this.state.aimY[1] = xy.y;
  }

  onMouseup (e) {
    if (!this.state.isAiming) return false;

    this.state.isAiming = false;

    const dist = distance(
      this.state.aimX[0],
      this.state.aimY[0],
      this.state.aimX[1],
      this.state.aimY[1]
    );

    if (dist < MIN_AIM_DIST) {
      return;
    };

    this.addBall(
      this.state.aimX[0],
      this.state.aimY[0],
      this.state.aimX[1],
      this.state.aimY[1]
    );

  }

  mouseXY (e) {
    return {
      x: e.clientX - this.bounds.left,
      y: e.clientY - this.bounds.top
    };
  }

  onScreen ({x, y}) {
    return x >= 0 && y >= 0 &&
      x <= this.canvasWidth && y <= this.canvasHeight;
  }
}

function isBlock (b) { return b instanceof Block; }
function isBall (b) { return b instanceof Ball; }