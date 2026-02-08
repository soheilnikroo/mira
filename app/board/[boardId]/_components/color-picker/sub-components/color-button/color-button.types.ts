import type { Color } from '@/types/canvas';

export type ColorButtonProps = {
  onClick: (color: Color) => void;
  color: Color;
};
