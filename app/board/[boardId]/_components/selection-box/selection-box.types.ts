import type { Side, XYWH } from '@/types/canvas';

export type SelectionBoxProps = {
  onResizeHandlePointerDown: (
    corner: Side,
    initialBounds: XYWH,
    layerId: string,
  ) => void;
};
