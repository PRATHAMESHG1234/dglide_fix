import React from 'react';
import { Checkbox } from '@/componentss/ui/checkbox';
import { Label } from '@/componentss/ui/label';

const ValidationOptions = ({ field, form, variant, onFormValueChanged }) => {
  const isMandatory = form.mandatory === true;
  const isHidden = form.hidden === true;
  const isUnique = form.unique === true;
  const globalSearch = form.globalSearch === true;
  const isAudit = form.audit === true;
  const isHighlightInitialCharacter = form.highlightInitialCharacter === true;
  const isEncode = form.encode === true;
  const isShowActivityReferenceField = form.activityReferenceField === true;
  const enableFilterPanel = form.enableFilterPanel === true;
  const trackLifecycle = form.trackLifecycle === true;
  const showInMinimalView = form.showInMinimalView === true;
  const showInNewRecord = form.showInNewRecord === true;
  const defaultLabel = form.defaultLabel === true;
  const editable = form.editable === true;
  const isShowOnTab = form.showOnTab === true;
  const isMailEnabled = form.mailEnabled === true;
  const showTimePeriod = form.showTimePeriod === true;

  const checkBoxComponent = (checked, label, name) => {
    return (
      <div className="w-[49%]">
        <Checkbox
          id={`${'checkbox-' + name}`}
          endLabel={label}
          checked={checked}
          onCheckedChange={(checked) => {
            const syntheticEvent = {
              target: {
                name,
                value: checked,
                checked,
                type: 'checkbox'
              }
            };
            onFormValueChanged(syntheticEvent);
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-2 py-2">
      <Label level="title-sm" paddingY="10px">
        Validation
      </Label>
      <div className="flex w-full flex-wrap justify-start gap-2">
        {!field.systemDefaultField &&
          checkBoxComponent(isMandatory, 'Mandatory', 'mandatory')}

        {field.category === 'TextArea' &&
          checkBoxComponent(isShowOnTab, 'Show on Tab', 'showOnTab')}

        {!field.systemDefaultField &&
          checkBoxComponent(
            editable,
            field.category === 'TableLookup' ||
              field.category === 'TableReference'
              ? 'Enable Add/Edit Record'
              : 'Editable',
            'editable'
          )}

        {checkBoxComponent(isHidden, 'Hidden', 'hidden')}

        {field.category !== 'TextArea' &&
          field.category !== 'AutoIncrement' &&
          field.category !== 'TableLookup' &&
          field.category !== 'TableReference' &&
          !field.systemDefaultField &&
          checkBoxComponent(isAudit, 'Audit', 'audit')}

        {field.category === 'Reference' &&
          !field.systemDefaultField &&
          checkBoxComponent(
            isHighlightInitialCharacter,
            'Highlight Initial',
            'highlightInitialCharacter'
          )}

        {variant === 'TimeLine' &&
          checkBoxComponent(isMailEnabled, 'Enable Mail', 'mailEnabled')}

        {!field.systemDefaultField && (
          <>
            {checkBoxComponent(isUnique, 'Unique', 'unique')}
            {checkBoxComponent(
              globalSearch,
              'Global Search',
              'globalSearch'
            )}{' '}
            {checkBoxComponent(
              isShowActivityReferenceField,
              'Activity reference field',
              'activityReferenceField'
            )}
            {checkBoxComponent(
              showInMinimalView,
              'Show in minimal view',
              'showInMinimalView'
            )}
            {checkBoxComponent(
              showInNewRecord,
              'Show in new record',
              'showInNewRecord'
            )}
            {checkBoxComponent(defaultLabel, 'Default label', 'defaultLabel')}
          </>
        )}

        {field.category === 'Input' &&
          !field.systemDefaultField &&
          checkBoxComponent(isEncode, 'Encode', 'encode')}
        {variant === 'DateTime' &&
          !field.systemDefaultField &&
          checkBoxComponent(
            showTimePeriod,
            'Show time period',
            'showTimePeriod'
          )}

        {field.options !== null && (
          <>
            {checkBoxComponent(
              enableFilterPanel,
              'Enable filter panel',
              'enableFilterPanel'
            )}

            {variant !== 'Multiple' &&
              checkBoxComponent(
                trackLifecycle,
                'Track Life Cycle',
                'trackLifecycle'
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default ValidationOptions;
