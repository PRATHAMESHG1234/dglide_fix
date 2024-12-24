import React from 'react';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Label } from '@/componentss/ui/label';

const SortByOptions = ({ onFormValueChanged, columns, form }) => {
  const sortedValue = form?.sortBy;

  return (
    <>
      <div className="py-2">
        <Label level="title-sm" paddingY="10px">
          Sort by
        </Label>

        <Dropdown
          id={'dropdown-sortBy'}
          name="sortBy"
          value={sortedValue}
          onChange={onFormValueChanged}
          options={columns
            .filter((f) => f.category === 'Date')
            .map((field) => {
              return {
                value: field.name,
                label: field.label
              };
            })}
        />
      </div>
    </>
  );
};

export default SortByOptions;
