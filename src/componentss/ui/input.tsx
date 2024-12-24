import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { useState, useEffect } from 'react';
import { useSidebar } from './sidebar';

interface ValidationProps {
  message?: string;
  type?: string;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  label?: string;
  validation?: ValidationProps;
  disabled?: boolean;
  readOnly?: boolean;
  indentType?: 'row' | 'col';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      label,
      validation,
      disabled,
      readOnly,
      indentType = 'col',
      ...props
    },
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const [helperText, setHelperText] = useState('');
    const { isMobile } = useSidebar();
    useEffect(() => {
      if (
        props.required &&
        touched &&
        (!props.value ||
          ((typeof props.value === 'string' || Array.isArray(props.value)) &&
            !props.value.length))
      ) {
        setHelperText(`${label ? label : ''} field can't be empty..!`);
      } else if (
        props.maxLength &&
        touched &&
        (typeof props.value === 'string' || Array.isArray(props.value)) &&
        props.value.length > props.maxLength
      ) {
        setHelperText(`Maximum ${props.maxLength} characters allowed..!`);
      } else if (validation?.message) {
        setHelperText(validation.message || `${label} field can't be empty..!`);
      } else {
        setHelperText('');
      }
    }, [
      touched,
      props.value,
      props.required,
      props.maxLength,
      label,
      validation?.type
    ]);

    const handleTouch = () => setTouched(true);
    const isRequeredField = props.required;

    return (
      <div
        className={`flex ${isMobile ? 'w-full flex-col items-start gap-1' : indentType === 'row' ? 'flex-row items-center justify-between' : 'w-full flex-col items-start gap-1'} `}
      >
        {label && (
          <Label className="line-clamp-1 h-6 w-56 min-w-32 text-sm">
            {label}
            {isRequeredField && (
              <span className="text-destructive"> &#42;</span>
            )}
          </Label>
        )}
        <div
          className={`relative flex items-center ${isMobile ? 'w-72' : 'w-full'}`}
        >
          {startIcon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            className={cn(
              'flex h-9 w-full rounded-md border bg-[#f7f8fa] px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-xs placeholder:text-muted-foreground read-only:cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              startIcon && 'pl-8',
              endIcon && 'pr-8',
              helperText && 'border-destructive focus-visible:ring-destructive',
              helperText &&
                validation?.type === 'info' &&
                'border-warning focus-visible:ring-warning',
              disabled && 'cursor-not-allowed bg-gray-100',
              className
            )}
            ref={ref}
            onFocus={handleTouch}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {endIcon}
            </div>
          )}
        </div>
        {/* {helperText && (
          <p
            className={`h-3 text-xs font-medium ${
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

Input.displayName = 'Input';

export { Input };
