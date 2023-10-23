import { Point } from "./point";

export class Segment {
  p1: Point;
  p2: Point;
  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }

  includes(p: Point) {
    return p.equals(this.p1) || p.equals(this.p2);
  }

  equals(s: Segment) {
    return this.includes(s.p1) && this.includes(s.p2);
  }
}
