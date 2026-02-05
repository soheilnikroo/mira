import { use } from 'react';

import { Room } from '@/components/room';

import { Canvas } from './_components/canvas';

import type { Id } from '@/convex/_generated/dataModel';

const BoardPage = ({
  params,
}: {
  params: Promise<{ boardId: Id<'boards'> }>;
}) => {
  const { boardId } = use(params);

  return (
    <Room roomId={boardId}>
      <Canvas boardId={boardId} />
    </Room>
  );
};

export default BoardPage;
