import type { DropdownMenuContent } from '../ui/dropdown-menu';
import type { ComponentProps } from 'react';

export type ActionsProps = {
  children: React.ReactNode;
  side?: ComponentProps<typeof DropdownMenuContent>['side'];
  sideOffset?: ComponentProps<typeof DropdownMenuContent>['sideOffset'];
  id: string;
  title: string;
};
