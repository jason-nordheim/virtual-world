import { Point } from "./point";

export type Segment = {
  p1: Point;
  p2: Point;
};

export const segmentIncludesPoint = (segment: Segment, point: Point): boolean => {
  return [segment.p1, segment.p2].includes(point);
};

export const isSameSegment = (s1: Segment, s2: Segment) => {
  if (segmentIncludesPoint(s2, s1.p1) && segmentIncludesPoint(s2, s1.p2)) {
    return true;
  }
  return false;
};

export const segmentExists = (segment: Segment, existingSegments: Segment[]) => {
  for (const s of existingSegments) {
    if (isSameSegment(s, segment)) return true;
  }
  return false;
};

export const generateRandomSegment = (existingPoints: Point[]): Segment => {
  const idxA = Math.floor(Math.random() * existingPoints.length);
  let idxB = Math.floor(Math.random() * existingPoints.length);
  while (idxB === idxA) {
    idxB = Math.floor(Math.random() * existingPoints.length);
  }

  return { p1: existingPoints[idxA], p2: existingPoints[idxB] };
};
