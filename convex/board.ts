import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

const images = [
  'https://doodleipsum.com/700/flat',
  'https://doodleipsum.com/500/flat',
  'https://doodleipsum.com/300/flat',
  'https://doodleipsum.com/200/flat',
  'https://doodleipsum.com/100/flat',
  'https://doodleipsum.com/50/flat',
  'https://doodleipsum.com/30/flat',
  'https://doodleipsum.com/20/flat',
  'https://doodleipsum.com/10/flat',
  'https://doodleipsum.com/5/flat',
  'https://doodleipsum.com/3/flat',
  'https://doodleipsum.com/2/flat',
  'https://doodleipsum.com/1/flat',
];

export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    return await ctx.db.insert('boards', {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const favorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', identity.subject).eq('boardId', args.id),
      )
      .unique();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id('boards'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error('Title is required');
    }

    if (title.length > 60) {
      throw new Error('Title must be less than 60 characters');
    }

    const board = await ctx.db.patch(args.id, {
      title,
    });

    return board;
  },
});

export const favorite = mutation({
  args: {
    id: v.id('boards'),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error('Board not found');
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', board._id),
      )
      .unique();

    if (existingFavorite) {
      throw new Error('Board is already favorited');
    } else {
      await ctx.db.insert('userFavorites', {
        userId,
        orgId: args.orgId,
        boardId: board._id,
      });
    }

    return board;
  },
});

export const unFavorite = mutation({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error('Board not found');
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) =>
        q.eq('userId', userId).eq('boardId', board._id),
      )
      .unique();

    if (!existingFavorite) {
      throw new Error('Favorite board not found');
    } else {
      await ctx.db.delete(existingFavorite._id);
    }

    return board;
  },
});

export const get = query({
  args: {
    id: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error('Board not found');
    }

    return board;
  },
});
