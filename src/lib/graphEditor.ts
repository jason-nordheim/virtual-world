import { Point } from "./Point";
import { Graph } from "./Graph";
import { DEFAULTS, GraphMode, GraphOpts } from "./common";
import { getNearestPoint, subtract } from "./math";
import { GraphView, SerializedGraphView } from "./GraphView";
import { Segment } from "./Segment";

type SerializedData = {
  points: Point[];
  segments: Segment[];
  view: SerializedGraphView;
};

type OnModeChangeCallback = (mode: GraphMode) => void;

// represents the controlling of the graph
export class GraphEditor {
  private canvas: HTMLCanvasElement;
  private graph: Graph;
  private view: GraphView;
  private mode: GraphMode = "pan";
  private mouse: Point = new Point(0, 0);
  private mouseWithOffset = new Point(0, 0);
  private modeChangeCallbacks: OnModeChangeCallback[] = [];

  constructor(graph: Graph, canvas: HTMLCanvasElement, opts: GraphOpts = DEFAULTS.GRAPH) {
    this.graph = graph;
    this.canvas = canvas;
    this.view = new GraphView(canvas, opts);

    // add event listeners
    this.canvas.addEventListener("mousedown", (evt) => this.handleMouseDown(evt));
    this.canvas.addEventListener("mousemove", (evt) => this.handleMouseMove(evt));
    this.canvas.addEventListener("mouseup", () => this.handleMouseUp());
    this.canvas.addEventListener("contextmenu", (evt) => this.handleRightClick(evt));
  }

  public addModeChangeCallback(cb: OnModeChangeCallback) {
    this.modeChangeCallbacks.push(cb);
  }

  public setupKeyboardListeners() {
    document.addEventListener("keypress", (evt) => {
      if (evt.key === "a") {
        this.setMode("add");
      }
      if (evt.key === "r") {
        this.setMode("remove");
      }
      if (evt.key === "p") {
        this.setMode("pan");
      }
    });
  }

  public setMode(mode: GraphMode) {
    this.mode = mode;
    this.modeChangeCallbacks.forEach((fn) => fn(this.mode));
  }

  private handleRightClick(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.graph.clearSelected();
  }

  private handleMouseUp() {
    this.graph.dragging = false;

    if (this.view.drag.active) {
      this.view.offset = this.view.getOffsetWithDrag();
      this.view.resetDrag();
    }
  }

  private handleMouseDown(evt: MouseEvent) {
    if (evt.button !== 0) return;

    if (this.mode === "add") {
      this.graph.dragging = true;
      this.graph.hovered = getNearestPoint(this.mouse, this.graph.points, 10);

      if (this.graph.hovered) {
        this.graph.select(this.graph.hovered);
        return;
      }

      this.graph.addPoint(this.mouse);
      this.graph.select(this.mouse);
    }

    if (this.mode === "remove") {
      const nearest = getNearestPoint(this.mouse, this.graph.points);
      if (nearest) {
        this.removePoint(nearest);
      }
    }

    if (this.mode === "pan") {
      this.view.drag.start = this.view.getMousePosition(evt);
      this.view.drag.active = true;
    }
  }

  private removePoint(p: Point) {
    this.graph.removePoint(p);
  }

  private handleMouseMove(evt: MouseEvent) {
    this.mouse = this.view.getMousePosition(evt);
    this.mouseWithOffset = this.view.getMousePosition(evt, true);
    this.graph.hovered = getNearestPoint(this.mouseWithOffset, this.graph.points, 10 * this.view.zoom);

    if (this.graph.dragging && this.graph.selected) {
      this.graph.selected.x = this.mouseWithOffset.x;
      this.graph.selected.y = this.mouseWithOffset.y;
    }

    if (this.view.drag.active) {
      this.view.drag.end = this.view.getMousePosition(evt);
      this.view.drag.offset = subtract(this.view.drag.end, this.view.drag.start);
    }
  }

  public dispose() {
    this.graph.reset();
  }

  public save() {
    localStorage.setItem(
      "graph",
      JSON.stringify({ points: this.graph.points, segments: this.graph.segments, view: this.view.serialize() })
    );
  }

  public load(data: SerializedData) {
    const points: Point[] = [];
    for (let i = 0; i < data.points.length; i++) {
      const p = new Point(data.points[i].x, data.points[i].y);
      points.push(p);
      this.graph.addPoint(p);
    }
    for (let i = 0; i < data.segments.length; i++) {
      this.graph.addSegment(
        new Segment(
          points.find((p) => p.equals(data.segments[i].p1))!,
          points.find((p) => p.equals(data.segments[i].p2))!
        )
      );
    }

    this.view.deserialize(data.view);
  }

  public display() {
    this.view.restore();
    this.view.clear();
    this.view.save();
    this.view.update();
    this.graph.draw(this.mouseWithOffset);
  }
}
