import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Camera } from '@/types/canvas';

const COLORS = [
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
