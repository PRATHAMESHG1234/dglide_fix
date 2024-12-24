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
import { PlusSquare, PlusCircle } from 'lucide-react';
import { colors } from '../../../../common/constants/styles';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../custom/useLocalStorage';
import { Calendar } from 'lucide-react';

export const DateFetchPanel = ({
  addExpression,
  setDateFetchData,
  dateFetchData,
  setDatePickerShow,
  elementId,
  modeler,
  element,
  setDateOperation
}) => {
  const { get, set } = useLocalStorage();

  const paramsArr = ['year', 'month', 'day', 'hour', 'minute', 'second'];

  const handleDateChange = (newValue) => {
    setDateFetchData((prevState) => ({
      ...prevState,
      date: newValue
    }));
    // setValue(newValue);
  };

  const submitDateFetchOperation = () => {
    set(`dateFetch_${elementId}`, JSON.stringify(dateFetchData));
    let local = get(`dateFetch_${elementId}`) || null;

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: local,
        s_type: 'dateTimeOperation'
      });
      setDateOperation((prev) => ({
        ...prev,
        dateFetchPanel: false
      }));
      setDateFetchData((prev) => ({
        date: '',
        param: ''
      }));
    }
  };
  const closePanel = () => {
    setDateOperation((prev) => ({
      ...prev,
      dateFetchPanel: false
    }));
  };
  return (
    <div
      id="set-variable-panel"
      className="panel approval-panel"
      style={{ width: '410px', padding: '25px' }}
    >
      <form id="setForm">
        <p>
          <b>DateFetch Operation</b>
        </p>
        <IconButton
          aria-label="close"
          onClick={closePanel}
          sx={{
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
          sx={{ fontSize: '16px' }}
        >
          <IconButton
            aria-label="info"
            sx={{
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
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              paddingBottom: '4px'
            }}
          >
            Select Date
          </Typography>
          <TextField
            id="input_category"
            type="text"
            name="input"
            value={dateFetchData.date}
            onChange={(event) =>
              setDateFetchData((prevState) => ({
                ...prevState,
                date: event.target.value
              }))
            }
            style={{
              height: '37px',
              fontSize: '13px',
              backgroundColor: colors.white,
              minWidth: '170px',
              paddingRight: '94px'
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Calendar
                    sx={{
                      color: colors.primary.dark,
                      fontSize: '25px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      addExpression(
                        0,
                        'dateFetchOperation',
                        dateFetchData.date
                      );
                      setDatePickerShow(true);
                    }}
                  />
                  <PlusSquare
                    sx={{
                      color: colors.primary.dark,
                      fontSize: '25px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      addExpression(
                        0,
                        'dateFetchOperation',
                        dateFetchData.date
                      );
                      setDatePickerShow(false);
                    }}
                  />
                </InputAdornment>
              )
            }}
          />
          &nbsp;&nbsp;
          <div className="">
            <select
              value={dateFetchData.param}
              onChange={(event) => {
                setDateFetchData((prevState) => ({
                  ...prevState,
                  param: event.target.value
                }));
              }}
            >
              <option value="" disabled selected>
                Select Params
              </option>
              {paramsArr.map((ele, i) => (
                <option key={i + 1} value={ele}>
                  {ele.charAt(0).toUpperCase() + ele.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex">
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  submitDateFetchOperation();
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
