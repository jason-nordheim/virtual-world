import { Point } from "./Point";

export const scale = (p: Point, scalar: number) => new Point(p.x * scalar, p.y * scalar);

export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export const subtract = (p1: Point, p2: Point) => new Point(p1.x - p2.x, p1.y - p2.y);

export const add = (p1: Point, p2: Point) => new Point(p1.x + p2.x, p1.y + p2.y);

export const distance = (p1: Point, p2: Point): number => Math.hypot(p1.x - p2.x, p1.y - p2.y);

export const getNearestPoint = (p: Point, allPoints: Point[], threshold: number = Number.MAX_SAFE_INTEGER) => {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let nearest: Point | undefined = undefined;
  for (let i = 0; i < allPoints.length; i++) {
    const d = distance(p, allPoints[i]);
    if (d < minDistance && d < threshold) {
      minDistance = d;
      nearest = allPoints[i];
    }
  }

  return nearest;
};
