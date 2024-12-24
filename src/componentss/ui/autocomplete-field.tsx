import { Search, X } from 'lucide-react';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';
import { useSidebar } from '@/componentss/ui/sidebar';
import { cn } from '@/lib/utils';
import debounce from 'lodash/debounce';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/componentss/ui/select';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface ValidationProps {
  message?: string;
  type?: string;
}

interface AutocompleteFieldProps {
  name: string;
  label: string;
  value: string;
  formObj: Record<string, any>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetchData: (data: {
    query: string;
    page: number;
    payload: Record<string, any>;
  }) => Promise<Option[]>;
  lookupConditions: { value: string }[];
  options: Option[];
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  indentType?: 'col' | 'row';
  validation?: ValidationProps;
}

const ScrollDownButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex items-center justify-center gap-2 rounded-md p-1 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-accent hover:text-blue-800 focus:underline focus:outline-none active:scale-95',
      className
    )}
    {...props}
    onClick={onClick}
  >
    <ChevronDown size={18} className="text-blue-600" />
    <span>Show More</span>
  </button>
));

ScrollDownButton.displayName = 'ScrollDownButton';

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  name,
  label,
  value,
  formObj,
  onChange,
  fetchData,
  lookupConditions,
  options,
  readOnly = false,
  required,
  placeholder,
  indentType = 'col',
  validation
}) => {
  const [inputValue, setInputValue] = useState('');
  const [fieldOptions, setFieldOptions] = useState<Option[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [touched, setTouched] = useState(false);
  const { isMobile } = useSidebar();
  const debouncedFetchData = debounce(
    async (query: string, page: number, formObj: Record<string, any>) => {
      const conditions = lookupConditions;
      const payload = conditions?.reduce(
        (acc, cond) => {
          return {
            ...acc,
            [cond?.value]: formObj?.[cond?.value]
          };
        },
        {} as Record<string, any>
      );

      setLoading(true);
      const data = { query, page, payload };
      try {
        const newOptions = await (typeof fetchData === 'function' &&
          fetchData(data));
        setFieldOptions((prevOptions) =>
          page === 0
            ? newOptions || []
            : [...prevOptions, ...(newOptions || [])]
        );
      } finally {
        setLoading(false);
      }
    },
    300
  );

  const dropdownData = options;

  useEffect(() => {
    if (dropdownData?.length > 0) {
      setFieldOptions(dropdownData);
    }
  }, [dropdownData]);

  useEffect(() => {
    if (inputValue.length >= 4) {
      setFieldOptions([]);
      debouncedFetchData(inputValue, 0, formObj);
    }
  }, [inputValue]);

  useEffect(() => {
    if (page === 0 && inputValue.length === 0) {
      debouncedFetchData('', 0, formObj);
    }
  }, [page, inputValue, formObj]);

  useEffect(() => {
    // Validation Logic
    if (touched) {
      if (required && !value) {
        setHelperText('This field is required!');
      } else if (validation?.message) {
        setHelperText(validation.message);
      } else {
        setHelperText('');
      }
    }
  }, [touched, value, required, validation]);

  const handleOnChange = useCallback(
    (newValue: string) => {
      if (!readOnly) {
        const syntheticEvent = {
          target: {
            name: name,
            value: newValue || ''
          }
        };
        setTyping(true);

        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
      if (!newValue) {
        setPage(0);
        setTyping(true);
      }
    },
    [name, onChange, inputValue, readOnly]
  );

  const filteredOptions = fieldOptions.filter((option) =>
    option.label?.toLowerCase()?.includes(inputValue?.toLowerCase())
  );

  const handleScroll = () => {
    if (!loading && !readOnly) {
      const newPage = page + 1;
      setLoading(true);
      handleScrollEnd(newPage, formObj);
    }
  };

  const handleScrollEnd = useCallback(
    async (newPage: number, formObj: Record<string, any>) => {
      await debouncedFetchData(inputValue, newPage, formObj);
      setPage(newPage);
      setLoading(false);
    },
    [inputValue, page, readOnly]
  );

  const handleClose = useCallback(() => {
    setInputValue('');
    debouncedFetchData('', 0, formObj);
    if (page !== 0) {
      setPage(0);
    }
  }, [debouncedFetchData, page, formObj]);

  const scrollDownButtonRef = useRef<HTMLButtonElement>(null);

  const isRequeredField = required;

  return (
    <div
      className={`flex ${isMobile ? 'flex-col items-start gap-1' : indentType === 'row' ? 'flex-row items-center justify-between' : 'flex-col items-start gap-1'} `}
    >
      {label && (
        <Label className="line-clamp-1 min-w-32 text-sm w-56">
          {label}
          {isRequeredField && <span className="text-destructive"> &#42;</span>}
        </Label>
      )}
      <div
        className={`relative flex items-center ${isMobile ? 'w-72' : 'w-full'}`}
      >
        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        <Select
          onValueChange={(value) => handleOnChange(value)}
          value={value}
          disabled={readOnly}
        >
          <SelectTrigger
            className={`${isMobile ? 'w-72' : 'w-full'} ${helperText && 'border-destructive'}`}
            disabled={readOnly}
          >
            <SelectValue placeholder={placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-auto">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={'Search...'}
                startIcon={<Search size={16} className="text-gray-500" />}
                endIcon={
                  inputValue && (
                    <X
                      size={16}
                      onClick={() => {
                        handleClose();
                        setPage(0);
                        setInputValue('');
                      }}
                      className="cursor-pointer bg-transparent text-gray-500 hover:bg-slate-400 hover:text-gray-700"
                    />
                  )
                }
                indentType={indentType}
                disabled={readOnly}
              />
            </div>
            <SelectGroup>
              {filteredOptions?.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
            {loading ? (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 transform">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <ScrollDownButton
                ref={scrollDownButtonRef}
                onClick={handleScroll}
              />
            )}
          </SelectContent>
        </Select>
        {/* {helperText && (
          <p
            className={`text-sm ${validation?.type === 'error' ? 'text-red-500' : 'text-green-500'}`}
          >
            {helperText}
          </p>
        )} */}
      </div>
    </div>
  );
};

export { AutocompleteField };
