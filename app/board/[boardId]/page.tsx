import { Canvas } from './_components/canvas';

const BoardPage = ({ params }: { params: { boardId: string } }) => {
  const { boardId } = params;
  return <Canvas boardId={boardId} />;
};

export default BoardPage;
