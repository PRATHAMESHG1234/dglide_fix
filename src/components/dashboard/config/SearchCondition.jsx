import React from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SelectField from '../../../elements/SelectField';
import ConditionValueInput from '../../records/preference/search-preference/ConditionValueInput';
import { colors } from '../../../common/constants/styles';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Trash2 } from 'lucide-react';
const SearchCondition = ({
  condition,
  index,
  tableColumns,
  operators,
  searchCriteriaHandler,
  deleteSearchCondition,
  pageView = ''
}) => {
  const Fields = tableColumns
    ?.filter((f) => f.category !== 'TableReference')
    ?.map((ele) => ({
      value: ele.value || ele.fieldInfoId,
      label: ele.label,
      category: ele.category
    }));
  const tableColumn = tableColumns.find(
    (f) => f.fieldInfoId === condition.fieldInfoId
  );

  const options = condition.options
    ? [
        {
          label: `\${${tableColumn?.label}}`,
          value: `\${${tableColumn?.name}}`,
          valueDynamic: true
        },
        ...condition.options
      ]
    : [
        {
          label: `\${${tableColumn?.label}}`,
          value: `\${${tableColumn?.name}}`,
          valueDynamic: true
        }
      ];

  return (
    <div className="flex gap-2 pb-2 pt-1" key={index}>
      <Dropdown
        label="Column"
        placeholder="Select Column"
        options={
          Array.isArray(Fields) && Fields.length > 0
            ? Fields.map((option) => ({
                value: option.value, // Adjust based on your data structure
                label: option.label // Adjust based on your data structure
              }))
            : []
        }
        value={condition.fieldInfoId || ''}
        onChange={(e) =>
          searchCriteriaHandler('field', e.target.value, condition)
        }
        required={true}
        id="input_category"
        disabled={false}
      />

      <Dropdown
        label="Operator"
        placeholder="Select Operator"
        options={
          Array.isArray(operators[condition.operatorType]) &&
          operators[condition.operatorType].length > 0
            ? operators[condition.operatorType].map((option) => ({
                value: option.value, // Adjust based on your data structure
                label: option.label // Adjust based on your data structure
              }))
            : []
        }
        value={condition.operator || ''}
        onChange={(e) =>
          searchCriteriaHandler('operator', e.target.value, condition)
        }
        required={true}
        id="input_operator"
        disabled={false}
      />

      {condition?.operator === 'BETWEEN' ? (
        <div
          style={{
            width: condition?.operator === 'BETWEEN' && '180%',
            cursor: condition?.operator === 'BETWEEN' && 'pointer'
          }}
        >
          <ConditionValueInput
            condition={condition}
            searchCriteriaHandler={searchCriteriaHandler}
            pageView={pageView}
            dashboardFieldOptions={options}
          />
        </div>
      ) : (
        <ConditionValueInput
          condition={condition}
          searchCriteriaHandler={searchCriteriaHandler}
          pageView={pageView}
          dashboardFieldOptions={options}
        />
      )}

      <div
        className="mt-6 flex cursor-pointer items-center rounded-md border bg-accent px-1 text-destructive hover:bg-destructive hover:text-white"
        onClick={() => deleteSearchCondition(condition?.conditionId)}
      >
        <Trash2 size={18} className="" />
      </div>
    </div>
  );
};

export default SearchCondition;
