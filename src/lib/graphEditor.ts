import { Point } from "./point";
import { Graph } from "./graph";
import { getPosition } from "./helpers";
import { DEFAULTS, Drag, GraphMode, GraphOpts } from "./common";
import { getNearestPoint } from "./math";
import { GraphView } from "./GraphView";

// represents the controlling of the graph
export class GraphEditor {
  private canvas: HTMLCanvasElement;
  private graph: Graph;
  private view: GraphView;
  private mode: GraphMode = "add";
  private mouse: Point = new Point(0, 0);

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

  public setMode(mode: GraphMode) {
    this.mode = mode;
  }

  private handleRightClick(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.graph.clearSelected();
  }

  private handleMouseUp() {
    this.graph.dragging = false;
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
  }

  private removePoint(p: Point) {
    this.graph.removePoint(p);
  }

  private handleMouseMove(evt: MouseEvent) {
    this.mouse = getPosition(evt);
    this.graph.hovered = getNearestPoint(this.mouse, this.graph.points, 10);

    if (this.graph.dragging && this.graph.selected) {
      this.graph.selected.x = evt.offsetX;
      this.graph.selected.y = evt.offsetY;
    }
  }

  public display() {
    this.view.clear();
    this.graph.draw(this.mouse);
  }
}
