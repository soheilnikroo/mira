'use client';

import { useStorage } from '@liveblocks/react';
import { memo } from 'react';

import { colorToCSS } from '@/lib/utils';
import { LayerType } from '@/types/canvas';

import { Ellipse } from '../ellipse';
import { Note } from '../note';
import { Path } from '../path';
import Rectangle from '../rectangle/rectangle';
import { Text } from '../text';

import type { LayerPreviewProps } from './layer-preview.types';

const LayerPreview = ({
  id,
  onLayerPointerDown,
  selectionColor,
}: LayerPreviewProps) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) return null;

  switch (layer.type) {
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Ellipse:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Text:
      return (
        <Text
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Note:
      return (
        <Note
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Path:
      return (
        <Path
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCSS(layer.fill) : '#000'}
          stroke={selectionColor || 'transparent'}
          onPointerDown={(e) => onLayerPointerDown(e, id)}
          points={layer.points}
        />
      );
    default:
      return null;
  }
};

LayerPreview.displayName = 'LayerPreview';

export default memo(LayerPreview);
