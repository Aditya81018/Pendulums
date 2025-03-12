import { randomColor, randomNo } from "./helpers/random.js";
import Pendulum, {
  adjustPendulumsWidth,
  createNewPendulum,
  randomizePendulums,
} from "./pendulum.js";
import { canvas, ctx } from "./const.js";

let count = 0;

let lastTime = 0;
let animationFrame;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  reset();
});

const pendulums = [];

function animate(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = count - 1; i >= 0; i--) {
    if (dt && pendulums.length > 0) pendulums[i].drawPathLine();
  }
  pendulums.forEach((pendulum) => {
    pendulum.animate(dt);
  });

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  animationFrame = window.requestAnimationFrame(animate);
}
animate();

function reset() {
  window.cancelAnimationFrame(animationFrame);
  pendulums[0].x = canvas.width / 2;
  pendulums[0].y = canvas.height / 2;
  animate();
}

document.getElementById("add-pendulum").addEventListener("click", () => {
  const pendulum = createNewPendulum(pendulums[count - 1]);
  pendulums.push(pendulum);
  count++;
  adjustPendulumsWidth(pendulums);
});

document.getElementById("remove-pendulum").addEventListener("click", () => {
  pendulums.pop();
  count--;
  adjustPendulumsWidth(pendulums);
});

document.getElementById("randomize").addEventListener("click", () => {
  randomizePendulums(pendulums);
  adjustPendulumsWidth(pendulums);
});

document.getElementById("randomize-color").addEventListener("click", () => {
  pendulums.forEach((pendulum) => {
    pendulum.setColor(randomColor());
  });
});
