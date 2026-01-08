'use client';

import { useOrganization } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

import { BoardList } from './_components/board-list';
import { EmptyOrg } from './_components/empty-org';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
}
