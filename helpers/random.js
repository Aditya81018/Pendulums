export function randomColor(sat = 80, lit = 70) {
  return `hsl(${Math.random() * 360} ${sat} ${lit})`;
}

export function randomNo(min, max, precision = 3) {
  return Number((Math.random() * (max - min) + min).toFixed(precision));
}

export function pickOne(...options) {
  return options[randomNo(0, options.length - 1, 0)];
}
