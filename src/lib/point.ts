export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(p: Point): boolean {
    if (p.x === this.x && p.y === this.y) return true;
    return false;
  }
}
