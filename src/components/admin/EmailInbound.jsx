import { useEffect, useState } from 'react';
import AddEditRecord from '../modify-record/addEditRecord/AddEditRecord';
import { Button } from '@/componentss/ui/button';
import { Dropdown } from '@/componentss/ui/dropdown';
import { COLORS, colors } from '../../common/constants/styles';
import { alpha } from '@mui/material/styles';
import { Input } from '@/componentss/ui/input';

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
const fieldOption = [
  { label: 'Subject', value: 'subject' },
  { label: 'Content', value: 'content' },
  { label: 'Headers', value: 'headers' },
  { label: 'To', value: 'to' },
  { label: 'From', value: 'from' }
];

export const EmailInboundSytem = ({
  newRecord,
  fieldValues,
  fieldData,
  onSubmitAllData,
  selectedRecordId,
  showSystemDefaultField,
  fieldGroups,
  formId
}) => {
  const [emailFieldVal, setEmailFieldVal] = useState({});
  const [emailField, setEmailField] = useState(fieldData);
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState({
    fieldName: '',
    operator: '',
    value: ''
  });
  const [conditionText, setConditionText] = useState('');

  useEffect(() => {
    if (newRecord) {
      setEmailField((prev) => {
        const filteredData = prev.filter(
          (element) => element.name !== 'condition'
        );
        return filteredData;
      });
    }
  }, [newRecord]);

  useEffect(() => {
    if (fieldValues) {
      const { condition, ...newFieldValues } = fieldValues;
      setEmailField((prev) => {
        const filteredData = prev.filter(
          (element) => element.name !== 'condition'
        );
        return filteredData;
      });

      setEmailFieldVal(newFieldValues);
      setConditionText(condition);
    }
  }, [fieldValues]);

  const handleTextAreaChange = (e) => {
    const newText = e.target.value;
    setConditionText(newText);
  };

  const addSearchCondition = (type) => {
    setConditionText((prev) => (prev ? `${prev} ${type}` : `${type}`));
  };

  const handleOperator = (operator, value, currCondition) => {
    let copyOfCondition = Object.assign({}, conditions);
    copyOfCondition[operator] = value;
    setConditions(copyOfCondition);
  };

  const handleConditionExpression = (field, value, currCondition) => {
    let copyOfCondition = Object.assign({}, currCondition);
    copyOfCondition[field] = value;
    setConditions(copyOfCondition);
  };

  const addConditionText = (e) => {
    e.preventDefault();
    setConditionText((prev) =>
      prev
        ? `${prev} {${conditions.fieldName}} ${conditions.operator} ${conditions.value}`
        : `{${conditions.fieldName}} ${conditions.operator} ${conditions.value}`
    );
    setConditions({
      fieldName: '',
      operator: '',
      value: ''
    });
  };

  const onSubmitEmailCondition = (value) => {
    const copyOfObj = Object.assign({}, value);
    copyOfObj.condition = conditionText;
    onSubmitAllData(copyOfObj);
  };
  return (
    <>
      <AddEditRecord
        mode="preview"
        formId={formId}
        fieldData={emailField}
        fieldValues={emailFieldVal}
        showSystemDefaultField={showSystemDefaultField}
        onSubmit={onSubmitEmailCondition}
        selectedRecordId={selectedRecordId}
        fieldGroups={fieldGroups}
        otherFields={
          <>
            <div>
              {open && (
                <div className="my-2 flex flex-col rounded-md">
                  <div className="flex flex-col">
                    <div className="">
                      <div className="">
                        <div className="">
                          <div className="">
                            <Dropdown
                              label="FieldName"
                              options={fieldOption}
                              type="text"
                              value={conditions.fieldName}
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
                              options={operators.String}
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
                            <Input
                              label="Value"
                              variant="outlined"
                              type="text"
                              value={conditions.value}
                              // disabled={
                              //   conditions.operator === "IS EMPTY" ||
                              //   conditions.operator === "IS EMPTY"
                              //     ? true
                              //     : false
                              // }

                              onChange={(e) =>
                                handleConditionExpression(
                                  'value',
                                  e.target.value,
                                  conditions
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-center">
                        <Button
                          className="mx-1 my-2"
                          onClick={(e) => addConditionText(e)}
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
              <div className="px-1">
                <Input
                  label="Condition"
                  variant="outlined"
                  name="condition"
                  type="text"
                  value={conditionText}
                  onChange={(e) => handleTextAreaChange(e)}
                  onClick={() => setOpen(true)}
                  category="Input"
                />
              </div>
            </div>
          </>
        }
      />
    </>
  );
};
