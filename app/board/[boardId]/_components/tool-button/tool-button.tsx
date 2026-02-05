'use client';

import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';

import type { ToolButtonProps } from './tool-button.types';

const ToolButton = ({
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
  label,
}: ToolButtonProps) => {
  return (
    <Hint label={label} side="right" sideOffset={14}>
      <Button
        variant={isActive ? 'boardActive' : 'board'}
        size="icon"
        onClick={onClick}
        disabled={isDisabled}
      >
        <Icon />
      </Button>
    </Hint>
  );
};

export default ToolButton;
