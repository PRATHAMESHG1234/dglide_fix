import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { colors } from '../../../../common/constants/styles';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { useLocalStorage } from '../custom/useLocalStorage';

function InsertPanel({
  insertOperationData,
  setInsertOperationData,
  addExpression,
  elementId,
  modeler,
  element,
  setStringOperations
}) {
  const { get, set } = useLocalStorage();

  const submitInsertOperation = () => {
    set(`insert_${elementId}`, JSON.stringify(insertOperationData));

    let local = get(`insert_${elementId}`) || null;
    let parsedData = JSON.parse(local);

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(parsedData),
        s_type: 'stringOperation'
      });

      setInsertOperationData((prev) => ({
        ...prev,
        input: '',
        substring: '',
        position: ''
      }));
      setStringOperations((prev) => ({
        ...prev,
        InsertOperationPanel: false
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInsertOperationData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const closePanel = () => {
    setStringOperations((prev) => ({
      ...prev,
      InsertOperationPanel: false
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
          <b>Insert Operation</b>
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
            margin: '20px 0px'
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
                value={insertOperationData.input}
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
                style={{
                  color: colors.primary.dark,
                  fontSize: '25px',
                  position: 'absolute',
                  top: '7px',
                  left: '136px',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  addExpression(0, 'insertOperation', insertOperationData.input)
                }
              />
            </span>
          </div>
          <div className="flex flex-col justify-start px-3">
            <Typography
              style={{
                fontSize: '13px',
                fontWeight: 400
              }}
            >
              Position
            </Typography>
            <span className="position-relative">
              <input
                id="input_position"
                type="number"
                name="position"
                value={insertOperationData.position}
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
              style={{
                fontSize: '13px',
                fontWeight: 400
              }}
            >
              Insert
            </Typography>
            <span className="position-relative">
              <input
                id="input_substring"
                type="text"
                name="substring"
                value={insertOperationData.substring}
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
                  submitInsertOperation();
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

export default InsertPanel;
