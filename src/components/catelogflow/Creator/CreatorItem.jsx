import { useState } from 'react';

import { Trash } from 'lucide-react';
import { GripHorizontal } from 'lucide-react';
import { TextField } from '@mui/material';

import Icon from '../../../elements/Icon';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { COLORS } from '../../../common/constants/styles';

const Item = ({ field, onSelect, onDelete, type, recordId }) => {
  // const catalogTypeObj = catalogType.filter((o) => o.value === type)
  const [showdDeleteModal, setShowDeleteModal] = useState(false);
  const [showStyle, setShowStyle] = useState(false);
  return (
    <>
      <div style={{ width: '550px', border: 'red' }}>
        {field.category === 'ModuleForm' ? null : (
          <TextField
            fullWidth
            variant="standard"
            className="py-2"
            type="text"
            placeholder={field.label ? field.label : null}
            onDoubleClick={() => onSelect(field)}
            onMouseOver={() => setShowStyle(true)}
            onMouseOut={() => setShowStyle(false)}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <>
                  {field.inDependent === false ? (
                    <>
                      <GripHorizontal
                        style={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                      />
                      <Icon
                        fontSize="22px"
                        name={field.category}
                        style={{ cursor: 'pointer' }}
                      />
                    </>
                  ) : (
                    <Icon
                      fontSize="22px"
                      name={field.category}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </>
              ),
              endAdornment: (
                <div
                  className="p-1"
                  style={{
                    borderLeft: showStyle
                      ? `1px dashed ${COLORS.SECONDARY}`
                      : '',
                    cursor: 'pointer'
                  }}
                >
                  {!field.default && (
                    <div
                      onClick={() => setShowDeleteModal(!showdDeleteModal)}
                      className="px-2"
                    >
                      <Trash
                        style={{
                          color: showStyle ? 'red' : '',
                          visibility: showStyle ? 'visible' : 'hidden',
                          fontSize: '25px'
                        }}
                      />
                    </div>
                  )}
                </div>
              ),
              disableUnderline: true
            }}
            style={{
              bgcolor: showStyle ? '#CCD0D780' : COLORS.WHITE,
              '& .MuiInputBase-root': {
                height: '30px',
                fontSize: '13px',
                color: 'black',
                fontWeight: '500'
              },
              input: { cursor: 'context-menu' },
              border: showStyle
                ? `1px dashed ${COLORS.SECONDARY}`
                : `1px dashed #D9D9D900`
            }}
          />
        )}

        {showdDeleteModal && (
          <ConfirmationModal
            open={showdDeleteModal}
            heading={`Delete Question ?`}
            message={'Are you sure you want to delete this Question ?'}
            onConfirm={() => onDelete(field)}
            onCancel={() => setShowDeleteModal(!showdDeleteModal)}
            secondButtonText="Confirm"
            firstButtonText="Cancel"
          />
        )}
      </div>
    </>
  );
};

export default Item;
