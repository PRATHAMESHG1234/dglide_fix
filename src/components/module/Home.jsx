// @ts-nocheck
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MODAL, initialState, reducer } from '../../common/utils/modal-toggle';
import {
  createModule,
  deleteModule,
  editModule,
  importSchemaModel
} from '../../redux/slices/moduleSlice';
import ConfirmationModal from '../shared/ConfirmationModal';
import DetailViewModal from '../shared/DetailViewModal';
import Loader from '../shared/Loader';
import AddEditModal from './AddEditModal';
import List from './List';
import ImportSchemaModal from '../form/importSchema/ImportSchema';
import Dialog from '../../elements/Dialog';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, modules } = useSelector((state) => state.module);
  const [selectedId, setSelectedId] = useState();
  const [state, emit] = useReducer(reducer, initialState);
  const { currentUser } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (
  //     modules?.length === 1 &&
  //     currentUser?.roles?.some((role) => role.level !== '1')
  //   ) {
  //     navigate(`/app/${modules[0]?.name}/dashboard/analytics`);
  //   }
  // }, [modules, currentUser]);

  if (isLoading) {
    return <Loader />;
  }

  const goToFields = (module) => {
    navigate('/fields', {
      state: {
        moduleId: module?.moduleInfoId || state.selected.moduleInfoId
      }
    });
  };

  const goToModulePanel = (module) => {
    navigate(`/app/${module.name}`);
  };

  const submitModuleHandler = async (value) => {
    try {
      if (state.type === MODAL.create) {
        await dispatch(createModule({ module: value })).unwrap();
      } else if (state.type === MODAL.edit) {
        await dispatch(editModule({ id: selectedId, module: value })).unwrap();
      }

      modalActionHandler(MODAL.cancel);
    } catch (error) {
      console.error('Failed to submit the module:', error);
    }
  };

  const importSchemaModuleHandle = (value) => {
    dispatch(importSchemaModel({ module: value, id: selectedId }));
    modalActionHandler(MODAL.cancel);
  };

  const deleteModuleHandler = () => {
    dispatch(deleteModule({ id: selectedId }));
    modalActionHandler(MODAL.cancel);
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.edit:
        const moduleData = modules?.find((c) => c.moduleInfoId === id);
        emit({ type: MODAL.edit, data: moduleData });
        setSelectedId(id);
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      case MODAL.details:
        const module = modules?.find((c) => c.moduleInfoId === id);
        emit({ type: MODAL.details, data: module });
        break;

      case MODAL.importSchema:
        const module_ = modules?.find((c) => c.moduleInfoId === id);
        emit({ type: MODAL.importSchema, data: module_ });
        setSelectedId(id);
        break;

      default:
        console.log('modalActionHandler');
    }
  };

  return (
    <>
      <List
        actionHandler={modalActionHandler}
        goToFields={goToFields}
        goToModulePanel={goToModulePanel}
        onCreateNew={() => modalActionHandler(MODAL.create)}
      />

      {state.show &&
        (state.type === MODAL.create || state.type === MODAL.edit) && (
          <AddEditModal
            state={state}
            onConfirm={submitModuleHandler}
            onCancel={() => modalActionHandler(MODAL.cancel)}
          />
        )}

      {state.show && state.type === MODAL.details && (
        <DetailViewModal
          goToFields={goToFields}
          type="module"
          state={state}
          goToPanel={goToModulePanel}
          onCancel={() => modalActionHandler(MODAL.cancel)}
        />
      )}

      {state.show && state.type === MODAL.importSchema && (
        <ImportSchemaModal
          onConfirm={importSchemaModuleHandle}
          state={state}
          onCancel={() => modalActionHandler(MODAL.cancel)}
        />
      )}

      {state.show && state.type === MODAL.delete && (
        <Dialog
          open={state.show}
          setOpen={() => modalActionHandler(MODAL.cancel)}
          title={`Are you sure you want to delete this module ?`}
          firstButtonText={'Delete'}
          secondButtonText={'Cancel'}
          onClick={deleteModuleHandler}
          width="sm"
          body={
            'Once you delete a repository, there is no going back. Please be certain.'
          }
          variant="delete"
        />
      )}
    </>
  );
};

export default Home;
