import * as React from 'react';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { useSidebar } from './sidebar';

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (event: { target: { name: string; value: string[] } }) => void;
  className?: string;
  label?: string;
  name: string;
  required?: boolean;
  indentType?: 'row' | 'col';
  validation?: {
    message?: string;
    type?: 'error' | 'info';
  };
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues = [],
  onChange,
  className,
  label,
  name,
  indentType,
  required = false,
  validation
}) => {
  const { isMobile } = useSidebar();

  const [touched, setTouched] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const updatedValues = checked
      ? [...selectedValues, value]
      : selectedValues?.filter((val) => val !== value);

    const syntheticEvent = {
      target: {
        name,
        value: updatedValues
      }
    };

    onChange(syntheticEvent);
  };

  React.useEffect(() => {
    if (required && touched && selectedValues.length === 0) {
      setHelperText(
        validation?.message || 'At least one option must be selected!'
      );
    } else {
      setHelperText('');
    }
  }, [touched, selectedValues, required, validation]);

  return (
    <div
      className={`flex ${isMobile ? 'w-full flex-col items-start gap-1' : indentType === 'row' ? 'flex-row items-start justify-between' : 'w-full flex-col items-start gap-1'} `}
    >
      {label && (
        <Label
          className={`line-clamp-1 min-w-32 text-sm w-56 ${indentType === 'row' && 'py-2'} `}
        >
          {label}
          {required && <span className="text-destructive"> &#42;</span>}
        </Label>
      )}

      <div className="flex w-full flex-col gap-y-4">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            startLabel={option.label}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(checked: boolean) =>
              handleCheckboxChange(option.value, checked)
            }
          />
        ))}
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

export { CheckboxGroup };
