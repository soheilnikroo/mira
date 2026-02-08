import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
  type Camera,
  type Color,
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
  '#10B981',
  '#14B8A6',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
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
