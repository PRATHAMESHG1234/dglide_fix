import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { useState, useEffect } from 'react';
import { useSidebar } from '@/componentss/ui/sidebar';
interface ValidationProps {
  message?: string;
  type?: string;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  validation?: ValidationProps;
  disabled?: boolean;
  readOnly?: boolean;
  indentType?: 'row' | 'col';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
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
    const isRequiredField = props.required;
    const { isMobile } = useSidebar();
    return (
      <div
        className={`flex ${isMobile ? 'flex-col items-start gap-1' : indentType === 'row' ? 'flex-row items-start justify-between' : 'flex-col items-start gap-1'} `}
      >
        {label && (
          <Label className="line-clamp-1 h-6 min-w-32 text-sm  w-56">
            {label}
            {isRequiredField && (
              <span className="text-destructive"> &#42;</span>
            )}
          </Label>
        )}
        <textarea
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            `flex min-h-20 ${isMobile ? 'w-72' : 'w-full'} rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm ring-offset-background placeholder:text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
            helperText && 'border-destructive focus-visible:ring-destructive',
            helperText &&
              validation?.type === 'info' &&
              'border-warning focus-visible:ring-warning',
            className
          )}
          ref={ref}
          onFocus={handleTouch}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export { Textarea };
