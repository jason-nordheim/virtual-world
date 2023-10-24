import { Drag } from "./Drag";
import { GraphOpts } from "./common";
import { add, clamp, scale, subtract } from "./math";
import { Point } from "./Point";

const ZOOM_STEP = 0.1;
const ZOOM_MAX = 5;
const ZOOM_MIN = 1;

export type SerializedGraphView = {
  drag: Drag;
  zoom: number;
  offset: Point;
};

// represents the view
export class GraphView {
  public drag: Drag = new Drag();
  private canvas: HTMLCanvasElement;
  private _zoom: number = 1;
  public offset: Point;

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

    this.canvas.addEventListener("wheel", (evt) => {
      const direction = Math.sign(evt.deltaY);
      const val = this._zoom + direction * ZOOM_STEP;
      this._zoom = clamp(val, ZOOM_MIN, ZOOM_MAX);
    });
  }

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d")!;
  }

  private getScale() {
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

  public getOffsetWithDrag() {
    return add(this.offset, this.drag.offset);
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public save() {
    this.ctx.save();
  }

  public update() {
    const s = this.getScale();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(s, s);
    const offset = this.getOffsetWithDrag();
    this.ctx.translate(offset.x, offset.y);
  }

  public resetDrag() {
    this.drag = new Drag();
  }

  public restore() {
    this.ctx.restore();
  }

  public serialize() {
    return {
      drag: this.drag,
      zoom: this._zoom,
      offset: this.offset,
    };
  }

  public deserialize(data: SerializedGraphView) {
    this._zoom = data.zoom;
    this.drag = data.drag;
    this.offset = data.offset;
  }

  // public reset() {
  //   this.ctx.restore();
  //   this.ctx.clearRect(0, 0, this.width, this.height);
  //   this.ctx.save();
  //   this.ctx.translate(this.center.x, this.center.y);
  //   this.ctx.scale(this.scale, this.scale);
  // }
}
