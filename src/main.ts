import { Graph } from "./lib";
import "./style.css";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;

const graph = new Graph(canvas);
