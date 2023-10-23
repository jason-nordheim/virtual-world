import { Point } from "./point";

const getDistance = (p1: Point, p2: Point): number => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
};

export const getNearestPoint = (p: Point, allPoints: Point[], threshold: number = Number.MAX_SAFE_INTEGER) => {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let nearest: Point | undefined = undefined;
  for (let i = 0; i < allPoints.length; i++) {
    const d = getDistance(p, allPoints[i]);
    if (d < minDistance && d < threshold) {
      minDistance = d;
      nearest = allPoints[i];
    }
  }

  return nearest;
};
