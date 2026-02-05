'use client';

import { useQuery } from 'convex/react';
import { Menu } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { Actions } from '@/components/actions';
import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { useRenameModal } from '@/store/use-rename-modal';

import type { InfoProps } from './info.types';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>;
};

const Info = ({ boardId }: InfoProps) => {
  const board = useQuery(api.board.get, { id: boardId });
  const { onOpen: onOpenRenameModal } = useRenameModal();

  const handleRename = () => {
    if (board?.title && boardId) {
      onOpenRenameModal(board._id, board.title);
    }
  };

  if (!board) {
    return <InfoSkeleton />;
  }

  const { title, _id: id } = board;

  return (
    <div className="absolute top-2 left-2 flex bg-white rounded-md px-1.5 h-12 items-center shadow-md">
      <Hint label="Go to homepage" side="bottom" sideOffset={10}>
        <Button variant="board" className="px-2" asChild>
          <Link href="/">
            <Image src="/logo.svg" alt="Mira Logo" width={32} height={32} />{' '}
            <span
              className={cn(
                'font-semibold text-xl ml-2 text-black',
                font.className,
              )}
            >
              Mira
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Rename board" side="bottom" sideOffset={10}>
        <Button
          variant="board"
          className="text-base font-normal px-2"
          onClick={handleRename}
        >
          {title}
        </Button>
      </Hint>
      <TabSeparator />
      <Actions side="bottom" sideOffset={10} id={id} title={title}>
        <div>
          <Hint label="Main menu" side="bottom" sideOffset={10}>
            <Button variant="board" size="icon">
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute top-2 left-2 flex bg-white rounded-mg px-1.5 h-12 items-center shadow-md w-[300px] rounded-md" />
  );
};

export default Info;
