import { Game } from './Game';
import { Block } from './Block';

import { niceColor } from './utils';

const createFps = require('fps-indicator');

document.addEventListener('DOMContentLoaded', function () {
  const screen = document.getElementById('screen');
  screen.setAttribute('width', document.body.clientWidth - 40);
  screen.setAttribute('height', document.body.clientHeight - 40);

  const game = new Game(screen);

  const blocks = [
    new Block(10, 10, 100, 100, niceColor()),
    new Block(150, 10, 40, 80, niceColor()),
    new Block(300, 70, 100, 120, niceColor()),
    new Block(400, 200, 100, 100, niceColor()),
    new Block(100, 150, 70, 70, niceColor()),
    new Block(600, 300, 50, 200, niceColor())
  ];

  game.addObjects(blocks);
  game.start();

  createFps();
});