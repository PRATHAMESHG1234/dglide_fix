import React from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  Button as Buttons
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { COLORS, colors } from '../../../common/constants/styles';
import SelectField from '../../../elements/SelectField';
import TextField from '../../../elements/TextField';
import { Plus, PlusCircle } from 'lucide-react';
// import {Button} from '@/componentss/ui/button'

const operators = {
  String: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'like', value: 'LIKE' },
    { label: 'not like', value: 'NOT LIKE' },
    { label: 'in', value: 'IN' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' },
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'greater than or equal to', value: '>=' },
    { label: 'less than or equal to', value: '<=' }
  ]
};

export const BpmnGateWay = ({
  addExpression,
  conditions,
  setConditions,
  conditionText,
  setConditionText,
  closeGateWayPanel,
  submitGateWay
}) => {
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
    // setConditions((prev) =>
    // 	prev?.map((condition) => {
    // 		if (condition.conditionId === currCondition.conditionId) {
    // 			return {
    // 				...condition,
    // 				[operator]: value
    // 			};
    // 		}
    // 		return condition;
    // 	})
    // );
  };
  const addConditionText = () => {
    setConditionText((prev) =>
      prev
        ? `${prev} ${conditions.fieldName} ${conditions.operator} ${conditions.value}`
        : `${conditions.fieldName} ${conditions.operator} ${conditions.value}`
    );
    setConditions({
      fieldName: '',
      operator: '',
      value: ''
    });
  };
  return (
    <div
      id="gateWay-panel"
      className="panel approval-panel flex"
      style={{ width: '700px' }}
    >
      <form id="gatWay">
        <div className="mb-2">
          <p>
            <b> Excusive GateWay</b>
          </p>
          <button
            id="close"
            className="close-btn"
            type="button"
            onClick={closeGateWayPanel}
          >
            &times;
          </button>
        </div>
        <Box
          className="flex flex-col gap-1"
          style={{
            borderRadius: '8px'
          }}
        >
          <Box className="flex flex-col gap-2">
            <div className="row">
              <div className="flex">
                <div className="">
                  <div className="flex items-center justify-between">
                    {/* <input
                  className="my-2"
                  type="text"
                  value={conditions.fieldName}
                  fieldstyle={{
                    width: "100%",
                    minWidth: "170px",
                  }}
                /> */}
                    <TextField
                      labelname="FieldName"
                      variant="outlined"
                      type="text"
                      value={conditions.fieldName}
                      style={{
                        width: '100%',
                        minWidth: '200px',
                        '& .MuiInputBase-root': {
                          height: '36.5px',
                          fontSize: '14px'
                        },
                        backgroundColor: COLORS.WHITE
                      }}
                    />
                    <IconButton
                      className="mx-1"
                      style={{
                        padding: '0px',
                        backgroundColor: colors.primary[200],
                        '&:hover': {
                          backgroundColor: colors.primary.dark
                        }
                      }}
                      onClick={() =>
                        addExpression(
                          'fieldName',
                          'exclusiveGateway',
                          '',
                          conditions
                        )
                      }
                    >
                      <PlusCircle
                        style={{
                          fontSize: '25px',
                          color: colors.primary.main,
                          '&:hover': {
                            color: colors.white
                          }
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
                <SelectField
                  labelname="Operator"
                  id="input_category"
                  options={operators.String}
                  value={conditions.operator || ''}
                  onChange={(e) =>
                    handleOperator('operator', e.target.value, conditions)
                  }
                  fieldstyle={{
                    width: '100%',
                    minWidth: '170px'
                  }}
                />
                <div className="mx-1">
                  <div className="flex items-center justify-between">
                    {/* <input
                  className="my-2"
                  type="text"
                  disabled={
                    conditions.operator === "IS EMPTY" ||
                    conditions.operator === "IS EMPTY"
                      ? true
                      : false
                  }
                  value={conditions.value}
                  fieldstyle={{
                    width: "100%",
                    minWidth: "170px",
                  }}
                /> */}
                    <TextField
                      labelname="Value"
                      variant="outlined"
                      type="text"
                      value={conditions.value}
                      disabled={
                        conditions.operator === 'IS EMPTY' ||
                        conditions.operator === 'IS EMPTY'
                          ? true
                          : false
                      }
                      style={{
                        width: '100%',
                        minWidth: '200px',
                        '& .MuiInputBase-root': {
                          height: '36.5px',
                          fontSize: '14px'
                        }
                      }}
                    />
                    <IconButton
                      className="mx-1"
                      style={{
                        padding: '0px',
                        backgroundColor: colors.primary[200],
                        '&:hover': {
                          backgroundColor: colors.primary.dark
                        }
                      }}
                      onClick={() =>
                        addExpression(
                          'value',
                          'exclusiveGateway',
                          '',
                          conditions
                        )
                      }
                    >
                      <PlusCircle
                        style={{
                          fontSize: '25px',
                          color: colors.primary.main,
                          '&:hover': {
                            color: colors.white
                          }
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center">
                <Button
                  className="mx-1 my-2"
                  style={{
                    width: '150px',
                    padding: '8px 10px',
                    backgroundColor: colors.primary[200],
                    '&:hover': {
                      backgroundColor: colors.primary.dark,
                      color: 'white'
                    }
                  }}
                  onClick={addConditionText}
                >
                  Add Condition
                </Button>
              </div>
            </div>
            {/* ); */}
            {/* })} */}
            <div
              className="mb-1 flex justify-evenly gap-2"
              style={{ width: '630px' }}
            >
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
                className="flex flex-1 items-center justify-center"
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

            <TextField
              labelname="Selected Condition"
              id="outlined-multiline-static"
              multiline
              minRows={4}
              value={conditionText}
              onChange={(e) => handleTextAreaChange(e)}
              // focused={false}
              // inputProps={{ readOnly: true }}
              style={{
                bgcolor: COLORS.WHITE,
                '& .MuiInputBase-root': {
                  fontSize: '13.5px'
                },
                input: { cursor: 'no-drop' }
              }}
              fieldstyle={{
                minWidth: '190px',
                width: '97%'
              }}
            />
          </Box>
        </Box>
        &nbsp;
        <div className="flex">
          <Grid container spacing={2}>
            <Grid item>
              <Buttons variant="outlined" onClick={submitGateWay}>
                Ok
              </Buttons>
            </Grid>
            <Grid item>
              <Buttons
                variant="outlined"
                color="error"
                onClick={closeGateWayPanel}
              >
                Close
              </Buttons>
            </Grid>
          </Grid>
        </div>
      </form>
    </div>
  );
};
