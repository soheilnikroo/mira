import { v } from 'convex/values';
import { getAllOrThrow } from 'convex-helpers/server/relationships';

import { query } from './_generated/server';

export const list = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    if (args.favorites) {
      const favoriteBoards = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', identity.subject).eq('orgId', args.orgId)
        )
        .order('desc')
        .collect();

      const ids = favoriteBoards.map((favorite) => favorite.boardId);

      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board) => {
        return {
          ...board,
          isFavorite: true,
        };
      });
    }

    const title = args.search?.toLowerCase();
    let boards = [];

    if (title) {
      boards = await ctx.db
        .query('boards')
        .withSearchIndex('search_title', (q) =>
          q.search('title', title).eq('orgId', args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query('boards')
        .withIndex('by_org', (q) => q.eq('orgId', args.orgId))
        .order('desc')
        .collect();
    }

    const favoriteBoards = boards.map((board) => {
      return ctx.db
        .query('userFavorites')
        .withIndex('by_user_board', (q) =>
          q.eq('userId', identity.subject).eq('boardId', board._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: Boolean(favorite),
          };
        });
    });

    const boardsWithFavorites = await Promise.all(favoriteBoards);

    return boardsWithFavorites;
  },
});
