import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Label } from './label';
import { Radio, RadioItem } from './radio';
import { useSidebar } from './sidebar';
interface RadioOption {
  label: string;
  value: string;
}
interface RadioGroupProps {
  options: RadioOption[];
  value: string | null;
  onChange?: (
    event: React.ChangeEvent<{ value: string; name?: string }>
  ) => void;
  label?: string;
  required?: boolean;
  id?: string;
  name?: string;
  indentType?: 'row' | 'col';
  validation?: {
    message?: string;
    type?: 'error' | 'info';
  };
  className?: string;
  optionLabelPosition?: 'end' | 'start';
}
const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  required = false,
  validation,
  id,
  name,
  className,
  indentType,
  optionLabelPosition
}) => {
  const { isMobile } = useSidebar();

  const [touched, setTouched] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  React.useEffect(() => {
    if (required && touched && !value) {
      setHelperText(validation?.message || 'Please select an option!');
    } else {
      setHelperText('');
    }
  }, [value, touched, required, validation]);

  const handleChange = (selectedValue: string) => {
    setTouched(true);

    const event = {
      target: {
        value: selectedValue,
        name: name || ''
      }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(event);
  };

  return (
    <div
      className={`flex ${isMobile ? 'w-full flex-col items-start gap-1' : indentType === 'row' ? 'flex-row items-start justify-between' : 'w-full flex-col items-start gap-1'} `}
    >
      {label && (
        <Label
          className={`line-clamp-1 h-6 min-w-32 text-sm w-56 ${indentType === 'row' && 'py-2'} `}
        >
          {label}
          {required && <span className="text-destructive"> &#42;</span>}
        </Label>
      )}
      <div className="w-full">
        <Radio
          className="flex flex-col"
          value={value || ''}
          onValueChange={handleChange}
          id={id}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-x-2 pb-4">
              {optionLabelPosition === 'start' && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="line-clamp-1 w-20 max-w-16 text-sm">
                        {option.label}
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>{option.label}</TooltipContent>
                  </Tooltip>
                  <RadioItem className="" value={option.value} />
                </>
              )}
              {optionLabelPosition !== 'start' && (
                <>
                  <RadioItem className="" value={option.value} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="line-clamp-1 w-40 max-w-40 text-sm">
                        {option.label}
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>{option.label}</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          ))}
        </Radio>
      </div>
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
};

export { RadioGroup };
