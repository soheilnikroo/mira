import React from 'react';

import { colorToCSS } from '@/lib/utils';

import type { EllipseProps } from './ellipse.types';

const Ellipse = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EllipseProps) => {
  const { x, y, width, height, fill } = layer;

  return (
    <ellipse
      className="drop-shadow-md"
      id={id}
      onPointerDown={(e: React.PointerEvent) => onPointerDown(e, id)}
      stroke={selectionColor || 'transparent'}
      strokeWidth={1}
      fill={fill ? colorToCSS(fill) : '#000'}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
    />
  );
};

export default Ellipse;
