import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Dropdown } from '@/componentss/ui/dropdown';

const Header = ({ moduleList, formList, onModuleSelect, onFormSelect }) => {
  const [moduleSelected, setModuleSelected] = useState('');
  const [formSelected, setFormSelected] = useState('');
  const { state } = useLocation();

  useEffect(() => {
    if (state?.moduleId) handleModuleSelect(state.moduleId);
    if (state?.formId) handleFormSelect(state.formId);
  }, [state]);

  const handleModuleSelect = useCallback(
    (value) => {
      setModuleSelected(value);
      onModuleSelect(value);
    },
    [onModuleSelect]
  );

  const handleFormSelect = useCallback(
    (value) => {
      setFormSelected(value);
      onFormSelect(value);
    },
    [onFormSelect]
  );

  const getDropdownOptions = useCallback(
    (list, key) =>
      list?.map((item) => ({
        value: item[key] || '',
        label: item.displayName
      })),
    []
  );

  return (
    <div className="flex w-full justify-end gap-2">
      <div className="w-full">
        <Dropdown
          id="dropdown-module"
          label="Module"
          name="module"
          value={moduleSelected}
          onChange={(e) => handleModuleSelect(e.target.value)}
          options={getDropdownOptions(moduleList, 'moduleInfoId') || []}
        />
      </div>
      <div className="w-full">
        <Dropdown
          id="dropdown-form"
          label="Form"
          name="form"
          value={formSelected}
          onChange={(e) => handleFormSelect(e.target.value)}
          options={getDropdownOptions(formList, 'formInfoId') || []}
        />
      </div>
    </div>
  );
};

export default React.memo(Header);
