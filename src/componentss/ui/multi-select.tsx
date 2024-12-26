import { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { Input } from './input';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useSidebar } from './sidebar';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (event: { target: { value: string[]; name: string } }) => void;
  selectedValues?: string[];
  required?: boolean;
  maxLength?: number;
  label?: string;
  name?: string;
  id?: string;
  validation?: {
    type?: string;
    message?: string;
  };
  selectType?: string;
  indentType?: 'row' | 'col';
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  placeholder = 'Select options...',
  onChange,
  selectedValues = [],
  required = false,
  maxLength,
  label,
  name,
  id,
  validation,
  selectType = 'multi',
  indentType = 'col'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [touched, setTouched] = useState(false);
  const [helperText, setHelperText] = useState('');
  const { isMobile } = useSidebar();
  console.log(options, 'options');
  const toggleOption = (value: string) => {
    let updatedValues = [];
    if (selectType === 'single') {
      updatedValues = [value];
    } else {
      updatedValues = selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value];
    }

    const event = {
      target: {
        value: updatedValues,
        name: name || ''
      }
    };

    if (onChange) {
      onChange(event);
    }
  };

  const filteredOptions = options?.filter((option) =>
    option.label?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  useEffect(() => {
    if (touched) {
      if (required && selectedValues.length === 0) {
        setHelperText(`${label} field can't be empty!`);
      } else if (maxLength && selectedValues.length > maxLength) {
        setHelperText(`Maximum ${maxLength} options allowed!`);
      } else if (validation?.type) {
        setHelperText(validation.message || `${label} field can't be empty!`);
      } else {
        setHelperText('');
      }
    }
  }, [touched, selectedValues, required, maxLength, validation, label]);

  const handleTouch = () => {
    setTouched(true);
  };

  return (
    <div
      className={`flex ${isMobile ? 'flex-col items-start gap-1' : indentType === 'row' ? 'flex-row items-center justify-between' : 'flex-col items-start gap-1'} `}
    >
      {label && (
        <Label className="line-clamp-1 h-6 w-56 min-w-32 text-sm">
          {label}
          {required && <span className="text-destructive"> &#42;</span>}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild className="h-9" id={id}>
          <button
            className={`flex items-center justify-between rounded-md border border-gray-300 bg-[#f7f8fa] px-2 py-2 ${isMobile ? 'w-72' : 'w-full'}`}
            onFocus={handleTouch}
          >
            <div className="my-2 flex h-7 items-center gap-1 overflow-hidden">
              {selectedValues.length > 0 ? (
                <div className="relative flex h-full w-full items-center gap-1 overflow-hidden">
                  <div className="flex items-center gap-1 truncate">
                    {selectedValues.map((value) => {
                      const option = options.find((o) => o.value === value);
                      return (
                        <Label
                          key={value}
                          className="shrink-0 rounded-sm bg-secondary/30 px-2 py-1 text-xs"
                        >
                          {option?.label}
                        </Label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <span className="text-accent">{placeholder}</span>
              )}
            </div>
            {isOpen ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-full">
          <Input
            type="text"
            placeholder="Search..."
            startIcon={<Search size={16} />}
            endIcon={
              <X
                size={16}
                onClick={() => setSearchQuery('')}
                className="cursor-pointer"
              />
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Label
                  key={option.value}
                  className="my-1 flex cursor-pointer items-center rounded-md py-2 ps-2 hover:bg-[#e3f2fdc4]"
                >
                  <Checkbox
                    endLabel={option.label}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={() => toggleOption(option.value)}
                  />
                </Label>
              ))
            ) : (
              <p className="text-gray-500">No options found.</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
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
};

export { MultiSelect };
