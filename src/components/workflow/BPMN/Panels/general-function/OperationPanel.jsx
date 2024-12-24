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

export const OperationPanel = ({
  disableDropdwn,
  operationData,
  setOperationEvent,
  setOperationData,
  setOperationValue,
  getTableColumn,
  selectedformId,
  allTableListRef,
  setConditionPanal,
  operationEvent,
  selectedTableDetail,
  newColumnList,
  addExpression,
  handleRowSelect,
  setNewColumnList,
  submitOperationPanal,
  setOperationPanel,
  setSelectedformId
}) => {
  const closeOperationPanel = () => {
    setOperationPanel(false);
    setOperationEvent('');
    setSelectedformId('');
    setNewColumnList([]);
  };
  const removeSelectedField = (Id) => {
    const filteredData = newColumnList.filter(
      (item) => item.fieldInfoId !== Id
    );
    setNewColumnList(filteredData);
  };

  const handleAddNewField = () => {
    getTableColumn(selectedformId, null);
  };
  return (
    <>
      <div
        id="operation-variable-panel"
        className="panel approval-panel operation-variable-panel"
      >
        <form id="setForm">
          <p>
            <b>Operation</b>
          </p>
          <button
            id="close"
            className="close-btn"
            type="button"
            onClick={closeOperationPanel}
          >
            &times;
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignContent: 'center',
              marginBottom: 20
            }}
          >
            <select
              disabled={disableDropdwn}
              value={operationData.operation}
              onChange={(event) => {
                setOperationEvent(event.target.value);
                setOperationData((prevState) => ({
                  ...prevState,
                  condition: ''
                }));
                setOperationValue(event.target.value, 'operation');
              }}
            >
              <option value="" disabled>
                Operation
              </option>
              <option value="Create">Create</option>
              <option value="Update">Update</option>
              <option value="Delete">Delete</option>
              <option value="Select">Select</option>
            </select>
            &nbsp;
            <select
              disabled={disableDropdwn}
              onChange={(event) => {
                setOperationData((prevState) => ({
                  ...prevState,
                  condition: ''
                }));
                getTableColumn(event.target.value, 'operation');
              }}
              value={
                selectedformId ? selectedformId : operationData?.dest_formId
              }
            >
              <option value="" disabled>
                Select Form
              </option>
              {allTableListRef.current &&
                allTableListRef.current?.map((option) => (
                  <option key={option.name} value={option.formInfoId}>
                    {option.label}
                    {option.name}
                  </option>
                ))}
            </select>
            &nbsp;
            {['Update', 'Delete', 'Select'].includes(
              operationData.operation
            ) && (
              <Grid item>
                <Buttons
                  variant="contained"
                  onClick={() => {
                    getTableColumn(selectedformId);
                    setConditionPanal(true);
                  }}
                >
                  Condition
                </Buttons>
              </Grid>
            )}
          </div>

          <div className="m-2">
            <table>
              {operationEvent === 'Select' ? (
                <thead>
                  <tr>
                    <th>{selectedTableDetail}</th>
                  </tr>
                </thead>
              ) : operationEvent === 'Delete' ? (
                ''
              ) : (
                <thead>
                  <tr>
                    <th>Fields</th>
                    <th>Value</th>
                  </tr>
                </thead>
              )}
              {operationEvent === 'Delete' ? null : (
                <tbody className="operation-table-body">
                  {newColumnList?.map((item, index) => (
                    <tr key={item?.fieldInfoId}>
                      <td>
                        <input
                          type="text"
                          value={item?.name}
                          readOnly
                          // onBlur={generateOpeExpression}
                          onSelect={(e) => handleRowSelect(index, e)}
                        />
                      </td>
                      {operationEvent !== 'Select' ? (
                        <td>
                          <input
                            type="text"
                            readOnly
                            className="table-row"
                            value={item?.value}
                          />
                        </td>
                      ) : null}
                      <td key={index} className="px-3">
                        {operationEvent !== 'Select' ? (
                          <IconButton
                            className="mx-1"
                            sx={{
                              padding: '0px',
                              backgroundColor: colors.primary[200],
                              '&:hover': {
                                backgroundColor: colors.primary.dark
                              }
                            }}
                            onClick={() =>
                              addExpression(index, 'operation', item.value)
                            }
                          >
                            <PlusCircle
                              sx={{
                                fontSize: '25px',
                                color: colors.primary.main,
                                '&:hover': {
                                  color: colors.white
                                }
                              }}
                            />
                          </IconButton>
                        ) : null}

                        <IconButton
                          className="mx-1"
                          sx={{
                            padding: '0px',
                            backgroundColor: colors.secondary[200],
                            '&:hover': {
                              backgroundColor: colors.secondary.dark
                            }
                          }}
                          onClick={() => removeSelectedField(item?.fieldInfoId)}
                        >
                          <Minus
                            sx={{
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
              )}
            </table>
          </div>
          {operationEvent === 'Delete' ? null : (
            <Divider className="my-2">
              <Chip
                variant="outlined"
                label={
                  <div
                    className="flex items-center justify-center"
                    onClick={handleAddNewField}
                  >
                    <IconButton
                      sx={{
                        marginY: '20px',
                        marginRight: '2px',
                        padding: '0px',
                        backgroundColor: 'lightgrey'
                      }}
                    >
                      <Plus sx={{ fontSize: '13px' }} />
                    </IconButton>
                    <Typography
                      sx={{
                        fontSize: '10px',
                        cursor: 'pointer'
                        // marginTop: '20px'
                      }}
                      color="textSecondary"
                      fontWeight="500"
                    >
                      Add Field
                    </Typography>
                  </div>
                }
                size="small"
              />
            </Divider>
          )}
          <Grid container spacing={2}>
            <Grid item>
              <Buttons variant="outlined" onClick={submitOperationPanal}>
                Ok
              </Buttons>
            </Grid>
            <Grid item>
              <Buttons
                variant="outlined"
                color="error"
                onClick={closeOperationPanel}
              >
                Close
              </Buttons>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};
