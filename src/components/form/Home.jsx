import { useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MODAL, initialState, reducer } from '../../common/utils/modal-toggle';
import {
  createForm,
  deleteForm,
  editForm,
  moveToAnotherModule,
  renameForm
} from '../../redux/slices/formSlice';
import ConfirmationModal from '../shared/ConfirmationModal';
import DetailViewModal from '../shared/DetailViewModal';
import AddEditModal from './AddEditModal';
// import Dashboard from "./dashboard/Dashboard";
import Dashboard from '../dashboard/Dashboard';
import List from './List';
import MoveToModal from './move-form/MoveToModal';
import RenameModal from './rename-form/RenameModal';
import Dialog from '../../elements/Dialog';
import { notify } from '../../hooks/toastUtils';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { forms } = useSelector((state) => state.form);
  const { modules } = useSelector((state) => state.module);
  const { currentModule } = useSelector((state) => state.current);
  const { currentUser } = useSelector((state) => state.auth);
  const [state, emit] = useReducer(reducer, initialState);
  const [selectedFormId, setSelectedFormId] = useState();

  const goToFields = (form) => {
    navigate('/fields', {
      state: {
        moduleId: currentModule.moduleInfoId,
        formId:
          form.formInfoId !== undefined &&
          form.formInfoId !== null &&
          form.formInfoId !== ''
            ? form.formInfoId
            : state.selected.formInfoId
      }
    });
  };

  const goToRecordPanel = (form) => {
    navigate(`/app/${currentModule?.name}/${form?.name}`);
    notify.success(`Double click to view ${form?.name} details`);
  };

  const goToFieldGroupList = (form) => {
    navigate(`/app/${currentModule?.name}/${form?.name}/field-groups`);
  };

  const goToSchemaList = (form) => {
    navigate(`/app/${currentModule?.name}/${form?.name}/schema`);
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.edit:
        const formEdit = forms?.find((c) => c.formInfoId === id);
        emit({ type: MODAL.edit, data: formEdit });
        setSelectedFormId(id);
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedFormId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      case MODAL.details:
        const formDetails = forms?.find((c) => c.formInfoId === id);
        emit({ type: MODAL.details, data: formDetails });
        break;

      case MODAL.moveTo:
        const formToMove = forms?.find((c) => c.formInfoId === id);
        emit({ type: MODAL.moveTo, data: formToMove });
        setSelectedFormId(id);
        break;

      case MODAL.rename:
        const formRename = forms?.find((c) => c.formInfoId === id);
        emit({ type: MODAL.rename, data: formRename });
        setSelectedFormId(id);
        break;

      default:
        console.log('modalActionHandler');
    }
  };

  const submitFormHandler = (value) => {
    if (state.type === MODAL.create && value.name.length >= 1) {
      const data = {
        ...value,
        moduleInfoId: currentModule.moduleInfoId
      };
      dispatch(createForm({ data }));
    } else if (state.type === MODAL.edit && value.name.length >= 1) {
      const data = {
        ...value,

        moduleInfoId: currentModule.moduleInfoId
      };
      dispatch(editForm({ id: selectedFormId, data }));
    } else {
      alert('Form Name is required* field');
    }
    modalActionHandler(MODAL.cancel);
  };

  const deleteFormHandler = () => {
    dispatch(deleteForm({ id: selectedFormId }));
    modalActionHandler(MODAL.cancel);
  };

  const moveToAnotherModuleHandler = (moduleInfoId) => {
    dispatch(moveToAnotherModule({ formInfoId: selectedFormId, moduleInfoId }));
    modalActionHandler(MODAL.cancel);
  };

  const renameFormHandler = (newObj) => {
    dispatch(renameForm({ formInfoId: selectedFormId, data: newObj }));
    modalActionHandler(MODAL.cancel);
  };

  return (
    <>
      {currentUser?.roles?.some((role) => role.level === '1') && (
        <List
          actionHandler={modalActionHandler}
          goToFields={goToFields}
          goToRecordPanel={goToRecordPanel}
          goToFieldGroupList={goToFieldGroupList}
          goToSchemaList={goToSchemaList}
          onCreateNew={() => modalActionHandler(MODAL.create)}
        />
      )}
      {state.show &&
        (state.type === MODAL.create || state.type === MODAL.edit) && (
          <AddEditModal
            state={state}
            onConfirm={submitFormHandler}
            onCancel={() => modalActionHandler(MODAL.cancel)}
          />
        )}

      {state.show && state.type === MODAL.moveTo && (
        <MoveToModal
          state={state}
          moduleList={modules}
          onConfirm={moveToAnotherModuleHandler}
          onCancel={() => modalActionHandler(MODAL.cancel)}
        />
      )}
      {state.show && state.type === MODAL.rename && (
        <RenameModal
          state={state}
          onConfirm={renameFormHandler}
          onCancel={() => modalActionHandler(MODAL.cancel)}
        />
      )}
      {state.show && state.type === MODAL.details && (
        <DetailViewModal
          goToFields={goToFields}
          goToPanel={goToRecordPanel}
          actionHandler={modalActionHandler}
          type="form"
          state={state}
          onCancel={() => modalActionHandler(MODAL.cancel)}
        />
      )}
      {state.show && state.type === MODAL.delete && (
        <ConfirmationModal
          open={state.show}
          heading={`Delete form`}
          onConfirm={deleteFormHandler}
          onCancel={() => modalActionHandler(MODAL.cancel)}
          firstButtonText="Cancel"
          secondButtonText="Confirm"
          message={'Are you sure you want to delete this form ?'}
        />
      )}
    </>
  );
};

export default Home;
