import * as v2m from "./vec2math.js";
export * as v2m from "./vec2math.js";
export class vec2 {
  constructor(a, b) {
    if (typeof a == "object") {
      this.x = a.x;
      this.y = a.y;
    } else {
      this.x = a;
      this.y = b;
    }
  }

  set(a, b) {
    if (typeof a == "object") {
      a.copy();
      this.x = a.x;
      this.y = a.y;
    } else {
      this.x = a;
      this.y = b;
    }
    return this;
  }

  add(a, b) {
    if (typeof a == "object") this.set(v2m.add(this, a));
    else this.set(v2m.add(this, new vec2(a, b)));
    return this;
  }

  sub(a, b) {
    if (typeof a == "object") this.set(v2m.sub(this, a));
    else this.set(v2m.sub(this, new vec2(a, b)));
    return this;
  }

  mult(a) {
    return this.set(v2m.mult(this, a));
  }

  div(a) {
    return this.set(v2m.div(this, a));
  }

  limit(num) {
    if (this.mag() > num) this.setMag(num);
    return this;
  }

  min(num) {
    if (this.mag() < num) this.setMag(num);
    return this;
  }

  constrain(num1, num2) {
    if (this.mag() != 0) {
      this.limit(num2);
      this.min(num1);
    }
    return this;
  }

  mag() {
    return v2m.mag(this);
  }

  setMag(num) {
    return this.set(v2m.setMag(this, num));
  }

  copy() {
    return v2m.copy(this, new vec2()); //updated
  }

  toString() {
    return "vec2 {x: " + this.x + ", y:" + this.y + "}";
  }

  round(num) {
    this.x = Number(this.x.toFixed(num));
    this.y = Number(this.y.toFixed(num));
    return this;
  }

  draw(pos, c, scale) {
    c.lineWidth = 1;
    c.strokeStyle = "rgba(255, 255, 255, 1)";
    c.beginPath();
    c.moveTo(pos.x, pos.y);
    c.lineTo(pos.x + this.x * scale, pos.y + this.y * scale);
    c.stroke();
  }

  distanceTo(vec) {
    return v2m.sub(this, vec).mag();
  }

  addComp() {
    return v2m.addComp(this);
  }

  addAbsComp() {
    return v2m.addAbsComp(this);
  }

  unit() {
    return this.set(v2m.unit(this));
  }

  toInt() {
    return new vec2(this.x | 0, this.y | 0);
  }
}
