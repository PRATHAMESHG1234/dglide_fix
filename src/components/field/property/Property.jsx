import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox, FormControlLabel } from '@mui/material';

import DataSourceDynamic from '../DataSourceDynamic';
import DataSourceManual from '../DataSourceManual';
import FieldGroup from '../../form/field-group/FieldGroup';
import FieldGroupModal from '../../form/field-group/FieldGroupModal';
import { fetchFormById } from '../../../services/form';
import { createFieldGroup } from '../../../redux/slices/fieldGroupSlice';
import { toSnakeCase } from '../../../common/utils/helpers';
import VariantOptions from './VariantOptions';
import FieldGroupSelector from './FieldGroupSelector';
import AddEditFieldName from './AddEditFieldName';
import ValidationOptions from './ValidationOptions';
import SortByOptions from './SortByOptions';
import Loader from '../../shared/Loader';
import { colors } from '../../../common/constants/styles';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';

const Property = ({ field, onFieldUpdated, fieldGroups, selectedFormId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [options, setOptions] = useState([]);
  const [lookup, setLookup] = useState();
  const [hideLength, setHideLength] = useState(false);
  const [openFieldGroupModal, setOpenFieldGroupModal] = useState(false);
  const [fieldGroupActions, setFieldGroupActions] = useState(false);
  const [variant, setVariant] = useState(field.variant || '');
  const [columns, setColumns] = useState([]);
  const [selectedFormDetails, setSelectedFormDetails] = useState({});
  const [passwordPolicyEnable, setPasswordPolicyEnable] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState({
    passwordExpiry: '',
    noUsernameInPassword: false,
    minPasswordLength: '',
    maxPasswordLength: '',
    alphabetAndNumber: false,
    mixedCase: false,
    specialCharacter: false,
    regexCheck: ''
  });
  useEffect(() => {
    setLoading(true);
    setForm({ ...field });
    setVariant(field.variant || '');
  }, [field]);

  useEffect(() => {
    const optionList = field.dataSourceType === 'Manual' ? options : null;
    const lookupObj =
      field.dataSourceType === 'Dynamic'
        ? {
            ...lookup,
            conditions: lookup?.conditions?.map((condition) => {
              return {
                ...condition,
                conditionId: isNaN(condition.conditionId)
                  ? 0
                  : condition.conditionId
              };
            })
          }
        : null;

    const dataType =
      field.category === 'Number' ? form.variant : field.dataType;

    const newField = {
      ...field,
      ...form,
      passwordPolicy: JSON.stringify(passwordPolicy),
      length: hideLength ? 0 : form.length || 0,

      fieldGroupInfoId: form.fieldGroupInfoId || 0,

      variant: variant || null,
      prependText: form.prependText || null,
      dataType:
        form.category === 'TextArea' && form.variant === 'RichText'
          ? 'Longtext'
          : dataType,
      options: optionList,
      lookup: lookupObj
    };

    onFieldUpdated(newField);
  }, [form, options, lookup, variant]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!passwordPolicyEnable) {
      setPasswordPolicy({
        passwordExpiry: '',
        noUsernameInPassword: false,
        minPasswordLength: '',
        maxPasswordLength: '',
        alphabetAndNumber: false,
        mixedCase: false,
        specialCharacter: false,
        regexCheck: ''
      });
    }
  }, [passwordPolicyEnable]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchFormById(selectedFormId);
        const result = res?.result || {};
        setSelectedFormDetails(result);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, [selectedFormId]);

  useEffect(() => {
    if (form) {
      setPasswordPolicyEnable(form?.passwordPolicyEnable);
    }
    if (form?.passwordPolicy) {
      try {
        const parsedPasswordPolicy = JSON?.parse(form?.passwordPolicy);

        setPasswordPolicy(parsedPasswordPolicy);
        setForm((prevForm) => ({
          ...prevForm,
          passwordPolicy: parsedPasswordPolicy
        }));
      } catch (error) {
        console.error('Error parsing passwordPolicy:', error);
      }
    } else {
      setPasswordPolicy({
        passwordExpiry: '',
        noUsernameInPassword: false,
        minPasswordLength: '',
        maxPasswordLength: '',
        alphabetAndNumber: false,
        mixedCase: false,
        specialCharacter: false
      });
    }
  }, [form]);

  const onFormValueChanged = (e) => {
    const { name, value, checked, type } = e.target;

    switch (name) {
      case 'label':
        const modifiedStr = toSnakeCase(value);
        if (name === 'label' && value?.toLowerCase() === 'id') {
          setForm({ ...form, label: value, name: 'id_' });
        } else {
          setForm({ ...form, label: value, name: modifiedStr });
        }
        break;
      case 'preLabelText':
      case 'postLabelText':
      case 'length':
      case 'prependText':
      case 'fieldGroupInfoId':
      case 'sortBy':
        setForm({ ...form, [name]: value });
        break;
      case 'showLabel':
      case 'mandatory':
      case 'hidden':
      case 'audit':
      case 'unique':
      case 'globalSearch':
      case 'showTimePeriod':
      case 'highlightInitialCharacter':
      case 'activityReferenceField':
      case 'enableFilterPanel':
      case 'trackLifecycle':
      case 'encode':
      case 'showInMinimalView':
      case 'showInNewRecord':
      case 'defaultLabel':
      case 'editable':
      case 'showOnTab':
      case 'mailEnabled':
        setForm({ ...form, [name]: checked });
        break;
      case 'variant':
        setVariant(value);
        break;
      case 'passwordPolicyEnable':
        setPasswordPolicyEnable(checked);
        setForm({ ...form, passwordPolicyEnable: checked });
        break;
      case 'passwordExpiry':
      case 'noUsernameInPassword':
      case 'minPasswordLength':
      case 'maxPasswordLength':
      case 'alphabetAndNumber':
      case 'mixedCase':
      case 'specialCharacter':
        const updatedPasswordPolicy = {
          ...passwordPolicy,
          [name]: type === 'checkbox' ? checked : value
        };

        setPasswordPolicy(updatedPasswordPolicy);
        setForm({
          ...form,
          passwordPolicy: updatedPasswordPolicy
        });
        break;
      default:
        break;
    }
  };

  const showDataSource = (field) => {
    if (!field) return;

    switch (field.dataSourceType) {
      case 'Manual':
        return (
          <DataSourceManual
            staticOptions={field.options}
            onOptionChange={(optns) => setOptions(optns)}
          />
        );

      case 'Dynamic':
        return (
          <DataSourceDynamic
            form={form}
            onOptionChange={(lkup) => setLookup(lkup)}
            columns={columns}
            setColumns={setColumns}
            isDynamic={
              (form?.category === 'TableLookup' &&
                form.activityReferenceField) ||
              form?.category === 'activity'
            }
          />
        );

      default:
        return null;
    }
  };

  const showPasswordCheckBoxes = () => {
    if (!passwordPolicyEnable) return null;
    return (
      <div>
        <Label>Password Policy Requirements</Label>
        <div className="flex flex-col gap-2 pt-2">
          <Input
            label="Password Expiry"
            fullWidth
            type="number"
            name="passwordExpiry"
            placeholder="Enter number of days"
            onChange={onFormValueChanged}
            value={passwordPolicy.passwordExpiry}
          />

          <Input
            label="Minimum length"
            fullWidth
            type="number"
            name="minPasswordLength"
            placeholder="Enter minimum password length"
            onChange={onFormValueChanged}
            value={passwordPolicy.minPasswordLength}
          />
          <Input
            label="Maximum length"
            fullWidth
            type="number"
            name="maxPasswordLength"
            placeholder="Enter maximum password length"
            onChange={onFormValueChanged}
            value={passwordPolicy.maxPasswordLength}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="noUsernameInPassword"
                checked={passwordPolicy.noUsernameInPassword}
                onChange={onFormValueChanged}
              />
            }
            label={
              <span style={{ fontSize: '0.875rem' }}>
                No Username in Password{' '}
                <Label
                  component="span"
                  style={{ color: colors.grey[600], fontSize: '0.875rem' }}
                >
                  (Username exclusion)
                </Label>
              </span>
            }
            style={{
              '& .MuiFormControlLabel-label': { fontSize: '0.875rem' },
              width: '90%'
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="alphabetAndNumber"
                checked={passwordPolicy.alphabetAndNumber}
                onChange={onFormValueChanged}
              />
            }
            label={
              <span style={{ fontSize: '0.875rem' }}>
                Alphabet and Number{' '}
                <Label
                  component="span"
                  style={{ color: colors.grey[600], fontSize: '0.875rem' }}
                >
                  (Combination of letters and digits)
                </Label>
              </span>
            }
            style={{
              '& .MuiFormControlLabel-label': { fontSize: '0.875rem' },
              width: '90%'
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="mixedCase"
                checked={passwordPolicy.mixedCase}
                onChange={onFormValueChanged}
              />
            }
            label={
              <span style={{ fontSize: '0.875rem' }}>
                Mixed Case{' '}
                <Label
                  component="span"
                  style={{ color: colors.grey[600], fontSize: '0.875rem' }}
                >
                  (Both uppercase and lowercase letters)
                </Label>
              </span>
            }
            style={{
              '& .MuiFormControlLabel-label': { fontSize: '0.875rem' },
              width: '90%'
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                name="specialCharacter"
                checked={passwordPolicy.specialCharacter}
                onChange={onFormValueChanged}
              />
            }
            label={
              <span style={{ fontSize: '0.875rem' }}>
                Special Character{' '}
                <Label
                  component="span"
                  style={{ color: colors.grey[600], fontSize: '0.875rem' }}
                >
                  (Non-alphanumeric symbols)
                </Label>
              </span>
            }
            style={{
              '& .MuiFormControlLabel-label': { fontSize: '0.875rem' },
              width: '90%'
            }}
          />
        </div>
      </div>
    );
  };

  const showTimePeriod = form.showTimePeriod === true;
  const isShowLabel = form.showLabel === true;
  const fieldGroupSubmitHandler = (group) => {
    if (!group) return;
    const obj = {
      ...group,
      formInfoId: selectedFormId
    };
    dispatch(createFieldGroup({ data: obj }));
    setOpenFieldGroupModal(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <form>
      <Label className="text-sm font-semibold">
        {form.category} Properties
      </Label>
      <hr />
      <div className="h-[calc(100vh-14rem)] overflow-y-scroll px-1">
        <AddEditFieldName
          form={form}
          setForm={setForm}
          onFormValueChanged={onFormValueChanged}
          field={field}
          isShowLabel={isShowLabel}
        />

        {field.category === 'AutoIncrement' && (
          <div className="flex flex-col gap-1 py-2 pt-1">
            <hr className="my-1 border-t border-gray-300" />
            <Input
              id={'input-prependText'}
              label="Prepend Text"
              fullWidth
              type="text"
              name="prependText"
              placeholder="Text"
              onChange={onFormValueChanged}
              value={form.prependText}
            />
          </div>
        )}

        {(field.category === 'Input' || field.category === 'TextArea') &&
          !hideLength && (
            <div className="flex flex-col py-2 pt-3">
              <Input
                id={'input-length'}
                label="Length"
                type="number"
                name="length"
                placeholder="Length"
                onChange={onFormValueChanged}
                value={form.length}
              />
            </div>
          )}
        <hr className="my-1 border-t border-gray-300" />

        <FieldGroupSelector
          fieldGroups={fieldGroups}
          form={form}
          onFormValueChanged={onFormValueChanged}
          setOpenFieldGroupModal={setOpenFieldGroupModal}
          setFieldGroupActions={setFieldGroupActions}
        />
        {(field.variant || field.category === 'TableReference') &&
          !field.systemDefaultField && (
            <>
              <hr className="my-1 border-t border-gray-300" />

              <VariantOptions
                category={field.category}
                variant={variant}
                onVariantChange={setVariant}
              />
            </>
          )}
        <hr className="my-1 border-t border-gray-300" />
        <ValidationOptions
          field={field}
          form={form}
          variant={variant}
          onFormValueChanged={onFormValueChanged}
        />
        <hr className="my-1 border-t border-gray-300" />
        {(!field.systemDefaultField ||
          selectedFormDetails?.name === 'default_fields') &&
          showDataSource(field)}

        {variant === 'Calendar' && !field.systemDefaultField && (
          <>
            <hr className="my-1 border-t border-gray-300" />

            <SortByOptions
              category={field.category}
              columns={columns}
              onFormValueChanged={onFormValueChanged}
              form={form}
            />
          </>
        )}

        {field.category === 'Password' && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  name="passwordPolicyEnable"
                  checked={passwordPolicyEnable}
                  onChange={onFormValueChanged}
                  size="small"
                />
              }
              label="Enable Password Policy"
              style={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.875rem'
                },
                width: '90%',
                px: '15px'
              }}
            />{' '}
            {showPasswordCheckBoxes()}
          </>
        )}
      </div>
      {openFieldGroupModal && (
        <FieldGroupModal
          state={{ show: true }}
          onConfirm={fieldGroupSubmitHandler}
          onCancel={() => setOpenFieldGroupModal(false)}
        />
      )}
      {fieldGroupActions && (
        <FieldGroup
          open={fieldGroupActions}
          close={() => setFieldGroupActions(false)}
          fieldGroups={fieldGroups}
          selectedFormDetails={selectedFormDetails}
        />
      )}
    </form>
  );
};

export default Property;
