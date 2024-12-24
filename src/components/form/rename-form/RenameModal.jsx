import { useState } from 'react';

import { ArrowLeftRight } from 'lucide-react';
import { Box } from '@mui/material';

import { COLORS } from '../../../common/constants/styles';
import { toSnakeCase } from '../../../common/utils/helpers';
import TextField from '../../../elements/TextField';
import Dialog from '../../shared/Dialog';

const RenameModal = ({ state, onConfirm, onCancel }) => {
  const [newName, setNewName] = useState('');
  const [newNameObj, setNewNameObj] = useState('');

  const onNameChangeHandler = (e) => {
    const value = e.target.value;
    setNewName(value);
    const modifiedStr = toSnakeCase(value);
    const obj = {
      name: modifiedStr,
      displayName: value
    };
    setNewNameObj(obj);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onConfirm({ ...newNameObj, oldName: state?.selected?.name });
  };

  return (
    <Dialog
      Header={{
        open: state.show,
        close: onCancel,
        maxWidth: 'sm',
        dialogTitle: 'Rename Form'
      }}
      Footer={{
        cancel: onCancel,
        confirm: onSubmitHandler,
        cancelBtnLabel: 'Cancel',
        saveBtnLabel: 'Save'
      }}
    >
      <Box
        spacing={5}
        className="m-3 flex items-center justify-between gap-2 rounded"
        style={{
          background: COLORS.TERTIARY
        }}
      >
        <TextField
          labelname="Old Name"
          value={state?.selected?.displayName}
          focused={false}
          inputProps={{ readOnly: true }}
          sx={{
            '& .MuiInputBase-root': {
              height: '40px',
              fontSize: '13px'
            },
            bgcolor: COLORS.WHITE,
            input: { cursor: 'no-drop' }
          }}
        />
        <ArrowLeftRight className="pt-1" />
        <TextField
          labelname="Updated Name"
          placeholder="Enter New Name"
          name="newName"
          value={newName}
          onChange={onNameChangeHandler}
          required={true}
          maxLength={40}
          sx={{
            '& .MuiInputBase-root': {
              height: '40px',
              fontSize: '13px'
            },
            bgcolor: COLORS.WHITE
          }}
        />
      </Box>
    </Dialog>
  );
};

export default RenameModal;
