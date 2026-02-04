import { useOrganization } from '@clerk/nextjs';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useApiMutation } from '@/hooks/use-api-mutation';

const EmptyBoards = () => {
  const { organization } = useOrganization();
  const { mutate: createBoard, pending } = useApiMutation(api.board.create);

  const handleCreate = async () => {
    if (!organization) {
      toast.error('You must be a member of an organization to create a board');
      return null;
    }

    try {
      await createBoard({ title: 'Untitled Board', orgId: organization.id });
      toast.success('Board created successfully');
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
        <Button size="lg" onClick={handleCreate} disabled={pending}>
          {pending ? 'Creating...' : 'Create Board'}
        </Button>
      </div>
    </div>
  );
};

export default EmptyBoards;
