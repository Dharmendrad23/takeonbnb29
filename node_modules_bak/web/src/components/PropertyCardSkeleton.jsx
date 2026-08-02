import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="flex justify-between items-start gap-2 px-1">
        <Skeleton className="h-5 w-2/3 rounded" />
        <Skeleton className="h-5 w-12 rounded" />
      </div>
      <Skeleton className="h-4 w-1/2 rounded px-1" />
      <Skeleton className="h-5 w-1/3 rounded px-1 mt-1" />
    </div>
  );
};

export default PropertyCardSkeleton;