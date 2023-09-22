import * as tdjge from "./2djsge/2Djsge.js";
import { vec2 } from "./2djsge/vec/vec2/vec2.js";
let canvas = document.querySelector("canvas");
// let world = new tdjge.World(canvas, { panningEnabled: true })
tdjge.newWorld(canvas, { panningEnabled: true });
tdjge.animate();

for (let i = 0; i < 200; i++) {
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
      rad: 700000,
      mass: 400,
      pos: new vec2(i * 100, i * 100),
      showPos: true,
    })
  );
}

tdjge.addBody(
  new tdjge.Circle({
    color: "yellow",
    rad: 700000,
    mass: 99999999,
    pos: new vec2(0, 0),
    showPos: true,
  })
);
tdjge.addBody(
  new tdjge.Circle({
    color: "gray",
    rad: 1700,
    mass: 10000,
    // vel: new vec2(0, -450),
    pos: new vec2(151000000 - 384000, 0),
    // showPos: true,
  })
);
tdjge.addBody(
  new tdjge.Circle({
    color: "blue",
    rad: 6300,
    mass: 10000,
    // mass: 60000,
    pos: new vec2(151000000, 0),
    showPos: true,
  })
);
tdjge.addBody(
  new tdjge.Circle({
    color: "red",
    rad: 70000,
    // mass: 18000000,
    mass: 0,
    pos: new vec2(742000000, 0),
    // showPos: true,
  })
);
