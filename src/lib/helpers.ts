import { Point } from "./Point";

export const getPosition = (evt: MouseEvent, zoom: number = 1) => {
  return new Point(evt.offsetX * zoom, evt.offsetY * zoom);
};
