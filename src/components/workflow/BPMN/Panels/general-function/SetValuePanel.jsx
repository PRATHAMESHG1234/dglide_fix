import {
  Chip,
  Divider,
  Grid,
  IconButton,
  Button as Buttons
} from '@mui/material';
import React from 'react';
import { colors } from '../../../../../common/constants/styles';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Add } from '@mui/icons-material';
import { Typography } from '@mui/joy';
import { useLocalStorage } from '../../custom/useLocalStorage';

export const SetValuePanel = ({
  variableValue,
  elementId,
  setVariableValue,
  setVariableDataValue,
  addExpression,
  addVariable,
  submitSetVariable,
  error,
  setVariableValuePanel
}) => {
  const { get, set } = useLocalStorage();
  const closeSetVariableValue = () => {
    setVariableValuePanel(false);
  };

  const removeVariable = (index) => {
    const variable = Object.assign({}, variableValue);
    variable.columns.splice(index, 1);
    setVariableValue(variable);
    set(`variableValue_${elementId}`, JSON.stringify(variable));
  };
  return (
    <>
      <div id="set-variable-panel" className="panel">
        <form id="setForm">
          <p>
            <b>Set Variable</b>
          </p>

          <IconButton
            aria-label="close"
            onClick={closeSetVariableValue}
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              color: colors.grey[500],
              // backgroundColor: colors.grey[500],

              cursor: 'pointer'
            }}
          >
            <CloseIcon style={{ fontSize: '15px' }} />
          </IconButton>
          {variableValue.columns.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '140px' }}>Name</th>
                    <th style={{ width: '163px' }}>Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {variableValue.columns?.map((item, index) => (
                    <tr key={index}>
                      <td style={{ width: '140px' }}>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(event) => {
                            setVariableDataValue(
                              event.target.value,
                              'name',
                              index
                            );
                          }}
                        />
                      </td>

                      <td style={{ width: '153px' }}>
                        <input
                          type="text"
                          value={item?.value}
                          onChange={(event) => {
                            setVariableDataValue(
                              event.target.value,
                              'value',
                              index
                            );
                          }}
                        />
                      </td>
                      <td
                        style={{ width: '76px' }}
                        className="flex flex-row justify-end"
                      >
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
                            addExpression(index, 'setValue', item.value)
                          }
                        >
                          <AddIcon
                            style={{
                              fontSize: '25px',
                              color: colors.primary.main,
                              '&:hover': {
                                color: colors.white
                              }
                            }}
                          />
                        </IconButton>
                        <IconButton
                          className="mx-1 my-2"
                          style={{
                            padding: '0px',
                            backgroundColor: colors.secondary[200],
                            '&:hover': {
                              backgroundColor: colors.secondary.dark
                            }
                          }}
                          onClick={() => removeVariable(index)}
                        >
                          <RemoveIcon
                            style={{
                              fontSize: '25px',
                              color: colors.secondary.main,
                              '&:hover': {
                                color: colors.white
                              }
                            }}
                          />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Divider className="my-2">
                <Chip
                  variant="outlined"
                  label={
                    <div
                      className="flex items-center justify-center"
                      onClick={addVariable}
                    >
                      <IconButton
                        style={{
                          marginY: '20px',
                          marginRight: '2px',
                          padding: '0px',
                          backgroundColor: 'lightgrey'
                        }}
                      >
                        <Add style={{ fontSize: '13px' }} />
                      </IconButton>
                      <Typography
                        style={{ fontSize: '10px', cursor: 'pointer' }}
                        color="textSecondary"
                        fontWeight="500"
                      >
                        Add Fields
                      </Typography>
                    </div>
                  }
                  size="small"
                />
              </Divider>
              <div className="">
                <Grid container spacing={2}>
                  <Grid item>
                    <Buttons variant="outlined" onClick={submitSetVariable}>
                      Ok
                    </Buttons>
                  </Grid>
                  <Grid item>
                    <Buttons
                      variant="outlined"
                      color="error"
                      onClick={closeSetVariableValue}
                    >
                      Close
                    </Buttons>
                  </Grid>
                </Grid>
              </div>
            </>
          )}
          {error && (
            <p className="error">
              Please define atleast one variable using define variable task to
              set value.
            </p>
          )}
        </form>
      </div>
    </>
  );
};
