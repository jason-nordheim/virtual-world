export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Segment {
  p1: Point;
  p2: Point;
  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }
}

export class Graph {
  private canvas: HTMLCanvasElement;
  private points: Point[] = [];
  private segements: Segment[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
}
