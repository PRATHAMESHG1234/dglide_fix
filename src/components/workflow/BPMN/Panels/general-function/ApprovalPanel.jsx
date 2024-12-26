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
import { useLocalStorage } from '../../custom/useLocalStorage';

export const ApprovalPanel = ({
  setApprovalPanel,
  approvalData,
  setApprovalValue,
  approvalList,
  currentApprover,
  elementId,
  modeler,
  element
}) => {
  const { get, set } = useLocalStorage();

  const closeApprovalPanel = () => {
    setApprovalPanel(false);
  };

  const submitApproval = () => {
    // const elementId = get(`currentElementId`) || '';
    // setElementId(elementId);
    let local = get(`approval_${elementId}`) || null;

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: local,
        s_type: 'approval'
      });
      setApprovalPanel(false);
    }
  };
  return (
    <>
      <div
        id="set-variable-panel"
        className="panel approval-panel"
        style={{ width: '450px' }}
      >
        <form id="setForm">
          <p>
            <b>Approval</b>
          </p>
          <button
            id="close"
            className="close-btn"
            type="button"
            onClick={closeApprovalPanel}
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
              margin: '20px 0px'
            }}
          >
            {' '}
            <div className="flex flex-col justify-start">
              <Typography
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  paddingBottom: '4px'
                }}
              >
                Type
              </Typography>

              <select
                value={approvalData.type || 'select'}
                onChange={(event) => {
                  setApprovalValue(event.target.value, 'type');
                }}
                style={{
                  height: '30px'
                }}
              >
                {' '}
                <option value="select" disabled>
                  Select
                </option>
                {approvalList?.approvalData?.map((item) => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            &nbsp;
            {currentApprover?.condition == 'email' ? (
              <div className="flex flex-col justify-start">
                <Typography
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    paddingBottom: '4px'
                  }}
                >
                  User
                </Typography>
                <select
                  value={approvalData.user || 'select'}
                  onChange={(event) => {
                    setApprovalValue(event.target.value, 'user');
                  }}
                  style={{
                    height: '30px'
                  }}
                >
                  {' '}
                  <option value="select" disabled>
                    Select
                  </option>
                  {approvalList?.approvalUsersData?.map((item) => (
                    <option key={item.uuid} value={item.uuid}>
                      {item?.user_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : currentApprover?.condition.replace(/\s+/g, '').toLowerCase() ===
              'email,level' ? (
              <div className="flex gap-2">
                <div className="flex flex-col justify-start">
                  <Typography
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      paddingBottom: '4px'
                    }}
                  >
                    Level
                  </Typography>
                  <input
                    id="input_category"
                    type="number"
                    // labelname="Value"
                    value={approvalData.level}
                    placeholder=""
                    onChange={(event) => {
                      setApprovalValue(event.target.value, 'level');
                    }}
                    min="0"
                    style={{
                      '& .MuiInputBase-root': {
                        height: '45px',
                        fontSize: '13px'
                      },
                      bgcolor: COLORS.WHITE,
                      marginTop: '12px'
                    }}
                    fieldstyle={{
                      width: '100%',
                      minWidth: '170px'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-start">
                <Typography
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    paddingBottom: '4px'
                  }}
                >
                  Group
                </Typography>
                <select
                  value={approvalData.group || 'select'}
                  onChange={(event) => {
                    setApprovalValue(event.target.value, 'group');
                  }}
                  style={{
                    height: '30px'
                  }}
                >
                  {' '}
                  <option value="select" disabled>
                    Select
                  </option>
                  {approvalList?.approvalGroupData?.map((item) => (
                    <option key={item.uuid} value={item.uuid}>
                      {item?.group_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-2 flex">
            <Grid container spacing={2}>
              <Grid item>
                <Buttons variant="outlined" onClick={submitApproval}>
                  Ok
                </Buttons>
              </Grid>
              <Grid item>
                <Buttons
                  variant="outlined"
                  color="error"
                  onClick={closeApprovalPanel}
                >
                  Close
                </Buttons>
              </Grid>
            </Grid>
          </div>
        </form>
      </div>
    </>
  );
};
