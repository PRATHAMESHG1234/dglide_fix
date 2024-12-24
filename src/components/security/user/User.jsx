/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useReducer, useState } from 'react';
import { Plus, PlusCircle } from 'lucide-react';
import { Box, Typography } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from '@mui/material';
import {
  MODAL,
  initialState,
  reducer
} from '../../../common/utils/modal-toggle';
import ConfirmationModal from '../../shared/ConfirmationModal';
import AddEditUser from './AddEditUser';
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser
} from '../../../redux/slices/userSlice';
import UserList from './UserList';
import { Button } from '@/componentss/ui/button';

const User = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [selectedId, setSelectedId] = useState();

  const [state, emit] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const submitUserRecord = (value) => {
    if (state.type === MODAL.create) {
      dispatch(createUser({ user: value }));
    } else if (state.type === MODAL.edit) {
      dispatch(updateUser({ id: selectedId, user: value }));
    }

    modalActionHandler(MODAL.cancel);
  };

  const deleteUserRecord = () => {
    dispatch(deleteUser({ id: selectedId }));
    modalActionHandler(MODAL.cancel);
    setSelectedId();
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.edit:
        const data = users?.find((c) => c.userId === id);
        emit({ type: MODAL.edit, data: data });
        setSelectedId(id);
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      default:
        console.log('modalActionHandler');
    }
  };

  return (
    <>
      <div
        className="bg-light position-fixed flex justify-between px-2 py-1 shadow-sm"
        style={{
          zIndex: 1,
          width: '90%'
        }}
      >
        <div className="flex items-center px-1">
          <Typography
            sx={{
              fontSize: '18px',
              color: 'grey'
            }}
            fontWeight="bold"
          >
            User
          </Typography>
        </div>
        <div className="flex items-center">
          <Box
            onClick={() => modalActionHandler(MODAL.create)}
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap'
            }}
          >
            <Tooltip title="Add User">
              <Button>
                <Plus />
              </Button>
            </Tooltip>
          </Box>
        </div>
      </div>
      <UserList users={users} modalActionHandler={modalActionHandler} />

      {/* {state.show &&
        (state.type === MODAL.create || state.type === MODAL.edit) && ( */}
      <AddEditUser
        state={state}
        onConfirm={submitUserRecord}
        onCancel={() => modalActionHandler(MODAL.cancel)}
      />
      {/* )} */}

      {state.show && state.type === MODAL.delete && (
        <ConfirmationModal
          open={state.show}
          heading={`Are you sure you want to delete this user ?`}
          onConfirm={deleteUserRecord}
          onCancel={() => modalActionHandler(MODAL.cancel)}
          firstButtonText="Delete"
        />
      )}
    </>
  );
};

export default User;
