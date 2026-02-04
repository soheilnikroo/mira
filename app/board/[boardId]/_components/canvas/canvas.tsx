import { Info } from '@/app/board/[boardId]/_components/info';
import { Participants } from '@/app/board/[boardId]/_components/participants';
import { Toolbar } from '@/app/board/[boardId]/_components/tool-bar';

const Canvas = ({ boardId }: { boardId: string }) => {
  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info />
      <Participants />
      <Toolbar />
    </main>
  );
};

export default Canvas;
