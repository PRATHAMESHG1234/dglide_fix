import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MODAL } from '../../../common/utils/modal-toggle';
import { Button } from '@/componentss/ui/button';

const AddEditGroup = ({ state, onConfirm, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: ' ',
    distributions: '',
    owner: ''
  });

  useEffect(() => {
    if (state.selected) {
      setForm({
        name: state.selected.name,
        description: state.selected.description,
        distributions: state.selected.distributions,
        owner: state.selected.owner
      });
    }
  }, [state]);

  const setFormValue = (e) => {
    const type = e.target.name;
    const value = e.target.value;

    switch (type) {
      case 'name':
        setForm({
          ...form,
          name: value
        });
        break;
      case 'description':
        setForm({
          ...form,
          description: value
        });
        break;
      case 'distributions':
        setForm({
          ...form,
          distributions: value
        });
        break;
      case 'owner':
        setForm({
          ...form,
          owner: value
        });
        break;
      default:
        console.log('setFormValue default');
    }
  };

  return (
    <Dialog open={state.show} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        {state.type === MODAL.create ? 'Create' : 'Edit'} Group
      </DialogTitle>
      <DialogContent>
        <div className="flex-1">
          <TextField
            fullWidth
            name="name"
            value={form.name}
            onChange={setFormValue}
            required={true}
            maxLength={40}
            placeholder="Name"
            sx={{
              marginTop: '6px',
              '& .MuiInputBase-root': {
                fontSize: '15px'
              }
            }}
          />
        </div>
        <div className="flex-1">
          <TextField
            fullWidth
            name="distributions"
            value={form.distributions}
            onChange={setFormValue}
            required={true}
            maxLength={40}
            placeholder="Distributions"
            sx={{
              marginTop: '6px',
              '& .MuiInputBase-root': {
                fontSize: '15px'
              }
            }}
          />
        </div>
        <div className="flex-1">
          <TextField
            fullWidth
            name="owner"
            value={form.owner}
            onChange={setFormValue}
            required={true}
            maxLength={40}
            placeholder="Owner"
            sx={{
              marginTop: '6px',
              '& .MuiInputBase-root': {
                fontSize: '15px'
              }
            }}
          />
        </div>

        <TextField
          type="text"
          fullWidth
          multiline
          maxLength={400}
          rows={3}
          name="description"
          value={form.description}
          placeholder="Description"
          onChange={setFormValue}
          sx={{
            marginTop: '6px',

            '& .MuiInputBase-root': {
              fontSize: '15px'
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="danger" onClick={onCancel}>
          Cancel
        </Button>

        <Button color="primary" type="submit" onClick={() => onConfirm(form)}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditGroup;
