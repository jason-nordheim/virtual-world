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
  private selected?: Point;
  private hovered?: Point;
  private mode: GraphMode = "add";

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
    this.canvas.addEventListener("mousedown", (evt) => {
      if (this.mode === "add") {
        const p = new Point(evt.offsetX, evt.offsetY);
        this.hovered = getNearestPoint(p, this.points, 10);
        if (this.hovered) {
          this.selected = this.hovered;
          return;
        }
        this.addPoint(p);
        this.selected = p;
      }

      if (this.mode === "remove") {
        const p = new Point(evt.offsetX, evt.offsetY);
        const nearest = getNearestPoint(p, this.points);
        if (nearest) {
          this.removePoint(nearest);
        }
      }
    });

    this.canvas.addEventListener("mousemove", (evt) => {
      const p = new Point(evt.offsetX, evt.offsetY);
      this.hovered = getNearestPoint(p, this.points, 10);
    });
  }

  private get ctx() {
    return this.canvas.getContext("2d")!;
  }

  private getRandomX() {
    return Math.floor(Math.random() * this.height);
  }

  private getRandomY() {
    return Math.floor(Math.random() * this.width);
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
    this.ctx.moveTo(s.p1.x, s.p1.y);
    this.ctx.lineTo(s.p2.x, s.p2.y);
    this.ctx.stroke();
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
    }
  }

  public display() {
    this.clear();
    for (let i = 0; i < this.points.length; i++) {
      if (this.selected && this.points[i].equals(this.selected)) {
        this.drawPoint(this.points[i], { outline: true });
      } else if (this.hovered && this.points[i].equals(this.hovered)) {
        this.drawPoint(this.points[i], { fill: true });
      } else {
        this.drawPoint(this.points[i]);
      }
    }
    for (let i = 0; i < this.segments.length; i++) {
      this.drawSegment(this.segments[i]);
    }
  }
}