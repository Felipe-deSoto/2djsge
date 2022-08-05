import { vec2 } from "./vec/vec2/vec2.js"
import { v2m } from "./vec/vec2/vec2.js"
export class Cursor
{
    constructor()
    {
        this.pos = new vec2(0, 0);
        this.startPanPos = new vec2(0, 0);
        this.startScalePos = new vec2(0, 0);
        this.grabbedBody = {
            body: undefined,
            offset: new vec2(0, 0)
        };
    }

}