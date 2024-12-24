import React from 'react';
import SelectField from '../../../../elements/SelectField';
import { Autocomplete } from '@mui/material';
import TextField from '../../../../elements/TextField';
import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { MultiSelect } from '@/componentss/ui/multi-select';
import { Label } from '@/componentss/ui/label';
import { colors } from '../../../../common/constants/styles';

const ConditionValueInput = ({
  condition,
  searchCriteriaHandler,
  pageView = '',
  dashboardFieldOptions
}) => {
  const options =
    pageView === 'Dashboard' ? dashboardFieldOptions : condition?.options;

  return (
    <>
      {condition.operator === 'IS EMPTY' ||
      condition.operator === 'IS NOT EMPTY' ? null : options ? (
        condition.operator === 'IN' ? (
          <MultiSelect
            id={`multiSelect-value`}
            label="Value"
            name={'value'}
            selectedValues={condition.value ? condition.value.split(',') : []}
            onChange={(e) => {
              const selectedValues = e.target.value;

              searchCriteriaHandler(
                'value',
                selectedValues.join(','),
                condition
              );
            }}
            options={options || []}
            required={true}
          />
        ) : (
          <div className="flex w-full">
            {condition.category === 'Lookup' ||
            condition.category === 'Reference' ? (
              <>
                {condition.operator === 'LIKE' ||
                condition.operator === 'NOT LIKE' ? (
                  <div className="flex w-full">
                    <Input
                      type={
                        condition.operatorType === 'String' ? 'Text' : 'Number'
                      }
                      label="Value"
                      value={condition.value || ''}
                      onChange={(e) =>
                        searchCriteriaHandler(
                          'value',
                          e.target.value,
                          condition
                        )
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <Label className="line-clamp-1 pb-[2px] text-sm">
                      Value
                    </Label>
                    <Autocomplete
                      disablePortal
                      id={`autocomplete_category`}
                      size="small"
                      options={options}
                      value={
                        options.find(
                          (option) => option.value === condition.value
                        ) || ''
                      }
                      getOptionLabel={(option) => option.label || ''}
                      onChange={(event, newValue) => {
                        const selectedValue = newValue ? newValue.value : '';
                        searchCriteriaHandler(
                          'value',
                          selectedValue,
                          condition
                        );
                      }}
                      ListboxProps={{
                        sx: {
                          fontSize: '0.875rem'
                        }
                      }}
                      sx={{
                        '& .MuiAutocomplete-input, & .MuiInputLabel-root': {
                          fontSize: '0.875rem'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '0.875rem'
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          value={params.inputProps?.value || ''}
                          fullWidth
                          variant="outlined"
                          type={'text'}
                          {...params}
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: '0.875rem',
                              height: '37.5px',
                              p: 0,
                              px: 1,
                              paddingBottom: '10px'
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.875rem',
                              paddingBottom: '10px'
                            },

                            '& .MuiFormLabel-root': {
                              fontSize: '0.875rem',
                              paddingBottom: '10px'
                            },
                            input: {
                              cursor: 'text'
                            },
                            fontSize: '0.875rem',
                            minWidth: '160px'
                          }}
                        />
                      )}
                    />
                  </div>
                )}
              </>
            ) : condition.category === 'DropDown' ? (
              <Dropdown
                label="Value"
                id="input_category"
                options={options || []}
                value={condition.value || ''}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  searchCriteriaHandler('value', selectedValue, condition);
                }}
                placeholder="Select a value"
              />
            ) : condition.operatorType === 'Date' ? (
              <>
                {condition?.operator !== 'BETWEEN' ? (
                  <Input
                    label="Value"
                    value={condition.value || ''}
                    type={
                      condition.variant === 'DateTime'
                        ? 'datetime-local'
                        : 'date'
                    }
                    onChange={(e) =>
                      searchCriteriaHandler('value', e.target.value, condition)
                    }
                  />
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-grow">
                      <Input
                        label="Start Date"
                        value={`\${Start Date}`}
                        type={'text'}
                      />
                    </div>
                    <div className="flex-grow">
                      <Input
                        label="End Date"
                        value={`\${End Date}}`}
                        type={'text'}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex w-full">
                <Input
                  type={condition.operatorType === 'String' ? 'Text' : 'Number'}
                  label="Value"
                  value={condition.value || ''}
                  onChange={(e) =>
                    searchCriteriaHandler('value', e.target.value, condition)
                  }
                />
              </div>
            )}
          </div>
        )
      ) : (
        <div className="flex w-full">
          <Input
            type={condition.operatorType === 'String' ? 'Text' : 'Number'}
            label="Value"
            value={condition.value || ''}
            onChange={(e) =>
              searchCriteriaHandler('value', e.target.value, condition)
            }
          />
        </div>
      )}
    </>
  );
};

export default ConditionValueInput;
