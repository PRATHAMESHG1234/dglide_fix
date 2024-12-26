import {
  Chip,
  Divider,
  Grid,
  IconButton,
  Button as Buttons
} from '@mui/material';
import React from 'react';
import { COLORS, colors } from '../../../../../common/constants/styles';
import { X } from 'lucide-react';
import { Minus } from 'lucide-react';
import { Plus, PlusCircle } from 'lucide-react';

import { Typography } from '@mui/joy';
import SelectField from '../../../../../elements/SelectField';
import TextField from '../../../../../elements/TextField';
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
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'greater than or equal to', value: '>=' },
    { label: 'less than or equal to', value: '<=' }
  ]
};

export const ConditionPanel = ({
  setConditionPanal,
  operationConditions,
  newColumnConditionList,
  operationConditionHandler,
  addExpression,
  setOperationValue,
  error
}) => {
  const handleConditionExpresion = () => {
    setConditionPanal(false);
    setOperationValue(operationConditions, 'condition');
  };

  const closeConditionPanel = () => {
    setConditionPanal(false);
  };
  return (
    <>
      <div
        id="condition-panel"
        className="panel notify-panel"
        style={{ width: '500px' }}
      >
        <form id="setForm">
          <p>
            <b>Condition Panel</b>
          </p>

          <button
            id="close"
            className="close-btn"
            type="button"
            onClick={closeConditionPanel}
          >
            &times;
          </button>
          {operationConditions &&
            operationConditions?.map((condition, index) => {
              const Fields = newColumnConditionList?.map((ele) => {
                return {
                  value: ele.fieldInfoId,
                  label: ele.label
                };
              });
              return (
                <div className="row mb-3" key={index}>
                  <div className="flex items-center gap-2">
                    <SelectField
                      labelname="Column"
                      options={Fields}
                      value={condition.dest_field_id || ''}
                      onChange={(e) =>
                        operationConditionHandler(
                          'dest_field',
                          e.target.value,
                          condition
                        )
                      }
                      fieldstyle={{
                        width: '100%'
                        // minWidth: '160px'
                      }}
                    />

                    <SelectField
                      labelname="Oprator"
                      id="input_category"
                      options={operators.String}
                      value={condition.operator || ''}
                      onChange={(e) =>
                        operationConditionHandler(
                          'operator',
                          e.target.value,
                          condition
                        )
                      }
                      fieldstyle={{
                        width: '100%',
                        minWidth: '70px'
                      }}
                    />
                    <TextField
                      type="text"
                      id="textFieldBorder"
                      labelname="Value"
                      value={condition.source_field || ''}
                      onChange={(e) =>
                        operationConditionHandler(
                          'source_field',
                          e.target.value,
                          condition
                        )
                      }
                      style={{
                        '& .MuiInputBase-root': {
                          height: '35px',
                          fontSize: '13px'
                        },
                        bgcolor: COLORS.WHITE
                      }}
                      fieldstyle={{
                        width: '100%',
                        minWidth: '170px'
                      }}
                    />

                    <IconButton
                      className="mx-1 my-2"
                      style={{
                        padding: '0px',
                        backgroundColor: colors.primary[200],
                        '&:hover': {
                          backgroundColor: colors.primary.dark
                        }
                      }}
                      onClick={() =>
                        addExpression(index, 'conditionPanel', condition.value)
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
                    {/* <input
                            className="remove-add plus"
                            type="button"
                            value="-"
                            // onClick={() => removeVariable(index)}
                          ></input> */}
                  </div>
                </div>
              );
            })}
          <Grid container spacing={2}>
            <Grid item>
              <Buttons variant="outlined" onClick={handleConditionExpresion}>
                Ok
              </Buttons>
            </Grid>
            <Grid item>
              <Buttons
                variant="outlined"
                color="error"
                onClick={closeConditionPanel}
              >
                Close
              </Buttons>
            </Grid>
          </Grid>

          {error && <p className="error">Please generate expression.</p>}
        </form>
      </div>
    </>
  );
};
