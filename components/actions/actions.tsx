import { Link2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useRenameModal } from '@/store/use-rename-modal';

import { ConfirmModal } from '../confirm-modal';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import type { ActionsProps } from './actions.types';

const Actions = ({ children, side, sideOffset, id, title }: ActionsProps) => {
  const { onOpen: onOpenRenameModal } = useRenameModal();
  const { mutate: removeBoard, pending: removeBoardPending } = useApiMutation(
    api.board.remove
  );

  const handleCopyLink = () => {
    try {
      navigator.clipboard
        .writeText(`${window.location.origin}/board/${id}`)
        .then(() => {
          toast.success('Board link copied to clipboard');
        })
        .catch((error) => {
          toast.error('Failed to copy board link', {
            description: 'Please try again later.',
            action: {
              label: 'Try again',
              onClick: handleCopyLink,
            },
          });
          console.error(error);
        });
    } catch (error) {
      toast.error('Failed to copy board link', {
        description: 'Please try again later.',
        action: {
          label: 'Try again',
          onClick: handleCopyLink,
        },
      });
      console.error(error);
    }
  };

  const handleRemoveBoard = async () => {
    try {
      await removeBoard({ id });
      toast.success('Board removed successfully');
    } catch (error) {
      toast.error('Failed to remove board', {
        description: 'Please try again later.',
        action: {
          label: 'Try again',
          onClick: handleRemoveBoard,
        },
      });
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuItem
          className="p-3 cursor-pointer"
          onClick={handleCopyLink}
        >
          <Link2 className="w-4 h-4 mr-2" />
          Copy the board link
        </DropdownMenuItem>
        <DropdownMenuItem
          className="p-3 cursor-pointer"
          onClick={() => onOpenRenameModal(id, title)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Rename the board title
        </DropdownMenuItem>
        <ConfirmModal
          title="Remove the board"
          description="Are you sure you want to remove this board?"
          onConfirm={handleRemoveBoard}
          disabled={removeBoardPending}
        >
          <Button
            variant="ghost"
            className="p-3 cursor-pointer w-full text-sm justify-start font-normal"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove the board
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
