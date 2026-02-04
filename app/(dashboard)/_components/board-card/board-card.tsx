'use client';

import { useAuth } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Actions } from '@/components/actions';

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
  const { userId } = useAuth();
  const isAuthor = userId === authorId;

  const authorLabel = isAuthor ? 'You' : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

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
          onClick={() => {}}
          disabled={false}
        />
      </div>
    </Link>
  );
}
