import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
  type Camera,
  type Color,
  type Layer,
  LayerType,
  type PathLayer,
  type Point,
  Side,
  type XYWH,
} from '@/types/canvas';

export const COLORS = [
  '#DC2626',
  '#D97706',
  '#059669',
  '#0284C7',
  '#7C3AED',
  '#DB2777',
  '#EA580C',
  '#0E7490',
  '#10B981',
  '#14B8A6',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#000000',
  '#FFFFFF',
];

export const connectionIdToColor = (connectionId: number) => {
  return COLORS[connectionId % COLORS.length];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pointerEventToCanvasPointer = (
  e: React.PointerEvent,
  camera: Camera,
) => {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
};

export const colorToCSS = (color: Color) => {
  return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
};

export const resizeLayer = (bounds: XYWH, corner: Side, point: Point) => {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
};

export const findIntersectingLayersWithRectangle = (
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point,
) => {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = [];

  for (const layerId of layerIds) {
    const layer = layers.get(layerId);

    if (layer === null || layer === undefined) continue;

    const { x, y, width, height } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }
  return ids;
};

export const getContrastingColor = (color: Color) => {
  const { r, g, b } = color;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 182 ? 'black' : 'white';
};

export const penPointsToPathLayer = (
  points: number[][],
  color: Color,
): PathLayer => {
  if (points.length < 2) {
    throw new Error('At least 2 points are required');
  }

  let left = +Infinity;
  let top = +Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (const point of points) {
    const [x, y] = point;

    if (left > x) left = x;
    if (top > y) top = y;
    if (right < x) right = x;
    if (bottom < y) bottom = y;
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
    width: right - left,
    height: bottom - top,
    fill: color,
  };
};

export const getSvgPathFromStroke = (stroke: number[][]) => {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'],
  );

  d.push('Z');
  return d.join(' ');
};
