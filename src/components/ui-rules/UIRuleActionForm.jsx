import React from 'react';
import { InputLabel, Tooltip } from '@mui/material';
import RadioField from '../../elements/RadioField';
import SelectField from '../../elements/SelectField';
import TextArea from '../../elements/TextArea';
import { Button } from '@/componentss/ui/button';
import { COLORS } from '../../common/constants/styles';
import { PlusSquare, PlusCircle } from 'lucide-react';
import MultipleSelect from '../../elements/MultipleSelect';

const UIRuleActionForm = ({
  actions = [],
  fields,
  formData,
  onChangeActionHandler,
  addActionsHandler
}) => {
  const uiActions = {
    displayAction: [
      { label: 'Show', value: 'show' },
      { label: 'Hidden', value: 'hidden' },
      { label: 'Mandatory', value: 'mandatory' },
      { label: 'Readonly', value: 'readonly' },
      { label: 'Readwrite', value: 'readwrite' },
      { label: 'Set Value for fields', value: 'set Value for fields' }
    ],
    validationAction: [{ label: 'Field Type', value: 'fieldType' }]
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <InputLabel sx={{ fontSize: '0.875rem' }}>Actions</InputLabel>
        <Tooltip title="Add" variant="solid">
          <PlusCircle
            fontSize="medium"
            onClick={addActionsHandler}
            sx={{
              color: COLORS.SECONDARY,
              cursor: 'pointer'
            }}
          />
        </Tooltip>
      </div>
      <div
        className="flex flex-col gap-2 border p-2"
        style={{ borderRadius: '5px' }}
      >
        {Array.isArray(actions) &&
          actions.map((action, index) => {
            const Fields = fields?.map((ele) => ({
              value: ele.value || ele.fieldInfoId,
              label: ele.label
            }));

            return (
              <div className="border-bottom flex flex-col gap-2" key={index}>
                <RadioField
                  labelname={`Action`}
                  value={action.action}
                  name={`action`}
                  onChange={(e) => onChangeActionHandler(e, action)}
                  options={[
                    { label: 'Display Action', value: 'displayAction' },
                    { label: 'Validation Action', value: 'validationAction' }
                  ]}
                />

                <SelectField
                  labelname="Action Type"
                  name={`actionType`}
                  id="input_category"
                  options={uiActions[action.action]}
                  value={formData[`actionType`]}
                  onChange={(e) => onChangeActionHandler(e, action)}
                />

                <MultipleSelect
                  labelname="Fields"
                  name={`fieldInfoIds`}
                  id="input_category"
                  options={Fields}
                  value={formData[`fieldInfoIds`] || []}
                  onChange={(e) => onChangeActionHandler(e, action)}
                  fieldstyle={{
                    minWidth: '180px'
                  }}
                  labelstyle={{
                    fontWeight: '500'
                  }}
                />

                <TextArea
                  labelname={'Message'}
                  id="outlined-multiline-static"
                  minRows={3}
                  name={`message`}
                  value={formData[`message`]}
                  onChange={(e) => onChangeActionHandler(e, action)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UIRuleActionForm;
