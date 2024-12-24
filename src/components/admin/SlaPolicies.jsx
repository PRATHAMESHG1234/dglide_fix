import React, { useEffect, useState } from 'react';
import AddEditRecord from '../modify-record/addEditRecord/AddEditRecord';
import SelectField from '../../elements/SelectField';
import { colors, COLORS } from '../../common/constants/styles';
import { alpha } from '@mui/material/styles';
import { fetchRecordsBytableName } from '../../services/table';
import { convertToMinutes } from '../../common/utils/helpers';
import TextField from '../../elements/TextField';
import ConditionValueInput from '../records/preference/search-preference/ConditionValueInput';
import {
  fetchFieldsByFormId,
  fetchRefLookupValuesByFieldInfoId
} from '../../services/field';
import { fetchModules } from '../../services/module';
import { fetchForms, fetchFormsByModuleId } from '../../services/form';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Button } from '@/componentss/ui/button';

const FILTERED_FIELDS = [
  'condition',
  'sla_start_condition',
  'sla_stop_condition',
  'shift',
  'target_time',
  'table',
  'module'
];

const operators = {
  String: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'like', value: 'LIKE' },
    { label: 'not like', value: 'NOT LIKE' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ]
};

export const SlaPolicies = ({
  newRecord,
  fieldData,
  onSubmitAllData,
  fieldValues,
  showSystemDefaultField,
  selectedRecordId,
  fieldGroups,
  formId
}) => {
  const [slaFieldValues, setSlaFieldValues] = useState({});
  const [slaFieldData, setSlaFieldData] = useState(fieldData);
  const [slaEditableFields, setSlaEditableFields] = useState({});
  const [conditionText, setConditionText] = useState('');
  const [fields, setFields] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [forms, setForms] = useState([]);

  const [activCondition, setActivCondition] = useState('');
  const [errorMsg, setErrorMsg] = useState({});
  let refFieldDataArr = [];
  const [dateTime, setDateTime] = useState({
    month: '',
    days: '',
    hours: '',
    minutes: ''
  });
  const [open, setOpen] = useState(false);
  const [shiftList, setShiftList] = useState([]);
  const [conditions, setConditions] = useState({
    fieldInfoId: '',
    fieldName: '',
    operator: '',
    value: '',
    operatorType: '',
    options: '',
    variant: '',
    category: ''
  });
  useEffect(() => {
    if (newRecord) {
      setSlaFieldData((prev) =>
        prev.filter((element) => !FILTERED_FIELDS.includes(element.name))
      );
    }
  }, [newRecord]);

  useEffect(() => {
    fetchRecordsBytableName('system_shift').then((data) => {
      let fetchedFormData = data?.data;
      let shiftArr = [];

      fetchedFormData.forEach((elem) => {
        if (!shiftArr.some((item) => item.name === elem.name)) {
          shiftArr.push(elem);
        }
        setShiftList([
          { name: 'calendar-hour', label: 'calendar-hour' },
          ...shiftArr
        ]);
      });
    });
  }, []);

  const fetchAllModuleAndForms = async () => {
    const res = await fetchForms();
    const mappedForms = res?.result.map((d) => {
      return {
        label: d?.displayName,
        value: d?.formInfoId
      };
    });
    setForms(mappedForms);

    const response = await fetchModules();
    const data = response?.result;
    if (data) {
      const moduleData = data.map((d) => {
        return {
          ...d,
          value: d.moduleInfoId,
          label: d.displayName
        };
      });
      setModuleList(moduleData);
    }
  };
  const fetchFormBymoduleID = async (moduleId) => {
    const res = await fetchFormsByModuleId(moduleId);
    const mappedForms = res?.result.map((d) => {
      return {
        label: d?.displayName,
        value: d?.formInfoId
      };
    });
    setForms(mappedForms);
  };
  const fetchFields = async (id) => {
    const tableColumn = await fetchFieldsByFormId(id);
    setFields(tableColumn?.result);
  };

  useEffect(() => {
    if (fieldValues && Object.keys(fieldValues).length > 0) {
      const filteredFields = {};
      const restOfObject = {};
      Object.entries(fieldValues).forEach(([key, value]) => {
        if (FILTERED_FIELDS.includes(key)) {
          filteredFields[key] = value;
        } else {
          restOfObject[key] = value;
        }
      });
      if (restOfObject?.temp_time) {
        const parsedTime = JSON.parse(restOfObject?.temp_time);
        setDateTime(parsedTime);
      }
      fetchFields(restOfObject?.table);
      setSlaFieldValues(restOfObject);
      setSlaEditableFields(filteredFields);
      // Update slaFieldData by filtering out unwanted fields
      setSlaFieldData((prev) =>
        prev.filter((element) => !FILTERED_FIELDS.includes(element.name))
      );
    }
  }, [fieldValues]);

  useEffect(() => {
    fetchAllModuleAndForms();
  }, []);

  useEffect(() => {
    fetchFormBymoduleID(slaEditableFields.module);
  }, [slaEditableFields.module]);

  useEffect(() => {
    fetchFields(slaEditableFields.table);
  }, [slaEditableFields.table]);

  const addSearchCondition = (type) => {
    setSlaEditableFields((prev) => ({
      ...prev,
      [activCondition]: prev[activCondition]
        ? `${prev[activCondition]} ${type}`
        : `${type}`
    }));
  };

  const handleTextAreaChange = (e, field) => {
    const newText = e.target.value;
    setSlaEditableFields((prev) => ({
      ...prev,
      [field]: newText
    }));
    setConditionText(newText);
  };
  const handleOperator = (operator, value, currCondition) => {
    let copyOfCondition = Object.assign({}, conditions);
    copyOfCondition[operator] = value;
    setConditions(copyOfCondition);
  };

  const handleConditionExpression = (criteria, value, currCondition) => {
    // let copyOfCondition = Object.assign({}, currCondition);
    // copyOfCondition[criteria] = value;
    // setConditions(copyOfCondition);

    setConditions((prevCondition) => {
      let updatedCondition = { ...prevCondition };

      if (criteria === 'fieldName') {
        const column = fields?.find((col) => col.fieldInfoId === value);
        const selectedField = fields?.find((f) => f.fieldInfoId === value);
        const isRefLookupField =
          selectedField?.category === 'Lookup' ||
          selectedField?.category === 'Reference';

        if (isRefLookupField) {
          const fetchRefLookupValue = async () => {
            try {
              const response = await fetchRefLookupValuesByFieldInfoId(value, {
                pagination: null,
                payload: {},
                search: null
              });

              const data = response?.result;

              if (selectedField.variant === 'Grid') {
                const parentFieldInfoId = selectedField.lookup.parentFormInfoId;

                if (parentFieldInfoId > 0) {
                  const res = await fetchFieldsByFormId(parentFieldInfoId);
                  const result = res?.result;
                  const defaultParentField = result?.find(
                    (f) => f.defaultLabel
                  );
                  const defaultFieldName =
                    defaultParentField?.name || selectedField.lookup.fieldName;

                  const gridData = data.map((d) => ({
                    label: d[defaultFieldName],
                    value: d.uuid
                  }));

                  refFieldDataArr.push(...gridData);
                } else {
                  const defaultFieldName = selectedField.lookup.fieldName;

                  const gridData = data.map((d) => ({
                    label: d[defaultFieldName],
                    value: d.uuid
                  }));

                  refFieldDataArr.push(...gridData);
                }
              } else {
                refFieldDataArr.push(...data);
              }

              const updatedFields = fields.map((field) =>
                field.fieldInfoId === value
                  ? {
                      ...field,
                      [field.category === 'Lookup'
                        ? 'lookupDropdownData'
                        : 'referenceDropdownData']: refFieldDataArr
                    }
                  : field
              );

              setFields(updatedFields);
            } catch (error) {
              console.error('Error fetching reference/lookup values:', error);
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

          updatedCondition = {
            ...updatedCondition,
            fieldInfoId: value,
            fieldName: column.name,
            operatorType,
            options: column.options || refFieldDataArr,
            variant: column.variant || '',
            category: column.category
          };
        }
      } else if (
        criteria === 'value' &&
        prevCondition.operator === 'IN' &&
        prevCondition.options
      ) {
        const selectedOptions = Array.isArray(value)
          ? value.map(
              (optionValue) =>
                prevCondition.options.find(
                  (option) => option.value === optionValue
                )?.value || ''
            )
          : [];

        updatedCondition = {
          ...updatedCondition,
          [criteria]: selectedOptions.join(',')
        };
      } else {
        updatedCondition = {
          ...updatedCondition,
          [criteria]: value
        };
      }

      return updatedCondition;
    });
  };
  const addConditionText = () => {
    setSlaEditableFields((prev) => ({
      ...prev,
      [activCondition]: `${prev[activCondition] || ''} {${conditions.fieldName}} ${conditions.operator} ${conditions.value}`
    }));
    setConditions({
      fieldName: '',
      operator: '',
      value: ''
    });
  };
  const onSubmitEmailCondition = (value) => {
    const totalMinutes = convertToMinutes(dateTime);
    const copyOfObj = Object.assign({}, slaEditableFields);
    copyOfObj.target_time = totalMinutes;
    copyOfObj.temp_time = JSON.stringify(dateTime);
    const combineObj = { ...value, ...copyOfObj };
    onSubmitAllData(combineObj);
  };
  return (
    <>
      {slaFieldData && (
        <AddEditRecord
          mode="preview"
          formId={formId}
          fieldData={slaFieldData}
          fieldValues={slaFieldValues}
          showSystemDefaultField={showSystemDefaultField}
          onSubmit={onSubmitEmailCondition}
          selectedRecordId={selectedRecordId}
          fieldGroups={fieldGroups}
          otherFields={
            <>
              <div
                className=""
                style={{
                  padding: '0px',
                  minWidth: '100%',
                  maxWidth: 1200
                }}
              >
                <div
                  className=""
                  style={{
                    padding: '0px'
                  }}
                >
                  <div className="">
                    <Dropdown
                      label="Module"
                      id="input_category1"
                      options={moduleList}
                      value={Number(slaEditableFields.module)}
                      onChange={(e) =>
                        setSlaEditableFields((prev) => ({
                          ...prev,
                          ['module']: e.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="">
                    <Dropdown
                      label="Table"
                      id="input_category"
                      options={forms}
                      value={Number(slaEditableFields.table)}
                      onChange={(e) =>
                        setSlaEditableFields((prev) => ({
                          ...prev,
                          ['table']: e.target.value
                        }))
                      }
                    />
                  </div>

                  <div className="">
                    <Input
                      label="Condition"
                      variant="outline"
                      name="condition"
                      type="text"
                      disabled={!slaEditableFields.table}
                      value={slaEditableFields.condition}
                      onChange={(e) => handleTextAreaChange(e, 'condition')}
                      onClick={() => {
                        setOpen(true);
                        setActivCondition('condition');
                      }}
                      category="Input"
                    />
                  </div>
                  <div className="">
                    <Input
                      label="Sla start condition"
                      name="sla_start_condition"
                      type="text"
                      disabled={!slaEditableFields.table}
                      value={slaEditableFields.sla_start_condition}
                      onChange={(e) =>
                        handleTextAreaChange(e, 'sla_start_condition')
                      }
                      onClick={() => {
                        setOpen(true);
                        setActivCondition('sla_start_condition');
                      }}
                      category="Input"
                    />
                  </div>
                  <div className="">
                    <Input
                      label="Sla stop condition"
                      name="sla_stop_condition"
                      disabled={!slaEditableFields.table}
                      value={slaEditableFields.sla_stop_condition}
                      onChange={(e) =>
                        handleTextAreaChange(e, 'sla_stop_condition')
                      }
                      onClick={() => {
                        setOpen(true);
                        setActivCondition('sla_stop_condition');
                      }}
                      category="Input"
                    />
                  </div>
                  <div className="">
                    <Dropdown
                      label="Select Shift"
                      options={shiftList.map((shift) => ({
                        label: shift.name || shift.label,
                        value: shift.name
                      }))}
                      value={slaEditableFields.shift || ''}
                      onChange={(e) =>
                        setSlaEditableFields((prev) => ({
                          ...prev,
                          ['shift']: e.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="">
                    <Input
                      label="Target time"
                      variant="outline"
                      name="target_time"
                      value={slaEditableFields.target_time}
                      onChange={(e) => handleTextAreaChange(e, 'totalMinutes')}
                      onClick={() => {
                        setActivCondition('target_time');
                      }}
                    />
                  </div>
                  {activCondition === 'target_time' ? (
                    <div
                      className="relative m-2 flex flex-wrap justify-evenly py-3"
                      style={{
                        border: `1px dashed ${colors.secondary.main}`,
                        borderRadius: '8px'
                      }}
                    >
                      <div className="text-secondary-main absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-sm font-bold">
                        Edit Target time
                      </div>
                      <div className="mb-1 flex flex-col">
                        <Input
                          label="Month"
                          type="number"
                          value={dateTime.month}
                          sx={{
                            width: '93%',
                            marginTop: '2px',
                            '& .MuiInputBase-root': {
                              fontSize: '15px',
                              height: '40px'
                            }
                          }}
                          onChange={(event) => {
                            const value = event.target.value;
                            const numberValue = Number(value);
                            if (numberValue >= 0 && numberValue <= 12) {
                              setDateTime((prevState) => ({
                                ...prevState,
                                month: value
                              }));
                              setErrorMsg({
                                month: ''
                              });
                            } else {
                              setErrorMsg({
                                month: 'Please enter a value between 0 and 12'
                              });
                            }
                          }}
                          inputProps={{ maxLength: 2 }}
                        />
                        {errorMsg?.month && <Label>{errorMsg.month}</Label>}
                      </div>

                      <div className="mb-1 flex flex-col">
                        <Input
                          label="Days"
                          type="number"
                          value={dateTime.days}
                          sx={{
                            width: '93%',
                            marginTop: '2px',
                            '& .MuiInputBase-root': {
                              fontSize: '15px',
                              height: '40px'
                            }
                          }}
                          onChange={(event) => {
                            const value = event.target.value;
                            const numberValue = Number(value);
                            if (numberValue >= 0 && numberValue <= 31) {
                              setDateTime((prevState) => ({
                                ...prevState,
                                days: event.target.value
                              }));
                              setErrorMsg({
                                days: ''
                              });
                            } else {
                              setErrorMsg({
                                days: 'Please enter a value between 0 and 31'
                              });
                            }
                          }}
                          maxLength="2"
                        />
                        <Label>{errorMsg?.days}</Label>
                      </div>
                      <div className="mb-1 flex flex-col">
                        <Input
                          label="Hours"
                          type="number"
                          value={dateTime.hours}
                          onChange={(event) => {
                            const value = event.target.value;
                            const numberValue = Number(value);
                            if (numberValue >= 0 && numberValue <= 23) {
                              setDateTime((prevState) => ({
                                ...prevState,
                                hours: value
                              }));
                              setErrorMsg({
                                hours: ''
                              });
                            } else {
                              setErrorMsg({
                                hours: 'Please enter a value between 0 and 23'
                              });
                            }
                          }}
                          maxLength="2"
                        />
                        <Label>{errorMsg?.hours}</Label>
                      </div>
                      <div className="mb-1 flex flex-col">
                        <Input
                          label="Minutes"
                          type="number"
                          value={dateTime.minutes}
                          onChange={(event) => {
                            const value = event.target.value;
                            const numberValue = Number(value);
                            if (numberValue >= 0 && numberValue <= 59) {
                              setDateTime((prevState) => ({
                                ...prevState,
                                minutes: value
                              }));
                              setErrorMsg({
                                minutes: ''
                              });
                            } else {
                              setErrorMsg({
                                minutes: 'Please enter a value between 0 and 59'
                              });
                            }
                          }}
                          maxLength="2"
                        />
                        <Label>{errorMsg?.minutes}</Label>
                      </div>
                    </div>
                  ) : null}
                </div>
                {open && activCondition !== 'target_time' && (
                  <div
                    className="relative mt-3 flex flex-col px-3 py-2"
                    style={{
                      // width: '98%',
                      borderRadius: '8px',
                      border: `1px dashed ${colors.secondary.main}`
                    }}
                  >
                    <div className="text-secondary-main absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-sm font-bold">
                      {`Edit ${activCondition.charAt(0).toUpperCase() + activCondition.slice(1).replaceAll('_', ' ')}`}
                    </div>
                    <div className="flex flex-col">
                      <div className="">
                        <div className="">
                          <div className="mt-2">
                            <div className="">
                              <Dropdown
                                label="FieldName"
                                options={fields.map((field) => ({
                                  label: field.name,
                                  value: field.fieldInfoId
                                }))}
                                type="text"
                                value={conditions.fieldInfoId}
                                onChange={(e) =>
                                  handleConditionExpression(
                                    'fieldName',
                                    e.target.value,
                                    conditions
                                  )
                                }
                              />
                            </div>
                            <div className="">
                              <Dropdown
                                label="Operator"
                                id="input_category"
                                options={operators[conditions.operatorType]}
                                value={conditions.operator || ''}
                                onChange={(e) =>
                                  handleOperator(
                                    'operator',
                                    e.target.value,
                                    conditions
                                  )
                                }
                              />
                            </div>
                            <div className="">
                              <ConditionValueInput
                                condition={conditions}
                                searchCriteriaHandler={
                                  handleConditionExpression
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-center">
                          <Button
                            className="mx-1 my-2"
                            onClick={addConditionText}
                          >
                            Add Condition
                          </Button>
                        </div>
                      </div>
                      <div className="mb-1 flex justify-evenly gap-2 px-2 py-2">
                        <div
                          className="flex flex-1 items-center justify-center p-2"
                          variant="solid"
                          type="button"
                          onClick={() => addSearchCondition('(')}
                          style={{
                            backgroundColor: alpha(COLORS.PRIMARY, 0.1),
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: 500
                          }}
                        >
                          &#40;
                        </div>
                        <div
                          className="flex flex-1 items-center justify-center"
                          variant="solid"
                          type="button"
                          onClick={() => addSearchCondition(')')}
                          style={{
                            backgroundColor: alpha(COLORS.PRIMARY, 0.1),
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: 500
                          }}
                        >
                          &#41;
                        </div>

                        <div
                          className="flex flex-1 items-center justify-center px-2"
                          variant="solid"
                          type="button"
                          onClick={() => addSearchCondition('OR')}
                          style={{
                            backgroundColor: alpha(COLORS.PRIMARY, 0.1),
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: 500
                          }}
                        >
                          OR
                        </div>
                        <div
                          className="flex flex-1 items-center justify-center"
                          variant="solid"
                          type="button"
                          onClick={() => addSearchCondition('AND')}
                          style={{
                            backgroundColor: alpha(COLORS.PRIMARY, 0.1),
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: 500
                          }}
                        >
                          AND
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          }
        />
      )}
    </>
  );
};
