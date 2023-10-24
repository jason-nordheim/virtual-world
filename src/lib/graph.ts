import { drawPoints, drawSegments } from "./draw";
import { Point } from "./Point";
import { Segment } from "./Segment";

/// represents the actual data
export class Graph {
  private canvas: HTMLCanvasElement;

  // state
  private _points: Point[] = [];
  private _segments: Segment[] = [];
  public previouslySelected?: Point;
  public selected?: Point;
  public hovered?: Point;
  public dragging: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  private get ctx() {
    return this.canvas.getContext("2d")!;
  }

  public get points() {
    return this._points;
  }

  public get segments() {
    return this._segments;
  }

  public pointExists(p: Point) {
    for (let i = 0; i < this._points.length; i++) {
      if (this._points[i].equals(p)) {
        return true;
      }
    }
    return false;
  }

  public segmentExists(s: Segment) {
    for (let i = 0; i < this._segments.length; i++) {
      if (this._segments[i].equals(s)) {
        return true;
      }
    }
    return false;
  }

  public addPoint(p: Point) {
    if (this.pointExists(p)) {
      console.warn("point already exists");
    } else {
      this._points.push(p);
    }
  }

  public addSegment(s: Segment) {
    if (!this.pointExists(s.p1) && !this.pointExists(s.p2)) {
      console.warn("Cannot Add Segment: Provided points do not exist");
    } else {
      if (!this.segmentExists(s)) {
        this._segments.push(s);
      } else {
        console.warn("segment already exists");
      }
    }
  }

  public removePoint(p: Point) {
    if (!this.pointExists(p)) {
      console.warn("point does not exist");
    } else {
      // find connected segments
      this._segments = this._segments.filter((s) => !s.includes(p));
      this._points = this._points.filter((gp) => !gp.equals(p));
      if (this.hovered && this.hovered.equals(p)) {
        this.hovered = undefined;
      }
      if (this.selected && this.selected.equals(p)) {
        this.selected = undefined;
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

  public reset() {
    this._points = [];
    this._segments = [];
    this.previouslySelected = undefined;
    this.selected = undefined;
    this.hovered = undefined;
  }

  public clearSelected() {
    this.selected = undefined;
  }

  public draw(mousePosition: Point) {
    this.ctx.save();
    drawSegments(this.ctx, this.segments);
    drawPoints(this.ctx, this.points, mousePosition, this.selected, this.hovered);
    this.ctx.restore();
  }
}
