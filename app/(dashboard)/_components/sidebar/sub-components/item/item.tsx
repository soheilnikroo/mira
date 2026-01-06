'use client';

import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import Image from 'next/image';

import { Hint } from '@/components/hint';
import { cn } from '@/lib/utils';

import type { ItemProps } from './item.types';

const Item = ({ id, name, imageUrl }: ItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const handleClick = () => {
    if (setActive) {
      setActive({ organization: id });
    }
  };

  return (
    <div className="aspect-square relative">
      <Hint
        label={`Switch to the "${name}" organization`}
        side="right"
        align="start"
        sideOffset={18}
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={cn(
            'rounded-md cursor-pointer opacity-75 hover:opacity-100 transition',
            isActive && 'opacity-100'
          )}
          onClick={handleClick}
        />
      </Hint>
    </div>
  );
};

export default Item;
