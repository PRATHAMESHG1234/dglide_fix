import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Add } from '@mui/icons-material';
import { FormLabel } from '@mui/material';

import { COLORS } from '../../../common/constants/styles';
import {
  MODAL,
  initialState,
  reducer
} from '../../../common/utils/modal-toggle';
import { Button } from '@/componentss/ui/button';
import ConfirmationModal from '../../shared/ConfirmationModal';
import {
  createDump,
  deleteDump,
  fetchDumps
} from '../../../redux/slices/dumpSlice';

import SchemaList from './SchemaList';

const Schema = () => {
  const dispatch = useDispatch();
  const [state, emit] = useReducer(reducer, initialState);
  const { currentForm } = useSelector((state) => state.current);

  const { dumps } = useSelector((state) => state.dump);
  const [selectedDumpId, setSelectedDumpId] = useState();

  useEffect(() => {
    dispatch(fetchDumps({ formInfoId: currentForm?.formInfoId }));
  }, [currentForm, dispatch]);

  const submitHandler = async () => {
    if (!currentForm || !currentForm.name) return;
    await dispatch(createDump({ formName: currentForm.name }));
    dispatch(fetchDumps({ formInfoId: currentForm.formInfoId }));
  };

  const deleteHandler = async () => {
    await dispatch(deleteDump({ dumpInfoId: selectedDumpId }));
    dispatch(fetchDumps({ formInfoId: currentForm.formInfoId }));
    modalActionHandler(MODAL.cancel);
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedDumpId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      default:
        console.log('dumpModalActionHandler');
    }
  };

  return (
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
          Schema
        </FormLabel>
        <div className="flex items-center" onClick={() => submitHandler()}>
          <Button
            tooltipTitle={'Export Schema'}
            sx={{
              backgroundColor: COLORS.PRIMARY
            }}
          >
            <Add />
          </Button>
        </div>
      </div>

      <SchemaList
        items={dumps?.map((dump) => {
          return {
            ...dump,
            id: dump.dumpInfoId
          };
        })}
        headers={['Sr No', 'Form', 'File Name', 'Export Date', 'Actions']}
        onActionClick={modalActionHandler}
      />

      {state.show && state.type === MODAL.delete && (
        <ConfirmationModal
          open={state.show}
          heading={`Delete this dump?`}
          message={'Are you sure you want to delete this dump?'}
          onConfirm={deleteHandler}
          onCancel={() => modalActionHandler(MODAL.cancel)}
          secondButtonText="Confirm"
          firstButtonText="Cancel"
        />
      )}
    </div>
  );
};

export default Schema;
