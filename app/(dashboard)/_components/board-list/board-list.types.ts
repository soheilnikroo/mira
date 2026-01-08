import type { ReadonlyURLSearchParams } from 'next/navigation';

export type BoardListProps = {
  orgId: string;
  query: ReadonlyURLSearchParams;
};
