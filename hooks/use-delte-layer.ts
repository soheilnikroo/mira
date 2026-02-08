import { useMutation, useSelf } from '@liveblocks/react';

export const useDeleteLayer = () => {
  const selection = useSelf((me) => me.presence.selection);

  const deleteLayer = useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get('layers');
      const liveLayersIds = storage.get('layerIds');

      for (const layerId of selection ?? []) {
        liveLayers.delete(layerId);

        const index = liveLayersIds.indexOf(layerId);

        if (index !== -1) {
          liveLayersIds.delete(index);
        }
      }

      setMyPresence(
        {
          selection: [],
        },
        {
          addToHistory: true,
        },
      );
    },
    [selection],
  );

  return deleteLayer;
};
