import { camera } from "../camera.js";
import { Cursor } from "../cursor.js";
import { vec2 } from "../vec/vec2/vec2.js";
import * as v2m from "../vec/vec2/vec2math.js";
export class World {
  constructor(canvas, options) {
    this.pos = new vec2(0, 0);
    let cam = (this.cam = new camera(canvas));
    let cursor = (this.cursor = new Cursor());
    //this.offset1;
    this.bodies = [];
    this.gravity = options.gravity || new vec2(0, 0);
    this.panningEnabled = false;
    if (options) {
      if (options.panningEnabled) this.panningEnabled = options.panningEnabled;
    }

    addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    addEventListener("wheel", (e) => {
      cursor.startScalePos = cam.toWorld(cursor.pos);
      cam.startScalePos = cam.pos;
      cam.clear();
      if (e.wheelDeltaY > 0 && cam.scale < 200)
        cam.scale = Math.min(cam.scale * 1.1, 200);
      if (e.wheelDeltaY < 0) cam.scale *= 0.8;

      let offset = v2m.sub(cursor.startScalePos, cam.toWorld(cursor.pos));
      let desiredPos = v2m.add(cam.pos, offset);
      cam.pos = desiredPos;
    });

    addEventListener("mousemove", (e3) => {
      this.cursor.pos = v2m
        .sub(canvas.pos, new vec2(e3.pageX, e3.pageY))
        .mult(-1);
    });
  }

  add(bodies) {
    bodies.forEach((body) => {
      this.bodies.push(body);
    });
  }

  update() {
    let cam = this.cam;
    let bodies = this.bodies;
    let cursor = this.cursor;
    if (cam.isGrabbed && this.panningEnabled) {
      let offset = v2m.sub(
        cam.toWorld(cursor.startPanPos).sub(cam.pos),
        cam.toWorld(cursor.pos).sub(cam.pos)
      );
      let desiredPos = v2m.add(cam.startPanPos, offset);
      cam.pos = desiredPos;
    }
    bodies.forEach((body) => {
      body.update();
      bodies.forEach((target) => {
        body.dynamicCollision(target);
        body.staticCollision(target);
        body.attract(target);
      });
      // body.checkEdges();
    });
    if (cursor.grabbedBody.body)
      cursor.grabbedBody.body.checkGrabbed(cursor, this.cam);
  }

  draw() {
    let bodies = this.bodies;
    let cam = this.cam;
    let c = cam.c;
    cam.clear();

    // this.drawAxis(cam);
    // this.drawGrid(cam, 1000);

    bodies.forEach((body) => {
      body.draw(c, cam);
    });

    if (
      this.cursor.grabbedBody.body &&
      this.cursor.grabbedBody.body.isGrabbed
    ) {
      this.cursor.grabbedBody.offset.draw(
        this.cursor.pos,
        this.cam.c,
        this.cam.scale
      );
      v2m
        .sub(
          v2m.add(cam.toWorld(this.cursor.pos), this.cursor.grabbedBody.offset),
          this.cursor.grabbedBody.body.pos
        )
        .draw(
          this.cam.toScreen(this.cursor.grabbedBody.body.pos),
          this.cam.c,
          this.cam.scale
        );
    }
    c.fillStyle = "white";
    c.font = "30px Consolas";
    c.fillText(
      cam.toWorld(this.cursor.pos).toInt().x.toString().padStart(25, " "),
      10,
      0 + 35
    );
    c.fillText(
      cam.toWorld(this.cursor.pos).toInt().y.toString().padStart(25, " "),
      10,
      0 + 35 * 2
    );
  }

  bodiesOnCursor() {
    let cursor = this.cursor;
    let cam = this.cam;
    let bodiesOnCursor = [];
    this.bodies.forEach((body) => {
      // if (cam.toWorld(cursor.pos).distanceTo(body.pos) <= body.rad) {
      bodiesOnCursor.push({
        body: body,
        distance: cam.toWorld(cursor.pos).distanceTo(body.pos),
      });
      // }
    });
    return bodiesOnCursor;
  }

  drawAxis(cam) {
    let c = cam.c;
    let posTemp = cam.toScreen(this.pos);
    c.fillStyle = "white";
    c.lineWidth = 2;
    c.strokeStyle = "white";
    let dashLength = 10;
    c.setLineDash([dashLength, dashLength]);
    c.beginPath();

    //TOP
    if (
      posTemp.y > 0 &&
      posTemp.x > 0 &&
      posTemp.x < cam.canvas.width /*   */
    ) {
      c.moveTo(posTemp.x, Math.max(posTemp.y, posTemp.y % (2 * dashLength)));
      c.lineTo(posTemp.x, 0);
    }

    //BOTTOM
    if (
      posTemp.y < cam.canvas.height &&
      posTemp.x > 0 &&
      posTemp.x < cam.canvas.width
    ) {
      c.moveTo(posTemp.x, Math.max(posTemp.y, posTemp.y % (2 * dashLength)));
      c.lineTo(posTemp.x, c.canvas.height);
    }

    //LEFT
    if (
      posTemp.x > 0 &&
      posTemp.y < cam.canvas.height &&
      posTemp.y > 0 /*   */
    ) {
      c.moveTo(posTemp.x, posTemp.y);
      c.lineTo(0, posTemp.y);
    }

    //RIGHT
    if (
      posTemp.x < cam.canvas.width &&
      posTemp.y < cam.canvas.height &&
      posTemp.y > 0
    ) {
      c.moveTo(posTemp.x, posTemp.y);
      c.lineTo(c.canvas.width, posTemp.y);
    }

    c.stroke();
    c.setLineDash([1, 0]);
  }

  drawGrid(cam, step) {
    let x = Math.max(Math.floor(0.06 / cam.scale), 1);
    step = step * cam.scale;
    let c = cam.c;
    let posTemp = cam.toScreen(this.pos);
    c.lineWidth = 1;
    c.strokeStyle = "hsla(0, 0%, 100%, 0.5)";
    c.setLineDash([1, 0]);
    c.beginPath();

    //// Vertical Right
    if (posTemp.x < cam.canvas.width) {
      for (let i = posTemp.x + step; i < cam.canvas.width; i += step) {
        c.moveTo(i, c.canvas.height);
        c.lineTo(i, 0);
      }
    }

    //// Vertical Left
    if (posTemp.x > 0) {
      for (let i = posTemp.x - step; i > 0; i -= step) {
        c.moveTo(i, c.canvas.height);
        c.lineTo(i, 0);
      }
    }

    //// Horizontal Bottom
    if (posTemp.y < cam.canvas.height) {
      for (let i = posTemp.y + step; i < cam.canvas.height; i += step) {
        c.moveTo(0, i);
        c.lineTo(c.canvas.width, i);
      }
    }

    //// Horizontal Top
    if (posTemp.y > 0) {
      for (let i = posTemp.y - step; i > 0; i -= step) {
        c.moveTo(0, i);
        c.lineTo(c.canvas.width, i);
      }
    }

    c.stroke();
  }
}
