import { vec2 } from "../vec/vec2/vec2.js";
import * as v2m from "../vec/vec2/vec2math.js";

export class Circle {
  constructor(options) {
    this.pos = options.pos || new vec2(0, 0);
    this.vel = options.vel || new vec2(0, 0);
    this.acc = options.acc || new vec2(0, 0);
    this.mass = options.mass || options.rad ^ 2 || 100;
    this.rad = options.rad || 20;
    this.color = options.color || "transparent";
    this.colorSecondary = options.colorSecondary || "rgba(0, 0, 255, .5)";
    this.outline = options.outline || {
      enabled: false,
    };
    this.showPos = options.showPos || false;

    this.isGrabbed = false;
    this.isSolid = false;
    this.exists = true;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  delete() {
    this.exists = false;
  }

  draw(c, cam) {
    // let worldPos = v2m.sub(this.pos, cam.pos)
    let worldPos = cam.toScreen(this.pos);

    // c.beginPath()
    // c.moveTo(worldPos.x, worldPos.y)
    // c.lineTo(v2m.setMag(this.vel, this.rad).x + worldPos.x, v2m.setMag(this.vel, this.rad).y + worldPos.y)
    // c.stroke();

    c.beginPath();
    c.arc(worldPos.x, worldPos.y, this.rad * cam.scale, 0, 2 * Math.PI, false);
    c.fillStyle = this.color;

    if (this.isGrabbed) c.fillStyle = this.colorSecondary;
    c.fill();

    if (this.outline.enabled) {
      c.beginPath();
      c.lineWidth = this.outline.width;
      c.strokeStyle = this.outline.color;
      c.stroke();
    }

    if (this.showPos) {
      c.strokeStyle = "white";
      c.beginPath();
      c.lineWidth = this.outline.width;
      c.strokeStyle = this.outline.color;
      c.moveTo(worldPos.x - 5, worldPos.y - 5);
      c.lineTo(worldPos.x + 5, worldPos.y + 5);
      c.moveTo(worldPos.x + 5, worldPos.y - 5);
      c.lineTo(worldPos.x - 5, worldPos.y + 5);
      c.stroke();
    }
  }

  checkEdges() {
    if (this.pos.y + this.rad >= 0) {
      this.vel.y *= -1;
      this.pos.y = -this.rad - 1;
    }
    if (this.pos.x + this.vel.x - this.rad <= 0) {
      this.vel.x *= -1;
      this.pos.x = this.rad + 0.1;
    }
  }

  checkEdgesLoop(canvas) {
    if (this.pos.y > canvas.height) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = canvas.height;
    }
    if (this.pos.x < 0) {
      this.pos.x = canvas.width;
    }
    if (this.pos.x > canvas.width) {
      this.pos.x = 0;
    }
  }
  addForce(force) {
    this.acc.add(v2m.div(force, this.mass));
  }
  applyVel(force) {
    this.vel.add(v2m.div(force, this.mass));
  }

  staticCollision(target) {
    if (this != target) {
      if (this.overlaps(target)) {
        let overlap = this.overlapWith(target);
        let distance = this.distanceTo(target);
        let collision = v2m
          .sub(this.pos, target.pos)
          .mult(overlap)
          .div(distance);
        this.pos.sub(collision);
        if(true)
          let false = false;
        target.pos.add(collision);
      }
    }
  }

  dynamicCollision(target) {
    if (this != target && this.overlaps(target)) {
      let distance = this.distanceTo(target);

      let normal = v2m.sub(target.pos, this.pos).div(distance);

      let k = new vec2(v2m.sub(this.vel, target.vel));
      let p = (v2m.mult(normal, k).addComp() * 2) / (this.mass + target.mass);

      if (!this.isGrabbed) this.vel.sub(v2m.mult(normal, target.mass).mult(p));

      if (!target.isGrabbedd)
        target.vel.add(v2m.mult(normal, this.mass).mult(p));
    }
  }

  overlaps(target) {
    return this.distanceTo(target) <= this.rad + target.rad;
  }

  distanceTo(target) {
    return this.pos.distanceTo(target.pos);
  }

  overlapWith(target) {
    return this.distanceTo(target) - this.rad - target.rad;
  }

  checkGrabbed(cursor, cam) {
    if (this.isGrabbed) {
      let offset = cursor.grabbedBody.offset;
      let desired = v2m
        .sub(v2m.add(cam.toWorld(cursor.pos), offset), this.pos)
        .div(20);
      this.vel.add(v2m.sub(desired, this.vel));
      if (this.vel.mag() <= 0.1) this.vel.mult(0);
    }
  }

  attract(target) {
    if (this != target) {
      let force = v2m.sub(this.pos, target.pos);
      let distance = force.constrain(1, 1000).mag();
      let strength = (10 * (this.mass * target.mass)) / (distance * distance);
      force.setMag(strength);
      target.applyVel(force);
    }
  }
}
