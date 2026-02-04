import { StarIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import type { FooterProps } from './footer.types';

const Footer = ({
  isFavorite,
  authorLabel,
  createdAtLabel,
  title,
  onClick,
  disabled,
}: FooterProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  return (
    <div className="relative bg-white p-3">
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {`${authorLabel} • ${createdAtLabel}`}
      </p>
      <button
        className={cn(
          'opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600',
          disabled && 'cursor-not-allowed opacity-75'
        )}
        disabled={disabled}
        onClick={handleClick}
      >
        <StarIcon
          className={cn('h-4 w-4', isFavorite && 'text-blue-600 fill-blue-600')}
        />
      </button>
    </div>
  );
};

export default Footer;
