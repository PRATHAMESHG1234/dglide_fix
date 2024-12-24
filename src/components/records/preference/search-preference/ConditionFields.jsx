import React from 'react';
import ConditionValueInput from './ConditionValueInput';
import { Dropdown } from '@/componentss/ui/dropdown';
const ConditionFields = ({
  condition,
  fields,
  operators,
  searchCriteriaHandler
}) => {
  return (
    <div className="flex w-[550px] gap-2">
      <div className="w-1/3">
        <Dropdown
          label="Column"
          id="input_category"
          options={fields || []}
          value={
            condition.fieldInfoId > 0
              ? condition.fieldInfoId
              : condition.defaultField || ''
          }
          onChange={(e) =>
            searchCriteriaHandler('field', e.target.value, condition)
          }
          placeholder="Select a column"
        />
      </div>
      <div className="w-1/3">
        <Dropdown
          label="Operator"
          id="input_operator"
          options={operators[condition.operatorType] || []}
          value={condition.operator || ''}
          onChange={(e) =>
            searchCriteriaHandler('operator', e.target.value, condition)
          }
          placeholder="Select an operator"
        />
      </div>
      <div className="w-1/3">
        <ConditionValueInput
          condition={condition}
          searchCriteriaHandler={searchCriteriaHandler}
        />
      </div>
    </div>
  );
};

export default ConditionFields;
