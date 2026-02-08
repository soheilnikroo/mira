'use client';

import { COLORS } from '@/lib/utils';

import { ColorButton } from './sub-components/color-button';

import type { ColorPickerProps } from './color-picker.types';

const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      {COLORS.map((color) => (
        <ColorButton
          key={color}
          onClick={onChange}
          color={{
            r: parseInt(color.slice(1, 3), 16),
            g: parseInt(color.slice(3, 5), 16),
            b: parseInt(color.slice(5, 7), 16),
          }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
