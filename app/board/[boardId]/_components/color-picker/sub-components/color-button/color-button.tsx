'use client';

import { colorToCSS } from '@/lib/utils';

import type { ColorButtonProps } from './color-button.types';

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      onClick={() => onClick(color)}
      className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
    >
      <div
        style={{
          background: colorToCSS(color),
        }}
        className="h-8 w-8 rounded-md border border-neutral-300"
      ></div>
    </button>
  );
};

export default ColorButton;
