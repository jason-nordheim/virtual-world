import { Point } from "./point";

export type GraphOpts = {
  height: number;
  width: number;
  backgroundColor: string;
};

export type PointDrawOptions = {
  size: number;
  color: string;
  outline: boolean;
  fill: boolean;
};

export type SegmentDrawOptions = {
  width: number;
  color: string;
  dash: [number, number];
};

export type GraphMode = "add" | "remove";

export type Drag = {
  start: Point;
  end: Point;
  offset: Point;
  active: boolean;
};
