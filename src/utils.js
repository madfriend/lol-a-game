import convert from 'color-convert';

export function within (a, b, c) {
  return a >= b && a <= c;
}

export function clamp (a, min, max) {
  if (a < min) return min;
  if (a > max) return max;
  return a;
}

export function trajectory (x1, y1, x2, y2) {
  let delta = (Math.sign(y2 - y1) || Math.sign(x2 - x1) || 1) * 8;

  if (x1 === x2) {
    return (x, y) => { return [x, y + delta] };
  }

  const a = y2 === y1 ? 0 : (y2 - y1) / (x2 - x1);
  const b = y1 - a * x1;

  delta = a === 0 ? delta : delta / a;
  delta = clamp(delta, -8, 8);

  return (x, y) => { return [x + delta, a * (x + delta) + b] };
}

export function distance (x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

let current = 160;
const step = 33;
const s = 50;
const l = 60;

export function niceColor () {
  current = (current + step) % 255;
  return '#' + convert.hsl.hex(current, s, l);
}

export function darken (hexstr, value) {
  const hsl = convert.hex.hsl(hexstr.substr(1));
  return '#' + convert.hsl.hex(
    hsl[0],
    hsl[1],
    clamp(hsl[2] - value, 0, +Infinity) % 255
  );
}

export function copyObjects (objects) {
  return objects.map(o => o.copy(o.constructor.name));
}