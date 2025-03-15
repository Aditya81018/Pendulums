import { canvas, ctx } from "./const.js";
import { modifyColor } from "./helpers/color.js";
import { pickOne, randomColor, randomNo } from "./helpers/random.js";

export default class Pendulum {
  constructor(speed, length, width, angle, color, prev) {
    this.x = prev?.dx ?? canvas.width / 2;
    this.y = prev?.dy ?? canvas.height / 2;
    this.speed = speed;
    this.speedMultiplier = 1;
    this.length = length;
    this.width = width;
    this.angle = angle;
    this.prev = prev;
    this.next = undefined;
    this.drawPendulum = true;
    this.drawPath = false;
    this.path = [];
    this.pathLength = 3200;
    this.setColor(color);
  }

  update(dt) {
    this.angle += (this.speed * this.speedMultiplier * dt) / 1000;
    this.x = this.prev?.dx ?? this.x;
    this.y = this.prev?.dy ?? this.y;
    if (this.drawPath) this.path.push([this.dx, this.dy]);
    else this.path = [];
    if (this.path.length > this.pathLength && this.pathLength != -1) {
      this.path.splice(0, 1);
    }
  }

  draw() {
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.dx, this.dy, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.dx, this.dy);
    ctx.stroke();
    ctx.closePath();
  }

  drawPathLine() {
    if (this.drawPath && this.path.length > 0) {
      ctx.lineWidth = this.width;
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.fillColor;
      ctx.beginPath();
      ctx.moveTo(...this.path[0]);
      this.path.forEach((point) => {
        ctx.lineTo(...point);
      });
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }

  animate(dt) {
    if (dt) {
      this.update(dt);
      if (this.drawPendulum) this.draw();
    }
  }

  setColor(color) {
    this.color = color;
    this.fillColor = modifyColor(color, 40, 20);
  }

  get dx() {
    return this.x + this.length * Math.cos(this.angle);
  }

  get dy() {
    return this.y + this.length * Math.sin(this.angle);
  }
}

export function createNewPendulum(prev) {
  const min = Math.min(canvas.width, canvas.height);
  const speed =
    pickOne(randomNo(-16, -8, 0), randomNo(8, 16, 0)) / (2 * Math.PI);
  const length = randomNo(min / 16, min / 8);
  const angle = randomNo(-Math.PI, Math.PI);
  const pendulum = new Pendulum(speed, length, 4, angle, randomColor(), prev);
  if (prev !== undefined) prev.next = pendulum;
  return pendulum;
}

export function randomizePendulums(pendulums) {
  for (let i = 0; i < pendulums.length; i++) {
    const pendulum = createNewPendulum(pendulums[i - 1]);
    pendulums[i] = pendulum;
    if (pendulums[i - 1]) pendulums[i - 1].next = pendulum;
  }
}

export function adjustPendulumsWidth(pendulums) {
  const unit = Math.min(canvas.height, canvas.width) / 240;
  let i = 0;
  let pendulum = pendulums.at(-1);
  while (pendulum !== undefined) {
    pendulum.width = unit + (i * unit) / 4;
    pendulum = pendulum.prev;
    i++;
  }
}

// query: all | last | none
export function setDrawPathFor(pendulums, query) {
  pendulums.forEach((pendulum) => {
    if (query === "all") {
      pendulum.drawPath = true;
    } else if (query === "last") {
      if (pendulum.next === undefined) pendulum.drawPath = true;
      else pendulum.drawPath = false;
    } else if (query === "none") pendulum.drawPath = false;
  });
}

export function setSpeedMultiplier(pendulums, speedMultiplier) {
  pendulums.forEach((pendulum) => (pendulum.speedMultiplier = speedMultiplier));
}

export function setVisibility(pendulums, visibility) {
  pendulums.forEach(
    (pendulum) => (pendulum.drawPendulum = visibility === "show")
  );
}
