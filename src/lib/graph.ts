import { getNearestPoint } from "./graph.utils";
import { Point } from "./point";
import { Segment } from "./segment";

export type GraphOpts = {
  height: number;
  width: number;
  backgroundColor: string;
};

export type PointDrawOptions = {
  size: number;
  color: string;
  outline: boolean;
  fill: boolean;
};

export type SegmentDrawOptions = {
  width: number;
  color: string;
  dash: [number, number];
};

const DEFAULTS = {
  GRAPH: {
    height: 600,
    width: 600,
    backgroundColor: "green",
  },
  DRAW: {
    POINT: {
      size: 18,
      color: "black",
      outline: false,
      fill: false,
    },
    SEGMENT: {
      width: 2,
      color: "black",
      dash: [],
    },
  },
};

type GraphMode = "add" | "remove";

export class Graph {
  private canvas: HTMLCanvasElement;
  private height: number;
  private width: number;

  // state
  private points: Point[] = [];
  private segments: Segment[] = [];
  private previouslySelected?: Point;
  private selected?: Point;
  private hovered?: Point;
  private mode: GraphMode = "add";
  private dragging: boolean = false;
  private mouse: Point = new Point(0, 0);
  private _zoom: number = 1;
  private _zoomScale: number = 0.1;

  constructor(canvas: HTMLCanvasElement, opts: GraphOpts = DEFAULTS.GRAPH) {
    this.canvas = canvas;
    this.height = opts.height;
    this.width = opts.width;
    this.canvas.width = opts.width;
    this.canvas.height = opts.height;
    this.canvas.style.backgroundColor = opts.backgroundColor;
    this.canvas.style.width = `${opts.width}px`;
    this.canvas.style.height = `${opts.height}px`;

    // add event listeners
    this.canvas.addEventListener("mousedown", (evt) => this.handleMouseDown(evt));
    this.canvas.addEventListener("mousemove", (evt) => this.handleMouseMove(evt));
    this.canvas.addEventListener("mouseup", () => this.handleMouseUp());
    this.canvas.addEventListener("contextmenu", (evt) => this.handleRightClick(evt));
    if (document) {
      document.addEventListener("wheel", (evt) => {
        const sign = Math.sign(evt.deltaY);
        this._zoom = Math.max(1, Math.min(5, this._zoom + this._zoom * sign * this._zoomScale));
      });
    }
  }

  private dispose() {
    this.canvas.removeEventListener("mousedown", (evt) => this.handleMouseDown(evt));
    this.canvas.removeEventListener("mousemove", (evt) => this.handleMouseMove(evt));
    this.canvas.removeEventListener("mouseup", () => this.handleMouseUp());
    this.canvas.removeEventListener("contextmenu", (evt) => this.handleRightClick(evt));
  }

  private get ctx() {
    return this.canvas.getContext("2d")!;
  }

  private handleRightClick(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.clearSelected();
  }

  private handleMouseUp() {
    this.dragging = false;
  }

  private handleMouseDown(evt: MouseEvent) {
    if (evt.button !== 0) return;

    if (this.mode === "add") {
      this.dragging = true;
      this.hovered = getNearestPoint(this.mouse, this.points, 10);

      if (this.hovered) {
        this.select(this.hovered);
        return;
      }

      this.addPoint(this.mouse);
      this.select(this.mouse);
    }

    if (this.mode === "remove") {
      const nearest = getNearestPoint(this.mouse, this.points);
      if (nearest) {
        this.removePoint(nearest);
      }
    }
  }

  private handleMouseMove(evt: MouseEvent) {
    this.mouse = new Point(evt.offsetX, evt.offsetY);
    this.hovered = getNearestPoint(this.mouse, this.points, 10);

    if (this.dragging && this.selected) {
      this.selected.x = evt.offsetX;
      this.selected.y = evt.offsetY;
    }
  }

  private pointExists(p: Point) {
    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i].equals(p)) {
        return true;
      }
    }
    return false;
  }

  private segmentExists(s: Segment) {
    for (let i = 0; i < this.segments.length; i++) {
      if (this.segments[i].equals(s)) {
        return true;
      }
    }
    return false;
  }

  private drawPoint(p: Point, opts?: Partial<PointDrawOptions>) {
    const completeOpts = { ...DEFAULTS.DRAW.POINT, ...opts };
    const rad = completeOpts.size / 2;
    this.ctx.beginPath();
    this.ctx.fillStyle = completeOpts.color;
    this.ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
    this.ctx.fill();

    if (completeOpts.outline) {
      const outlineRad = rad * 0.6;
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "yellow";
      this.ctx.arc(p.x, p.y, outlineRad, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    if (completeOpts.fill) {
      const outlineRad = rad * 0.6;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, outlineRad, 0, Math.PI * 2);
      this.ctx.fillStyle = "yellow";
      this.ctx.fill();
    }
  }

  private drawSegment(s: Segment, opts?: Partial<SegmentDrawOptions>) {
    const completeOpts = { ...DEFAULTS.DRAW.SEGMENT, ...opts };
    this.ctx.beginPath();
    this.ctx.lineWidth = completeOpts.width;
    this.ctx.strokeStyle = completeOpts.color;
    this.ctx.setLineDash(completeOpts.dash);
    this.ctx.moveTo(s.p1.x, s.p1.y);
    this.ctx.lineTo(s.p2.x, s.p2.y);
    this.ctx.stroke();
    this.ctx.setLineDash([]); // reset
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public setMode(mode: GraphMode) {
    this.mode = mode;
  }

  public addPoint(p: Point) {
    if (this.pointExists(p)) {
      console.warn("point already exists");
    } else {
      this.points.push(p);
    }
  }

  public addSegment(s: Segment) {
    if (!this.pointExists(s.p1) && !this.pointExists(s.p2)) {
      console.warn("Cannot Add Segment: Provided points do not exist");
    } else {
      if (!this.segmentExists(s)) {
        this.segments.push(s);
      } else {
        console.warn("segment already exists");
      }
    }
  }

  private removePoint(p: Point) {
    if (!this.pointExists(p)) {
      console.warn("point does not exist");
    } else {
      // find connected segments
      this.segments = this.segments.filter((s) => !s.includes(p));
      this.points = this.points.filter((gp) => !gp.equals(p));
      if (this.hovered && this.hovered.equals(p)) {
        this.hovered = undefined;
      }
      if (this.selected && this.selected.equals(p)) {
        this.selected = undefined;
      }
    }
  }

  private updateViewport() {
    const scale = 1 / this._zoom;
    this.ctx.scale(scale, scale);
  }

  private drawSegments() {
    for (let i = 0; i < this.segments.length; i++) {
      this.drawSegment(this.segments[i]);
    }
  }

  private drawPoints() {
    for (let i = 0; i < this.points.length; i++) {
      if (this.selected && this.points[i].equals(this.selected)) {
        // snapping logic
        const intent = new Segment(this.selected, this.hovered || this.mouse);
        this.drawSegment(intent, { color: "yellow", dash: [2, 2] });
        this.drawPoint(this.points[i], { outline: true });
      } else if (this.hovered && this.points[i].equals(this.hovered)) {
        this.drawPoint(this.points[i], { fill: true });
      } else {
        this.drawPoint(this.points[i]);
      }
    }
  }

  public select(point: Point) {
    this.previouslySelected = this.selected;
    this.selected = point;
    if (this.selected && this.previouslySelected) {
      const s = new Segment(this.previouslySelected, this.selected);
      this.addSegment(s);
    }
  }

  public clearSelected() {
    this.selected = undefined;
  }

  public display() {
    this.clear();
    this.ctx.save();
    this.updateViewport();
    this.drawSegments();
    this.drawPoints();
    this.ctx.restore();
    this.ctx.restore();
  }
}
