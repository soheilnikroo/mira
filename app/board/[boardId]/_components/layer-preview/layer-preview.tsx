'use client';

import { useStorage } from '@liveblocks/react';
import { memo } from 'react';

import { LayerType } from '@/types/canvas';

import Rectangle from '../rectangle/rectangle';

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
        <ellipse
          id={id}
          onPointerDown={(e: React.PointerEvent) => onLayerPointerDown(e, id)}
          rx={100}
          ry={100}
          fill={selectionColor ?? 'transparent'}
        />
      );
    case LayerType.Text:
      return (
        <text
          id={id}
          onPointerDown={(e: React.PointerEvent) => onLayerPointerDown(e, id)}
          x={100}
          y={100}
          fill={selectionColor ?? 'transparent'}
        />
      );
    case LayerType.Note:
      return null;
  }

  return null;
};

LayerPreview.displayName = 'LayerPreview';

export default memo(LayerPreview);
