export function add(vec1, vec2) {
  vec1 = vec1.copy();
  vec1.x += vec2.x;
  vec1.y += vec2.y;
  return vec1;
}

export function sub(vec1, vec2) {
  vec1 = vec1.copy();
  vec1.x -= vec2.x;
  vec1.y -= vec2.y;
  return vec1;
}
export function div(a, b) {
  a = a.copy();
  if (typeof b == "object") {
    a.x /= b.x;
    a.y /= b.y;
  } else {
    if (b != 0) {
      a.x /= b;
      a.y /= b;
    }
  }
  return a;
}
export function mult(a, b) {
  if (typeof a == "object") a = a.copy();
  if (typeof b == "object") {
    (a.x *= b.x), (a.y *= b.y);
  } else {
    if (typeof a == "object") {
      a.x *= b;
      a.y *= b;
    }
  }
  return a;
}

export function limit(vec, num) {
  if (mag(vec) > num) return setMag(vec, num);
  else return vec;
}

export function min(vec, num) {
  if (mag(vec) < num) return setMag(vec, num);
  else return vec;
}

export function mag(vec) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export function setMag(vec, num) {
  vec = vec.copy();
  vec = div(vec, mag(vec));
  vec = mult(vec, num);
  return vec;
}

export function addComp(vec) {
  return vec.x + vec.y;
}

export function addAbsComp(vec) {
  return Math.abs(vec.x) + Math.abs(vec.y);
}

export function unit(vec) {
  vec.copy();
  if (vec.mag() == 0) {
    return vec;
  } else {
    return div(vec, vec.mag());
  }
}

export function copy(vec1, vec2) {
  vec2.x = vec1.x;
  vec2.y = vec1.y;
}
