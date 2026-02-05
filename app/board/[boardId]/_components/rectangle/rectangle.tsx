import type { RectangleProps } from './rectangle.types';

const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <rect
      className="drop-shadow-md"
      id={id}
      onPointerDown={(e: React.PointerEvent) => onPointerDown(e, id)}
      width={width}
      height={height}
      fill={`rgb(${fill.r}, ${fill.g}, ${fill.b})`}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      strokeWidth={1}
      stroke="transparent"
    />
  );
};

export default Rectangle;
