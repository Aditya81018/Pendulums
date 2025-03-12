export function modifyColor(color, sat, lit) {
  const hue = Number(color.replace("hsl(", "").substring(0, 3));
  return `hsl(${hue} ${sat} ${lit})`;
}
