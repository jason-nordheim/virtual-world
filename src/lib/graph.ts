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
    },
    SEGMENT: {
      width: 2,
      color: "black",
    },
  },
};

export class Graph {
  private canvas: HTMLCanvasElement;
  private height: number;
  private width: number;
  private points: Point[] = [];
  private segments: Segment[] = [];

  constructor(canvas: HTMLCanvasElement, opts: GraphOpts = DEFAULTS.GRAPH) {
    this.canvas = canvas;
    this.height = opts.height;
    this.width = opts.width;
    this.canvas.width = opts.width;
    this.canvas.height = opts.height;
    this.canvas.style.backgroundColor = opts.backgroundColor;
    this.canvas.style.width = `${opts.width}px`;
    this.canvas.style.height = `${opts.height}px`;
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

  private drawPoint(p: Point, opts: PointDrawOptions = DEFAULTS.DRAW.POINT) {
    const rad = opts.size / 2;
    this.ctx.beginPath();
    this.ctx.fillStyle = opts.color;
    this.ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawSegment(s: Segment, opts: SegmentDrawOptions = DEFAULTS.DRAW.SEGMENT) {
    this.ctx.beginPath();
    this.ctx.lineWidth = opts.width;
    this.ctx.strokeStyle = opts.color;
    this.ctx.moveTo(s.p1.x, s.p1.y);
    this.ctx.lineTo(s.p2.x, s.p2.y);
    this.ctx.stroke();
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
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

  public display() {
    this.clear();
    for (let i = 0; i < this.points.length; i++) {
      this.drawPoint(this.points[i]);
    }
    for (let i = 0; i < this.segments.length; i++) {
      this.drawSegment(this.segments[i]);
    }
  }
}
