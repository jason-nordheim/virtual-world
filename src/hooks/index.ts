import { useState } from "react";
import { Graph, Point, Segment, generateRandomPoint, generateRandomSegment, pointExists, segmentExists } from "../lib";

export const useGraph = (height: number, width: number) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);

  const addRandomPoint = () => {
    const p = generateRandomPoint(height, width);
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

  const graph: Graph = { points, segments };

  return {
    graph,
    addRandomPoint,
    addRandomSegment,
  };
};
