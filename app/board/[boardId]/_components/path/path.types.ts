export type PathProps = {
  x: number;
  y: number;
  fill: string;
  stroke?: string;
  points: number[][];
  onPointerDown?: (e: React.PointerEvent) => void;
};
