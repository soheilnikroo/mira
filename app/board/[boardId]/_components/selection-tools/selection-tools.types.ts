import type { Camera, Color } from '@/types/canvas';

export type SelectionToolsProps = {
  camera: Camera;
  setLastUsedCursor: (cursor: Color) => void;
};
