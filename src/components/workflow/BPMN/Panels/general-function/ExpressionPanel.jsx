import {
  Chip,
  Divider,
  Grid,
  IconButton,
  Button as Buttons,
  TextField as TextFields
} from '@mui/material';

import React, { useRef, useState } from 'react';
import { COLORS, colors } from '../../../../../common/constants/styles';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Add } from '@mui/icons-material';
import { Typography } from '@mui/joy';
import SelectField from '../../../../../elements/SelectField';
import TextField from '../../../../../elements/TextField';
import { useSelector } from 'react-redux';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { addDataAtCursor } from '../../BpmnCommonFunctions';

export const ExpressionPanel = ({
  inputRef,
  datePickerShow,
  expression,
  setExpression,
  expressionColumn,
  setError,
  expresionByCatagory,
  handleExpression,
  oldColumnList,
  workFlowType,
  localStorageData,
  setLocalStorage,
  submitExpression,
  error,
  selectedFormField,
  setOldColumnList,
  oldColumnListRef,
  setExpresionByCatagory,
  setSelectedFormField,
  setExpressionPanel,
  setDatePickerShow
}) => {
  let restApiRegex = /^RES-\d{3}$/;

  const [fullScreen, setfullScreen] = useState(false);
  const workFlowDetail = useSelector((state) => state?.workflow);

  const handleTextAreaChange = (event) => {
    const newText = event.target.value;
    setExpression(newText);
  };

  const handleDropdownExpretn = (e) => {
    const newExpression = `{${
      workFlowType === 'Catalog'
        ? `${workFlowDetail?.workFlow?.catalog_id_display}.${selectedFormField?.name}.${e.target.value}.`
        : `${workFlowDetail?.workFlow?.form_info_id_display}.${selectedFormField?.name}.${e.target.value}`
    }}`;
    addDataAtCursor(newExpression, inputRef, expression, setExpression);

    setOldColumnList(oldColumnListRef.current);
    setExpresionByCatagory({
      dropdownData: false,
      referanceData: false
    });
  };

  const handleRefExpresion = (e) => {
    const refid = selectedFormField?.lookup?.parentFormInfoId
      ? selectedFormField?.lookup?.parentFormInfoId
      : selectedFormField?.lookup?.formInfoId;
    const newExpression = `{${
      workFlowType === 'Catalog'
        ? `${workFlowDetail?.workFlow?.catalog_id_display}.ref-${refid}.${selectedFormField?.name}.${e.target.value}`
        : `${workFlowDetail?.workFlow?.form_info_id_display}.ref-${refid}.${selectedFormField?.name}.${e.target.value}`
    }}`;
    addDataAtCursor(newExpression, inputRef, expression, setExpression);

    setOldColumnList(oldColumnListRef.current);
    setSelectedFormField('');
    // setExpresionByCatagory(false);
    setExpresionByCatagory({
      dropdownData: false,
      referanceData: false
    });
  };

  const closeExpressionPanel = () => {
    setExpressionPanel(false);
    setDatePickerShow(false);
    setfullScreen(false);
    setOldColumnList(oldColumnListRef.current);
    setSelectedFormField('');
    setExpresionByCatagory({
      dropdownData: false,
      referanceData: false
    });
  };
  return (
    <>
      <div
        id="set-variable-panel"
        className={`panel expression-panel ${fullScreen === true ? 'fullScreenPanel' : ''}`}
      >
        <form id="setFormxpression">
          <p>
            <b>Expression Panel</b>
          </p>

          <button
            id="close"
            className="close-btn"
            type="button"
            onClick={closeExpressionPanel}
          >
            &times;
          </button>

          <table
            className={fullScreen === true ? 'fullscrenHeight w-full' : ''}
          >
            <tr className="flex">
              <td>
                <label>
                  Select {workFlowDetail.workFlow.form_info_id_display}
                  <br />
                  Form Field
                </label>
                <div>
                  {datePickerShow === true ? (
                    <div className="" style={{ position: 'relative' }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          label="Date & time"
                          // format="d/M/yyyy hh:mm:ss"
                          value={expression ? new Date(expression) : null}
                          format="d/M/yyyy hh:mm:ss"
                          style={{
                            '& .MuiInputBase-root': {
                              fontSize: '0.875rem',
                              height: '38.5px',
                              minWidth: '240px',
                              width: '100%'
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: '0.875rem'
                            },
                            '& .MuiFormLabel-root': {
                              marginTop: expression ? '0px' : '-7px',
                              fontSize: '0.875rem'
                            },
                            '& .Mui-focused': {
                              mt: '0px'
                            }
                          }}
                          renderInput={(props) => (
                            <TextFields
                              size="small"
                              fullWidth
                              {...props}
                              helperText=""
                              type="datetime-local"
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          )}
                          onChange={(newValue) => {
                            const localISOTime = format(
                              newValue,
                              "yyyy-MM-dd'T'HH:mm"
                            );
                            //   setValue(newValue);
                            setExpression(localISOTime);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  ) : (
                    <select
                      style={{
                        height: 325,
                        width: 300,
                        overflowX: 'scroll'
                      }}
                      multiple
                      value={expressionColumn}
                      onChange={(event) => {
                        setError(false);
                        expresionByCatagory?.referanceData === true
                          ? handleRefExpresion(event)
                          : expresionByCatagory?.dropdownData === true
                            ? handleDropdownExpretn(event)
                            : handleExpression(event.target.value);
                      }}
                    >
                      {oldColumnList &&
                        oldColumnList.map((item, i) => {
                          const isBlue = restApiRegex.test(item.name);
                          return (
                            <option
                              key={i}
                              className={`${
                                item.category === 'Reference' &&
                                expresionByCatagory.referanceData === false
                                  ? 'Green-option'
                                  : item.category === 'DropDown' &&
                                      expresionByCatagory.dropdownData === false
                                    ? 'Purple-Optn'
                                    : isBlue
                                      ? 'blue-option'
                                      : ''
                              }`}
                              value={
                                workFlowType !== 'Catalog'
                                  ? item.name || ''
                                  : item.field_name || item.label
                              }
                            >
                              {workFlowType !== 'Catalog'
                                ? item.name || ''
                                : item.label || ''}
                            </option>
                          );
                        })}
                    </select>
                  )}
                </div>
              </td>
              <td
                className={fullScreen === true ? 'fullscrenHeight w-full' : ''}
              >
                <div className="flex items-center">
                  <label>
                    Write <br />
                    expression
                  </label>
                  {localStorageData.expressionIndex === 'payload' ? (
                    <IconButton
                      className="mx-2"
                      style={{
                        borderRadius: '8px',
                        padding: '5px',
                        backgroundColor: colors.primary[200],
                        '&:hover': {
                          backgroundColor: colors.primary.dark
                        }
                      }}
                      onClick={() => {
                        setfullScreen(true);
                        setLocalStorage({
                          expressionIndex: ''
                        });
                      }}
                    >
                      <OpenInFullIcon />
                    </IconButton>
                  ) : null}
                </div>

                <div>
                  <textarea
                    ref={inputRef}
                    className={
                      fullScreen === true ? 'fullscrenHeight w-full' : ''
                    }
                    rows={13}
                    cols={17}
                    type="text"
                    value={expression}
                    onChange={handleTextAreaChange}
                    // onBlur={generateExpression}
                  />
                </div>
              </td>
            </tr>
          </table>
          <Grid container spacing={2}>
            <Grid item>
              <Buttons variant="outlined" onClick={submitExpression}>
                Ok
              </Buttons>
            </Grid>
            <Grid item>
              <Buttons
                variant="outlined"
                color="error"
                onClick={closeExpressionPanel}
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
