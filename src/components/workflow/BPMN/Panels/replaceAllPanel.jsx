import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { colors } from '../../../../common/constants/styles';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { useLocalStorage } from '../custom/useLocalStorage';

function ReplaceallPanel({
  replaceAllOperationData,
  setReplaceAllOperationData,
  addExpression,
  elementId,
  modeler,
  element,
  setStringOperations
}) {
  const { get, set } = useLocalStorage();

  const submitAllReplaceOperation = () => {
    set(`replaceall_${elementId}`, JSON.stringify(replaceAllOperationData));

    let local = get(`replaceall_${elementId}`) || null;

    let parsedData = JSON.parse(local);

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(parsedData),
        s_type: 'stringOperation'
      });

      setReplaceAllOperationData((prev) => ({
        ...prev,
        input: '',
        target: '',
        replacement: ''
      }));
      setStringOperations((prev) => ({
        ...prev,
        ReplaceAllOperationPanel: false
      }));
    }
  };

  const closePanel = () => {
    setStringOperations((prev) => ({
      ...prev,
      ReplaceAllOperationPanel: false
    }));
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReplaceAllOperationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div
      id="set-variable-panel"
      className="panel approval-panel"
      style={{ width: '600px' }}
    >
      <form id="setForm">
        <p>
          <b>Replaceall Operation</b>
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
          <CloseIcon />
        </IconButton>
        <Tooltip
          title="Output variable name: 'string', use it as id.out.string"
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
            marginBottom: 20
          }}
        >
          &nbsp;
          <div className="flex flex-col justify-start">
            <Typography
              style={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Input
            </Typography>
            <span className="position-relative">
              <input
                id="input_category"
                type="text"
                name="input"
                value={replaceAllOperationData.input}
                onChange={handleInputChange}
                placeholder=""
                style={{
                  height: '40px',
                  fontSize: '13px',
                  backgroundColor: colors.white,
                  marginTop: '12px',
                  width: '100%',
                  minWidth: '170px'
                }}
              />
              <AddBoxIcon
                style={{
                  color: colors.primary.dark,
                  fontSize: '25px',
                  marginTop: '10px',
                  position: 'absolute',
                  top: '9px',
                  left: '135px',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  addExpression(
                    0,
                    'replaceAllOperation',
                    replaceAllOperationData.input
                  )
                }
              />
            </span>
          </div>
          <div className="flex flex-col justify-start px-3">
            <Typography
              style={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Target
            </Typography>
            <span className="position-relative">
              <input
                id="input_substring"
                type="text"
                name="target"
                value={replaceAllOperationData.target}
                onChange={handleInputChange}
                placeholder=""
                style={{
                  height: '40px',
                  fontSize: '13px',
                  backgroundColor: colors.white,
                  marginTop: '12px',
                  width: '100%',
                  minWidth: '170px'
                }}
              />
            </span>
          </div>
          <div className="flex flex-col justify-start px-3">
            <Typography
              style={{
                fontSize: '12px',
                fontWeight: 600,
                paddingBottom: '4px'
              }}
            >
              Replacement
            </Typography>
            <span className="position-relative">
              <input
                id="input_substring"
                type="text"
                name="replacement"
                value={replaceAllOperationData.replacement}
                onChange={handleInputChange}
                placeholder=""
                style={{
                  height: '40px',
                  fontSize: '13px',
                  backgroundColor: colors.white,
                  marginTop: '12px',
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
                  submitAllReplaceOperation();
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

export default ReplaceallPanel;
