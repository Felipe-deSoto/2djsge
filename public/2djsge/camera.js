import { vec2 } from "./vec/vec2/vec2.js";
import { v2m } from "./vec/vec2/vec2.js";

export class camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.isGrabbed = false;
    this.scale = 0.1;
    this.startPanPos = new vec2(0, 0);
    this.startScalePos = new vec2(0, 0);
    this.c = this.canvas.getContext("2d");
    this.updateSize();
    this.pos = new vec2(0, -canvas.height);

    addEventListener("resize", () => {
      this.updateSize();
    });
  }

  updateSize() {
    let rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.right - rect.left;
    this.canvas.height = rect.bottom - rect.top;
    this.canvas.pos = new vec2(rect.left, rect.top);
  }
  clear() {
    this.c.fillStyle = "rgba(0, 0, 0, 1)";
    this.c.fillRect(0, 0, this.c.canvas.width, this.c.canvas.height);
  }

  toScreen(vec) {
    return v2m.sub(vec, this.pos).mult(this.scale);
  }
  toWorld(vec) {
    return v2m.div(vec, this.scale).add(this.pos);
  }
}
