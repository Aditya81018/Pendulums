import { randomColor, randomNo } from "./helpers/random.js";
import Pendulum, {
  adjustPendulumsWidth,
  createNewPendulum,
  randomizePendulums,
  setDrawPathFor,
  setSpeedMultiplier,
  setVisibility,
} from "./pendulum.js";
import { canvas, ctx } from "./const.js";
import { colorButtons, colorSpans } from "./helpers/color.js";

const countElement = document.querySelector("#header > #count > span");
const fpsElement = document.querySelector("#header > #fps > span");

let count = 0;

let lastTime = 0;
let animationFrame;

let drawPathFor = "none";
let speedMultiplier = 1;
let state = "playing";
let visibility = "show";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  reset();
});

const pendulums = [];

colorButtons();
colorSpans();

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

  if (visibility === "show") {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  fpsElement.innerText = (1000 / dt).toFixed(0);

  animationFrame = window.requestAnimationFrame(animate);
}
animate();

function reset() {
  window.cancelAnimationFrame(animationFrame);
  if (count > 0) {
    pendulums[0].x = canvas.width / 2;
    pendulums[0].y = canvas.height / 2;
  }
  animate();
}

document.getElementById("add-pendulum").addEventListener("click", () => {
  const pendulum = createNewPendulum(pendulums[count - 1]);
  pendulums.push(pendulum);
  count++;
  adjustPendulumsWidth(pendulums);
  setDrawPathFor(pendulums, drawPathFor);
  setVisibility(pendulums, visibility);
  if (state === "paused") {
    pendulum.speedMultiplier = 0;
  } else pendulum.speedMultiplier = speedMultiplier;
  countElement.innerText = count;
});

document.getElementById("remove-pendulum").addEventListener("click", () => {
  pendulums.pop();
  count--;
  pendulums.at(-1).next = undefined;
  adjustPendulumsWidth(pendulums);
  setDrawPathFor(pendulums, drawPathFor);
  countElement.innerText = count;
});

document.getElementById("randomize").addEventListener("click", () => {
  randomizePendulums(pendulums);
  adjustPendulumsWidth(pendulums);
  setDrawPathFor(pendulums, drawPathFor);
  setVisibility(pendulums, visibility);
  if (state === "paused") {
    setSpeedMultiplier(pendulums, 0);
  } else setSpeedMultiplier(pendulums, speedMultiplier);
});

document.getElementById("randomize-color").addEventListener("click", () => {
  pendulums.forEach((pendulum) => {
    pendulum.setColor(randomColor());
  });
});

document.getElementById("draw-path-for").addEventListener("click", (event) => {
  drawPathFor = {
    none: "last",
    last: "all",
    all: "none",
  }[drawPathFor];
  setDrawPathFor(pendulums, drawPathFor);
  document.getElementById("draw-path-for").innerText = drawPathFor;
});

document
  .getElementById("speed-multiplier")
  .addEventListener("click", (event) => {
    speedMultiplier = {
      1: 2,
      2: 4,
      4: 8,
      8: 1,
    }[speedMultiplier];
    if (state !== "paused") setSpeedMultiplier(pendulums, speedMultiplier);
    document.getElementById("speed-multiplier").innerHTML =
      `<i class="fa-solid fa-xmark"></i>` + speedMultiplier;
  });

document.getElementById("pause").addEventListener("click", () => {
  if (state === "playing") {
    setSpeedMultiplier(pendulums, 0);
    state = "paused";
    document.getElementById(
      "pause"
    ).innerHTML = `<i class="fa-solid fa-play"></i>`;
  } else if (state === "paused") {
    setSpeedMultiplier(pendulums, speedMultiplier);
    state = "playing";
    document.getElementById(
      "pause"
    ).innerHTML = `<i class="fa-solid fa-pause"></i>`;
  }
});

document.getElementById("hide-pendulums").addEventListener("click", () => {
  if (visibility === "show") {
    document.getElementById(
      "hide-pendulums"
    ).innerHTML = `<i class="fa-solid fa-eye"></i>`;
    visibility = "hide";
  } else if (visibility === "hide") {
    document.getElementById(
      "hide-pendulums"
    ).innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
    visibility = "show";
  }
  setVisibility(pendulums, visibility);
});

document.getElementById("clear-path").addEventListener("click", () => {
  pendulums.forEach((pendulum) => {
    pendulum.path = [];
  });
});
