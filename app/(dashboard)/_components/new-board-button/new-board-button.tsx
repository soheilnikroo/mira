import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';

import type { NewBoardButtonProps } from './new-board-button.type';

const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const { mutate: createBoard, pending } = useApiMutation(api.board.create);
  const router = useRouter();

  const handleCreate = async () => {
    try {
      const boardId = await createBoard({ title: 'Untitled Board', orgId });
      toast.success('Board created successfully');
      router.push(`/board/${boardId}`);
    } catch (error) {
      toast.error('Failed to create board', {
        description: 'Please try again later.',
        action: {
          label: 'Try again',
          onClick: handleCreate,
        },
      });
      console.error(error);
    }
  };

  return (
    <button
      disabled={pending || disabled}
      onClick={handleCreate}
      className={cn(
        'col-span-1 aspect-100/127 bg-blue-600 hover:bg-blue-800 rounded-lg flex flex-col items-center justify-center py-6',
        (pending || disabled) &&
          'opacity-75 hover:bg-blue-600 cursor-not-allowed'
      )}
    >
      <div />
      {pending ? (
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      ) : (
        <Plus className="h-12 w-12 text-white stroke-1" />
      )}
      <p className="text-white text-sm font-light mt-2">
        {pending ? 'Creating...' : 'Create New Board'}
      </p>
    </button>
  );
};

export default NewBoardButton;
