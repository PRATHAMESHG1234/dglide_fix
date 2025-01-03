import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { colors } from '../../../../common/constants/styles';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../custom/useLocalStorage';
import { Calendar } from 'lucide-react';

export const DateDiffPanel = ({
  addExpression,
  setDateDiffData,
  dateDiffData,
  panelFlag,
  setDatePickerShow,
  elementId,
  modeler,
  element,
  setDateOperation
}) => {
  const { get, set } = useLocalStorage();

  const closePanel = () => {
    setDateOperation((prev) => ({
      ...prev,
      dateDiffPanel: false
    }));
  };

  const submitDateDiffOperation = () => {
    set(`dateDiff_${elementId}`, JSON.stringify(dateDiffData));

    let local = get(`dateDiff_${elementId}`) || null;

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: local,
        s_type: 'dateTimeOperation'
      });
      setDateOperation((prev) => ({
        ...prev,
        dateDiffPanel: false
      }));
      setDateDiffData((prev) => ({
        date1: '',
        date2: ''
      }));
    }
  };
  return (
    <div
      id="set-variable-panel"
      className="panel approval-panel"
      style={{ width: '410px', padding: '20px' }}
    >
      <form id="setForm">
        <p>
          <b>DateDiff Operation</b>
        </p>
        <IconButton
          aria-label="close"
          onClick={closePanel}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            color: colors.grey[500]
          }}
        >
          <X />
        </IconButton>
        <Tooltip
          title="Output variable name: 'datetime', use it as id.out.datetime"
          placement="top-start"
          arrow
          style={{ fontSize: '16px' }}
        >
          <IconButton
            aria-label="info"
            style={{
              position: 'absolute',
              right: 35,
              top: 0,
              color: colors.primary.dark
            }}
          >
            <AlertCircle />
          </IconButton>
        </Tooltip>
        <div className="flex flex-col">
          <div className="flex flex-col justify-start">
            <Typography
              style={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Enter First Date
            </Typography>
            <div>
              <TextField
                id="input_category"
                type="text"
                name="input"
                value={dateDiffData.date1}
                onChange={(event) =>
                  setDateDiffData((prevState) => ({
                    ...prevState,
                    date1: event.target.value
                  }))
                }
                style={{
                  height: '37px',
                  fontSize: '13px',
                  backgroundColor: colors.white,
                  minWidth: '170px',
                  paddingRight: '60px' // Adjust this value based on the icon size
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Calendar style={{
                          color: colors.primary.dark,
                          fontSize: '25px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          addExpression(
                            'date1',
                            'dateDiffOperation',
                            dateDiffData.date1
                          );
                          setDatePickerShow(true);
                        }}
                      />
                      <PackagePlus style={{
                          color: colors.primary.dark,
                          fontSize: '25px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          addExpression(
                            'date1',
                            'dateDiffOperation',
                            dateDiffData.date1
                          );
                          setDatePickerShow(false);
                        }}
                      />
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
          &nbsp; &nbsp;
          <div className="flex flex-col justify-start">
            <Typography
              style={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Enter second Date
            </Typography>
            <div>
              <TextField
                id="input_category"
                type="text"
                name="input"
                value={dateDiffData.date2 ? dateDiffData.date2 : null}
                onChange={(event) =>
                  setDateDiffData((prevState) => ({
                    ...prevState,
                    date2: event.target.value
                  }))
                }
                style={{
                  height: '37px',
                  fontSize: '13px',
                  backgroundColor: colors.white,
                  minWidth: '170px',
                  paddingRight: '60px' // Adjust this value based on the icon size
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Calendar style={{
                          color: colors.primary.dark,
                          fontSize: '25px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          addExpression(
                            'date2',
                            'dateDiffOperation',
                            dateDiffData.date2
                          );
                          setDatePickerShow(true);
                        }}
                      />
                      <PackagePlus style={{
                          color: colors.primary.dark,
                          fontSize: '25px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          addExpression(
                            'date2',
                            'dateDiffOperation',
                            dateDiffData.date2
                          );
                          setDatePickerShow(false);
                        }}
                      />
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex">
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  submitDateDiffOperation();
                }}
              >
                Ok
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="error" onClick={closePanel}>
                Close
              </Button>
            </Grid>
          </Grid>
        </div>
      </form>
    </div>
  );
};
