import { Graph, Point, Segment } from "./lib";
import { GraphEditor } from "./lib/GraphEditor";
import "./style.css";

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

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
const modePan = document.createElement("option");
modePan.value = modePan.textContent = "pan";
modeToggle.appendChild(modeRemove);
modeToggle.appendChild(modeAdd);
modeToggle.appendChild(modePan);
modeToggle.value = "pan";
controls?.appendChild(modeToggle);
controls?.appendChild(clearSelectedBtn);

const resetBtn = document.createElement("button");
resetBtn.textContent = "reset";
const saveBtn = document.createElement("button");
saveBtn.textContent = "save";

const graphString = localStorage.getItem("graph");
const data = graphString ? JSON.parse(graphString) : undefined;
const graph = new Graph(canvas);
const editor = new GraphEditor(graph, canvas);
if (data) {
  editor.load(data);
}

resetBtn.addEventListener("click", () => editor.dispose());
saveBtn.addEventListener("click", () => editor.save());
controls?.appendChild(resetBtn);
controls?.appendChild(saveBtn);

modeToggle.addEventListener("change", (evt) => {
  // @ts-expect-error
  editor.setMode(evt.target.value);
});
clearSelectedBtn.onclick = () => {
  graph.clearSelected();
};
document.addEventListener("keydown", (evt) => {
  if (evt.key == "Escape") {
    graph.clearSelected();
  }
});

function animate() {
  editor.display();
  requestAnimationFrame(animate);
}
animate();
