import Image from 'next/image';

import { Button } from '@/components/ui/button';

const EmptyBoards = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-boards.svg"
        alt="Empty Boards"
        width={110}
        height={110}
      />
      <h2 className="text-2xl font-semibold mt-6">No boards found</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Start by creating a new board for your organization
      </p>
      <div className="mt-6">
        <Button size="lg">Create Board</Button>
      </div>
    </div>
  );
};

export default EmptyBoards;
