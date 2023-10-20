export type Point = {
  x: number;
  y: number;
};

export const isSamePoint = (p1: Point, p2: Point) => {
  return p1.x === p2.x && p1.y === p2.y;
};

export const pointExists = (point: Point, existingPoints: Point[]): boolean => {
  const idx = existingPoints.findIndex(({ x, y }) => x == point.x && y == point.y);
  return idx !== -1;
};

export const generateRandomPoint = (height: number, width: number): Point => {
  const x = Math.random() * height;
  const y = Math.random() * width;
  return { x, y };
};
