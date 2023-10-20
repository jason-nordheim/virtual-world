import { useState } from "react";
import "./App.css";
import { Canvas } from "./components";
import { Point, Segment, generateRandomPoint, generateRandomSegment, pointExists, segmentExists } from "./lib";

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
  const [points, setPoints] = useState<Point[]>(demoPoints);
  const [segments, setSegments] = useState<Segment[]>(demoSegments);

  const addRandomPoint = () => {
    const p = generateRandomPoint(CANVAS.height, CANVAS.width);
    if (pointExists(p, points)) {
      addRandomPoint();
    } else {
      setPoints([...points, p]);
    }
  };

  const addRandomSegment = () => {
    // there must be at least 2 points to connect
    if (points.length < 2) return;
    const segment: Segment = generateRandomSegment(points);
    const exists = segmentExists(segment, segments);
    if (!exists) {
      setSegments([...segments, segment]);
    } else {
      console.warn("segment already exists");
    }
  };

  return (
    <>
      <h1>World Editor</h1>
      <Canvas height={CANVAS.height} width={CANVAS.width} points={points} segments={segments} />
      <div id="controls">
        <button onClick={() => addRandomPoint()}>Add Point</button>
        <button onClick={() => addRandomSegment()}>Add Segment</button>
      </div>
    </>
  );
}

export default App;
