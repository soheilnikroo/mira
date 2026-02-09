'use client';

import { LiveList, LiveMap, type LiveObject } from '@liveblocks/client';
import {
  RoomProvider,
  ClientSideSuspense,
  LiveblocksProvider,
} from '@liveblocks/react/suspense';

import { Loading } from '@/app/board/[boardId]/_components/loading';

import type { RoomProps } from './room.types';
import type { Layer } from '@/types/canvas';

const Room = ({ roomId, children, fallback = <Loading /> }: RoomProps) => {
  return (
    <LiveblocksProvider throttle={16} authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: [],
          pencilDraft: null,
          penColor: null,
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList<string>([]),
        }}
      >
        <ClientSideSuspense fallback={fallback}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default Room;
