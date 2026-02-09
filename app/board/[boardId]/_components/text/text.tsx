import { useMutation } from '@liveblocks/react';
import { Kalam } from 'next/font/google';
import ContainerEditable, {
  type ContentEditableEvent,
} from 'react-contenteditable';

import { cn, colorToCSS } from '@/lib/utils';

import type { TextProps } from './text.types';

const font = Kalam({
  subsets: ['latin'],
  weight: ['400'],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.max(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

const Text = ({ id, layer, onPointerDown, selectionColor }: TextProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get('layers');

    liveLayers.get(id)?.set('value', newValue);
  }, []);

  const handleChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e: React.PointerEvent) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
      }}
    >
      <ContainerEditable
        className={cn(
          'h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none',
          font.className,
        )}
        html={value || 'Text'}
        onChange={handleChange}
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? colorToCSS(fill) : '#000',
        }}
      />
    </foreignObject>
  );
};

export default Text;
