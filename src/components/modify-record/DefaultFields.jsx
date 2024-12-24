import { FormLabel, Tooltip, Zoom } from '@mui/material';
import React, { useState } from 'react';
import { COLORS } from '../../common/constants/styles';
import TextField from '../../elements/TextField';
import { Link } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { notify } from '../../hooks/toastUtils';

const DefaultFields = () => {
  const dispatch = useDispatch();
  const { tableRecord } = useSelector((state) => state.table);
  const { selectedRecordId } = useSelector((state) => state.current);
  const [copySuccess, setCopySuccess] = useState('Copy');

  if (!selectedRecordId) return null;

  const sysFields = [
    { label: 'UUID', value: tableRecord['uuid'] },
    { label: 'Created At', value: tableRecord['created_at_display'] },
    { label: 'Created By', value: tableRecord['created_by_display'] },
    { label: 'Updated At', value: tableRecord['updated_at_display'] },
    { label: 'Updated By', value: tableRecord['updated_by_display'] }
  ];

  const copyPageUrl = async () => {
    await navigator.clipboard.writeText(selectedRecordId);
    setCopySuccess('Copied..!');
    if (copySuccess) {
      notify.success('URL copied to clipboard');
      return;
    }
  };
  return (
    <div
      className="flex flex-col gap-2 border p-3 pe-4"
      style={{
        backgroundColor: '#f6f9fe',
        width: '330px',
        borderRadius: '10px',
        boxShadow:
          '0px 2.31px 1.2px 0px #00000009 , 0px 3.7px 5.3px 0px #00000009 , 0px 3.5px 10.1px 0px #00000009 , 0px 4.6px 37.8px 0px #00000009 , 0px 9.1px 33.4px 0px #00000009'
      }}
    >
      <FormLabel
        sx={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#797979',
          position: 'absolute',
          borderBottom: '1px solid grey',
          width: '90%',
          pb: '5px'
        }}
      >
        System default fields
      </FormLabel>
      <div className="flex flex-col p-0 pb-3 pt-3">
        {sysFields
          .filter((fieldvalue) => fieldvalue.value !== null)
          .map((sysField) => (
            <div className="flex items-center">
              <span className="flex-1">
                <TextField
                  key={sysField.label}
                  labelname={sysField.label}
                  id="outlined-basic"
                  variant="outlined"
                  placeholder=""
                  value={sysField.value}
                  inputProps={{
                    sx: {
                      padding: '4px 10px !important'
                    },

                    readOnly: true
                  }}
                  sx={{
                    '& fieldset': {
                      border: 'none'
                    },
                    '& .MuiInputBase-root': {
                      fontSize: '13px',
                      borderRadius: '20px',
                      p: 0,
                      bgcolor: COLORS.WHITE
                    },
                    filter: 'drop-shadow(0px 0.001px 2.9px  #e4e4e4)',
                    input: {
                      cursor: 'context-menu'
                    }
                  }}
                  labelstyle={{
                    color: '#797979',
                    fontWeight: 400,
                    paddingBottom: '5px'
                  }}
                  fieldstyle={{
                    height: '60px',
                    marginRight: 10
                  }}
                />
              </span>
              <div
                className="text-primary"
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: 85,
                  fontSize: '10px'
                }}
              >
                <Tooltip
                  title={copySuccess}
                  TransitionComponent={Zoom}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        color: 'white',
                        fontSize: '13px',
                        height: '20px',
                        paddingX: '10px'
                      }
                    }
                  }}
                >
                  <Link sx={{
                      color: COLORS.BLUEGRAY,
                      cursor: 'pointer',
                      transform: 'rotate(-60deg)'
                    }}
                    onClick={copyPageUrl}
                  />
                </Tooltip>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DefaultFields;
