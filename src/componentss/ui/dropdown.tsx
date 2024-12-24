import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './select';
import { Label } from './label';
import { useSidebar } from './sidebar';

interface DropdownProps {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (
    event: React.ChangeEvent<{ value: string; name?: string }>
  ) => void;
  required?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  validation?: { message?: string; type?: 'error' | 'info' };
  indentType?: 'row' | 'col';
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      placeholder,
      options = [],
      value,
      onChange,
      required,
      name,
      disabled,
      readOnly,
      validation,
      id,
      indentType = 'col',
      ...props
    },
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const [helperText, setHelperText] = useState('');
    const { isMobile } = useSidebar();

    useEffect(() => {
      if (required && touched && !value) {
        setHelperText(`${label} field can't be empty..!`);
      } else if (validation?.message) {
        setHelperText(validation.message);
      } else {
        setHelperText('');
      }
    }, [touched, required, value, validation, label]);

    const handleTouch = () => {
      if (!disabled) setTouched(true);
    };

    const handleValueChange = (selectedValue: string) => {
      if (disabled || readOnly) return;

      if (onChange) {
        const event = {
          target: { value: selectedValue, name }
        } as React.ChangeEvent<{ value: string; name?: string }>;
        onChange(event);
      }
    };

    return (
      <div
        className={`flex ${
          isMobile
            ? 'flex-col items-start gap-1'
            : indentType === 'row'
              ? 'flex-row items-center justify-between'
              : 'w-full flex-col items-start gap-1'
        } `}
        ref={ref}
      >
        {label && (
          <Label className="line-clamp-1 h-6 w-56 min-w-32 text-sm">
            {label}
            {required && <span className="text-destructive"> &#42;</span>}
          </Label>
        )}
        <Select
          value={value}
          onValueChange={handleValueChange}
          required={required}
        >
          <SelectTrigger
            id={id}
            className={`${isMobile ? 'w-72' : 'w-full'} ${
              helperText && 'border-destructive'
            } ${readOnly && 'cursor-not-allowed opacity-50'}`}
            onFocus={handleTouch}
            disabled={disabled}
          >
            <SelectValue placeholder={value || placeholder} />
          </SelectTrigger>
          {!readOnly && (
            <SelectContent className="z-[100000]">
              <SelectGroup className="z-[100000]">
                {options?.map((option) => (
                  <SelectItem key={option?.value} value={option?.value}>
                    {option?.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          )}
        </Select>
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

export { Dropdown };
