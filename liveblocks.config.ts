// Define Liveblocks types for your application

import type { Color, Layer } from './types/canvas';
import type { LiveList, LiveMap, LiveObject } from '@liveblocks/client';

// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      cursor: { x: number; y: number } | null;
      selection: string[];
      pencilDraft: [x: number, y: number, pressure: number][] | null;
      penColor: Color | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Example, a conflict-free list
      layers: LiveMap<string, LiveObject<Layer>>;
      layerIds: LiveList<string>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id?: string;
      info?: {
        name?: string;
        picture?: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent:
      | { type: 'REACTION'; emoji: string; x: number; y: number }
      | { type: 'CONFETTI'; emoji: string; x: number; y: number };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    // ThreadMetadata: {
    //   // Example, attaching coordinates to a thread
    //   // x: number;
    //   // y: number;
    // };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    // RoomInfo: {
    //   // Example, rooms with a title and url
    //   // title: string;
    //   // url: string;
    // };
  }
}

export {};
