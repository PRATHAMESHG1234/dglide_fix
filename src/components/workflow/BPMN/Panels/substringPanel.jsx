import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { colors } from '../../../../common/constants/styles';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { useLocalStorage } from '../custom/useLocalStorage';

function SubstringPanel({
  substringOperationData,
  setSubstringOperationData,
  addExpression,
  elementId,
  modeler,
  element,
  setStringOperations
}) {
  const { get, set } = useLocalStorage();

  const closePanel = () => {
    setStringOperations((prev) => ({
      ...prev,
      SubstringOperationPanel: false
    }));
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSubstringOperationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const submitSubstringOperation = () => {
    set(`substring_${elementId}`, JSON.stringify(substringOperationData));

    let local = get(`substring_${elementId}`) || null;

    let parsedData = JSON.parse(local);

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(parsedData),
        s_type: 'stringOperation'
      });

      setSubstringOperationData((prev) => ({
        ...prev,
        input: ''
      }));
      setStringOperations((prev) => ({
        ...prev,
        SubstringOperationPanel: false
      }));
    }
  };
  return (
    <div
      id="set-variable-panel"
      className="panel approval-panel"
      style={{ width: '600px' }}
    >
      <form id="setForm">
        <p>
          <b>Substring Operation</b>
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
          title="Output variable name: 'string', use it as id.out.string"
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
            margin: '20px 0'
          }}
        >
          &nbsp;
          <div className="flex flex-col justify-start">
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 400
              }}
            >
              Input
            </Typography>
            <span className="position-relative">
              <input
                id="input_category"
                type="text"
                name="input"
                value={substringOperationData.input}
                onChange={handleInputChange}
                placeholder=""
                style={{
                  height: '40px',
                  fontSize: '13px',
                  backgroundColor: colors.white,
                  width: '100%',
                  minWidth: '170px'
                }}
              />
              <AddBoxIcon
                sx={{
                  color: colors.primary.dark,
                  fontSize: '25px',
                  position: 'absolute',
                  top: '9px',
                  left: '135px',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  addExpression(
                    0,
                    'substringOperation',
                    substringOperationData.input
                  )
                }
              />
            </span>
          </div>
          <div className="flex flex-col justify-start px-3">
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 400
              }}
            >
              Begin index
            </Typography>
            <span className="position-relative">
              <input
                id="input_position"
                type="number"
                name="beginindex"
                value={substringOperationData.beginindex}
                onChange={handleInputChange}
                min="0"
                placeholder=""
                style={{
                  height: '40px',
                  fontSize: '13px',
                  backgroundColor: colors.white,
                  width: '100%',
                  minWidth: '170px'
                }}
              />
            </span>
          </div>
          <div className="flex flex-col justify-start">
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 400
              }}
            >
              End index
            </Typography>
            <span className="position-relative">
              <input
                id="input_position"
                type="number"
                name="endindex"
                value={substringOperationData.endindex}
                onChange={handleInputChange}
                min="0"
                placeholder=""
                style={{
                  height: '40px',
                  fontSize: '13px',
                  backgroundColor: colors.white,
                  width: '100%',
                  minWidth: '170px'
                }}
              />
            </span>
          </div>
        </div>

        <div className="flex">
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  submitSubstringOperation();
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
}

export default SubstringPanel;
