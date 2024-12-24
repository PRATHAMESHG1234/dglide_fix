import React from 'react';
import { Input } from '@/componentss/ui/input';

const Url = ({ actionObj, handleChange, optionsCheckType }) => {
  return (
    <>
      {optionsCheckType(actionObj?.options)?.map((urlObj) => {
        return (
          <div className="flex w-full space-x-2">
            <Input
              label="URL"
              name="url"
              helpertext="none"
              value={urlObj.url}
              onChange={(e) => {
                handleChange('url', e.target.value, urlObj);
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default Url;
