import React from 'react';
import { toSnakeCase } from '../../../common/utils/helpers';
import { Input } from '@/componentss/ui/input';

const AddEditFieldName = ({ form, setForm, onFormValueChanged, field }) => {
  const handleBlur = (name, value) => {
    if (name && value) {
      const trimmedValue = value.trim();
      const modifiedStr = toSnakeCase(trimmedValue);

      setForm((prevForm) => ({
        ...prevForm,
        [name]: trimmedValue,
        name: modifiedStr
      }));
    }
  };

  return (
    <>
      <div className="flex w-full items-center gap-2 py-2">
        <div className="flex w-1/2 flex-col">
          <Input
            label="Label"
            fullWidth
            type="text"
            placeholder="Label"
            name="label"
            onChange={onFormValueChanged}
            value={form.label}
            focused={field.systemDefaultField && false}
            inputProps={{ readOnly: field.systemDefaultField && true }}
            onBlur={() => handleBlur('label', form.label)}
          />
        </div>
        <div className="flex w-1/2 flex-col">
          <Input
            label="Name"
            fullWidth
            type="text"
            placeholder="Label"
            name="label"
            onChange={onFormValueChanged}
            value={form.name}
            focused={false}
            disabled={true}
          />
        </div>
      </div>
    </>
  );
};

export default AddEditFieldName;
