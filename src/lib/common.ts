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

export type GraphMode = "add" | "remove" | "pan";

export const DEFAULTS = {
  GRAPH: {
    height: 600,
    width: 600,
    backgroundColor: "green",
  },
  DRAW: {
    POINT: {
      size: 18,
      color: "black",
      outline: false,
      fill: false,
    },
    SEGMENT: {
      width: 2,
      color: "black",
      dash: [],
    },
  },
};
