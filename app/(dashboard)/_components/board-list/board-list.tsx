'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

import { BoardCard } from '../board-card';
import { BoardCardSkeleton } from '../board-card/sub-components/board-card-skeleton';
import { EmptyBoards } from '../empty-boards';
import { EmptyFavorites } from '../empty-favorites';
import { EmptySearch } from '../empty-search';
import { NewBoardButton } from '../new-board-button';

import type { BoardListProps } from './board-list.types';

const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.list, { orgId });
  const search = query.get('search');
  const favorites = query.get('favorites');

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {favorites ? 'Favorite Boards' : 'Team Boards'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
        </div>
      </div>
    );
  }

  if (!data.length && search) {
    return <EmptySearch />;
  }

  if (!data.length && favorites) {
    return <EmptyFavorites />;
  }

  if (!data.length) {
    return <EmptyBoards />;
  }

  return (
    <div>
      <h2 className="text-3xl">
        {favorites ? 'Favorite Boards' : 'Team Boards'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            authorId={board.authorId}
            authorName={board.authorName}
            imageUrl={board.imageUrl}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardList;
