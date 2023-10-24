import { Drag, GraphOpts } from "./common";
import { add, scale, subtract } from "./math";
import { Point } from "./point";

const INITIAL_DRAG: Drag = {
  start: new Point(0, 0),
  end: new Point(0, 0),
  offset: new Point(0, 0),
  active: false,
};

// represents the view
export class GraphView {
  private canvas: HTMLCanvasElement;
  private _zoom: number = 1;
  private drag: Drag = INITIAL_DRAG;
  private offset: Point;

  readonly height: number;
  readonly width: number;
  readonly center: Point;

  constructor(canvas: HTMLCanvasElement, opts: GraphOpts) {
    this.canvas = canvas;
    this.canvas.style.backgroundColor = opts.backgroundColor;

    // height
    this.height = opts.height;
    this.canvas.height = opts.height;
    this.canvas.style.height = `${opts.height}px`;

    //width
    this.width = opts.width;
    this.canvas.width = opts.width;
    this.canvas.style.width = `${opts.width}px`;

    this.center = new Point(opts.width / 2, opts.height / 2);
    this.offset = scale(this.center, -1);
  }

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d")!;
  }

  public get scale() {
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

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(this.scale, this.scale);
  }
}
