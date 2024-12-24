import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';
import { Label } from './label';

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string;
  validation?: {
    message?: string;
    type?: 'error' | 'info';
  };
  optionLabelPosition?: 'end' | 'start';
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      label,
      validation,
      onCheckedChange,
      required = false,
      optionLabelPosition,
      ...props
    },
    ref
  ) => {
    const [touched, setTouched] = React.useState(false);
    const [helperText, setHelperText] = React.useState('');

    const handleTouch = () => setTouched(true);

    React.useEffect(() => {
      if (required && touched && props.checked === false) {
        setHelperText(validation?.message || 'This field is required!');
      } else {
        setHelperText('');
      }
    }, [touched, props.checked, required, validation]);
    //
    return (
      <div className="mt-4 flex flex-row items-start justify-start">
        {label && (
          <Label className="line-clamp-1 h-6 w-56 min-w-32 text-sm">
            {label}
            {required && <span className="text-destructive"> &#42;</span>}
          </Label>
        )}

        <div className="w-full">
          <SwitchPrimitives.Root
            className={cn(
              'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-secondary data-[state=unchecked]:bg-input',
              helperText && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            ref={ref}
            onCheckedChange={onCheckedChange}
            onFocus={handleTouch}
            {...props}
          >
            <SwitchPrimitives.Thumb
              className={cn(
                'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
              )}
            />
          </SwitchPrimitives.Root>
        </div>

        {/* {optionLabelPosition !== 'start' && label && (
          <Label className="line-clamp-1 h-6 min-w-32 pb-4 text-sm">
            {label}
            {required && <span className="text-destructive"> &#42;</span>}
          </Label>
        )} */}

        {/* {helperText && (
          <p
            className={`text-xs font-medium ${
              validation?.type === 'info' ? 'text-warning' : 'text-destructive'
            }`}
          >
            {helperText}
          </p>
        )} */}
      </div>
    );
  }
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
