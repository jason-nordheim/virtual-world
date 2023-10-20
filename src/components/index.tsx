import { FC, useEffect, useRef } from "react";
import { Point, Segment } from "../lib";
import { drawPoint, drawSegment } from "../utils/draw";

type CanvasProps = {
  height: number;
  width: number;
  points?: Point[];
  segments?: Segment[];
};

export const Canvas: FC<CanvasProps> = ({ height, width, points = [], segments = [] }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = ref.current.getContext("2d")!;
    for (const p of points) {
      drawPoint(ctx, p);
    }
    for (const s of segments) {
      drawSegment(ctx, s);
    }
  }, [height, width, points, segments]);

  return <canvas ref={ref} height={height} width={width}></canvas>;
};
