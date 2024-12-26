import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { colors } from '../../../../common/constants/styles';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../custom/useLocalStorage';

function LowercasePanel({
  lowerCaseOperationData,
  setLowerCaseOperationData,
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
      LowerCaseOperationPanel: false
    }));
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLowerCaseOperationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const submitLowercaseOperation = () => {
    set(`lowercase_${elementId}`, JSON.stringify(lowerCaseOperationData));

    let local = get(`lowercase_${elementId}`) || null;

    let parsedData = JSON.parse(local);

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(parsedData),
        s_type: 'stringOperation'
      });

      setLowerCaseOperationData((prev) => ({
        ...prev,
        input: ''
      }));
      setStringOperations((prev) => ({
        ...prev,
        LowerCaseOperationPanel: false
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
          <b>Lowercase Operation</b>
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
            <AlertCircle />
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
              style={{
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
                value={lowerCaseOperationData.input}
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
              <PackagePlus style={{
                  color: colors.primary.dark,
                  fontSize: '25px',
                  position: 'absolute',
                  top: '9px',
                  left: '147px',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  addExpression(
                    0,
                    'lowercaseOperation',
                    lowerCaseOperationData.input
                  )
                }
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
                  submitLowercaseOperation();
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

export default LowercasePanel;
