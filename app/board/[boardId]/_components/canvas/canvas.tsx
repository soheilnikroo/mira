'use client';

import { LiveObject } from '@liveblocks/client';
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from '@liveblocks/react';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Info } from '@/app/board/[boardId]/_components/info';
import { Participants } from '@/app/board/[boardId]/_components/participants';
import { Toolbar } from '@/app/board/[boardId]/_components/tool-bar';
import {
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  pointerEventToCanvasPointer,
  resizeLayer,
} from '@/lib/utils';
import {
  type Camera,
  CanvasMode,
  type CanvasState,
  type Color,
  type Layer,
  type LayerType,
  type Point,
  type Side,
  type XYWH,
} from '@/types/canvas';

import CursorPresence from '../cursor-presence/cursor-presence';
import EmojiReactions, { type EmojiReactionsHandle } from '../emoji-reactions';
import EmojiToolbar from '../emoji-toolbar';
import { LayerPreview } from '../layer-preview';
import { SelectionBox } from '../selection-box';
import SelectionTools from '../selection-tools/selection-tools';

import { MAX_LAYERS } from './canvas.constants';

import type { Id } from '@/convex/_generated/dataModel';

const Canvas = ({ boardId }: { boardId: Id<'boards'> }) => {
  const layerIds = useStorage((root) => root.layerIds);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedCursor, setLastUsedCursor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPointRef = useRef<Point | null>(null);
  const lastScreenPositionRef = useRef<{ x: number; y: number } | null>(null);
  const emojiReactionsRef = useRef<EmojiReactionsHandle>(null);

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point,
    ) => {
      const liveLayers = storage.get('layers');

      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get('layerIds');
      const layerId = nanoid();

      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        width: 100,
        height: 100,
        fill: lastUsedCursor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer as LiveObject<Layer>);

      setMyPresence(
        {
          selection: [layerId],
        },
        {
          addToHistory: true,
        },
      );

      setCanvasState({
        mode: CanvasMode.None,
      });
    },
    [lastUsedCursor],
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((prev) => {
      return {
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      };
    });
  }, []);

  const onPointerMovePan = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning || !lastPanPointRef.current) return;

      e.preventDefault();

      const deltaX = e.clientX - lastPanPointRef.current.x;
      const deltaY = e.clientY - lastPanPointRef.current.y;

      setCamera((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      lastPanPointRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    },
    [isPanning],
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const newBounds = resizeLayer(
        canvasState.initialBounds,
        canvasState.corner,
        point,
      );

      const liveLayers = storage.get('layers');
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(newBounds);
      }
    },
    [canvasState],
  );

  const translateSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get('layers');

      for (const layerId of self.presence.selection) {
        const layer = liveLayers.get(layerId);

        if (layer) {
          layer.update({
            x: layer.get('x') + offset.x,
            y: layer.get('y') + offset.y,
          });
        }
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [canvasState],
  );

  const unSelectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence(
        {
          selection: [],
        },
        {
          addToHistory: true,
        },
      );
    }
  }, []);

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get('layers').toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });

      const ids = findIntersectingLayersWithRectangle(
        layerIds ?? [],
        layers,
        origin,
        current,
      );

      setMyPresence({
        selection: ids,
      });
    },
    [layerIds],
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      if (isPanning) {
        return;
      }

      e.preventDefault();

      lastScreenPositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      const current = pointerEventToCanvasPointer(e, camera);

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      }

      setMyPresence({
        cursor: current,
      });
    },
    [camera, isPanning, canvasState, resizeSelectedLayer],
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setIsPanning(false);
    lastPanPointRef.current = null;
    setMyPresence({
      cursor: null,
    });
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPointer(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      if (e.button === 1) {
        e.preventDefault();
        setIsPanning(true);
        lastPanPointRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }

      setCanvasState({
        origin: point,
        mode: CanvasMode.Pressing,
      });
    },
    [canvasState.mode, camera],
  );

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      if (e.button === 1) {
        setIsPanning(false);
        lastPanPointRef.current = null;
        return;
      }

      const pointer = pointerEventToCanvasPointer(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unSelectLayers();
        setCanvasState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, pointer);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [camera, canvasState, history, insertLayer, unSelectLayers],
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }
      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPointer(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence(
          {
            selection: [layerId],
          },
          {
            addToHistory: true,
          },
        );
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [setCanvasState, camera, history, canvasState.mode],
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history],
  );

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={history.undo}
        redo={history.redo}
      />
      <EmojiToolbar
        getLastScreenPosition={() => lastScreenPositionRef.current}
        onReaction={(emoji, x, y) => {
          emojiReactionsRef.current?.addReaction(emoji, x, y);
        }}
        onConfetti={(emoji, x, y) => {
          emojiReactionsRef.current?.addConfetti(emoji, x, y);
        }}
      />
      <EmojiReactions ref={emojiReactionsRef} />
      <SelectionTools camera={camera} setLastUsedCursor={setLastUsedCursor} />
      <svg
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        className="h-screen w-screen"
        onWheel={onWheel}
        onPointerMove={(e) => {
          if (isPanning) {
            onPointerMovePan(e);
          } else {
            onPointerMove(e);
          }
        }}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          {layerIds?.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          <CursorPresence />
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
