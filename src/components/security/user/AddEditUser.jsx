import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MODAL } from '../../../common/utils/modal-toggle';
import { Button } from '@/componentss/ui/button';

const AddEditUser = ({ state, onConfirm, onCancel }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    manager: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (state.selected) {
      setForm({
        firstName: state.selected.firstName,
        lastName: state.selected.lastName,
        manager: state.selected.manager,
        email: state.selected.email,
        password: state.selected.password
      });
    }
  }, [state]);

  const setFormValue = (e) => {
    const type = e.target.name;
    const value = e.target.value;

    switch (type) {
      case 'firstName':
        setForm({
          ...form,
          firstName: value
        });
        break;
      case 'lastName':
        setForm({
          ...form,
          lastName: value
        });
        break;
      case 'manager':
        setForm({
          ...form,
          manager: value
        });
        break;
      case 'email':
        setForm({
          ...form,
          email: value
        });
        break;
      case 'password':
        setForm({
          ...form,
          password: value
        });
        break;
      default:
        console.log('setFormValue default');
    }
  };

  return (
    <Dialog open={state.show} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        {state.type === MODAL.create ? 'Create' : 'Edit'} User
      </DialogTitle>
      <DialogContent>
        <div className="flex-1">
          <TextField
            fullWidth
            name="firstName"
            value={form.firstName}
            onChange={setFormValue}
            required={true}
            maxLength={40}
            placeholder="First Name"
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
            name="lastName"
            value={form.lastName}
            onChange={setFormValue}
            required={true}
            maxLength={40}
            placeholder="Last Name"
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
            name="manager"
            value={form.manager}
            onChange={setFormValue}
            required={true}
            maxLength={40}
            placeholder="Manager"
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
            name="email"
            value={form.email}
            onChange={setFormValue}
            required={true}
            maxLength={40}
            placeholder="Email"
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
            type="password"
            fullWidth
            name="password"
            value={form.password}
            onChange={setFormValue}
            required={true}
            maxLength={40}
            placeholder="Password"
            sx={{
              marginTop: '6px',
              '& .MuiInputBase-root': {
                fontSize: '15px'
              }
            }}
          />
        </div>
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

export default AddEditUser;
