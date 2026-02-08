import { colorToCSS } from '@/lib/utils';

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
      fill={fill ? colorToCSS(fill) : '#000'}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      strokeWidth={1}
      stroke={selectionColor || 'transparent'}
    />
  );
};

export default Rectangle;
