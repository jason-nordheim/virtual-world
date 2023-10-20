import { Point, Segment } from "../lib";

export const drawPoint = (ctx: CanvasRenderingContext2D, point: Point, size = 18, color = "black") => {
  const radius = size / 2;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
};

export const drawSegment = (ctx: CanvasRenderingContext2D, segment: Segment, width = 2, color = " black") => {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.moveTo(segment.p1.x, segment.p1.y);
  ctx.lineTo(segment.p2.x, segment.p2.y);
  ctx.stroke();
};
