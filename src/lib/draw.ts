import { Segment } from ".";
import { DEFAULTS, PointDrawOptions, SegmentDrawOptions } from "./common";
import { Point } from "./point";

export const drawPoint = (ctx: CanvasRenderingContext2D, p: Point, opts?: Partial<PointDrawOptions>) => {
  const completeOpts = { ...DEFAULTS.DRAW.POINT, ...opts };
  const rad = completeOpts.size / 2;
  ctx.beginPath();
  ctx.fillStyle = completeOpts.color;
  ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
  ctx.fill();

  if (completeOpts.outline) {
    const outlineRad = rad * 0.6;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";
    ctx.arc(p.x, p.y, outlineRad, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (completeOpts.fill) {
    const outlineRad = rad * 0.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, outlineRad, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
};

export const drawSegment = (ctx: CanvasRenderingContext2D, s: Segment, opts?: Partial<SegmentDrawOptions>) => {
  const completeOpts = { ...DEFAULTS.DRAW.SEGMENT, ...opts };
  ctx.beginPath();
  ctx.lineWidth = completeOpts.width;
  ctx.strokeStyle = completeOpts.color;
  ctx.setLineDash(completeOpts.dash);
  ctx.moveTo(s.p1.x, s.p1.y); 
  ctx.lineTo(s.p2.x, s.p2.y);
  ctx.stroke();
  ctx.setLineDash([]); // reset
};

export const drawSegments = (ctx: CanvasRenderingContext2D, segments: Segment[]) => {
  for (let i = 0; i < segments.length; i++) {
    drawSegment(ctx, segments[i]);
  }
};

export const drawPoints = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  mousePosition: Point,
  selected?: Point,
  hovered?: Point
) => {
  for (let i = 0; i < points.length; i++) {
    if (selected && points[i].equals(selected)) {
      // snapping logic
      const intent = new Segment(selected, hovered || mousePosition);
      drawSegment(ctx, intent, { color: "yellow", dash: [2, 2] });
      drawPoint(ctx, points[i], { outline: true });
    } else if (hovered && points[i].equals(hovered)) {
      drawPoint(ctx, points[i], { fill: true });
    } else {
      drawPoint(ctx, points[i]);
    }
  }
};
