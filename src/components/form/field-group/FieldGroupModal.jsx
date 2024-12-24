import { useEffect, useState } from 'react';
import Dialog from '../../shared/Dialog';
import { useSelector } from 'react-redux';
import { Input } from '@/componentss/ui/input';
import { Textarea } from '@/componentss/ui/textarea';
import { Checkbox } from '@/componentss/ui/checkbox';

import './FieldGroup.css';

const FieldGroupModal = ({ state, onCancel, onConfirm }) => {
  const { currentForm } = useSelector((state) => state.current);
  const [groupObj, setGroupObj] = useState({
    formInfoId: '',
    name: '',
    description: '',
    fieldGroupIndex: '',
    enableFullWidth: false,
    hideLabel: true
  });
  const [fieldErrors, setFieldErrors] = useState({
    fieldGroupIndex: ''
  });

  useEffect(() => {
    if (state.selected) {
      const {
        formInfoId,
        name,
        description,
        fieldGroupIndex,
        enableFullWidth,
        hideLabel
      } = state.selected;

      setGroupObj({
        formInfoId,
        name,
        description,
        fieldGroupIndex,
        enableFullWidth,
        hideLabel
      });
    }
  }, [state]);

  const handleChange = (name, value) => {
    setGroupObj((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'fieldGroupIndex' && (!value || isNaN(value))) {
      setFieldErrors((prev) => ({
        ...prev,
        fieldGroupIndex: 'Order Id is required and must be a number.'
      }));
    } else if (name === 'fieldGroupIndex') {
      setFieldErrors((prev) => ({
        ...prev,
        fieldGroupIndex: ''
      }));
    }
  };

  const onSubmitHandler = () => {
    if (!groupObj.fieldGroupIndex) {
      setFieldErrors((prev) => ({
        ...prev,
        fieldGroupIndex: 'Order Id is required and must be a number.'
      }));
      return;
    }

    const { formInfoId } = currentForm || {};
    const { name, description, fieldGroupIndex, enableFullWidth, hideLabel } =
      groupObj;

    const obj = {
      formInfoId,
      name,
      description,
      fieldGroupIndex,
      enableFullWidth,
      hideLabel
    };

    onConfirm(obj);
  };

  return (
    <Dialog
      Header={{
        open: state.show,
        close: onCancel,
        maxWidth: 'sm',
        dialogTitle: 'Field Group'
      }}
      Footer={{
        clear: onCancel,
        confirm: onSubmitHandler,
        cancelBtnLabel: 'Cancel',
        saveBtnLabel: 'Save'
      }}
    >
      <div className="modal_container">
        <div
          key={groupObj.formInfoId}
          className="flex flex-col gap-3"
          style={{
            borderBottom: groupObj.type && '1px solid grey',
            marginBottom: '10px'
          }}
        >
          <Input
            id="name"
            label="Name"
            type="text"
            fullWidth
            maxLength={400}
            name="name"
            value={groupObj.name}
            placeholder="Name"
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <Textarea
            label="Description"
            type="text"
            fullWidth
            placeholder="Description"
            multiline={true}
            maxLength={400}
            id="description"
            minRows={4}
            maxcharacter={100}
            value={groupObj.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full"
          />

          <Input
            id="fieldGroupIndex"
            label="Order Id"
            type="number"
            fullWidth
            maxLength={400}
            value={groupObj.fieldGroupIndex}
            placeholder="Order Id"
            onChange={(e) => handleChange('fieldGroupIndex', e.target.value)}
            error={!!fieldErrors.fieldGroupIndex}
            validation={
              fieldErrors.fieldGroupIndex && {
                type: 'error',
                message: fieldErrors.fieldGroupIndex
              }
            }
          />
          <div className="pt-1">
            <Checkbox
              checked={groupObj.hideLabel}
              onCheckedChange={(checked) => {
                handleChange('hideLabel', checked);
              }}
              endLabel={'Hide Label'}
              id="enableFullWidth"
            />
          </div>
          <div className="pt-1">
            <Checkbox
              checked={groupObj.enableFullWidth}
              onCheckedChange={(checked) => {
                handleChange('enableFullWidth', checked);
              }}
              endLabel={'Allow Full Width'}
              id="enableFullWidth"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FieldGroupModal;
