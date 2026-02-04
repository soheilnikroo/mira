import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const BoardCardSkeleton = () => {
  return (
    <div className="aspect-100/127 rounded-lg overflow-hidden justify-between">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

export default BoardCardSkeleton;
