import { useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  FormLabel,
  IconButton,
  Tooltip
} from '@mui/material';

import { COLORS } from '../../../common/constants/styles';
import {
  MODAL,
  initialState,
  reducer
} from '../../../common/utils/modal-toggle';
import { Button } from '@/componentss/ui/button';
import ConfirmationModal from '../../shared/ConfirmationModal';
import FieldGroupModal from './FieldGroupModal';
import {
  createFieldGroup,
  deleteFieldGroup,
  updateFieldGroup
} from '../../../redux/slices/fieldGroupSlice';
import { X } from 'lucide-react';
import FieldGroupList from './FieldGroupList';

const FieldGroup = ({ open, close, fieldGroups, selectedFormDetails }) => {
  const dispatch = useDispatch();
  const [state, emit] = useReducer(reducer, initialState);

  const [selectedfieldGroupId, setSelectedfieldGroupId] = useState();

  const submitHandler = (group) => {
    if (!group) return;
    if (state.type === MODAL.create) {
      dispatch(
        createFieldGroup({
          data: { ...group, formInfoId: selectedFormDetails?.formInfoId }
        })
      );
    } else if (state.type === MODAL.edit) {
      dispatch(
        updateFieldGroup({
          fieldGroupInfoId: selectedfieldGroupId,
          data: { ...group, formInfoId: selectedFormDetails?.formInfoId }
        })
      );
    }
    modalActionHandler(MODAL.cancel);
  };

  const deleteHandler = () => {
    dispatch(deleteFieldGroup({ fieldGroupInfoId: selectedfieldGroupId }));
    modalActionHandler(MODAL.cancel);
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.edit:
        const fieldGroupEdit = fieldGroups?.find(
          (c) => c.fieldGroupInfoId === id
        );
        emit({ type: MODAL.edit, data: fieldGroupEdit });
        setSelectedfieldGroupId(id);
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedfieldGroupId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      default:
        console.log('actionModalActionHandler');
    }
  };
  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '900px',
            margin: 0,
            padding: 0,
            borderRadius: '10px'
          }
        }
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: COLORS.WHITE
        }}
      >
        <Tooltip title="Close" placement="bottom">
          <IconButton onClick={close}>
            <CloseIcon fontSize="small" sx={{ color: COLORS.BLACK }} />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent sx={{ p: 2 }}>
        <div
          className="border p-2"
          style={{ borderRadius: '10px', backgroundColor: COLORS.WHITE }}
        >
          <div
            className="border-bottom flex items-center justify-between px-3"
            style={{
              height: '60px'
            }}
          >
            <FormLabel sx={{ fontSize: '16px', fontWeight: 'bold' }}>
              Groups
            </FormLabel>
            <div
              className="flex items-center"
              onClick={() => modalActionHandler(MODAL.create)}
            >
              <Button tooltipTitle={'Add Group'}>
                <Add /> Add group
              </Button>
            </div>
          </div>

          <FieldGroupList
            items={fieldGroups?.map((group) => {
              return {
                ...group,
                id: group.fieldGroupInfoId
              };
            })}
            headers={['Order Id', 'Name', 'Description', 'Actions']}
            onActionClick={modalActionHandler}
          />

          {state.show &&
            (state.type === MODAL.create || state.type === MODAL.edit) && (
              <FieldGroupModal
                state={state}
                onConfirm={submitHandler}
                onCancel={() => modalActionHandler(MODAL.cancel)}
              />
            )}
          {state.show && state.type === MODAL.delete && (
            <ConfirmationModal
              open={state.show}
              heading={`Are you sure you want to delete this action?`}
              onConfirm={deleteHandler}
              onCancel={() => modalActionHandler(MODAL.cancel)}
              firstButtonText="Delete"
              buttonPosition="reversed"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldGroup;
