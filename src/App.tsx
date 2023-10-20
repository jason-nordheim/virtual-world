import { useState } from "react";
import "./App.css";
import { Canvas } from "./components";
import { Point, Segment } from "./lib";
import { useGraph } from "./hooks";

const CANVAS = {
  height: 600,
  width: 600,
};

const demoPoints: Point[] = [
  { x: 200, y: 200 },
  { x: 500, y: 200 },
  { x: 400, y: 400 },
  { x: 100, y: 300 },
];

const demoSegments: Segment[] = [
  { p1: demoPoints[0], p2: demoPoints[1] },
  { p1: demoPoints[0], p2: demoPoints[2] },
  { p1: demoPoints[0], p2: demoPoints[3] },
  { p1: demoPoints[1], p2: demoPoints[3] },
];
function App() {
  const { graph, addRandomPoint, addRandomSegment } = useGraph({
    height: CANVAS.height,
    width: CANVAS.width,
    prePopulate: { points: demoPoints, segments: demoSegments },
  });

  return (
    <>
      <h1>World Editor</h1>
      <Canvas height={CANVAS.height} width={CANVAS.width} points={graph.points} segments={graph.segments} />
      <div id="controls">
        <button onClick={() => addRandomPoint()}>Add Point</button>
        <button onClick={() => addRandomSegment()}>Add Segment</button>
      </div>
    </>
  );
}

export default App;
