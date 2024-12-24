import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { BoxPlus } from 'lucide-react';
import { colors } from '../../../../common/constants/styles';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../custom/useLocalStorage';

function ReplacePanel({
  replaceOperationData,
  setReplaceOperationData,
  addExpression,
  elementId,
  modeler,
  element,
  setStringOperations
}) {
  const { get, set } = useLocalStorage();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReplaceOperationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const closePanel = () => {
    setStringOperations((prev) => ({
      ...prev,
      ReplaceOperationPanel: false
    }));
  };
  const submitReplaceOperation = () => {
    set(`replace_${elementId}`, JSON.stringify(replaceOperationData));

    let local = get(`replace_${elementId}`) || null;

    let parsedData = JSON.parse(local);

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(parsedData),
        s_type: 'stringOperation'
      });

      setReplaceOperationData((prev) => ({
        ...prev,
        input: '',
        target: '',
        replacement: ''
      }));
      setStringOperations((prev) => ({
        ...prev,
        ReplaceOperationPanel: false
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
          <b>Replace Operation</b>
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
                value={replaceOperationData.input}
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
                  top: '7px',
                  left: '136px',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  addExpression(
                    0,
                    'replaceOperation',
                    replaceOperationData.input
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
              Target
            </Typography>
            <span className="position-relative">
              <input
                id="input_substring"
                type="text"
                name="target"
                value={replaceOperationData.target}
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
            </span>
          </div>
          <div className="flex flex-col justify-start">
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 400
              }}
            >
              Replacement
            </Typography>
            <span className="position-relative">
              <input
                id="input_substring"
                type="text"
                name="replacement"
                value={replaceOperationData.replacement}
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
            </span>
          </div>
        </div>

        <div className="flex">
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  submitReplaceOperation();
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

export default ReplacePanel;
