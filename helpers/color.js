import { randomColor } from "./random.js";

export function modifyColor(color, sat, lit) {
  const hue = Number(color.replace("hsl(", "").substring(0, 3));
  return `hsl(${hue} ${sat} ${lit})`;
}

export function colorButtons() {
  document.querySelectorAll("button").forEach((button) => {
    const color = randomColor();
    button.style.background = modifyColor(color, 40, 20);
    button.style.borderColor = color;
    button.style.color = color;
  });
}
