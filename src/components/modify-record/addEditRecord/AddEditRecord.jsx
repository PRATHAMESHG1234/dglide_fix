import { useEffect, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../../common/constants/styles';
import { AutocompleteField } from '../../../componentss/ui/autocomplete-field';
import RichTextEditor from '../../../elements/RichTextEditor';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';
import {
  fetchFieldsByFormId,
  fetchFieldsWithValues,
  fetchRefLookupValuesByFieldInfoId
} from '../../../services/field';
import { fetchFormsByModuleId } from '../../../services/form';
import CreatorAddAttachment from '../../catelogflow/Creator/CreatorAddAttachment';
import { PreviewSingleAttchment } from '../../catelogflow/Creator/PreviewSingleAttchment';
import ReferenceFieldGridData from '../../records/data-grid/ReferenceFieldGridData';
import ReferenceFieldGridDataAdd from '../../records/data-grid/ReferenceFieldGridDataAdd';
import './AddEditRecord.css';
import { createTableRecord } from '../../../services/table';
import { fetchUIRulesByFormId } from '../../../redux/slices/UIRuleSlice';
import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Switch } from '@/componentss/ui/switch';
import { CheckboxGroup } from '@/componentss/ui/checkbox-group';
import { RadioGroup } from '@/componentss/ui/radio-group';
import { MultiSelect } from '@/componentss/ui/multi-select';
import { Textarea } from '@/componentss/ui/textarea';
import { Plus, PlusCircle } from 'lucide-react';
import { Label } from '@/componentss/ui/label';
import { useSidebar } from '@/componentss/ui/sidebar';
import { notify } from '../../../hooks/toastUtils';
const NUMERIC_REGEX = /^[0-9-]+$/;

const AddEditRecord = ({
  formId,
  fieldData,
  toggles = 'Format-1',
  fieldValues,
  onSubmit,
  mode = '',
  hasTabs = false,
  viewType,
  showSystemDefaultField,
  otherFields,
  selectedRecordId,
  atValues,
  taggedEmails,
  setTaggedEmails,
  setTreeListValues,
  activeFormId,
  fieldGroups,
  showEditRecord,
  indentType = 'col',
  style: compstyle
}) => {
  const getFormWidth = (style) => {
    if (toggles !== 'Format-1') {
      return `lg:w-full md:w-1/2 sm:w-full  pb-4 ${style}`;
    }

    return `lg:w-full md:w-1/2 sm:w-full  pb-4 ${style}`;
  };

  const dispatch = useDispatch();

  const { currentForm, currentModule } = useSelector((state) => state.current);
  const { rules } = useSelector((state) => state.uiRule);

  const { currentTheme } = useSelector((state) => state.auth);
  const { isMobile } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [formObj, setFormObj] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [autocomplete, setAutocomplete] = useState(false);
  const [isFormErrors, setIsFormErrors] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState();
  const [refField, setRefField] = useState({
    open: false,
    formId: 0,
    label: '',
    fieldName: ''
  });

  const [refresh, setRefresh] = useState(false);
  const [fields, setFields] = useState([]);
  const [groupOfFields, setGroupOfFields] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [refFieldAddData, setRefFieldAddData] = useState({
    open: false,
    formId: 0
  });

  const [selectedForms, setSelectedForms] = useState([]);

  const searchParams = new URLSearchParams(window.location.search);
  const path2 = `/app/${currentModule?.name}/${currentForm?.name}/modify`;
  const isEditPage = !(
    window.location.pathname === path2 && searchParams.has('id')
  );

  const fetchRuleData = async () => {
    if (currentForm) {
      const formInfoId = currentForm?.formInfoId;
      dispatch(fetchUIRulesByFormId(formInfoId));
    }
  };

  useEffect(() => {
    setFormObj((prev) => {
      return {
        ...prev,
        to: taggedEmails?.map((user) => user.email).join(', ')
      };
    });
  }, [taggedEmails]);

  const divRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (divRef.current) {
        divRef.current.scrollTop = 0;
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  const convertToFieldInfoIdObject = (rules, fields) => {
    const result = {};

    rules?.forEach((rule) => {
      const parsedConditionsData = rule?.conditions
        ? JSON.parse(rule?.conditions)
        : {};

      const parsedConditions = parsedConditionsData?.data || [];
      const parsedActions = rule?.actions ? JSON.parse(rule.actions) : [];

      const conditions = parsedConditions.map((cond) => {
        const field = fields?.find(
          (field) => field.fieldInfoId === cond?.fieldInfoId
        );

        if (cond.fieldInfoId === 0) {
          return {
            operator: cond?.operator
          };
        }

        return {
          ...cond,
          fieldName: field?.name
        };
      });

      parsedActions.forEach((action) => {
        action.fieldInfoIds.forEach((fieldInfoId) => {
          if (!result[fieldInfoId]) {
            result[fieldInfoId] = [];
          }

          result[fieldInfoId].push({
            actionType: action.actionType,
            action: action.action,
            message: action.message,
            conditions: [...conditions]
          });
        });
      });
    });

    return result;
  };

  useEffect(() => {
    const fetchDataWithValues = async () => {
      try {
        const data = await fetchFieldsWithValues(fieldData);

        const enabledRulesArr = await rules
          ?.filter((r) => r.enable)
          .map((rule) => {
            if (selectedRecordId && rule?.event !== 'newRecord') {
              return {
                ...rule
              };
            } else if (!selectedRecordId && rule?.event !== 'editRecord') {
              return {
                ...rule
              };
            }
          });

        const modifiedData = data.map((d) => ({
          ...d,
          validation:
            convertToFieldInfoIdObject(enabledRulesArr, data)?.[
              d.fieldInfoId
            ] || null
        }));

        setFields(modifiedData);
        setFetchData(true);
      } catch (err) {
        console.error('Error fetching fields with values:', err);
      }
    };
    if (fieldData?.length > 0) {
      fetchDataWithValues();
    }
  }, []);

  useEffect(() => {
    const checkFormErrors = () => {
      const hasErrors = fields.some((field) => {
        const { error } = validateField(field, formObj, isFormSubmitted);

        return error;
      });

      if (isFormErrors !== hasErrors) {
        setIsFormErrors(hasErrors);
      }
    };

    checkFormErrors();
  }, [formObj, fields, isFormSubmitted, isFormErrors]);

  useEffect(() => {
    if (fieldValues) return;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof setTreeListValues === 'function') {
      setTreeListValues((prev) => ({
        ...prev,
        [formId]: formObj
      }));
    }
  }, [formObj, formId]);

  useEffect(() => {
    setLoading(true);
    setFormObj({ ...fieldValues });
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [fieldValues]);

  useEffect(() => {
    const groupOfFieldArr = [];

    const filteredFields = fields?.filter((field) => {
      if (
        field.category === 'TableReference' ||
        field.category === 'TableLookup'
      ) {
        return false;
      }
      return true;
    });

    for (let i = 0; i <= fieldGroups?.length; i++) {
      const groupArr = filteredFields
        ?.filter((field) => field.fieldGroup?.name === fieldGroups[i]?.name)
        ?.map((fld) => fld);
      if (groupArr.length !== 0) {
        groupOfFieldArr.push(groupArr);
      }
    }
    setGroupOfFields([...groupOfFieldArr]);
  }, [fieldGroups, fields]);
  const formInfoId = activeFormId ? activeFormId : currentForm?.formInfoId;

  useEffect(() => {
    if (formInfoId) {
      fetchRuleData();
    }
  }, [formInfoId, currentForm]);

  useEffect(() => {
    async function ApiCall() {
      const formField = fields?.find((data) => data.variant === 'Form');
      const moduleField = fields?.find((data) => data.variant === 'Module');

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
    ApiCall();
    setFetchData(false);
  }, [formObj, selectedRecordId, fetchData]);

  function returnRefObject(name, fieldval, id) {
    if (!fieldval) return;

    const { category, lookupDropdownData, referenceDropdownData } = fieldval;

    if (category === 'Lookup') {
      if (!lookupDropdownData?.some((item) => item?.value === name)) {
        lookupDropdownData?.push({
          label: name,
          value: name
        });
      }
    } else {
      referenceDropdownData?.push({
        label: name,
        value: id
      });
    }
  }
  function getObjectValue(name, fieldVal, id) {
    const pathname = window.location.pathname;

    const path1 = `/app/${currentModule?.name}/${currentForm?.name}`;
    const path2 = `/app/${currentModule?.name}/${currentForm?.name}/modify`;

    if (pathname === path1 || (pathname === path2 && searchParams.has('id'))) {
      returnRefObject(name, fieldVal, id);
    } else {
    }
  }

  useEffect(() => {
    const referenceField = fields?.filter(
      (item) =>
        item.category === 'Reference' &&
        item?.variant?.toLowerCase() === 'dropdown' &&
        !item?.systemDefaultField
    );

    if (referenceField?.length > 0) {
      referenceField.forEach((field) => {
        const refname = field?.name;
        const val = formObj?.[refname];

        makeDependentCall(refname, val);
      });
    }
  }, [autocomplete]);

  const checkPasswordPolicy = (field, newValue) => {
    if (field.category === 'Password') {
      const parsedPolicy = JSON.parse(field.passwordPolicy);
      let errorMessage = '';

      const {
        minPasswordLength,
        maxPasswordLength,
        alphabetAndNumber,
        mixedCase,
        specialCharacter
      } = parsedPolicy;

      if (newValue.length < parseInt(minPasswordLength, 10)) {
        errorMessage = `Password must be at least ${minPasswordLength} characters long.`;
      } else if (newValue.length > parseInt(maxPasswordLength, 10)) {
        errorMessage = `Password must be no more than ${maxPasswordLength} characters long.`;
      } else if (
        alphabetAndNumber &&
        !/(?=.*[a-zA-Z])(?=.*\d)/.test(newValue)
      ) {
        errorMessage = 'Password must contain both letters and numbers.';
      } else if (mixedCase && !/(?=.*[a-z])(?=.*[A-Z])/.test(newValue)) {
        errorMessage =
          'Password must contain both uppercase and lowercase letters.';
      } else if (specialCharacter && !/(?=.*[!@#$%^&*])/.test(newValue)) {
        errorMessage =
          'Password must contain at least one special character (e.g., !@#$%^&*).';
      }

      setPasswordValidation(errorMessage);
    }
  };

  const onFormValueChanged = (e, field, types = '') => {
    if (field?.type === 'password') {
      checkPasswordPolicy(field, e.target.value);
    }

    const name = e?.target?.name ? e.target.name : field?.name;
    let value = e?.target?.value;

    if (
      field.type === 'number' &&
      field?.dataType !== 'Float' &&
      value !== '' &&
      !NUMERIC_REGEX.test(value)
    ) {
      return;
    }

    const type = e?.target?.type ? e.target.type : field?.type;
    let obj = Object.assign({}, formObj);
    if (field.type === 'switch') {
      const checked = e;
      if (checked) {
        obj[name] = '1';
      } else {
        obj[name] = '2';
      }
    } else if (type === 'checkbox') {
      obj[name] = value.join(',');
    } else if (type === 'radio') {
      const selectedValue = value;
      obj[name] = selectedValue;
    } else if (
      field?.type === 'select' &&
      field.variant?.toLowerCase() === 'multiple'
    ) {
      const modifiedArr = e.join();

      obj[name] = modifiedArr;
    } else {
      obj[name] = value;
    }
    makeDependentCall(name, value);
    setFormObj(obj);
  };
  const makeDependentCall = (changedField, selectedValue) => {
    const newFields = fields?.filter(
      (fld) => fld.category === 'Reference' || fld.category === 'Lookup'
    );

    newFields?.forEach((field) => {
      field?.lookup?.conditions?.forEach((condition) => {
        if (
          condition.dependent &&
          condition.value?.toLowerCase() === changedField?.toLowerCase()
        ) {
          const condValues = field?.lookup?.conditions?.reduce((acc, c) => {
            acc[c.value] = formObj[c.value];
            return acc;
          }, {});
          fetchDependentReferenceLookupValues(field, {
            ...condValues,
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
    if (moduleField && formField && formField.variant === 'Form') {
      fetchDependentFields(formField.name, selectedValue);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setTimeout(() => {
      if (
        isFormErrors ||
        (passwordValidation && passwordValidation?.length > 0)
      ) {
        notify.error('Form submission aborted due to errors.');
        return;
      }

      onSubmit(formObj);
    }, 100);
  };

  const onRefClick = (field) => {
    const payload = {};
    field?.lookup?.conditions?.forEach((condition) => {
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
      return {
        ...prev,
        [name]: value
      };
    });
  };
  const fetchDependentForms = async (name, moduleId) => {
    if (moduleId) {
      const response = await fetchFormsByModuleId(moduleId);
      const data = response?.result;
      if (data) {
        const newFields = fields?.map((f) => {
          if (f.category === 'ModuleForm' && f.variant === 'Form') {
            setSelectedForms(
              data?.map((d) => {
                return {
                  value: d.formInfoId,
                  label: d.displayName
                };
              })
            );
            return {
              ...f,
              formData: data?.map((d) => {
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
            fieldData: data?.map((d) => {
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
        const data = await response?.result?.data;

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
        const data = await response?.result?.data;

        if (data) {
          setFields((prevFields) =>
            prevFields?.map((f) =>
              f.name === field.name ? { ...f, lookupDropdownData: data } : f
            )
          );
        }
      }
    }
  };
  const submitRefDataHandler = (values) => {
    if (values && refField.lookupFormName) {
      setLoading(true);
      createTableRecord(refField.lookupFormName, values).then((res) => {
        if (res.status) {
          setLoading(false);

          if (res.statusCode === 200) {
            notify.success(res.message || 'Operation Failed');
          } else {
            notify.error(res.message || 'Operation Failed');
          }
        }
      });
      setRefFieldAddData({ open: false, formId: 0 });
      setRefresh(true);
    }
  };

  if (loading) {
    const loaderStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'calc(100vh - 9.5rem)'
    };

    return (
      <div style={loaderStyle}>
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }
  const customstyle = {
    // height: '100vh',
    background: colors.white
  };

  const isPreviewOrEditPage = mode === 'preview' || isEditPage || !hasTabs;

  const style = isPreviewOrEditPage ? {} : customstyle;

  const onReactQuillValueChanged = (content, field, emails) => {
    const name = field?.name;
    const URL = process.env.REACT_APP_STORAGE_URL;
    const updatedData = content?.replace(new RegExp(URL, 'g'), 'STORAGE_URL');
    if (!updatedData) return;
    setFormObj((prev) => {
      return {
        ...prev,
        [name]: updatedData,
        to: emails
      };
    });
  };

  const fetchDataOnSearchKeyword = async (payloadData) => {
    const { query, field, page = 0, payload = {} } = payloadData;

    const parentFieldName = field?.lookup?.fieldName;
    if (!field) return [];

    const response = await fetchRefLookupValuesByFieldInfoId(
      field?.fieldInfoId,
      {
        pagination: {
          page,
          pageSize: 10
        },
        payload,
        search: {
          fieldName: parentFieldName,
          keyword: query || ''
        }
      }
    );

    const data = await response?.result?.data;

    if (data) {
      const fieldDropdownData = field?.category === 'Reference' && {
        dropdownData: data
      };

      setFields((prevFields) =>
        prevFields?.map((f) =>
          f.name === field.name ? { ...f, ...fieldDropdownData } : f
        )
      );
      return data;
    }
    return [];
  };

  function evaluateActionConditions(actionData, inputData) {
    if (!Array.isArray(actionData)) {
      console.error('actionData is not an array or is null.');
      return [];
    }

    return actionData.map((action) => {
      const conditions = action.conditions || [];
      let conditionsMet = true;
      let currentOperator = 'AND';

      for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i];

        if (cond.operator === 'AND' || cond.operator === 'OR') {
          currentOperator = cond.operator;
          continue;
        }

        const { operator, value, fieldName } = cond;
        const fieldValue = inputData[fieldName];

        let conditionMet = false;

        switch (operator) {
          case '=':
            conditionMet = fieldValue === value;
            break;
          case '<>':
            conditionMet = fieldValue !== value;
            break;
          case 'LIKE':
            conditionMet =
              typeof fieldValue === 'string' && fieldValue.includes(value);
            break;
          case 'NOT LIKE':
            conditionMet =
              typeof fieldValue === 'string' && !fieldValue.includes(value);
            break;
          case 'IN':
            conditionMet = Array.isArray(value) && value.includes(fieldValue);
            break;
          case 'IS EMPTY':
            conditionMet =
              fieldValue === '' ||
              fieldValue === null ||
              fieldValue === undefined;
            break;
          case 'IS NOT EMPTY':
            conditionMet =
              fieldValue !== '' &&
              fieldValue !== null &&
              fieldValue !== undefined;
            break;
          case '>':
            conditionMet = fieldValue > value;
            break;
          case '<':
            conditionMet = fieldValue < value;
            break;
          case '>=':
            conditionMet = fieldValue >= value;
            break;
          case '<=':
            conditionMet = fieldValue <= value;
            break;
          case 'BETWEEN':
            if (Array.isArray(value) && value.length === 2) {
              conditionMet = fieldValue >= value[0] && fieldValue <= value[1];
            }
            break;
          default:
            conditionMet = false;
        }

        if (currentOperator === 'AND') {
          conditionsMet = conditionsMet && conditionMet;
        } else if (currentOperator === 'OR') {
          conditionsMet = conditionsMet || conditionMet;
        }
      }

      return {
        [action.actionType]: conditionsMet,
        message: conditionsMet ? action.message : null
      };
    });
  }

  function validateField(field) {
    const validationForField = field?.validation;
    const validation =
      validationForField &&
      evaluateActionConditions(validationForField, formObj);
    const hidden = validation?.find((field) => field.hidden)?.hidden;

    const showObject = validation?.find((item) => item.hasOwnProperty('show'));
    const showValue = showObject ? showObject.show : true;

    const readonly = validation?.find((field) => field.readonly)?.readonly;

    const mandatoryObj = validation?.find((field) => field.mandatory);

    const mandatory = mandatoryObj?.mandatory;

    const errorObj = validation?.find((field) => field.error);

    const infoObj = validation?.find((field) => field.info);

    const error = formObj[field.name] ? false : errorObj?.error;

    const info = formObj[field.name] ? false : infoObj?.info;

    return {
      hidden,
      showValue,
      readonly,
      mandatory,
      error,
      errorObj,
      info,
      infoObj
    };
  }

  const shouldDisplayField = (field) => {
    const isNewRecord = !selectedRecordId;
    const isNotHidden = !field.hidden;
    const shouldShowInNewRecord = isNewRecord ? field.showInNewRecord : true;
    const shouldShowSystemField =
      !showSystemDefaultField || !field.systemDefaultField;
    const shouldShowInMinimalView =
      viewType === 'minimal' ? field.showInMinimalView : true;
    const shouldShowAutoIncrementField = !(
      field.category === 'AutoIncrement' && isNewRecord
    );

    return (
      shouldShowInNewRecord &&
      isNotHidden &&
      shouldShowSystemField &&
      shouldShowInMinimalView &&
      shouldShowAutoIncrementField
    );
  };
  return (
    <>
      <form
        id={formId}
        onSubmit={submitHandler}
        style={style}
        className={`flex flex-col justify-between ${formId === 'normal' && 'bg-background'}`}
      >
        {showEditRecord && (
          <div>
            <Label className="ps-3 text-xl">{`Edit ${currentForm?.displayName} Details`}</Label>
          </div>
        )}
        <Label className="pb-1 ps-3 text-xs text-destructive">
          Please note that all fields marked with an asterisk{' '}
          <span className="font-semibold"> (*) </span> are required.
        </Label>
        <div
          className={`h-[calc(100vh-95px)] overflow-auto scroll-smooth`}
          ref={divRef}
          style={compstyle}
        >
          <div
            className={`grid py-2 pb-24 ${isMobile ? 'w-full grid-cols-1' : toggles === 'Format-1' ? 'w-full grid-cols-2' : toggles === 'Format-2' ? 'w-full grid-cols-3' : 'w-full grid-cols-1'}`}
          >
            {groupOfFields.map((fields, i) => {
              const isLabelHidden = fields?.[0]?.fieldGroup?.hideLabel ?? false;

              const isFullWidthEnabled =
                fields?.[0]?.fieldGroup?.enableFullWidth ?? false;

              return (
                <div
                  className={`${formId === 'normal' && 'm-2 rounded-md border-2 bg-[#ffffff] p-3'} ${
                    isFullWidthEnabled
                      ? toggles === 'Format-1'
                        ? 'col-span-2'
                        : 'col-span-3'
                      : ''
                  } `}
                >
                  {!isLabelHidden &&
                    fields?.[0]?.fieldGroup?.name &&
                    formId === 'normal' && (
                      <div className="w-52 pb-4 pt-2 text-sm font-semibold">
                        {fields?.[0]?.fieldGroup?.name}
                      </div>
                    )}
                  <div
                    key={fields.name}
                    className="items-center justify-start px-2"
                    style={{
                      // minWidth: '100%',
                      // maxWidth: '750px',
                      borderRadius: '5px',
                      display: 'flex',
                      flexWrap: 'wrap'
                    }}
                  >
                    {fields &&
                      fields.length > 0 &&
                      fields
                        .filter((field) => {
                          return shouldDisplayField(field);
                        })
                        .map((field) => {
                          let classes = null;

                          if (getFormWidth()) {
                            if (field.type === 'textarea') {
                              classes = getFormWidth('w-full');
                            } else {
                              classes = getFormWidth(
                                !field.showInNewRecord && !selectedRecordId
                                  ? 'hidden'
                                  : ''
                              );
                            }
                          }

                          switch (field.type) {
                            case 'text':
                            case 'number':
                            case 'password':
                            case 'date': {
                              const {
                                hidden,
                                showValue,
                                readonly,
                                mandatory,
                                error,
                                errorObj,
                                info,
                                infoObj
                              } = validateField(field);

                              return (
                                <div
                                  className={classes}
                                  key={field.name}
                                  style={{
                                    display:
                                      (!showValue && 'none') ||
                                      (hidden && 'none')
                                  }}
                                >
                                  <Input
                                    id={`input-${field.name}`}
                                    label={field.label}
                                    placeholder={field.label}
                                    variant="outlined"
                                    name={field.name}
                                    maxLength={field.length}
                                    type={
                                      field.type === 'date'
                                        ? field.variant === 'DateTime'
                                          ? 'datetime-local'
                                          : 'date'
                                        : field.type
                                    }
                                    required={
                                      (field.category === 'Password' &&
                                        passwordValidation &&
                                        passwordValidation.length > 0) ||
                                      error ||
                                      info ||
                                      mandatory ||
                                      field.mandatory
                                    }
                                    validation={{
                                      type:
                                        (error && 'error') || (info && 'info'),
                                      message:
                                        (field.category === 'Password' &&
                                          passwordValidation) ||
                                        (error &&
                                          isFormSubmitted &&
                                          errorObj?.message) ||
                                        (info &&
                                          isFormSubmitted &&
                                          infoObj?.message)
                                    }}
                                    value={
                                      field.variant === 'Date'
                                        ? formObj[field.name]?.split('T')[0]
                                        : formObj[field.name] || ''
                                    }
                                    category={field?.category}
                                    onChange={(e) => {
                                      onFormValueChanged(e, field);
                                    }}
                                    disabled={
                                      field.category === 'AutoIncrement' ||
                                      field.systemDefaultField ||
                                      !field.editable ||
                                      readonly
                                    }
                                    indentType={indentType}
                                  />
                                </div>
                              );
                            }

                            case 'textarea':
                              if (!(selectedRecordId && field.showOnTab)) {
                                const {
                                  hidden,
                                  showValue,
                                  readonly,
                                  mandatory,
                                  error,
                                  errorObj,
                                  info,
                                  infoObj
                                } = validateField(field);

                                return (
                                  <div
                                    key={field.name}
                                    style={{
                                      width: '100%',
                                      display:
                                        (!showValue && 'none') ||
                                        (hidden && 'none')
                                    }}
                                    className={classes}
                                  >
                                    {field.variant === 'PlainText' ? (
                                      <Textarea
                                        label={field.label}
                                        id={`textarea-${field.name}`}
                                        minRows={4}
                                        maxRows={Infinity}
                                        type={field.type}
                                        name={field.name}
                                        required={
                                          error ||
                                          mandatory ||
                                          info ||
                                          field.mandatory
                                        }
                                        validation={{
                                          type:
                                            (error && 'error') ||
                                            (info && 'info'),
                                          message:
                                            (error &&
                                              isFormSubmitted &&
                                              errorObj?.message) ||
                                            (info &&
                                              isFormSubmitted &&
                                              infoObj?.message)
                                        }}
                                        maxcharacter={field.length}
                                        value={formObj[field.name] || ''}
                                        disabled={readonly}
                                        onChange={(e) =>
                                          onFormValueChanged(e, field)
                                        }
                                        indentType={indentType}
                                      />
                                    ) : (
                                      <div
                                        className="mb-2 flex flex-col gap-4"
                                        key={field.name}
                                      >
                                        <div
                                          className="ReactQuill"
                                          // style={{ maxWidth: 840 }}
                                        >
                                          <RichTextEditor
                                            label={field.label}
                                            value={formObj[field.name] || ''}
                                            required={
                                              error ||
                                              mandatory ||
                                              info ||
                                              field.mandatory
                                            }
                                            validation={{
                                              type:
                                                (error && 'error') ||
                                                (info && 'info'),
                                              message:
                                                (error &&
                                                  isFormSubmitted &&
                                                  errorObj?.message) ||
                                                (info &&
                                                  isFormSubmitted &&
                                                  infoObj?.message)
                                            }}
                                            maxLength={field.length}
                                            disabled={readonly}
                                            onChange={(content) =>
                                              onReactQuillValueChanged(
                                                content,
                                                field
                                              )
                                            }
                                            placeholder="Enter..."
                                            form={currentForm}
                                            atValues={atValues}
                                            taggedEmails={taggedEmails}
                                            setTaggedEmails={setTaggedEmails}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              break;

                            case 'radio':
                              if (!formObj[field.name]) {
                                const defaultValueOption = field.options?.find(
                                  (option) => option.default
                                );
                                if (defaultValueOption) {
                                  formObj[field.name] =
                                    defaultValueOption.value;
                                }
                              }

                              const {
                                hidden,
                                showValue,
                                mandatory,
                                error,
                                errorObj,
                                info,
                                infoObj
                              } = validateField(field);

                              return (
                                <div
                                  className={`${classes} w-full`}
                                  key={field.name}
                                  style={{
                                    display:
                                      (!showValue && 'none') ||
                                      (hidden && 'none')
                                  }}
                                >
                                  <RadioGroup
                                    id={`radioGroup-${field.name}`}
                                    label={field.label}
                                    value={formObj[field.name]}
                                    name={field.name}
                                    required={
                                      error ||
                                      mandatory ||
                                      info ||
                                      field.mandatory
                                    }
                                    validation={{
                                      type:
                                        (error && 'error') || (info && 'info'),
                                      message:
                                        (error &&
                                          isFormSubmitted &&
                                          errorObj?.message) ||
                                        (info &&
                                          isFormSubmitted &&
                                          infoObj?.message)
                                    }}
                                    onChange={(e) =>
                                      onFormValueChanged(e, field)
                                    }
                                    options={field.options}
                                    indentType={indentType}
                                  />
                                </div>
                              );

                            case 'select':
                              if (!formObj[field.name]) {
                                const defaultValueOption = field.options?.find(
                                  (option) => option.default
                                );
                                if (defaultValueOption) {
                                  formObj[field.name] =
                                    defaultValueOption.value;
                                }
                              }
                              if (
                                !field.variant ||
                                field.variant?.toLowerCase() === 'single'
                              ) {
                                const {
                                  hidden,
                                  showValue,
                                  readonly,
                                  mandatory,
                                  error,
                                  errorObj,
                                  info,
                                  infoObj
                                } = validateField(field);

                                return (
                                  <div
                                    className={`${classes}`}
                                    key={field.name}
                                    style={{
                                      display:
                                        (!showValue && 'none') ||
                                        (hidden && 'none')
                                    }}
                                  >
                                    <Dropdown
                                      id={`dropdown-${field.name}`}
                                      label={field.label}
                                      name={field.name}
                                      value={formObj[field.name]}
                                      required={
                                        error ||
                                        mandatory ||
                                        info ||
                                        field.mandatory
                                      }
                                      validation={{
                                        type:
                                          (error && 'error') ||
                                          (info && 'info'),
                                        message:
                                          (error &&
                                            isFormSubmitted &&
                                            errorObj?.message) ||
                                          (info &&
                                            isFormSubmitted &&
                                            infoObj?.message)
                                      }}
                                      onChange={(e) =>
                                        onFormValueChanged(e, field)
                                      }
                                      options={field.options}
                                      disabled={
                                        (field.systemDefaultField && true) ||
                                        !field.editable ||
                                        readonly
                                      }
                                      indentType={indentType}
                                    />
                                  </div>
                                );
                              } else if (
                                field.variant?.toLowerCase() === 'multiple'
                              ) {
                                const {
                                  hidden,
                                  showValue,
                                  readonly,
                                  mandatory,
                                  error,
                                  errorObj,
                                  info,
                                  infoObj
                                } = validateField(field);

                                return (
                                  <div
                                    className={`${classes}`}
                                    key={field.name}
                                    style={{
                                      display:
                                        (!showValue && 'none') ||
                                        (hidden && 'none')
                                    }}
                                  >
                                    <MultiSelect
                                      id={`multiSelect-${field.name}`}
                                      label={field.label}
                                      name={field.name}
                                      selectedValues={
                                        formObj[field.name]
                                          ? formObj[field.name]
                                              .toString()
                                              .split(',')
                                          : []
                                      }
                                      onChange={(e) =>
                                        onFormValueChanged(
                                          e.target.value,
                                          field
                                        )
                                      }
                                      options={field.options}
                                      required={
                                        error ||
                                        mandatory ||
                                        info ||
                                        field.mandatory
                                      }
                                      validation={{
                                        type:
                                          (error && 'error') ||
                                          (info && 'info'),
                                        message:
                                          (error &&
                                            isFormSubmitted &&
                                            errorObj?.message) ||
                                          (info &&
                                            isFormSubmitted &&
                                            infoObj?.message)
                                      }}
                                      indentType={indentType}
                                    />
                                  </div>
                                );
                              }

                            case 'checkbox': {
                              if (!formObj[field.name]) {
                                const defaultValueOption = field.options?.find(
                                  (option) => option.default
                                );
                                if (defaultValueOption) {
                                  formObj[field.name] =
                                    defaultValueOption.value;
                                }
                              }
                              const {
                                hidden,
                                showValue,
                                mandatory,
                                error,
                                errorObj,
                                info,
                                infoObj
                              } = validateField(field);

                              return (
                                <div
                                  className={`${classes} w-full py-1`}
                                  key={field.name}
                                  style={{
                                    display:
                                      (!showValue && 'none') ||
                                      (hidden && 'none')
                                  }}
                                >
                                  <CheckboxGroup
                                    id={`checkboxGroup-${field.name}`}
                                    label={field.label}
                                    name={field.name}
                                    required={
                                      error ||
                                      mandatory ||
                                      info ||
                                      field.mandatory
                                    }
                                    validation={{
                                      type:
                                        (error && 'error') || (info && 'info'),
                                      message:
                                        (error &&
                                          isFormSubmitted &&
                                          errorObj?.message) ||
                                        (info &&
                                          isFormSubmitted &&
                                          infoObj?.message)
                                    }}
                                    options={field.options}
                                    selectedValues={
                                      formObj[field.name]
                                        ? formObj[field.name]
                                            .toString()
                                            .split(',')
                                        : []
                                    }
                                    onChange={(e) =>
                                      onFormValueChanged(e, field)
                                    }
                                    indentType={indentType}
                                  />
                                </div>
                              );
                            }

                            case 'reference': {
                              const {
                                hidden,
                                showValue,
                                readonly,
                                mandatory,
                                error,
                                errorObj,
                                info,
                                infoObj
                              } = validateField(field);

                              if (
                                (formId === 'reference' ||
                                  formId === 'reference-modal') &&
                                currentForm?.name === field.lookup?.formName
                              ) {
                                return null;
                              }
                              if (field.variant === 'Dropdown') {
                                return (
                                  <div
                                    className={`${classes} flex flex-col ${hidden ? 'hidden' : ''} ${!showValue ? 'hidden' : ''}`}
                                    key={field.name}
                                  >
                                    <AutocompleteField
                                      id={`autocompleteField-${field.name}`}
                                      label={field.label}
                                      name={field.name}
                                      value={formObj[field.name]}
                                      lookupConditions={
                                        field?.lookup?.conditions
                                      }
                                      options={field?.referenceDropdownData}
                                      formObj={formObj}
                                      onChange={(e) => {
                                        onFormValueChanged(e, field);
                                      }}
                                      placeholder={field.label}
                                      fetchData={(data) =>
                                        fetchDataOnSearchKeyword({
                                          ...data,
                                          field
                                        })
                                      }
                                      readOnly={
                                        field.systemDefaultField ||
                                        !field.editable ||
                                        readonly
                                      }
                                      required={
                                        error ||
                                        mandatory ||
                                        info ||
                                        field.mandatory
                                      }
                                      validation={{
                                        type:
                                          (error && 'error') ||
                                          (info && 'info'),
                                        message:
                                          (error &&
                                            isFormSubmitted &&
                                            errorObj?.message) ||
                                          (info &&
                                            isFormSubmitted &&
                                            infoObj?.message)
                                      }}
                                      indentType={indentType}
                                    />
                                  </div>
                                );
                              } else if (field.variant === 'Grid') {
                                return (
                                  <div
                                    className={`${classes} ${hidden ? 'hidden' : ''} ${!showValue ? 'hidden' : ''}`}
                                  >
                                    {!editMode
                                      ? getObjectValue(
                                          formObj[field.name + '_display'],
                                          field,
                                          formObj[field.name]
                                        )
                                      : null}

                                    <Input
                                      id={`input-${field.name}`}
                                      label={field.label}
                                      placeholder={field.label}
                                      variant="outlined"
                                      name={field.name}
                                      endIcon={
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Plus
                                              id={`grid_icon-${field?.name}`}
                                              size={22}
                                              onClick={() => {
                                                onRefClick(field);
                                                setEditMode(true);
                                              }}
                                              className="cursor-pointer rounded-sm bg-secondary p-1 text-white"
                                            />
                                          </TooltipTrigger>
                                          <TooltipContent side="bottom">
                                            <p>Add New {field.label}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      }
                                      maxLength={field.length}
                                      type={
                                        field.type === 'date'
                                          ? field.variant === 'DateTime'
                                            ? 'datetime-local'
                                            : 'date'
                                          : field.type
                                      }
                                      required={
                                        (field.category === 'Password' &&
                                          passwordValidation &&
                                          passwordValidation.length > 0) ||
                                        error ||
                                        info ||
                                        mandatory ||
                                        field.mandatory
                                      }
                                      validation={{
                                        type:
                                          (error && 'error') ||
                                          (info && 'info'),
                                        message:
                                          (field.category === 'Password' &&
                                            passwordValidation) ||
                                          (error &&
                                            isFormSubmitted &&
                                            errorObj?.message) ||
                                          (info &&
                                            isFormSubmitted &&
                                            infoObj?.message)
                                      }}
                                      value={
                                        field.referenceDropdownData?.find(
                                          (f) => f.value === formObj[field.name]
                                        )?.label
                                      }
                                      category={field?.category}
                                      onChange={(e) => {
                                        onFormValueChanged(e, field);
                                      }}
                                      readOnly={true}
                                      indentType={indentType}
                                    />
                                  </div>
                                );
                              } else {
                                return null;
                              }
                            }

                            case 'lookup': {
                              getObjectValue(
                                formObj[field.name],
                                field,
                                formObj[field.name]
                              );
                              const {
                                hidden,
                                showValue,
                                readonly,
                                mandatory,
                                error,
                                errorObj,
                                info,
                                infoObj
                              } = validateField(field);

                              return (
                                <div
                                  className={`${classes}`}
                                  key={field.name}
                                  style={{
                                    display:
                                      (!showValue && 'none') ||
                                      (hidden && 'none')
                                  }}
                                >
                                  <Dropdown
                                    id={`dropdown-${field.name}`}
                                    label={field.label}
                                    name={field.name}
                                    value={formObj[field.name]}
                                    onChange={(e) =>
                                      onFormValueChanged(e, field)
                                    }
                                    options={field.lookupDropdownData}
                                    required={
                                      error ||
                                      mandatory ||
                                      info ||
                                      field.mandatory
                                    }
                                    validation={{
                                      type:
                                        (error && 'error') || (info && 'info'),
                                      message:
                                        (error &&
                                          isFormSubmitted &&
                                          errorObj?.message) ||
                                        (info &&
                                          isFormSubmitted &&
                                          infoObj?.message)
                                    }}
                                    disabled={!field.editable || readonly}
                                    indentType={indentType}
                                  />
                                </div>
                              );
                            }

                            case 'moduleform': {
                              if (field.variant) {
                                const {
                                  hidden,
                                  showValue,
                                  readonly,
                                  mandatory,
                                  error,
                                  errorObj,
                                  info,
                                  infoObj
                                } = validateField(field);

                                return (
                                  <div
                                    className={`${classes}`}
                                    key={field.name}
                                    style={{
                                      display:
                                        (!showValue && 'none') ||
                                        (hidden && 'none')
                                    }}
                                  >
                                    <Dropdown
                                      id={`dropdown-${field.name}`}
                                      label={field.label}
                                      name={field.name}
                                      value={parseInt(formObj[field.name])}
                                      onChange={(e) =>
                                        onFormValueChanged(e, field)
                                      }
                                      options={
                                        field.variant === 'Module'
                                          ? field.moduleData
                                          : field.variant === 'Form'
                                            ? field.formData || selectedForms
                                            : field.fieldData
                                      }
                                      required={
                                        error ||
                                        mandatory ||
                                        info ||
                                        field.mandatory
                                      }
                                      validation={{
                                        type:
                                          (error && 'error') ||
                                          (info && 'info'),
                                        message:
                                          (error &&
                                            isFormSubmitted &&
                                            errorObj?.message) ||
                                          (info &&
                                            isFormSubmitted &&
                                            infoObj?.message)
                                      }}
                                      disabled={!field.editable || readonly}
                                      indentType={indentType}
                                    />
                                  </div>
                                );
                              }
                            }

                            case 'switch': {
                              const {
                                hidden,
                                showValue,
                                readonly,
                                mandatory,
                                error,
                                errorObj,
                                info,
                                infoObj
                              } = validateField(field);
                              return (
                                <div
                                  className={`${classes} py-1`}
                                  key={field.name}
                                  style={{
                                    display:
                                      (!showValue && 'none') ||
                                      (hidden && 'none')
                                  }}
                                >
                                  <Switch
                                    id={`switch-${field.name}`}
                                    label={field?.label}
                                    name={field.name}
                                    checked={formObj[field.name] == '1'}
                                    required={
                                      error ||
                                      mandatory ||
                                      info ||
                                      field.mandatory
                                    }
                                    validation={{
                                      type:
                                        (error && 'error') || (info && 'info'),
                                      message:
                                        (error &&
                                          isFormSubmitted &&
                                          errorObj?.message) ||
                                        (info &&
                                          isFormSubmitted &&
                                          infoObj?.message)
                                    }}
                                    onCheckedChange={(val) =>
                                      onFormValueChanged(val, field)
                                    }
                                  />
                                </div>
                              );
                            }
                            case 'json':
                              if (formObj?.details) {
                                const detailData = JSON.parse(formObj?.details);
                                return (
                                  <div
                                    className={`${classes} Add-edit-box`}
                                    key={field.name}
                                  >
                                    {Object.entries(detailData).map(
                                      ([key, value]) => {
                                        const newKey = key
                                          .split('_')
                                          .map(
                                            (word) =>
                                              word.charAt(0).toUpperCase() +
                                              word.slice(1)
                                          )
                                          .join(' ');

                                        return (
                                          <div
                                            key={key}
                                            className={`${classes}`}
                                          >
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
                                                <p className="w-[8vw] overflow-hidden text-ellipsis whitespace-nowrap text-sm text-secondary">
                                                  {newKey}
                                                </p>

                                                <PreviewSingleAttchment
                                                  catlogFlag=""
                                                  attachmnetData={value}
                                                />
                                              </>
                                            ) : (
                                              <div className="mb-3">
                                                <p className="mr-[25px] text-sm font-normal text-secondary">
                                                  {newKey}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                  {value}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              }
                            default:
                              return null;
                          }
                        })}
                  </div>
                </div>
              );
            })}
            <div className="px-2">{otherFields}</div>
          </div>
        </div>
      </form>

      {refField.open && (
        <ReferenceFieldGridData
          refField={refField}
          setRefFieldAddData={setRefFieldAddData}
          refFieldAddData={refFieldAddData}
          updateTable={{ refresh: refresh, setRefresh: setRefresh }}
          onConfirm={(selectedRecord) => {
            onRecordSelected(selectedRecord);
          }}
          onCancel={() => setRefField({ open: false, formId: 0 })}
          form={
            refFieldAddData?.open && (
              <ReferenceFieldGridDataAdd
                refField={refField}
                refFieldAddData={refFieldAddData}
                onConfirm={submitRefDataHandler}
                onCancel={() => setRefFieldAddData({ open: false, formId: 0 })}
              />
            )
          }
        />
      )}
    </>
  );
};

export default AddEditRecord;
