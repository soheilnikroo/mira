'use client';

import { useMutation, useSelf } from '@liveblocks/react';
import { BringToFront, SendToBack, Trash2 } from 'lucide-react';
import { memo } from 'react';

import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import { useDeleteLayer } from '@/hooks/use-delte-layer';
import { useSelectionBounds } from '@/hooks/use-selection-bounds';

import { ColorPicker } from '../color-picker';

import type { SelectionToolsProps } from './selection-tools.types';
import type { Color } from '@/types/canvas';

const SelectionTools = ({ camera, setLastUsedCursor }: SelectionToolsProps) => {
  const selection = useSelf((me) => me.presence.selection);

  const moveToBack = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get('layerIds');
      const indices: number[] = [];

      const arr = liveLayerIds.toArray();

      for (let i = 0; i < arr.length; i++) {
        if (selection?.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        liveLayerIds.move(indices[i], i);
      }
    },
    [selection],
  );

  const moveToFront = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get('layerIds');
      const indices: number[] = [];

      const arr = liveLayerIds.toArray();

      for (let i = 0; i < arr.length; i++) {
        if (selection?.includes(arr[i])) {
          indices.push(i);
        }
      }

      for (let i = 0; i < indices.length; i++) {
        liveLayerIds.move(indices[i], arr.length - 1 - i);
      }
    },
    [selection],
  );

  const setFill = useMutation(
    ({ storage }, fill: Color) => {
      const liveLayers = storage.get('layers');
      setLastUsedCursor(fill);

      selection?.forEach((layerId) => {
        liveLayers.get(layerId)?.set('fill', fill);
      });
    },
    [setLastUsedCursor, selection],
  );

  const deleteLayers = useDeleteLayer();

  const selectionBounds = useSelectionBounds();

  if (!selectionBounds) {
    return null;
  }

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 16px - 100%))`,
      }}
    >
      <ColorPicker onChange={setFill} />
      <div className="flex flex-col gap-y-0.5 items-center justify-center">
        <Hint label="Bring To Front">
          <Button variant="board" size="icon" onClick={moveToFront}>
            <BringToFront />
          </Button>
        </Hint>
        <Hint label="Bring To Back" side="bottom">
          <Button variant="board" size="icon" onClick={moveToBack}>
            <SendToBack />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center pl-2 ml-2  border-neutral-200">
        <Hint label="Delete">
          <Button variant="board" size="icon" onClick={deleteLayers}>
            <Trash2 />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

SelectionTools.displayName = 'SelectionTools';

export default memo(SelectionTools);
