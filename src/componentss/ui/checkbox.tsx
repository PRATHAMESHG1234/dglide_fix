import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  startLabel?: string;
  endLabel?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, startLabel, endLabel, ...props }, ref) => {
  const startLabelRef = React.useRef<HTMLLabelElement>(null);
  const endLabelRef = React.useRef<HTMLLabelElement>(null);
  const [isStartClamped, setIsStartClamped] = React.useState(false);
  const [isEndClamped, setIsEndClamped] = React.useState(false);

  React.useEffect(() => {
    if (startLabelRef.current) {
      setIsStartClamped(
        startLabelRef.current.scrollWidth > startLabelRef.current.clientWidth
      );
    }
    if (endLabelRef.current) {
      setIsEndClamped(
        endLabelRef.current.scrollWidth > endLabelRef.current.clientWidth
      );
    }
  }, [startLabel, endLabel]);

  return (
    <div className="flex items-center space-x-2">
      {startLabel && (
        <Tooltip>
          <TooltipTrigger asChild>
            <label
              ref={startLabelRef}
              className="w-16 max-w-16 overflow-hidden text-ellipsis whitespace-nowrap text-sm"
              title={!isStartClamped ? undefined : startLabel} // Adds a native tooltip if not using ShadCN
            >
              {startLabel}
            </label>
          </TooltipTrigger>
          {isStartClamped && (
            <TooltipContent side="top">{startLabel}</TooltipContent>
          )}
        </Tooltip>
      )}
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-secondary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-secondary data-[state=checked]:text-primary-foreground',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn('flex items-center justify-center text-current')}
        >
          <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {endLabel && (
        <Tooltip>
          <TooltipTrigger asChild>
            <label
              ref={endLabelRef}
              className="overflow-hidden text-ellipsis whitespace-nowrap text-sm"
              title={!isEndClamped ? undefined : endLabel}
            >
              {endLabel}
            </label>
          </TooltipTrigger>
          {isEndClamped && (
            <TooltipContent side="top">{endLabel}</TooltipContent>
          )}
        </Tooltip>
      )}
    </div>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
