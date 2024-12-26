/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useReducer, useState } from 'react';
import { Plus, PlusCircle } from 'lucide-react';
import { Box, Typography } from '@mui/joy';
import { Tooltip } from '@mui/material';
import GroupList from './GroupList';
import { useDispatch, useSelector } from 'react-redux';
import {
  createGroup,
  deleteGroup,
  fetchGroups,
  updateGroup
} from '../../../redux/slices/groupSlice';
import {
  MODAL,
  initialState,
  reducer
} from '../../../common/utils/modal-toggle';
import AddEditGroup from './AddEditGroup';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { Button } from '@/componentss/ui/button';

const Group = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.group);
  const [selectedId, setSelectedId] = useState();
  const [state, emit] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(fetchGroups());
  }, []);

  const submitGroupRecord = (value) => {
    if (state.type === MODAL.create) {
      dispatch(createGroup({ group: value }));
    } else if (state.type === MODAL.edit) {
      dispatch(updateGroup({ id: selectedId, group: value }));
    }

    modalActionHandler(MODAL.cancel);
  };

  const deleteGroupRecord = () => {
    dispatch(deleteGroup({ id: selectedId }));
    modalActionHandler(MODAL.cancel);
    setSelectedId();
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.edit:
        const data = groups?.find((c) => c.groupId === id);
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
            style={{
              fontSize: '18px',
              color: 'grey'
            }}
            fontWeight="bold"
          >
            Group
          </Typography>
        </div>
        <div className="flex items-center">
          <Box
            onClick={() => modalActionHandler(MODAL.create)}
            style={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap'
            }}
          >
            <Tooltip title="Add WorkFlow">
              <Button>
                <Plus />
              </Button>
            </Tooltip>
          </Box>
        </div>
      </div>

      <GroupList groups={groups} modalActionHandler={modalActionHandler} />

      {state.show &&
        (state.type === MODAL.create || state.type === MODAL.edit) && (
          <AddEditGroup
            state={state}
            onConfirm={submitGroupRecord}
            onCancel={() => modalActionHandler(MODAL.cancel)}
          />
        )}

      {state.show && state.type === MODAL.delete && (
        <ConfirmationModal
          open={state.show}
          heading={`Delete group`}
          message={'Are you sure you want to delete this group ?'}
          onConfirm={deleteGroupRecord}
          onCancel={() => modalActionHandler(MODAL.cancel)}
          secondButtonText="Confirm"
          firstButtonText="Cancel"
        />
      )}
    </>
  );
};

export default Group;
