import { Grid, IconButton, Button as Buttons } from '@mui/material';
import React from 'react';
import { colors } from '../../../../../common/constants/styles';
import { Plus } from 'lucide-react';
import { useLocalStorage } from '../../custom/useLocalStorage';

export const NotifyPanel = ({
  setNotifyPanel,
  notifyData,
  setNotifyValue,
  addExpression,
  setNotifyData,
  elementId,
  modeler,
  element
}) => {
  const { get, set } = useLocalStorage();
  const closeNotifyPanel = () => {
    setNotifyPanel(false);
  };

  const submitNotify = () => {
    // const elementId = get(`currentElementId`) || '';
    // setElementId(elementId);

    let local = get(`notify_${elementId}`) || null;

    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: local,
        s_type: 'notify'
      });

      setNotifyData({
        to: '',
        subject: '',
        messageText: '',
        type: '',
        bcc: null,
        cc: null,
        formId: null,
        notificationType: 'Email',
        operation: 'string',
        templateId: null,
        workflowName: ''
      });
      setNotifyPanel(false);
    }
  };
  return (
    <>
      <div id="set-variable-panel" className="panel notify-panel">
        <form id="setForm">
          <p>
            <b>Notify</b>
          </p>
          <button
            id="close"
            className="close-btn"
            type="button"
            onClick={closeNotifyPanel}
          >
            &times;
          </button>
          <div className="flex items-center justify-between">
            <input
              className="my-2"
              type="text"
              value={notifyData.to}
              placeholder="To"
              onChange={(event) => {
                setNotifyValue(event.target.value, 'to');
              }}
            />
            <IconButton
              className="mx-1 my-2"
              sx={{
                padding: '0px',
                backgroundColor: colors.primary[200],
                '&:hover': {
                  backgroundColor: colors.primary.dark
                }
              }}
              onClick={() => addExpression('to', 'notify', notifyData.to)}
            >
              <AddIcon
                sx={{
                  fontSize: '25px',
                  color: colors.primary.main,
                  '&:hover': {
                    color: colors.white
                  }
                }}
              />
            </IconButton>
          </div>

          <div className="flex items-center justify-between">
            <input
              className="my-2"
              type="text"
              value={notifyData.cc}
              placeholder="Cc"
              onChange={(event) => {
                setNotifyValue(event.target.value, 'cc');
              }}
            />

            <IconButton
              className="mx-1 my-2"
              sx={{
                padding: '0px',
                backgroundColor: colors.primary[200],
                '&:hover': {
                  backgroundColor: colors.primary.dark
                }
              }}
              onClick={() => addExpression('cc', 'notify', notifyData.cc)}
            >
              <AddIcon
                sx={{
                  fontSize: '25px',
                  color: colors.primary.main,
                  '&:hover': {
                    color: colors.white
                  }
                }}
              />
            </IconButton>
          </div>

          <div className="flex items-center justify-between">
            <input
              className="my-2"
              type="text"
              value={notifyData.bcc}
              placeholder="Bcc"
              onChange={(event) => {
                setNotifyValue(event.target.value, 'bcc');
              }}
            />

            <IconButton
              className="mx-1 my-2"
              sx={{
                padding: '0px',
                backgroundColor: colors.primary[200],
                '&:hover': {
                  backgroundColor: colors.primary.dark
                }
              }}
              onClick={() => addExpression('bcc', 'notify', notifyData.bcc)}
            >
              <AddIcon
                sx={{
                  fontSize: '25px',
                  color: colors.primary.main,
                  '&:hover': {
                    color: colors.white
                  }
                }}
              />
            </IconButton>
          </div>
          <div className="flex items-center justify-between">
            <textarea
              className="my-2"
              style={{ height: '50px' }}
              value={notifyData.subject}
              placeholder="Subject"
              onChange={(event) => {
                setNotifyValue(event.target.value, 'subject');
              }}
            />

            <IconButton
              className="mx-1 my-2"
              sx={{
                padding: '0px',
                backgroundColor: colors.primary[200],
                '&:hover': {
                  backgroundColor: colors.primary.dark
                }
              }}
              onClick={() =>
                addExpression('subject', 'notify', notifyData.subject)
              }
            >
              <AddIcon
                sx={{
                  fontSize: '25px',
                  color: colors.primary.main,
                  '&:hover': {
                    color: colors.white
                  }
                }}
              />
            </IconButton>
          </div>
          <div className="flex items-start justify-between">
            <textarea
              className="mx-1 my-2"
              type="text"
              value={notifyData.messageText}
              placeholder="Message"
              onChange={(event) => {
                setNotifyValue(event.target.value, 'messageText');
              }}
            >
              {notifyData.messageText}
            </textarea>

            <IconButton
              className="mx-1 my-2"
              sx={{
                padding: '0px',
                backgroundColor: colors.primary[200],
                '&:hover': {
                  backgroundColor: colors.primary.dark
                }
              }}
              onClick={() =>
                addExpression('messageText', 'notify', notifyData.messageText)
              }
            >
              <AddIcon
                sx={{
                  fontSize: '25px',
                  color: colors.primary.main,
                  '&:hover': {
                    color: colors.white
                  }
                }}
              />
            </IconButton>
          </div>
          <Grid container spacing={2}>
            <Grid item>
              <Buttons variant="outlined" onClick={submitNotify}>
                Ok
              </Buttons>
            </Grid>
            <Grid item>
              <Buttons
                variant="outlined"
                color="error"
                onClick={closeNotifyPanel}
              >
                Close
              </Buttons>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};
