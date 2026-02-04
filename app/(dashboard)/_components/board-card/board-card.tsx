'use client';

import { useAuth } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { Actions } from '@/components/actions';
import { api } from '@/convex/_generated/api';
import { useApiMutation } from '@/hooks/use-api-mutation';

import { Footer } from './sub-components/footer';
import { Overlay } from './sub-components/overlay';

import type { BoardCardProps } from './board-card.type';

export default function BoardCard({
  id,
  title,
  authorId,
  authorName,
  imageUrl,
  createdAt,
  orgId,
  isFavorite,
}: BoardCardProps) {
  const { mutate: favoriteBoard, pending: favoriteBoardPending } =
    useApiMutation(api.board.favorite);
  const { mutate: unFavoriteBoard, pending: unFavoriteBoardPending } =
    useApiMutation(api.board.unFavorite);
  const { userId } = useAuth();
  const isAuthor = userId === authorId;

  const authorLabel = isAuthor ? 'You' : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await unFavoriteBoard({ id });
        return;
      }

      await favoriteBoard({ id, orgId });
      return;
    } catch (error) {
      toast.error('Failed to favorite board', {
        description: 'Please try again later.',
        action: {
          label: 'Try again',
          onClick: handleFavorite,
        },
      });
      console.error(error);
    }
  };

  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-100/127 border rounded-lg flex overflow-hidden flex-col justify-between">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
          <Overlay />
          <Actions id={id} title={title} side="right">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>
        <Footer
          isFavorite={isFavorite}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          title={title}
          onClick={handleFavorite}
          disabled={favoriteBoardPending || unFavoriteBoardPending}
        />
      </div>
    </Link>
  );
}
