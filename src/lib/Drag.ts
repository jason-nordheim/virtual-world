import { Point } from "./point";

export class Drag {
  start = new Point(0, 0);
  end = new Point(0, 0);
  offset = new Point(0, 0);
  active = false;
}
