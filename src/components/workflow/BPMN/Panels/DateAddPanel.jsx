import {
  Button,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import { colors } from '../../../../common/constants/styles';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { useLocalStorage } from '../custom/useLocalStorage';

export const DateAddPanel = ({
  addExpression,
  setDateAddData,
  dateAddData,
  setDatePickerShow,
  setDateOperation,
  elementId,
  modeler,
  element
}) => {
  const { get, set } = useLocalStorage();
  const [inputType, setInputType] = useState('datetime-local');
  const inputRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState({});

  const closePanel = () => {
    setDateOperation((prev) => ({
      ...prev,
      DateAddPanel: false
    }));
  };
  const submitDateAddOperation = () => {
    set(`dateAdd_${elementId}`, JSON.stringify(dateAddData));

    let local = get(`dateAdd_${elementId}`) || null;
    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: local,
        s_type: 'dateTimeOperation'
      });
      setDateOperation((prev) => ({
        ...prev,
        DateAddPanel: false
      }));
      setDateAddData((prev) => ({
        date: '',
        type: '',
        days: '',
        hours: '',
        minutes: '',
        seconds: ''
      }));
    }
  };
  return (
    <div
      id="set-variable-panel"
      className="panel approval-panel"
      style={{ width: '550px' }}
    >
      <form id="setForm">
        <p>
          <b>DateAdd Operation</b>
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
          <CloseIcon />
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
            <ErrorIcon />
          </IconButton>
        </Tooltip>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div className="mb-3 flex w-full flex-col justify-start">
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Input
            </Typography>
            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <TextField
                id="input_category"
                type="text"
                name="input"
                value={dateAddData.date}
                onChange={(event) =>
                  setDateAddData((prevState) => ({
                    ...prevState,
                    date: event.target.value
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
                      <CalendarMonthIcon
                        sx={{
                          color: colors.primary.dark,
                          fontSize: '25px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          addExpression(
                            0,
                            'dateAddOperation',
                            dateAddData.date
                          );
                          setDatePickerShow(true);
                        }}
                      />
                      <AddBoxIcon
                        sx={{
                          color: colors.primary.dark,
                          fontSize: '25px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          addExpression(
                            0,
                            'dateAddOperation',
                            dateAddData.date
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
          <div className="mb-3">
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Type
            </Typography>
            <select
              value={dateAddData.type}
              onChange={(event) => {
                setDateAddData((prevState) => ({
                  ...prevState,
                  type: event.target.value
                }));
              }}
            >
              <option value="" disabled selected>
                Select Type
              </option>
              <option value="regular">Regular</option>
              <option value="bussiness">Bussiness</option>
            </select>
          </div>
          &nbsp;
          <div className="mb-3">
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Days
            </Typography>
            <input
              className="input-Date"
              type="number"
              value={dateAddData.days}
              onChange={(event) => {
                const value = event.target.value;
                const numberValue = Number(value);
                if (numberValue >= 0 && numberValue <= 31) {
                  setDateAddData((prevState) => ({
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
            <p className="error">{errorMsg?.days}</p>
          </div>
          &nbsp;
          <div className="mb-3">
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Hours
            </Typography>
            <input
              className="input-Date"
              type="number"
              value={dateAddData.hours}
              onChange={(event) => {
                const value = event.target.value;
                const numberValue = Number(value);
                if (numberValue >= 0 && numberValue <= 23) {
                  setDateAddData((prevState) => ({
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
            <p className="error">{errorMsg?.hours}</p>
          </div>
          &nbsp;
          <div className="mb-3">
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Minutes
            </Typography>
            <input
              className="input-Date"
              type="number"
              value={dateAddData.minutes}
              onChange={(event) => {
                const value = event.target.value;
                const numberValue = Number(value);
                if (numberValue >= 0 && numberValue <= 59) {
                  setDateAddData((prevState) => ({
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
            <p className="error">{errorMsg?.minutes}</p>
          </div>
          &nbsp;
          <div className="mb-3">
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Seconds
            </Typography>
            <input
              className="input-Date"
              type="number"
              value={dateAddData.seconds}
              onChange={(event) => {
                const value = event.target.value;
                const numberValue = Number(value);
                if (numberValue >= 0 && numberValue <= 59) {
                  setDateAddData((prevState) => ({
                    ...prevState,
                    seconds: event.target.value
                  }));
                  setErrorMsg({
                    seconds: ''
                  });
                } else {
                  setErrorMsg({
                    seconds: 'Please enter a value between 0 and 59'
                  });
                }
              }}
              maxLength="2"
            />
            <p className="error">{errorMsg?.seconds}</p>
          </div>
          &nbsp;
        </div>

        <div className="mt-4 flex">
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  submitDateAddOperation();
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
