import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

import type { HintProps } from './hint.types';

const Hint = ({
  label,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 0,
  alignOffset = 0,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          side={side}
          align={align}
          className="text-white bg-black border-black"
        >
          <p className="font-semibold capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
