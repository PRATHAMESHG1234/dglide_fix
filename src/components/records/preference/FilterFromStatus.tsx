import React from 'react';
import { useSelector } from 'react-redux';

type FilterOption = {
  optionId: number;
  value: string;
  label: string;
  count?: number;
};

type Field = {
  fieldInfoId: number;
  options: FilterOption[];
};

type FilterFromStatusProps = {
  onSearchFilter: (conditions: any[]) => void;
  selectedFilterTab: string | null;
  selectedCondition: any[];
  filterCount: Record<number, number>;
  field: Field;
};

const FilterFromStatus: React.FC<FilterFromStatusProps> = ({
  onSearchFilter,
  selectedFilterTab,
  selectedCondition,
  filterCount,
  field
}) => {
  const { currentTheme } = useSelector((state: any) => state.auth);

  const handleChange = (newValue?: string) => {
    const tabOptAll = {
      fieldInfoId: 0,
      operator: '',
      value: ''
    };
    const tabOpt = {
      fieldInfoId: field?.fieldInfoId,
      operator: '=',
      value: newValue || ''
    };

    const obj = newValue ? tabOpt : tabOptAll;

    if (selectedCondition.length > 0) {
      if (newValue) {
        const data = [
          {
            operator: 'AND',
            value: 'AND'
          }
        ];
        data.push(obj);

        const cond = selectedCondition.concat(data);
        onSearchFilter(cond);
      } else {
        onSearchFilter(selectedCondition);
      }
    } else if (obj) {
      onSearchFilter([obj]);
    }
  };

  const tabs = field?.options.map((optn) => {
    const optionId = optn?.optionId;
    if (Object.keys(filterCount).includes(optionId.toString())) {
      return {
        ...optn,
        count: filterCount[optionId]
      };
    }
    return optn;
  });

  return (
    <div
      className={`flex h-[35px] w-full items-center text-${
        currentTheme === 'Light' ? 'gray-900' : '[#f5f5f5]'
      } text-base`}
    >
      <label
        onClick={() => handleChange()}
        className={`flex h-[35px] cursor-pointer items-center text-sm font-semibold ${
          !selectedFilterTab
            ? 'border-b-2 border-secondary text-secondary'
            : 'border-b-2 border-transparent'
        }`}
      >
        All
      </label>

      {tabs?.map((opt) => {
        if (opt.count && opt.count > 0) {
          return (
            <label
              key={opt.optionId}
              onClick={() => handleChange(opt.value)}
              className={`ml-4 flex h-[35px] cursor-pointer items-center text-sm font-semibold ${
                selectedFilterTab === opt.value
                  ? 'border-b-2 border-secondary text-secondary'
                  : 'border-b-2 border-transparent'
              }`}
            >
              {opt.label}
              <div className="ml-1.5 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-secondary">
                {opt?.count}
              </div>
            </label>
          );
        }
        return null;
      })}
    </div>
  );
};

export default FilterFromStatus;
