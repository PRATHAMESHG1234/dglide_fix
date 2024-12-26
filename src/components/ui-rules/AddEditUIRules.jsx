import React, { useEffect, useState } from 'react';

import { Separator } from '@/componentss/ui/separator';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';

import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { RadioGroup } from '@/componentss/ui/radio-group';
import { MultiSelect } from '@/componentss/ui/multi-select';
import { Textarea } from '@/componentss/ui/textarea';
import { Plus } from 'lucide-react';
import { Label } from '@/componentss/ui/label';
import { Button } from '@/componentss/ui/button';
import { Checkbox } from '@/componentss/ui/checkbox';

import { useSelector } from 'react-redux';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/componentss/ui/sheet';
import { generateUId } from '../../common/utils/helpers';
import {
  fetchFieldsByFormId,
  fetchRefLookupValuesByFieldInfoId
} from '../../services/field';
import { operators } from '../../common/constants/operators';
import SearchCondition from '../dashboard/config/SearchCondition';

const AddEditUIRules = ({
  preview,
  onCloseDrawer,
  forms,
  selectedRuleId,
  setSelectedRuleId,
  onSubmitHandler
}) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const { rule } = useSelector((state) => state.uiRule);

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchAllCond, setMatchAllCond] = useState(false);

  const [formData, setFormData] = useState({
    ruleName: '',
    ruleDescription: '',
    formInfoId: '',
    event: 'newRecord',
    conditions: [],
    actions: []
  });

  const [conditions, setConditions] = useState([
    {
      conditionId: generateUId(),
      fieldInfoId: 0,
      operator: '',
      value: '',
      category: ''
    }
  ]);

  const [actions, setActions] = useState([
    {
      actionId: generateUId(),
      action: 'displayAction',
      actionType: '',
      fieldInfoIds: [],
      message: ''
    }
  ]);
  let refFieldDataArr = [];
  const resetFormState = () => {
    setFormData({
      ruleName: '',
      ruleDescription: '',
      formInfoId: '',
      event: 'newRecord',
      conditions: [],
      actions: []
    });
    setConditions([
      {
        conditionId: generateUId(),
        fieldInfoId: 0,
        operator: '',
        value: '',
        category: ''
      }
    ]);
    setActions([
      {
        actionId: generateUId(),
        action: 'displayAction',
        actionType: '',
        fieldInfoIds: [],
        message: ''
      }
    ]);
  };

  const uiActions = {
    displayAction: [
      { label: 'Show', value: 'show' },
      { label: 'Hidden', value: 'hidden' },
      { label: 'Mandatory', value: 'mandatory' },
      { label: 'Readonly', value: 'readonly' }
    ],
    validationAction: [
      { label: 'Error', value: 'error' },
      { label: 'Info', value: 'info' }
    ]
  };

  useEffect(() => {
    if (preview === false) {
      resetFormState();
      setSelectedRuleId(null);
    }
  }, [preview]);

  useEffect(() => {
    if (selectedRuleId) {
      const parsedConditions = rule.conditions
        ? JSON.parse(rule.conditions)
        : {};

      const updatedConditions =
        parsedConditions?.data?.filter((cond) => cond.conditionId) || [];

      setConditions(updatedConditions);
      setMatchAllCond(parsedConditions?.isMatchingAll);
      setActions(rule?.actions ? JSON.parse(rule.actions) : []);
      setFormData(rule);

      if (rule?.formInfoId) {
        getFieldsBySelectedForm(rule?.formInfoId);
      }
    }
  }, [rule, selectedRuleId]);

  const getFieldsBySelectedForm = async (formId) => {
    const res = await fetchFieldsByFormId(formId);
    const columns = res.result;
    setFields(columns);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'formInfoId' && value) {
      getFieldsBySelectedForm(value);
    }
    setFormData((prev) => ({ ...prev, [name]: value, eventOrder: 0 }));
  };

  const addOperatorBetweenConditions = (conditions, isMatchingAll) => {
    const operator = isMatchingAll ? 'AND' : 'OR';
    const result = [];

    conditions.forEach((condition, index) => {
      result.push(condition);
      if (index < conditions.length - 1) {
        result.push({ operator });
      }
    });

    return result;
  };

  const handleSubmit = (e, isEnabled) => {
    e.preventDefault();

    const isEnabledRule = Boolean(isEnabled);

    const updatedConditions = addOperatorBetweenConditions(
      conditions,
      matchAllCond
    );

    const stringifiedConditions = conditions
      ? JSON.stringify({ isMatchingAll: matchAllCond, data: updatedConditions })
      : '';
    const stringifiedActions = actions ? JSON.stringify(actions) : '';

    const payload = {
      ...formData,
      actions: stringifiedActions,
      conditions: stringifiedConditions,
      enable: isEnabledRule
    };

    const id = payload?.ruleAndValidationInfoId;

    onSubmitHandler(payload, id);
  };

  const searchCriteriaHandler = (criteria, value, currCondition) => {
    const tableColumns = fields;
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
                    for (let i = 0; i < data?.length; i++) {
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
                    (option) => option.value === optionValue
                  );
                  return selectedOption ? selectedOption.value : '';
                })
              : [];

            return {
              ...condition,
              [criteria]: selectedOptions.join(',')
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

  const addActionsHandler = () => {
    setActions((prevData) => [
      ...prevData,
      {
        actionId: generateUId(),
        action: 'displayAction',
        actionType: '',
        fieldInfoIds: [],
        message: ''
      }
    ]);
  };

  const onChangeActionHandler = (e, action) => {
    const { name, value } = e.target;

    setActions((prevData) => {
      const existingAction = prevData.find(
        (item) => item.actionId === action.actionId
      );

      if (existingAction) {
        return prevData.map((item) =>
          item.actionId === action.actionId
            ? {
                ...item,
                [name]: value
              }
            : item
        );
      } else {
        return [
          ...prevData,
          {
            ...action,
            [name]: value
          }
        ];
      }
    });
  };

  const addSearchCondition = () => {
    setConditions((prev) => [
      ...prev,

      {
        conditionId: generateUId(),
        fieldInfoId: 0,
        operator: '',
        value: ''
      }
    ]);
  };

  const deleteSearchCondition = (conditionId) => {
    setConditions((prev) => {
      return prev.filter((cond) => cond.conditionId !== conditionId);
    });
  };

  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  const tableColumns = fields?.map((ele) => {
    return {
      value: ele.value || ele.fieldInfoId,
      label: ele.label
    };
  });

  return (
    <Sheet
      key={'right'}
      open={preview}
      onOpenChange={(prev) => onCloseDrawer(!prev)}
    >
      <SheetContent
        side={'right'}
        className="w-[850px] min-w-[850px] max-w-[850px] sm:max-w-[850px]"
      >
        <SheetHeader className="flex w-full flex-row items-center justify-between py-6">
          <SheetTitle className="flex w-full flex-row items-center justify-between text-lg font-semibold">
            {selectedRuleId ? 'Edit UI Rule' : 'Create UI Rule'}
            <div className="">
              <div
                alignItems="center"
                justifyContent="space-between"
                spacing={3}
              >
                <div item>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      type="submit"
                      size="sm"
                      onClick={(e) => handleSubmit(e, 'enabled')}
                    >
                      Enable & Submit
                    </Button>

                    <Button onClick={handleSubmit} size="sm">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="py-2">
          <Separator className="h-[1px]" />
        </div>
        <div className="flex h-[calc(100vh-90px)] w-full flex-col gap-x-2.5 overflow-auto pb-12 pr-5">
          {loading ? (
            <div className="flex h-[calc(100vh-150px)] items-center justify-center">
              <div class="flex items-center justify-center">
                <div class="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex w-full flex-col gap-y-4 px-1">
                {' '}
                <Input
                  label={'Name'}
                  name={'ruleName'}
                  type={'text'}
                  value={formData.ruleName}
                  onChange={(e) => handleInputChange(e, formData)}
                />
                <div className="w-full">
                  <Textarea
                    label={'Description'}
                    id="outlined-multiline-static"
                    minRows={3}
                    name={'ruleDescription'}
                    value={formData.ruleDescription}
                    onChange={(e) => handleInputChange(e, formData)}
                  />
                </div>
                <Dropdown
                  label="Form"
                  name="formInfoId"
                  id="input_category"
                  options={forms?.map((form) => {
                    return {
                      value: form.formInfoId,
                      label: form.displayName
                    };
                  })}
                  value={formData.formInfoId}
                  onChange={(e) => handleInputChange(e, formData)}
                />
                <RadioGroup
                  label={'Event'}
                  value={formData.event}
                  name={'event'}
                  onChange={(e) => handleInputChange(e, formData)}
                  options={[
                    { label: 'New Record', value: 'newRecord' },
                    { label: 'Edit Record', value: 'editRecord' },
                    { label: 'Both New and Edit', value: 'both' }
                  ]}
                  sx={{ paddingLeft: '1px' }}
                />
              </div>

              <div className="flex flex-col pt-2">
                <div className="flex justify-between pb-2 pr-2">
                  <Label sx={{ fontSize: '0.875rem' }}>Conditions</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="">
                        <Plus
                          size={16}
                          onClick={() => addSearchCondition('AND')}
                          className="cursor-pointer rounded font-semibold text-secondary outline outline-secondary"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Add</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div
                  className="flex flex-col border p-2"
                  style={{ borderRadius: '5px' }}
                >
                  {conditions
                    ?.filter((f) => f.conditionId)
                    ?.map((condition, index) => (
                      <SearchCondition
                        key={index}
                        condition={condition}
                        index={index}
                        tableColumns={tableColumns}
                        operators={operators}
                        searchCriteriaHandler={searchCriteriaHandler}
                        deleteSearchCondition={deleteSearchCondition}
                        pageView={'uIRules'}
                      />
                    ))}
                  <Checkbox
                    checked={matchAllCond}
                    onCheckedChange={(checked) => setMatchAllCond(checked)}
                    endLabel={
                      'Match all conditions above (if unchecked, match any condition).'
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col pt-4">
                <div className="flex justify-between pb-2 pr-2">
                  <Label className="text-sm">Actions</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Plus
                          size={16}
                          onClick={addActionsHandler}
                          className="cursor-pointer rounded font-semibold text-secondary outline outline-secondary"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Add</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div
                  className="flex flex-col gap-2 border p-2"
                  style={{ borderRadius: '5px' }}
                >
                  {Array.isArray(actions) &&
                    actions.map((action, index) => {
                      const Fields = fields?.map((ele) => ({
                        value: ele.value || ele.fieldInfoId,
                        label: ele.label
                      }));
                      return (
                        <div
                          className="border-bottom flex flex-col gap-2"
                          key={index}
                        >
                          <RadioGroup
                            label={`Action`}
                            value={action.action}
                            name={`action`}
                            onChange={(e) => onChangeActionHandler(e, action)}
                            options={[
                              {
                                label: 'Perform an Action',
                                value: 'displayAction'
                              },
                              {
                                label: 'Validate Form on Submission',
                                value: 'validationAction'
                              }
                            ]}
                          />

                          <div className="flex w-full flex-col gap-y-2">
                            <Dropdown
                              label="Action Type"
                              name={`actionType`}
                              id="input_category"
                              options={uiActions[action.action]}
                              value={action.actionType || []}
                              onChange={(e) => onChangeActionHandler(e, action)}
                            />
                            <MultiSelect
                              id={`multiSelect-fields`}
                              label={'Fields'}
                              name={'fieldInfoIds'}
                              selectedValues={action.fieldInfoIds || []}
                              onChange={(e) => onChangeActionHandler(e, action)}
                              options={Fields}
                            />
                          </div>

                          {action?.action === 'validationAction' && (
                            <Textarea
                              label={'Message'}
                              id="outlined-multiline-static"
                              minRows={3}
                              name={`message`}
                              value={action.message}
                              onChange={(e) => onChangeActionHandler(e, action)}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddEditUIRules;
