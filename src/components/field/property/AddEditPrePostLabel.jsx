import React from 'react';
import { Input } from '@/componentss/ui/input';

const AddEditPrePostLabel = ({ form, onFormValueChanged }) => {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex w-1/2 flex-col py-2 pt-3">
        <Input
          label="Prefix Text"
          variant="outlined"
          type="text"
          placeholder="text"
          name="preLabelText"
          onChange={onFormValueChanged}
          value={form.preLabelText || ''}
        />
      </div>
      <div className="flex w-1/2 flex-col py-2 pt-3">
        <Input
          label="Suffix Text"
          fullWidth
          variant="outlined"
          type="text"
          placeholder="text"
          name="postLabelText"
          onChange={onFormValueChanged}
          value={form.postLabelText || ''}
        />
      </div>
    </div>
  );
};

export default AddEditPrePostLabel;
