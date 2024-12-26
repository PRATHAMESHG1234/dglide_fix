import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '../shared/Dialog';
import FieldEditor from '../field/FieldEditor';
import { fetchFieldsByFormId } from '../../redux/slices/fieldSlice';
import ConfirmationModal from '../shared/ConfirmationModal';
import { createTable } from '../../redux/slices/tableSlice';
import { fetchFieldGroups } from '../../redux/slices/fieldGroupSlice';

const NodeContainedFields = ({ onClose, open, nodeDetails }) => {
  const dispatch = useDispatch();
  const { fields } = useSelector((state) => state.field);
  const { modules, isLoading } = useSelector((state) => state.module);
  const [compile, setCompile] = useState(false);
  const [selectedField, setSelectedField] = useState();
  const selectedForm = nodeDetails;
  const moduleInfoId = nodeDetails?.moduleInfoId;
  const formId = selectedForm?.formInfoId;
  useEffect(() => {
    if (formId) {
      dispatch(fetchFieldsByFormId({ formInfoId: formId }));
      dispatch(fetchFieldGroups({ formInfoId: formId }));
    }
  }, [open]);

  const saveFieldsANdCreateTableHandler = () => {
    const data = fields?.map((field) => {
      const fieldInfoId = isNaN(field.fieldInfoId) ? 0 : field.fieldInfoId;

      const formInfoId = isNaN(formId) ? 0 : +formId;

      const options = field.options?.map((optn, index) => {
        const optionId = isNaN(optn.optionId) ? 0 : optn.optionId;
        return {
          ...optn,
          fieldInfoId,
          optionId,
          value: index + 1
        };
      });

      return {
        ...field,
        formInfoId,
        fieldInfoId,
        options
      };
    });
    if (!formId) return;

    createTableHandler(data);
  };

  const createTableHandler = (data) => {
    const formName = selectedForm?.name;
    if (formName) dispatch(createTable({ formName, fields: data }));
    if (!isLoading) {
      setCompile(false);
      setSelectedField();
    }
  };
  return (
    <>
      <Dialog
        Header={{
          open: open,
          close: onClose,
          dialogTitle: 'Fields'
        }}
        Footer={{
          clear: onClose,
          confirm: () => setCompile(true),
          cancelBtnLabel: 'Cancel',
          saveBtnLabel: 'Save'
        }}
        style={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1200px'
            }
          }
        }}
      >
        <FieldEditor
          selectedModuleId={moduleInfoId}
          selectedFormId={formId}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
        />
      </Dialog>

      {compile && (
        <ConfirmationModal
          open={compile}
          heading="Save & create table"
          message="This action will create table and columns"
          onConfirm={saveFieldsANdCreateTableHandler}
          onCancel={() => setCompile(false)}
          secondButtonText="Submit"
          firstButtonText="Cancel"
        />
      )}
    </>
  );
};

export default NodeContainedFields;
