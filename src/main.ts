import { Graph, Point, Segment } from "./lib";
import "./style.css";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const controls = document.querySelector("#controls");

const clearSelectedBtn = document.createElement("button");
clearSelectedBtn.textContent = "Clear Selection";

const modeToggle = document.createElement("select");
modeToggle.name = "modeToggle";
const modeAdd = document.createElement("option");
modeAdd.value = modeAdd.text = "add";
const modeRemove = document.createElement("option");
modeRemove.value = modeRemove.text = "remove";
modeToggle.appendChild(modeRemove);
modeToggle.appendChild(modeAdd);
modeToggle.value = "add";
controls?.appendChild(modeToggle);
controls?.appendChild(clearSelectedBtn);

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

const graph = new Graph(canvas);

graph.addPoint(p1);
graph.addPoint(p2);
graph.addPoint(p3);
graph.addPoint(p4);

graph.addSegment(s1);
graph.addSegment(s2);
graph.addSegment(s3);
graph.addSegment(s4);

modeToggle.addEventListener("change", (evt) => {
  // @ts-expect-error
  graph.setMode(evt.target.value);
});
clearSelectedBtn.onclick = () => {
  graph.clearSelected();
};

function animate() {
  graph.display();
  requestAnimationFrame(animate);
}
animate();
