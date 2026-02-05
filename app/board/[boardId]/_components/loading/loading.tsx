import { Loader } from 'lucide-react';

import { InfoSkeleton } from '../info';
import { ParticipantsSkeleton } from '../participants';
import { ToolbarSkeleton } from '../tool-bar';

const Loading = () => {
  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center">
      <Loader className="w-6 h-6 text-muted-foreground animate-spin" />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  );
};

export default Loading;
