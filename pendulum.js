import { canvas, ctx } from "./const.js";
import { modifyColor } from "./helpers/color.js";
import { randomColor, randomNo } from "./helpers/random.js";

export default class Pendulum {
  constructor(speed, length, width, angle, color, prev) {
    this.x = prev?.dx ?? canvas.width / 2;
    this.y = prev?.dy ?? canvas.height / 2;
    this.speed = speed;
    this.length = length;
    this.width = width;
    this.angle = angle;
    this.color = color;
    this.fillColor = modifyColor(color, 40, 20);
    this.prev = prev;
    this.next = undefined;
    this.drawPath = true;
    this.path = [];
    this.pathLength = 2 * (canvas.width + canvas.height);
  }

  update(dt) {
    this.angle += (this.speed * dt) / 1000;
    this.x = this.prev?.dx ?? this.x;
    this.y = this.prev?.dy ?? this.y;
    this.path.push([this.dx, this.dy]);
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
      this.draw();
    }
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
  const speed = randomNo(-10, 10, 0) / Math.PI;
  const length = randomNo(min / 16, min / 8);
  const angle = randomNo(-Math.PI, Math.PI);
  const pendulum = new Pendulum(speed, length, 4, angle, randomColor(), prev);

  return pendulum;
}

export function randomizePendulums(pendulums) {
  for (let i = 0; i < pendulums.length; i++) {
    const pendulum = createNewPendulum(pendulums[i - 1]);
    pendulum.width = pendulums.length - 1 + 4;
    pendulums[i] = pendulum;
    if (pendulums[i - 1]) pendulums[i - 1].next = pendulum;
    if (i === pendulums.length - 1) pendulum.drawPath = true;
  }
}

export function adjustPendulumsWidth(pendulums) {
  pendulums.forEach((pendulum) => {
    pendulum.width = pendulum.prev
      ? pendulum.prev.width - 1
      : pendulums.length + 4;
  });
}
