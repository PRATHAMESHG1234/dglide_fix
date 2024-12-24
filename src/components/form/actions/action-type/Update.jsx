import React, { useState } from 'react';
import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Plus, Trash } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

const Update = ({
  actionObj,
  handleChange,
  addOperationHandler,
  fields,
  optionsCheckType,
  fieldDeleteHandler
}) => {
  const [optObj, setOptObj] = useState(null);

  return (
    <>
      {optionsCheckType(actionObj?.options)?.map((optObj, index) => {
        const field = fields?.map((fld) => {
          return {
            value: fld.fieldInfoId,
            label: fld.label
          };
        });

        const handleOptionChange = (newValue) => {
          setOptObj(newValue);
        };

        return (
          <div
            key={optObj.id}
            style={{
              width: '100%',
              margin: '10px 0'
            }}
          >
            <div className="flex w-full items-center space-x-4">
              <Dropdown
                label={'Field'}
                name={'Field'}
                value={optObj.fieldInfoId}
                onChange={(e) => {
                  handleChange('fieldInfoId', e.target.value, optObj);
                  handleOptionChange(optObj);
                }}
                options={field}
              />
              <>
                {actionObj.type === 'Update' && (
                  <>
                    {optObj?.fieldOption ? (
                      <Dropdown
                        label={'Value'}
                        name={'value'}
                        value={actionObj.value}
                        onChange={(e) =>
                          handleChange('value', e.target.value, optObj)
                        }
                        options={optObj.fieldOption}
                      />
                    ) : (
                      <Input
                        label="Value"
                        name="value"
                        helpertext="none"
                        value={optObj.value}
                        onChange={(e) =>
                          handleChange('value', e.target.value, optObj)
                        }
                      />
                    )}
                  </>
                )}
              </>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className="mt-7 flex items-center justify-center p-1"
                    onClick={() =>
                      fieldDeleteHandler(
                        index,
                        optionsCheckType(actionObj?.options)
                      )
                    }
                    style={{
                      border: '1px solid lightgrey',
                      color: 'red',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash size={18} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
          </div>
        );
      })}

      <div className="my-2">
        <div className="flex items-center justify-center">
          <div
            className="flex cursor-pointer rounded-full border border-accent bg-accent p-1 px-2 hover:bg-slate-200"
            onClick={() => addOperationHandler(actionObj, optObj)}
          >
            <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-slate-500 bg-accent">
              <Plus size={12} />
            </div>
            <span className="text-xs">Add Action</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Update;
