'use client';

import { EmptyBoards } from '../empty-boards';
import { EmptyFavorites } from '../empty-favorites';
import { EmptySearch } from '../empty-search';

import type { BoardListProps } from './board-list.types';

const BoardList = ({ orgId, query }: BoardListProps) => {
  const search = query.get('search');
  const favorites = query.get('favorites');

  const data = []; // TODO: Get boards from Convex

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
      <h1>Board List</h1>
      <p>Search: {search}</p>
      <p>Favorites: {favorites}</p>
    </div>
  );
};

export default BoardList;
