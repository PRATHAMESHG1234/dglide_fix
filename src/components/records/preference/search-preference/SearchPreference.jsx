import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Checkbox } from '@/componentss/ui/checkbox';
import { generateUId } from '../../../../common/utils/helpers';
import { Input } from '@/componentss/ui/input';
import { Textarea } from '@/componentss/ui/textarea';
import {
  createFilterPreference,
  deleteFilterPreference,
  fetchFilterPreference
} from '../../../../services/fieldPreference';

import {
  fetchFieldsByFormId,
  fetchRefLookupValuesByFieldInfoId
} from '../../../../services/field';
import ConditionButtons from './ConditionButtons';
import ConditionFields from './ConditionFields';
import SavedConditionsList from './SavedConditionsList';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader
} from '@/componentss/ui/sheet';
import { Separator } from '@/componentss/ui/separator';
import { Button } from '@/componentss/ui/button';

const operators = {
  String: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'like', value: 'LIKE' },
    { label: 'not like', value: 'NOT LIKE' },
    { label: 'in', value: 'IN' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ],
  Number: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'greater than or equal to', value: '>=' },
    { label: 'less than or equal to', value: '<=' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ],
  Date: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'greater than or equal to', value: '>=' },
    { label: 'less than or equal to', value: '<=' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ]
};

const SearchPreference = ({
  open,
  onSearchFilter,
  setShowSearchFilter,
  setSelectedCondition,
  conditions,
  setConditions,
  fields,
  setFields
}) => {
  const { currentForm } = useSelector((state) => state.current);
  const { currentUser } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState([]);
  const [name, setName] = useState('');

  const [filterSelected, setFilterSelected] = useState();
  const [filterStates, setFilterStates] = useState({
    showOnMenu: false,
    systemDefined: false,
    isDefault: false
  });
  const [tableColumns, setTableColumns] = useState([]);
  const [conditionText, setConditionText] = useState('');
  let refFieldDataArr = [];

  useEffect(() => {
    setConditionText((prev) =>
      prev.concat(`SELECT * FROM ${currentForm.name} WHERE`)
    );

    fetchFilterPreference(currentForm?.formInfoId).then((res) =>
      setFilters(res.result)
    );
  }, [currentForm]);

  useEffect(() => {
    const list = fields?.filter(
      (field) =>
        field.category !== 'TableReference' || field.category !== 'TableLookup'
    );
    setTableColumns(list);
  }, [fields]);

  const addSearchCondition = (type) => {
    setConditionText((prev) => prev?.concat(` ${type}`));
    if (type === '(' || type === ')') {
      setConditions((prev) => [
        ...prev,
        {
          operator: type
        }
      ]);
      return;
    }

    setConditions((prev) => [
      ...prev,
      {
        operator: type
      },
      {
        conditionId: generateUId(),
        fieldInfoId: 0,
        operator: '',
        value: ''
      }
    ]);
  };

  const searchCriteriaHandler = (criteria, value, currCondition) => {
    setConditionText((prev) => prev?.concat(` ${value}`));

    setConditions((prev) =>
      prev?.map((condition) => {
        if (condition.conditionId === currCondition.conditionId) {
          if (criteria === 'field') {
            const column = tableColumns?.find(
              (column) => column.fieldInfoId === value
            );

            const defaultField = tableColumns?.find(
              (fld) => fld.value === value
            );

            const selectedField = tableColumns.find(
              (f) => f.fieldInfoId === value
            );

            const isRefLookupField =
              selectedField?.category === 'Lookup' ||
              selectedField?.category === 'Reference';
            if (isRefLookupField) {
              const fetchRefLookupValue = async () => {
                try {
                  const response = await fetchRefLookupValuesByFieldInfoId(
                    value,
                    {
                      pagination: null,
                      payload: {},
                      search: null
                    }
                  );
                  const data = await response?.result?.data;

                  if (selectedField.variant === 'Grid') {
                    const parentFieldInfoId =
                      selectedField.lookup.parentFormInfoId;

                    if (parentFieldInfoId > 0) {
                      const res = await fetchFieldsByFormId(
                        selectedField.lookup.parentFormInfoId
                      );
                      const result = await res?.result;
                      const defaultParentField = await result?.find(
                        (f) => f.defaultLabel
                      );
                      const defaultFieldName =
                        await (defaultParentField?.name ||
                          selectedField.lookup.fieldName);
                      const gridData = await data.map((d) => ({
                        label: d[defaultFieldName],
                        value: d.uuid
                      }));

                      refFieldDataArr.push(...gridData);
                    } else {
                      const defaultFieldName =
                        await selectedField.lookup.fieldName;

                      const gridData = data.map((d) => ({
                        label: d[defaultFieldName],
                        value: d.uuid
                      }));

                      refFieldDataArr.push(...gridData);
                    }
                  } else {
                    for (let i = 0; i < data.length; i++) {
                      refFieldDataArr.push(data[i]);
                    }
                  }

                  const updatedFields = fields.map((field) => {
                    if (field.fieldInfoId === value) {
                      const dropdownType =
                        field.category === 'Lookup'
                          ? 'lookupDropdownData'
                          : 'referenceDropdownData';

                      return {
                        ...field,
                        [dropdownType]: refFieldDataArr
                      };
                    }

                    return field;
                  });

                  setFields(updatedFields);
                } catch (error) {
                  console.error(
                    'Error fetching reference/lookup values:',
                    error
                  );
                }
              };

              fetchRefLookupValue();
            }

            if (column) {
              const operatorType =
                column.category === 'Number'
                  ? 'Number'
                  : column.category === 'Date'
                    ? 'Date'
                    : 'String';

              const variant = column?.variant;

              return {
                ...condition,
                fieldInfoId: value,
                operatorType: operatorType,
                options: column.options || refFieldDataArr,
                variant: variant || '',
                category: column.category
              };
            } else if (defaultField) {
              return {
                ...condition,
                defaultField: value
              };
            } else {
              return condition;
            }
          }

          if (
            criteria === 'value' &&
            condition.operator === 'IN' &&
            condition.options
          ) {
            const selectedOptions = Array.isArray(value)
              ? value.map((optionValue) => {
                  const selectedOption = condition.options.find(
                    (option) => option.value == optionValue
                  );
                  return selectedOption ? selectedOption.value : '';
                })
              : [];

            return {
              ...condition,
              [criteria]: value
            };
          }

          return {
            ...condition,
            [criteria]: value
          };
        }
        return condition;
      })
    );
  };
  useEffect(() => {
    const text = conditions?.map((cond) => {
      const selectedField = tableColumns?.find((column) =>
        column.category !== 'Default'
          ? column.fieldInfoId === cond.fieldInfoId
          : column.value === cond?.defaultField
      );

      let options;
      if (selectedField?.options) {
        options = selectedField.options;
      } else if (selectedField?.category === 'Reference') {
        options = selectedField.referenceDropdownData;
      } else if (selectedField?.category === 'Lookup') {
        options = selectedField.lookupDropdownData;
      } else {
        options = selectedField?.options;
      }

      if (cond.operator === '(' || cond.operator === ')') {
        return ` ${cond.operator} `;
      } else if (cond.value !== undefined) {
        if (cond.operator === 'IN' && options) {
          const selectedValues = cond.value
            .split(',')
            .filter((val) => val)
            .map((val) => {
              const option = options.find((opt) => opt.value === val);
              return option ? option.label : val;
            })
            .join(', ');
          return ` ${selectedField?.label || ''} ${cond.operator} ${selectedValues} `;
        }

        const selectedOption = options?.find((opt) => opt.value === cond.value);
        return ` ${selectedField?.label || ''} ${cond.operator} ${
          selectedOption ? selectedOption.label : cond.value
        } `;
      } else {
        return ` ${cond.operator} `;
      }
    });

    setConditionText(text.join(''));
  }, [conditions, tableColumns]);

  const onClear = () => {
    setConditions([
      {
        conditionId: generateUId(),
        fieldInfoId: 0,
        operator: '',
        value: '',
        operatorType: ''
      }
    ]);
    setSelectedCondition([]);
  };
  const onSearchFilterSubmit = () => {
    const data = getConditions(conditions);
    onSearchFilter(data);
    setSelectedCondition(data);
  };

  const handleCheckboxChange = (name, checked) => {
    setFilterStates((prevStates) => ({
      ...prevStates,
      [name]: checked
    }));
  };

  const onFilterSubmit = () => {
    const conds = getConditions(conditions);
    const data = {
      conditions: conds,
      name,
      default: filterStates?.isDefault,
      showOnMenu: filterStates?.showOnMenu,
      systemDefined: filterStates?.systemDefined
    };
    createFilterPreference(currentForm?.formInfoId, data).then(() => {
      onSearchFilter(conds);
    });
    setSelectedCondition(conds);
  };

  const getConditions = (conditions) => {
    return conditions?.map((cond) => {
      return {
        fieldInfoId: cond.fieldInfoId,
        fieldName: cond.fieldName || cond.defaultField,
        operator: cond.operator,
        value: cond.value || cond.operator
      };
    });
  };

  const handleOnFilterSelected = (searchPreferenceId) => {
    const selectedFilter = filters.find(
      (fltr) => fltr.searchPreferenceId === +searchPreferenceId
    );

    if (selectedFilter) {
      setFilterSelected(selectedFilter);
      setConditions(selectedFilter.conditions);
    } else {
      console.error('Filter not found for ID:', searchPreferenceId);
    }
  };

  const deleteHandler = () => {
    deleteFilterPreference(
      currentForm?.formInfoId,
      filterSelected.searchPreferenceId
    ).then(() => {
      const newFilters = filters?.filter(
        (fltr) => fltr.searchPreferenceId !== filterSelected.searchPreferenceId
      );
      setFilters(newFilters);
      setConditions([
        {
          conditionId: generateUId(),
          fieldInfoId: 0,
          operator: '',
          value: '',
          operatorType: ''
        }
      ]);
      setFilterSelected(null);
    });
  };

  return (
    <Sheet
      key={'right'}
      open={open}
      onOpenChange={() => setShowSearchFilter(false)}
    >
      <SheetContent
        side={'right'}
        className="w-[600px] min-w-[600px] max-w-[600px] sm:max-w-[600px]"
      >
        <SheetHeader className="flex w-full flex-row items-center justify-between pt-3">
          <SheetTitle className="flex w-full flex-row items-center justify-between text-lg font-semibold">
            Advanced Filters
          </SheetTitle>
        </SheetHeader>
        <div className="py-2">
          <Separator className="h-[1px]" />
        </div>
        <div className="flex w-[550px] min-w-[550px] max-w-[550px] flex-col gap-2 rounded-md sm:max-w-[550px]">
          <SavedConditionsList
            filters={filters}
            filterSelected={filterSelected}
            handleOnFilterSelected={handleOnFilterSelected}
            deleteHandler={deleteHandler}
          />
          <div className="flex flex-col gap-3">
            {conditions
              ?.filter((f) => f.conditionId)
              ?.map((condition, index) => {
                const Fields = tableColumns?.map((ele) => {
                  return {
                    value: ele.value || ele.fieldInfoId,
                    label: ele.label
                  };
                });

                return (
                  <div className="flex py-2" key={index}>
                    <ConditionFields
                      condition={condition}
                      fields={Fields}
                      operators={operators}
                      searchCriteriaHandler={searchCriteriaHandler}
                    />
                  </div>
                );
              })}
            <ConditionButtons addSearchCondition={addSearchCondition} />

            <Textarea
              label="Selected Condition"
              id="outlined-multiline-static"
              multiline
              rows={4}
              value={conditionText}
              focused={false}
              readonly
              className="w-full"
            />
            <Input
              label="Condition Name"
              id="input_category"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Checkbox
            name="showOnMenu"
            checked={filterStates.showOnMenu}
            onCheckedChange={(checked) =>
              handleCheckboxChange('showOnMenu', checked)
            }
            endLabel="Show this condition in the menu"
          />
          {currentUser?.role?.level == 1 && (
            <Checkbox
              name="systemDefined"
              checked={filterStates.systemDefined}
              onCheckedChange={(checked) =>
                handleCheckboxChange('systemDefined', checked)
              }
              endLabel="Mark this condition as system-defined filter"
            />
          )}
          <Checkbox
            name="isDefault"
            checked={filterStates.isDefault}
            onCheckedChange={(checked) =>
              handleCheckboxChange('isDefault', checked)
            }
            endLabel="Set this condition as the default filter"
          />

          <div className="flex items-center space-x-4 py-2">
            <Button
              onClick={name === '' ? onSearchFilterSubmit : onFilterSubmit}
            >
              Submit
            </Button>
            <Button variant="outline" onClick={() => onClear()}>
              Clear
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchPreference;
