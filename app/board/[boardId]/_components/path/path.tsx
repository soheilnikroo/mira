import getStroke from 'perfect-freehand';

import { getSvgPathFromStroke } from '@/lib/utils';

import type { PathProps } from './path.types';

const Path = ({ fill, onPointerDown, x, y, stroke, points }: PathProps) => {
  const path = getSvgPathFromStroke(
    getStroke(points, {
      size: 16,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    }),
  );

  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={path}
      fill={fill}
      stroke={stroke}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      strokeWidth={1}
    />
  );
};

export default Path;
