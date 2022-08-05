import { World } from "./worldtypes/2d.js";
export { World } from "./worldtypes/2d.js";
export { Circle } from "./bodies/circle.js";
import { vec2 } from "./vec/vec2/vec2.js";
import * as v2m from "./vec/vec2/vec2math.js";
var world;
var cam;
var cursor;
export function newWorld(canvas) {
  world = new World(canvas, { panningEnabled: true });
  cam = world.cam;
  cursor = world.cursor;
}

export function addBody(body) {
  world.bodies.push(body);
}

addEventListener("mousedown", (e) => {
  if (e.button == 0) {
    let bodiesOnCursor = world.bodiesOnCursor();
    if (!bodiesOnCursor.length) {
    } else {
      cursor.grabbedBody.body =
        bodiesOnCursor[
          bodiesOnCursor
            .map((object) => {
              return object.distance;
            })
            .indexOf(
              Math.min.apply(
                null,
                bodiesOnCursor.map((object) => {
                  return object.distance;
                })
              )
            )
        ].body;
      cursor.grabbedBody.body.isGrabbed = true;
      cursor.grabbedBody.offset = new vec2(
        v2m.sub(cursor.grabbedBody.body.pos, cam.toWorld(cursor.pos))
      );
      addEventListener("mouseup", mup2);
      function mup2(e) {
        if (e.button == 0 || e.buttons == 4) {
          cursor.grabbedBody.body.isGrabbed = false;
          removeEventListener("mouseup", mup2, false);
        }
      }
    }
  }

  if (e.button == 1) {
    e.preventDefault();
    cam.isGrabbed = true;
    cursor.startPanPos = cursor.pos;
    cam.startPanPos = cam.pos;
    addEventListener("mouseup", mup);
  }

  function mup(e) {
    if (e.button == 1 || e.buttons == 1) {
      cam.isGrabbed = false;
      removeEventListener("mouseup", mup, false);
    }
  }
});

export function animate() {
  cam.updateSize();
  requestAnimationFrame(animate);
  world.update();
  world.draw();
}
