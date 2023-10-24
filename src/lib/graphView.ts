import { Drag } from "./common";
import { getPosition } from "./helpers";
import { add, scale, subtract } from "./math";
import { Point } from "./point";

const INITIAL_DRAG: Drag = {
  start: new Point(0, 0),
  end: new Point(0, 0),
  offset: new Point(0, 0),
  active: false,
};

class GraphView {
  private canvas: HTMLCanvasElement;
  private mouse: Point = new Point(0, 0);
  private _zoom: number = 1;
  private drag: Drag = INITIAL_DRAG;
  private offset: Point;

  readonly height: number;
  readonly width: number;
  readonly center: Point;

  constructor(canvas: HTMLCanvasElement, height: number, width: number) {
    this.canvas = canvas;
    this.height = height;
    this.width = width;
    this.center = new Point(width / 2, height / 2);
    this.offset = scale(this.center, -1);

    document.addEventListener("mousemove", (evt) => {
      if (this.drag.active && this.drag.start === INITIAL_DRAG.start) {
        this.drag.start = getPosition(evt, this._zoom);
      } else if (this.drag.active) {
        this.drag.end = getPosition(evt, this._zoom);
        this.drag.offset = subtract(this.drag.end, this.drag.start);
      }
    });
    document.addEventListener("keydown", (evt) => {
      if (evt.metaKey) {
        this.drag.active = true;
      }
    });
    document.addEventListener("keyup", (evt) => {
      if (evt.metaKey) {
        this.drag.active = false;
      }
    });
    document.addEventListener("wheel", (evt) => {});
  }

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d")!;
  }

  private get scale() {
    return 1 / this.zoom;
  }

  public get zoom() {
    return this._zoom;
  }

  public getMousePosition(evt: MouseEvent, subtractOffset = false) {
    const p = new Point(
      (evt.offsetX - this.center.x) * this._zoom - this.offset.x,
      (evt.offsetY - this.center.y) * this._zoom - this.offset.y
    );
    return subtractOffset ? subtract(p, this.drag.offset) : p;
  }

  public getOffset() {
    return add(this.offset, this.drag.offset);
  }

  public reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(this.scale, this.scale);
  }
}
