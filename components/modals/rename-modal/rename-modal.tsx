'use client';

import { startTransition, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useRenameModal } from '@/store/use-rename-modal';

const RenameModal = () => {
  const { mutate: renameBoard, pending: renameBoardPending } = useApiMutation(
    api.board.update
  );
  const { isOpen, initialValues, onClose } = useRenameModal();
  const [title, setTitle] = useState(initialValues.title);

  useEffect(() => {
    startTransition(() => {
      setTitle(initialValues.title);
    });

    return () => {
      setTitle('');
    };
  }, [initialValues.title]);

  const handleRenameBoard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      await renameBoard({ id: initialValues.id, title: title.trim() });
      toast.success('Board renamed successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to rename board', {
        description: 'Please try again later.',
        action: {
          label: 'Try again',
          onClick: () => handleRenameBoard(e),
        },
      });
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            Rename Board &quot;{initialValues.title}&quot;
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>Rename the board to a new name.</DialogDescription>
        <form className="space-y-4" onSubmit={handleRenameBoard}>
          <Input
            required
            maxLength={60}
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new name for the board"
            disabled={renameBoardPending}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={renameBoardPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={renameBoardPending}>
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameModal;
