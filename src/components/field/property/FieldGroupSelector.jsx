import React from 'react';
import { Dropdown } from '@/componentss/ui/dropdown';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';

import { Settings, SquarePlus } from 'lucide-react';

const FieldGroupSelector = ({
  fieldGroups,
  form,
  onFormValueChanged,
  setOpenFieldGroupModal,
  setFieldGroupActions
}) => {
  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="flex items-center justify-end gap-2">
        <Tooltip>
          <TooltipTrigger>
            <SquarePlus
              size={17}
              onClick={(e) => {
                e.preventDefault();
                setOpenFieldGroupModal(true);
              }}
              className="cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
            Add
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Settings
              size={17}
              onClick={(e) => {
                e.preventDefault();
                setFieldGroupActions(true);
              }}
              className="cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
            Actions
          </TooltipContent>
        </Tooltip>
      </div>

      <Dropdown
        id="dropdown-fieldGroup"
        label="Group"
        name="fieldGroupInfoId"
        value={parseInt(form?.fieldGroupInfoId) || 0}
        onChange={onFormValueChanged}
        options={fieldGroups?.map((group) => {
          return {
            value: group.fieldGroupInfoId,
            label: group.name
          };
        })}
      />
    </div>
  );
};

export default FieldGroupSelector;
