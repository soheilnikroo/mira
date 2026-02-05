import type { LucideIcon } from 'lucide-react';

export type ToolButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};
