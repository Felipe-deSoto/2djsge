import * as tdjge from "./2djsge/2Djsge.js";
import { vec2 } from "./2djsge/vec/vec2/vec2.js";
let canvas = document.querySelector("canvas");
// let world = new tdjge.World(canvas, { panningEnabled: true })
tdjge.newWorld(canvas);
tdjge.animate();

for (let i = 0; i < 6; i++) {
  tdjge.addBody(
    new tdjge.Circle({
      color:
        "rgb(" +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        ")",
      rad: 400,
      mass: i * 400,
      pos: new vec2(6200 * i, -800 * i),
      showPos: true,
    })
  );
}
