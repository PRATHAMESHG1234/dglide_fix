/* eslint-disable no-fallthrough */
/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import './AddEditRecord.css';

import { Plus, PlusCircle } from 'lucide-react';
import {
  Autocomplete,
  Box,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Zoom,
  Dialog,
  IconButton,
  DialogContent,
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { COLORS } from '../../../common/constants/styles';
import CheckboxField from '../../../elements/CheckboxField';
import MultipleSelect from '../../../elements/MultipleSelect';
import RadioField from '../../../elements/RadioField';
import SelectField from '../../../elements/SelectField';
import TextField from '../../../elements/TextField';
import {
  fetchFieldsByFormId,
  fetchFieldsWithValues,
  fetchRefLookupValuesByFieldInfoId
} from '../../../services/field';
import { fetchFormsByModuleId } from '../../../services/form';
import ReferenceFieldGridData from '../../records/data-grid/ReferenceFieldGridData';
import ReferenceFieldGridDataAdd from '../../records/data-grid/ReferenceFieldGridDataAdd';
import { createTableRecord } from '../../../redux/slices/tableSlice';
import { useDispatch } from 'react-redux';
import { fetchFieldGroups } from '../../../redux/slices/fieldGroupSlice';

import { Info } from 'lucide-react';
import DefaultFields from '../DefaultFields';
import Avatar from '../../../elements/Avatar';
import { IconForOption } from '../../field/OptionFieldIcon';
import { Button } from '@/componentss/ui/button';
import { X } from 'lucide-react';
import { Mail } from 'lucide-react';
import { PhoneCall } from 'lucide-react';
import { Edit, Edit2 } from 'lucide-react';
import { catalogType } from '../../../common/utils/fields';
import CreatorAddAttachment from '../../catelogflow/Creator/CreatorAddAttachment';
import { PreviewSingleAttchment } from '../../catelogflow/Creator/PreviewSingleAttchment';
import { AutocompleteField } from '../../../componentss/ui/autocomplete-field';

const defaultTheme = createTheme();
const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '2em',
          borderRadius: '10px',
          padding: 0,
          height: '90px'
        }
      }
    }
  }
});

const NUMERIC_REGEX = /^[0-9-]+$/;

const PreviewRecord = ({ formId, fieldData, fieldValues, onSubmit }) => {
  const [catagoryType, setCatagoryType] = useState('');
  const dispatch = useDispatch();
  const { currentForm, selectedRecordId } = useSelector(
    (state) => state.current
  );
  const { fieldGroups } = useSelector((state) => state.fieldGroup);
  const [formObj, setFormObj] = useState({});

  const [refresh, setRefresh] = useState(false);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForms, setSelectedForms] = useState([]);
  const [openInfo, setOpenInfo] = useState({ open: false });
  const [groupOfFields, setGroupOfFields] = useState([]);
  const [fetchdata, setFetchData] = useState(false);
  const [refField, setRefField] = useState({
    open: false,
    formId: 0,
    label: '',
    fieldName: ''
  });
  const [refFieldAddData, setRefFieldAddData] = useState({
    open: false,
    formId: 0,
    label: '',
    fieldName: ''
  });

  useEffect(() => {
    setFormObj({ ...fieldValues });
    if (fieldValues?.type) {
      const catalogTypeObj = catalogType.filter(
        (o) => o.value === fieldValues?.type
      );
      setCatagoryType(catalogTypeObj[0]?.label);
    }
  }, [fieldValues]);

  useEffect(() => {
    fetchFieldsWithValues(fieldData, fieldValues).then((data) => {
      setFields([...data]);
      setFetchData(true);
    });
  }, [fieldData, fieldValues]);

  useEffect(() => {
    const groupOfFieldArr = [];
    for (let i = 0; i <= fieldGroups?.length; i++) {
      const groupArr = fields
        ?.filter((field) => field.fieldGroup?.name === fieldGroups[i]?.name)
        .map((fld) => fld);
      groupOfFieldArr.push(groupArr);
    }
    setGroupOfFields([...groupOfFieldArr]);
  }, [fieldGroups, fields]);

  useEffect(() => {
    dispatch(fetchFieldGroups({ formInfoId: currentForm?.formInfoId }));
  }, [currentForm]);

  useEffect(() => {
    async function fetchData() {
      const moduleField = fields?.find((data) => data.variant === 'Module');
      const formField = fields?.find((data) => data.variant === 'Form');

      if (selectedRecordId && moduleField) {
        await fetchDependentForms(
          moduleField?.name,
          formObj[moduleField?.name]
        );
      }

      if (selectedRecordId && formField) {
        await fetchDependentFields(formField?.name, formObj[formField?.name]);
      }
    }

    fetchData();
    setFetchData(false);
  }, [selectedRecordId, fetchdata]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const onFormValueChanged = (e, field) => {
    const name = e.target.name || field.name;
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.type === 'select-multiple'
          ? Array.from(e.target.selectedOptions, (option) => option.value)
          : e.target.value;

    // Additional logic for handling numeric fields
    if (
      field?.type === 'number' &&
      field?.dataType !== 'Float' &&
      value !== ''
    ) {
      if (!NUMERIC_REGEX.test(value)) {
        return;
      }
    }

    const obj = { ...formObj };

    if (e.target.type === 'checkbox') {
      const objData = obj[name] ? obj[name].split(',') : [];
      const index = objData.indexOf(e.target.value);
      if (value === false) {
        if (index !== -1) {
          objData.splice(index, 1);
        }
      } else {
        if (index === -1) {
          objData.push(e.target.value);
        }
      }
      obj[name] = objData.join(',');
    } else if (e.target.type === 'select-multiple') {
      obj[name] = value.join(',');
    } else {
      obj[name] = value;
    }

    // Make dependent calls based on the changed field and value
    makeDependentCall(name, value);

    // Update the formObj state with the new values
    setFormObj(obj);
  };

  const makeDependentCall = (changedField, selectedValue) => {
    const newFields = fields?.filter(
      (fld) => fld.category === 'Reference' || fld.category === 'Lookup'
    );

    newFields.forEach((field) => {
      field?.lookup.conditions.forEach((condition) => {
        if (
          condition.dependent &&
          condition.value.toLowerCase() === changedField.toLowerCase()
        ) {
          fetchDependentReferenceLookupValues(field, {
            [changedField]: selectedValue
          });
        }
      });
    });

    const moduleField = fields?.find((data) => data.name === changedField);
    if (moduleField && moduleField.variant === 'Module') {
      fetchDependentForms(moduleField.name, selectedValue);
    }

    const formField = fields?.find((data) => data.name === changedField);
    if (formField && formField.variant === 'Form') {
      fetchDependentFields(formField.name, selectedValue);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit(formObj);
  };

  const onRefClick = (field) => {
    const payload = {};
    field?.lookup.conditions.forEach((condition) => {
      if (condition.dependent) {
        payload[condition.value] = formObj[condition.value];
      }
    });
    if (!field || !field?.lookup) return;
    setRefField({
      open: true,
      fieldInfoId: field.fieldInfoId,
      formId: field.lookup.formInfoId,
      lookupFormName: field.lookup.formName,
      name: field.name,
      fieldName: field.lookup.fieldName,
      parentFormInfoId: field.lookup.parentFormInfoId,
      payload,
      field
    });
  };

  const onRecordSelected = (record) => {
    const { name, value, column } = record;
    const field = fields.find(
      (ele) =>
        ele.fieldInfoId === refField.fieldInfoId &&
        ele.category === 'Reference' &&
        ele.variant === 'Grid'
    );
    const referenceDropdownData = [
      {
        label: column,
        value: value
      }
    ];

    if (field) {
      field.referenceDropdownData = referenceDropdownData;
      const newField = fields?.map((ele) => {
        if (ele.fieldInfoId === field.fieldInfoId) return field;
        return ele;
      });
      setFields([...newField]);
    }

    setRefField({
      open: false,
      formId: 0,
      name: ''
    });

    setFormObj((prev) => {
      let displayValue = name + '_display';
      return {
        ...prev,
        [name]: value,
        [displayValue]: column
      };
    });
  };

  const fetchDependentForms = async (name, moduleId) => {
    const response = await fetchFormsByModuleId(moduleId);
    const data = response?.result;
    if (data) {
      const newFields = fields?.map((f) => {
        if (f.category === 'ModuleForm' && f.variant === 'Form') {
          setSelectedForms(
            data.map((d) => {
              return {
                value: d.formInfoId,
                label: d.displayName
              };
            })
          );
          return {
            ...f,
            formData: data.map((d) => {
              return {
                value: d.formInfoId,
                label: d.displayName
              };
            })
          };
        }
        return f;
      });

      setFields([...newFields]);
    }
  };

  const fetchDependentFields = async (name, formId) => {
    const response = await fetchFieldsByFormId(formId);
    const data = response?.result;
    if (data) {
      const newFields = fields?.map((f) => {
        if (f.category === 'ModuleForm' && f.variant === 'Field') {
          return {
            ...f,
            fieldData: data.map((d) => {
              return {
                value: d.fieldInfoId,
                label: d.label
              };
            })
          };
        }
        return f;
      });

      setFields([...newFields]);
    }
  };

  const fetchDependentReferenceLookupValues = async (field, payload) => {
    if (field.dependent) {
      if (field.category === 'Reference' && field.variant !== 'Grid') {
        const response = await fetchRefLookupValuesByFieldInfoId(
          field.fieldInfoId,
          {
            pagination: null,
            payload,
            search: null
          }
        );
        const data = await response?.result;

        const newFields = fields?.map((f) => {
          if (f.name === field.name) {
            return {
              ...f,
              referenceDropdownData: data
            };
          }
          return f;
        });

        setFields([...newFields]);
      }
      if (field.category === 'Lookup') {
        const response = await fetchRefLookupValuesByFieldInfoId(
          field.fieldInfoId,
          {
            pagination: null,
            payload,
            search: null
          }
        );
        const data = await response?.result;

        const newFields = fields?.map((f) => {
          if (f.name === field.name) {
            return {
              ...f,
              lookupDropdownData: data
            };
          }
          return f;
        });

        setFields([...newFields]);
      }
    }
  };

  const submitRefDataHandler = (values) => {
    if (values && refField.lookupFormName) {
      dispatch(
        createTableRecord({
          tableName: refField.lookupFormName,
          data: values
        })
      );
      setRefFieldAddData({ open: false, formId: 0 });
      setRefresh(true);
    }
  };

  const fieldWidth = (field) => {
    if (!(field.preLabelText || field.postLabelText)) {
      return '250px';
    }
  };

  if (loading) {
    return <div style={{ minHeight: loading && '500px' }}>...Loading</div>;
  }
  return (
    <>
      <form id={formId} onSubmit={submitHandler}>
        <div className="flex flex-col" style={{ maxWidth: '1200px' }}>
          {groupOfFields.map((fields, i) => {
            const condArr = fields
              .filter((field) => !field.showLabel)
              ?.map((fld) => fld.fieldGroupInfoId);
            const fieldgroupArr = fields?.map((fld) => fld.fieldGroupInfoId);

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection:
                    fields[i]?.fieldGroupInfoId === 0 ? 'column' : 'row',
                  alignItems:
                    fields[i]?.fieldGroupInfoId === 0 ? 'start' : 'start',
                  justifyContent: 'start'
                  // gap: !fieldgroupArr.includes(condArr[0]) && '15px'
                }}
                className="flex-wrap px-3"
              >
                {fields
                  ?.filter((field) => !field.hidden)
                  .map((field) => {
                    switch (field.type) {
                      case 'text':
                      case 'number':
                      case 'password':
                        return (
                          <>
                            {field.category === 'AutoIncrement' ? (
                              <div
                                className="flex items-center justify-center"
                                style={{
                                  paddingTop: '2.5px',
                                  paddingBottom:
                                    fieldgroupArr.includes(condArr[0]) && '23px'
                                }}
                              >
                                <FormLabel
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 'bolder'
                                  }}
                                >
                                  {formObj[field.name] || formObj?.uuid}
                                  <ThemeProvider theme={defaultTheme}>
                                    <ThemeProvider theme={theme}>
                                      <Tooltip
                                        title={<DefaultFields />}
                                        placement="right"
                                        TransitionComponent={Zoom}
                                      >
                                        <span className="ps-1">
                                          <Info
                                            style={{
                                              fontSize: '18px',
                                              color: COLORS.PRIMARY
                                            }}
                                          />
                                        </span>
                                      </Tooltip>
                                    </ThemeProvider>
                                  </ThemeProvider>
                                </FormLabel>
                              </div>
                            ) : (
                              <div
                                className={`${
                                  (field.name === 'summary' ||
                                    field.name === 'subject') &&
                                  'flex flex-1'
                                }`}
                                style={{
                                  maxWidth:
                                    (field.name === 'summary' ||
                                      field.name === 'subject') &&
                                    '720px'
                                }}
                              >
                                <TextField
                                  key={field.name}
                                  labelname={field.showLabel && field.label}
                                  variant="outlined"
                                  multiline={
                                    (field.name === 'summary' ||
                                      field.name === 'subject') &&
                                    'multiline'
                                  }
                                  minRows={
                                    (field.name === 'summary' ||
                                      field.name === 'subject') &&
                                    1
                                  }
                                  maxRows={
                                    (field.name === 'summary' ||
                                      field.name === 'subject') &&
                                    1
                                  }
                                  preLabelText={field.preLabelText}
                                  postLabelText={field.postLabelText}
                                  name={field.name}
                                  maxLength={field?.length}
                                  type={field.type}
                                  required={field.mandatory}
                                  value={formObj[field.name] || ''}
                                  onChange={(e) => onFormValueChanged(e, field)}
                                  inputProps={{
                                    sx: {
                                      padding: '4px 10px !important'
                                    },

                                    readOnly:
                                      ((field.category === 'AutoIncrement' ||
                                        field.systemDefaultField) &&
                                        true) ||
                                      !field.editable,
                                    autoComplete:
                                      field.category === 'Password' &&
                                      'new-password'
                                  }}
                                  style={{
                                    '& fieldset': {
                                      border: 'none'
                                    },
                                    '& .MuiInputBase-root': {
                                      fontSize: '13px',
                                      borderRadius: '200px',
                                      p:
                                        field.name === 'summary' ||
                                        field.name === 'subject'
                                          ? 1
                                          : 0,
                                      bgcolor: COLORS.WHITE
                                    },
                                    filter:
                                      'drop-shadow(0px 0.001px 2.9px  #e4e4e4)',
                                    input: (field.category ===
                                      'AutoIncrement' ||
                                      field.systemDefaultField) && {
                                      cursor: 'no-drop'
                                    }
                                  }}
                                  labelstyle={{
                                    color: '#797979',
                                    fontWeight: 400,
                                    paddingTop: '5px'
                                  }}
                                  fieldstyle={{
                                    paddingLeft:
                                      (field.name === 'summary' ||
                                        field.name === 'subject') &&
                                      25,
                                    paddingRight:
                                      (field.name === 'summary' ||
                                        field.name === 'subject') &&
                                      25,

                                    width:
                                      !(
                                        field.name === 'summary' ||
                                        field.name === 'subject'
                                      ) && fieldWidth(field),

                                    display:
                                      field.category === 'AutoIncrement' &&
                                      !selectedRecordId
                                        ? 'none'
                                        : 'flex',
                                    flexGrow:
                                      (field.name === 'summary' ||
                                        field.name === 'subject') &&
                                      1,
                                    flexDirection: 'column',
                                    marginRight:
                                      !(
                                        field.name === 'summary' ||
                                        field.name === 'subject'
                                      ) && '20px'
                                  }}
                                  inputAreaStyle={{
                                    width: '122px',
                                    minWidth: '142px'
                                  }}
                                />
                              </div>
                            )}
                          </>
                        );

                      case 'date':
                        return (
                          <div className="">
                            <TextField
                              key={field.name}
                              labelname={field.showLabel && field.label}
                              variant="outlined"
                              name={field.name}
                              showTimePeriod={field?.showTimePeriod}
                              type={
                                field.variant === 'DateTime'
                                  ? 'datetime-local'
                                  : 'date'
                              }
                              preLabelText={field.preLabelText}
                              postLabelText={field.postLabelText}
                              required={field.mandatory}
                              value={
                                field.variant === 'DateTime' &&
                                formObj[field.name]
                                  ? formObj[field.name]
                                  : formObj[field.name]?.split('T')[0]
                              }
                              onChange={(e) => onFormValueChanged(e, field)}
                              inputProps={{
                                sx: {
                                  padding: '4px 10px !important'
                                },
                                readOnly:
                                  (field.systemDefaultField && true) ||
                                  !field.editable
                              }}
                              style={{
                                '& fieldset': {
                                  border: 'none'
                                },
                                '& .MuiInputBase-root': {
                                  fontSize: '13px',
                                  borderRadius: '200px',
                                  p: 0,
                                  bgcolor: COLORS.WHITE
                                },
                                filter:
                                  'drop-shadow(0px 0.001px 2.9px  #e4e4e4)',
                                input: field.systemDefaultField && {
                                  cursor: 'no-drop'
                                }
                              }}
                              fieldstyle={{
                                width: !field.showLabel
                                  ? '100%'
                                  : fieldWidth(field),
                                marginRight: '20px'
                              }}
                              labelstyle={{
                                color: '#797979',
                                fontWeight: 400,
                                paddingBottom: '5px'
                              }}
                              inputAreaStyle={{
                                width: '172px'
                              }}
                            />
                          </div>
                        );

                      // eslint-disable-next-line no-fallthrough
                      case 'radio':
                        if (!formObj[field.name]) {
                          const defaultValueOption = field.options?.find(
                            (option) => option.default
                          );
                          if (defaultValueOption) {
                            formObj[field.name] = defaultValueOption.value;
                          }
                        }
                        return (
                          <RadioField
                            key={field.name}
                            labelname={field.label}
                            value={formObj[field.name] || ''}
                            name={field.name}
                            onChange={(e) => onFormValueChanged(e, field)}
                            options={field.options}
                            labelstyle={{
                              color: '#797979',
                              fontWeight: 400,
                              paddingBottom: '5px'
                            }}
                            fieldstyle={{ marginRight: '20px' }}
                          />
                        );

                      case 'select':
                        if (!formObj[field.name]) {
                          const defaultValueOption = field.options?.find(
                            (option) => option.default
                          );
                          if (defaultValueOption) {
                            formObj[field.name] = defaultValueOption.value;
                          }
                        }
                        if (
                          !field.variant ||
                          field.variant?.toLowerCase() === 'single'
                        ) {
                          const fieldWithStyle = field.options?.filter(
                            (opt) => opt.value === formObj[field.name]
                          );
                          const optionColor =
                            fieldWithStyle[0]?.style &&
                            JSON.parse(fieldWithStyle[0]?.style);
                          // if (!optionColor?.icon) return;
                          const modifiedOptions =
                            optionColor?.icon &&
                            field.options.map((opn) => {
                              const label =
                                opn?.style && JSON.parse(opn?.style)?.icon;
                              return {
                                ...opn,
                                label: IconForOption && (
                                  <Box
                                    style={{
                                      fontSize: '16px',
                                      color: COLORS.PRIMARY
                                    }}
                                  >
                                    {IconForOption[label]}
                                  </Box>
                                )
                              };
                            });
                          return (
                            <SelectField
                              key={field.name}
                              labelname={field.showLabel && field.label}
                              name={field.name}
                              value={formObj[field.name]}
                              preLabelText={field.preLabelText}
                              postLabelText={field.postLabelText}
                              onChange={(e) => onFormValueChanged(e, field)}
                              options={modifiedOptions || field.options}
                              inputProps={{
                                sx: {
                                  padding: '4px 10px !important'
                                },
                                IconComponent: () => null,
                                readOnly:
                                  (field.systemDefaultField && true) ||
                                  !field.editable
                              }}
                              style={{
                                fontSize: '13px',
                                borderRadius: '20px',
                                '& fieldset': {
                                  border: 'none'
                                },
                                backgroundColor:
                                  optionColor?.backgroundColor || 'white',
                                color: optionColor?.color,
                                filter:
                                  'drop-shadow(0px 0.001px 2.9px  #e4e4e4)',
                                input: field.systemDefaultField && {
                                  cursor: 'no-drop'
                                }
                              }}
                              labelstyle={{
                                color: '#797979',
                                fontWeight: 400,
                                paddingBottom: '5px'
                              }}
                              fieldstyle={{
                                minWidth: !formObj[field.name] && '70px',
                                width: fieldWidth(field),
                                marginRight:
                                  !(
                                    field.preLabelText || field.postLabelText
                                  ) && '20px'
                              }}
                            />
                          );
                        } else if (
                          field.variant?.toLowerCase() === 'multiple'
                        ) {
                          return (
                            <MultipleSelect
                              key={field.name}
                              labelname={field.label}
                              name={field.name}
                              value={
                                formObj[field.name]
                                  ? formObj[field.name]?.toString().split(',')
                                  : []
                              }
                              onChange={(e) => onFormValueChanged(e, field)}
                              options={field.options}
                              inputProps={{
                                sx: {
                                  padding: '4px 10px !important'
                                },
                                IconComponent: () => null,
                                readOnly: field.systemDefaultField && true
                              }}
                              style={{
                                fontSize: '13px',
                                borderRadius: '20px',
                                '& fieldset': {
                                  border: 'none'
                                },
                                backgroundColor: 'white',
                                filter:
                                  'drop-shadow(0px 0.001px 2.9px  #e4e4e4)',
                                input: field.systemDefaultField && {
                                  cursor: 'no-drop'
                                }
                              }}
                              labelstyle={{
                                color: '#797979',
                                fontWeight: 400,
                                paddingBottom: '5px'
                              }}
                              fieldstyle={{
                                minWidth: !formObj[field.name] && '70px',
                                width: fieldWidth(field),
                                marginRight: '20px'
                              }}
                            />
                          );
                        }

                      // eslint-disable-next-line no-fallthrough
                      case 'checkbox':
                        if (!formObj[field.name]) {
                          const defaultValueOption = field.options?.find(
                            (option) => option.default
                          );
                          if (defaultValueOption) {
                            formObj[field.name] = defaultValueOption.value;
                          }
                        }

                        return (
                          <div className="py-1" key={field.name}>
                            <CheckboxField
                              labelname={field.label}
                              options={field.options}
                              checkedlabel={formObj[field.name]}
                              name={field.name}
                              onChange={(e) => onFormValueChanged(e, field)}
                              labelstyle={{
                                color: '#797979',
                                fontWeight: 400,
                                paddingBottom: '5px'
                              }}
                            />
                          </div>
                        );

                      case 'reference':
                        if (
                          (formId === 'reference' ||
                            formId === 'reference-modal') &&
                          currentForm?.name === field.lookup?.formName
                        ) {
                          return null;
                        }

                        if (field.variant === 'Dropdown') {
                          return (
                            <AutocompleteField
                              field={field}
                              formObj={formObj}
                              onFormValueChanged={onFormValueChanged}
                              fieldWidth={fieldWidth}
                              disableClearable={true}
                              placeholder="Search"
                              showTooltip={true}
                              forcePopupIcon={false}
                              listboxStyle={{
                                fontSize: '13px',
                                fontWeight: 'normal',
                                position: 'absolute',
                                minWidth: fieldWidth(field),
                                maxWidth: fieldWidth(field),
                                backgroundColor: COLORS.WHITE,
                                filter:
                                  'drop-shadow(-1px 1px 5px rgba(0,0,0,0.2)) drop-shadow(0px 3px 5px rgba(0,0,0,0.14)) drop-shadow(0px 1px 4px rgba(0,0,0,0.12))',
                                borderRadius: '3px',
                                lineHeight: '15px'
                              }}
                              textFieldSx={{
                                fontSize: '13px',
                                padding: '0 5px !important',
                                borderRadius: '20px',
                                bgcolor: COLORS.WHITE,
                                width: !field.showLabel
                                  ? '10px'
                                  : fieldWidth(field),
                                minWidth: '90px',
                                border: 'none',
                                shadow: 'drop-shadow(0px 0.001px 2.9px #e4e4e4)'
                              }}
                              autocompleteFieldStyle={{
                                marginRight: field.showLabel && '20px'
                              }}
                              labelstyle={{
                                color: '#797979',
                                fontWeight: 400
                              }}
                            />
                          );
                        } else if (field.variant === 'Grid') {
                          const HighlightInitial =
                            field.highlightInitialCharacter && field;
                          const name = field.name + '_display';
                          return (
                            <>
                              {HighlightInitial ? (
                                <div
                                  className="flex flex-row gap-2"
                                  onClick={() =>
                                    setOpenInfo({
                                      open: true,
                                      name: formObj[name],
                                      field: field
                                    })
                                  }
                                  style={{
                                    position: 'relative',
                                    cursor: 'pointer'
                                    // width: fieldWidth(field)
                                  }}
                                >
                                  <Avatar value={formObj[name]} />
                                  <div className="flex flex-col gap-0">
                                    <FormLabel
                                      style={{
                                        fontSize: '13.5px',
                                        fontWeight: 'bold',
                                        cursor: 'inherit'
                                      }}
                                    >
                                      {formObj[name]}
                                    </FormLabel>
                                    <span
                                      style={{
                                        fontSize: '12.5px',
                                        color: '#797979'
                                      }}
                                    >
                                      {field.label}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="flex flex-col pb-1"
                                  key={field.name}
                                >
                                  <InputLabel
                                    style={{
                                      fontSize: '13.5px',
                                      fontWeight: 400
                                    }}
                                  >
                                    {field.mandatory ? (
                                      <div className="flex">
                                        <span
                                          style={{
                                            color: '#797979'
                                          }}
                                        >
                                          {field.label}
                                          <span className="text-danger">
                                            {' '}
                                            *
                                          </span>
                                        </span>
                                      </div>
                                    ) : (
                                      field.label
                                    )}
                                  </InputLabel>
                                  <FormControl
                                    style={{
                                      minWidth: 180
                                    }}
                                  >
                                    <div className="mb-3 flex items-center">
                                      <Select
                                        fullWidth={true}
                                        name={field.name}
                                        value={formObj[field.name] || ''}
                                        readOnly
                                        preLabelText={field.preLabelText}
                                        postLabelText={field.postLabelText}
                                        isShowTooltip={true}
                                        inputProps={{
                                          IconComponent: () => null
                                        }}
                                        style={{
                                          height: '35px',
                                          fontSize: '13px',
                                          bgcolor: COLORS.WHITE,
                                          borderRadius: '8px 0px 0px 8px',
                                          backgroundColor: 'white',
                                          filter:
                                            'drop-shadow(0px 0.001px 2.9px  #e4e4e4)'
                                        }}
                                        labelstyle={{
                                          color: '#797979'
                                        }}
                                        fieldstyle={{
                                          marginRight: '20px'
                                        }}
                                      >
                                        {field.referenceDropdownData?.map(
                                          (opn, j) => {
                                            return (
                                              <MenuItem
                                                key={j}
                                                value={opn.value}
                                                style={{
                                                  fontSize: '13px',
                                                  display: 'none'
                                                }}
                                              >
                                                {opn.label}
                                              </MenuItem>
                                            );
                                          }
                                        )}
                                      </Select>

                                      <Plus
                                        style={{
                                          border: `1px solid ${COLORS.GRAYSCALE}`,
                                          borderRadius: '0px 8px 8px 0px',
                                          borderLeft: 'none',
                                          cursor: 'pointer',
                                          height: '35px',
                                          width: '40px',
                                          padding: '8px',
                                          color: COLORS.SECONDARY,
                                          bgcolor: '#D2E5FF'
                                        }}
                                        onClick={() => onRefClick(field)}
                                      />
                                    </div>
                                  </FormControl>
                                </div>
                              )}
                            </>
                          );
                        } else {
                          return null;
                        }

                      case 'lookup':
                        return (
                          <SelectField
                            key={field.name}
                            labelname={field.showLabel && field.label}
                            name={field.name}
                            value={formObj[field.name]}
                            preLabelText={field.preLabelText}
                            postLabelText={field.postLabelText}
                            onChange={(e) => onFormValueChanged(e, field)}
                            options={field.lookupDropdownData}
                            inputProps={{
                              readOnly: !field.editable,
                              sx: {
                                padding: '4px 10px !important'
                              },
                              IconComponent: () => null
                            }}
                            style={{
                              fontSize: '13px',
                              '& fieldset': {
                                border: 'none'
                              },
                              borderRadius: '20px',
                              backgroundColor: 'white',
                              filter: 'drop-shadow(0px 0.001px 2.9px  #e4e4e4)'
                            }}
                            labelstyle={{
                              color: '#797979',
                              fontWeight: 400,
                              paddingBottom: '5px'
                            }}
                            fieldstyle={{
                              minWidth: !formObj[field.name] && '70px',
                              width: fieldWidth(field),
                              marginRight: '20px'
                            }}
                          />
                        );

                      case 'moduleform': {
                        if (field.variant) {
                          return (
                            <SelectField
                              labelname={field.label}
                              name={field.name}
                              value={formObj[field.name]}
                              key={field.name}
                              onChange={(e) => onFormValueChanged(e, field)}
                              options={
                                field.variant === 'Module'
                                  ? field.moduleData
                                  : field.variant === 'Form'
                                    ? field.formData || selectedForms
                                    : field.fieldData
                              }
                              required={field.mandatory}
                              inputProps={{
                                sx: {
                                  padding: '4px 10px !important'
                                },
                                IconComponent: () => null
                              }}
                              style={{
                                fontSize: '13px',
                                borderRadius: '20px',
                                '& fieldset': {
                                  border: 'none'
                                },
                                backgroundColor: 'white',
                                filter:
                                  'drop-shadow(0px 0.001px 2.9px  #e4e4e4)'
                              }}
                              labelstyle={{
                                color: '#797979',
                                fontWeight: 400,
                                paddingBottom: '5px'
                              }}
                              fieldstyle={{
                                minWidth: !formObj[field.name] && '70px',
                                width: fieldWidth(field),
                                marginRight:
                                  !(
                                    field.preLabelText || field.postLabelText
                                  ) && '20px'
                              }}
                            />
                          );
                        }
                      }

                      case 'json': {
                        if (formObj?.details) {
                          const detailData = JSON.parse(formObj?.details);
                          return (
                            <>
                              <div className="">
                                {Object.entries(detailData).map(
                                  ([key, value], index) => {
                                    const newKey = key
                                      .split('_')
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(' ');

                                    return (
                                      <div key={key}>
                                        {Array.isArray(value) ? (
                                          <CreatorAddAttachment
                                            selectedRecordId={
                                              selectedRecordId
                                                ? selectedRecordId
                                                : null
                                            }
                                            catlogFlag="RequestType"
                                          />
                                        ) : typeof value === 'object' ? (
                                          <>
                                            <Typography
                                              style={{
                                                color: COLORS.SECONDARY,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                width: '8vw',
                                                fontSize: '14px'
                                              }}
                                            >
                                              {key}
                                            </Typography>
                                            <PreviewSingleAttchment
                                              catlogFlag=""
                                              attachmnetData={value}
                                            />
                                          </>
                                        ) : (
                                          <TextField
                                            key={index}
                                            labelname={key}
                                            variant="outlined"
                                            readOnly
                                            name={key}
                                            type="text"
                                            value={value}
                                            inputProps={{
                                              sx: {
                                                padding: '4px 10px !important'
                                              },

                                              readOnly:
                                                field.category ===
                                                  'AutoIncrement' && true,

                                              autoComplete:
                                                field.category === 'Password' &&
                                                'new-password'
                                            }}
                                            style={{
                                              '& fieldset': {
                                                border: 'none'
                                              },
                                              '& .MuiInputBase-root': {
                                                fontSize: '13px',
                                                borderRadius: '200px',
                                                p:
                                                  field.name === 'summary'
                                                    ? 1
                                                    : 0,
                                                bgcolor: COLORS.WHITE
                                              },
                                              filter:
                                                'drop-shadow(0px 0.001px 2.9px  #e4e4e4)',
                                              input: field.category ===
                                                'AutoIncrement' && {
                                                cursor: 'no-drop'
                                              }
                                            }}
                                            labelstyle={{
                                              color: '#797979',
                                              fontWeight: 400,
                                              paddingBottom: '5px'
                                            }}
                                            fieldstyle={{
                                              paddingLeft:
                                                field.name === 'summary' && 10,
                                              paddingRight:
                                                field.name === 'summary' && 10,

                                              width:
                                                field.name === 'summary' &&
                                                '450px',
                                              display:
                                                field.category ===
                                                  'AutoIncrement' &&
                                                !selectedRecordId &&
                                                'none'
                                            }}
                                            inputAreaStyle={{
                                              width: '122px',
                                              minWidth: '142px'
                                            }}
                                          />
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </>
                          );
                        }
                      }
                      default:
                        return null;
                    }
                  })}
              </div>
            );
          })}
        </div>
        {catagoryType === 'Document Type' && fieldValues?.uuid && (
          <CreatorAddAttachment
            field="attachment"
            selectedRecordId={fieldValues?.uuid ? fieldValues?.uuid : null}
            catlogFlag="DocumentType"
          />
        )}
        <Dialog
          open={openInfo.open}
          onClose={() => setOpenInfo({ open: false })}
          fullWidth
          style={{
            '& .MuiDialog-container': {
              '& .MuiPaper-root': {
                width: '100%',
                maxWidth: '250px',
                Margin: 0,
                padding: 0,
                borderRadius: '10px'
              }
            }
          }}
        >
          <div style={{ height: '105px', position: 'relative' }}>
            <div
              className="w-full"
              style={{
                height: '73px',
                backgroundColor: '#F6FAFF'
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                top: '35px',
                left: '90px',
                backgroundColor: COLORS.WHITE,
                borderRadius: 999
              }}
            >
              <Avatar
                value={openInfo.name}
                style={{
                  height: '65px',
                  width: '65px',
                  fontSize: '22px'
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0
              }}
            >
              <Tooltip title="Close" placement="bottom">
                <IconButton onClick={() => setOpenInfo(false)}>
                  <X fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <DialogContent style={{ p: 0 }}>
            {openInfo.name ? (
              <div className="flex flex-col items-center justify-center p-3 pt-0">
                <label
                  style={{
                    fontWeight: 500,
                    fontSize: '17px',
                    cursor: 'pointer'
                  }}
                >
                  {openInfo?.name}{' '}
                  <Tooltip
                    title={`change ${openInfo?.field?.name}`}
                    TransitionComponent={Zoom}
                  >
                    <IconButton
                      onClick={() => {
                        onRefClick(openInfo.field);
                        setOpenInfo({ open: false });
                      }}
                      style={{
                        height: '15px',
                        width: '15px'
                      }}
                    >
                      <Edit2 style={{ fontSize: '16px' }} />
                    </IconButton>
                  </Tooltip>
                </label>
                <p style={{ fontSize: '13px' }}>
                  {`@${openInfo?.name?.toLowerCase()}456`}
                </p>
                <div className="flex gap-2">
                  <Button
                    tooltipTitle={'mail'}
                    style={{
                      backgroundColor: COLORS.PRIMARY
                    }}
                  >
                    <Mail />
                  </Button>
                  <Button
                    tooltipTitle={'call'}
                    style={{
                      backgroundColor: COLORS.PRIMARY
                    }}
                  >
                    <PhoneCall />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-3"
                style={{ height: '100px' }}
              >
                <label
                  style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  There is no agent selected.
                </label>
                <Button
                  onClick={() => {
                    onRefClick(openInfo.field);
                    setOpenInfo({ open: false });
                  }}
                  style={{
                    backgroundColor: COLORS.PRIMARY
                  }}
                >
                  Select
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </form>

      {refField.open && (
        <ReferenceFieldGridData
          refField={refField}
          setRefFieldAddData={setRefFieldAddData}
          updateTable={{ refresh: refresh, setRefresh: setRefresh }}
          onConfirm={(selectedRecord) => onRecordSelected(selectedRecord)}
          onCancel={() => setRefField({ open: false, formId: 0 })}
        />
      )}

      {refField && refFieldAddData && (
        <ReferenceFieldGridDataAdd
          refFieldAddData={refFieldAddData}
          onConfirm={submitRefDataHandler}
          onCancel={() => setRefFieldAddData({ open: false, formId: 0 })}
        />
      )}
    </>
  );
};

export default PreviewRecord;
