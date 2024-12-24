import React from 'react';
import { variants } from '../../../common/utils/fields';
import { Dropdown } from '@/componentss/ui/dropdown';
import { RadioGroup } from '@/componentss/ui/radio-group';

const VariantOptions = ({ category, variant, onVariantChange }) => {
  const handleVariantChange = (event) => {
    onVariantChange(event.target.value);
  };

  return (
    <>
      {category !== 'TableReference' ? (
        <div className="py-1">
          <Dropdown
            label={'Variant'}
            id={`dropdown-variant`}
            name="variant"
            value={variant}
            onChange={handleVariantChange}
            options={variants?.[category]?.map((variant) => {
              return {
                label: variant.label,
                value: variant.name
              };
            })}
          />
        </div>
      ) : (
        <div className="px-1 py-2">
          <RadioGroup
            id={`radioGroup-variant`}
            label={'Variant'}
            value={variant}
            name={'variant'}
            onChange={handleVariantChange}
            options={variants[category]?.map((o) => {
              return {
                label: o.label,
                value: o.name
              };
            })}
          />
        </div>
      )}
    </>
  );
};

export default VariantOptions;
