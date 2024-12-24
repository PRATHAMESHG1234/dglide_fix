import { memo, useEffect, useState } from 'react';
import { PlusSquare, PlusCircle } from 'lucide-react';
import { Divider, FormControl, Typography } from '@mui/joy';
import {
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import { generateUId } from '../../../common/utils/helpers';
import { catalogVariants } from '../../../common/utils/fields';
import { toSnakeCase } from '../../../common/utils/helpers';
import TextField from '../../../elements/CreatorTextField';
import DataSourceDynamic from './CreatorDataDynamic';
import { COLORS } from '../../../common/constants/styles';
import DataSourceManual from './CreatorDataSourceManual';
import { Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '@/componentss/ui/button';
import { X } from 'lucide-react';
import DefaultTextField from '../../../elements/CreatorDefaultTextField';

const Property = ({
  fields,
  setSelectedField,
  field,
  onFieldUpdated,
  updateChild,
  updateQuestion,
  handleClosePanel
}) => {
  const [form, setForm] = useState(
    field || {
      name: '',
      label: '',
      field_name: '',
      length: 0,
      mandatory: false,
      hidden: false,
      audit: false,
      variant: '',
      prependText: '',
      condition: [],
      inDependent: false,
      parentQueName: '',
      instruction: '',
      readOnly: false,
      readOnlyText: '',
      validation: '',
      defaultText: ''
    }
  );
  const [options, setOptions] = useState(field?.condition || []);
  const [lookup, setLookup] = useState();
  const [hideLength, setHideLength] = useState(false);
  const [propertyLoaded, setPropertyLoaded] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [fieldList, setFieldList] = useState([]);
  const [fieldChildArray, setFieldChildArray] = useState([]);
  const [selectedChildArr, setSelectedChildArr] = useState([]);
  const [removedFieldArr, setRemovedFieldArr] = useState([]);
  const [updatedFieldList, setUpdatedFieldList] = useState([]);
  const [submitFlag, setSubmitFlag] = useState(false);
  const [labelError, setLabelError] = useState('');
  const [defaultValueError, setdefaultValueError] = useState('');

  useEffect(() => {
    if (fields) {
      setFieldList(fields);
    }
  }, [fields]);

  useEffect(() => {
    if (field?.condition && field?.condition.length > 0) {
      setConditions(field?.condition);
    } else {
      setConditions([]);
    }
    setForm({
      ...field,
      condition: field?.condition
    });
    setPropertyLoaded(true);
  }, [field]);

  const applyChange = () => {
    setSubmitFlag(true);
    let fieldChildArr = [...field?.child, ...fieldChildArray];
    let updatedChildArry = [...updatedFieldList];

    for (let index = 0; index < selectedChildArr.length; index++) {
      const fieldElement = selectedChildArr[index];

      const found = fields.find((o) => o.name === fieldElement);
      if (found) {
        const newField = {
          ...found,
          inDependent: true,
          parentQueName: field.name ? field.name : null
        };
        let exists = fieldChildArr.some((item) => item.name === newField.name);
        if (!exists) {
          fieldChildArr.push(newField);
        }
        setFieldChildArray(fieldChildArr);
        updatedChildArry.push(newField);
      }
    }

    let filteredArray;
    if (conditions.length > 0) {
      filteredArray = conditions.filter((obj) => {
        return Object.values(obj).every((value) => {
          if (Array.isArray(value)) {
            return value.every((item) => item !== '' && item !== ' ');
          } else {
            return value !== null && value !== '';
          }
        });
      });
    }
    let lookupDependent = false;
    const optionList = field.dataSourceType === 'Manual' ? options : null;
    if (lookup?.conditions?.length > 0) {
      lookup?.conditions?.forEach((elem) => {
        if (elem?.dependent === true) {
          lookupDependent = true;
        }
      });
    }

    const lookupObj =
      field.dataSourceType === 'Dynamic'
        ? {
            ...lookup,
            conditions:
              lookup?.conditions?.length > 0
                ? lookup.conditions
                    .filter((condition) =>
                      Object.entries(condition).every(([key, value]) => {
                        if (key === 'dependentFieldType') {
                          return true;
                        }
                        return value !== '';
                      })
                    )
                    .map((condition) => {
                      return {
                        ...condition,
                        conditionId: condition.conditionId
                      };
                    })
                : []
          }
        : null;

    const dataType =
      field.category === 'Number' ? form.variant : field.dataType;

    const newField = {
      ...field,
      name: form.name,
      label: form.label,
      child: fieldChildArray,
      dependent: lookupDependent ? lookupDependent : false,
      field_name: form.field_name,
      length: hideLength ? 0 : form.length,
      mandatory: form.mandatory ? true : false,
      hidden: form.hidden ? true : false,
      audit: form.audit ? true : false,
      variant: form.variant ? form.variant : null,
      prependText: form.prependText ? form.prependText : null,
      dataType:
        form.category === 'TextArea' &&
        form.variant &&
        form.variant === 'RichText'
          ? 'Longtext'
          : dataType,
      options: optionList,
      lookup: lookupObj,
      condition: filteredArray,
      inDependent: form.inDependent ? true : false,
      parentQueName: form.parentQueName ? form.parentQueName : null,
      instruction: form?.instruction ? form?.instruction : '',
      readOnly: form?.readOnly ? true : false,
      readOnlyText: form.readOnlyText ? form.readOnlyText : null,
      validation: form?.validation ? form?.validation : '',
      defaultText: form?.defaultText ? form?.defaultText : ''
    };
    updatedChildArry.push(newField);
    setSelectedChildArr([]);

    //   const missingFields = mandetoryField.filter(element => {
    //     return !Object.keys(formObj).includes(element.name);
    // });
    if (labelError === '' && defaultValueError === '') {
      onFieldUpdated(updatedChildArry);
    }
  };

  const addCondition = () => {
    let prev =
      conditions && conditions.length > 0
        ? JSON.parse(JSON.stringify(conditions))
        : [];
    prev.push({
      conditionId: generateUId(),
      fieldName: null,
      value: null,
      isMultiSelect: true
    });
    setConditions(prev);
  };

  const handleChange = (field, event, condition, i, fieldName) => {
    let removedElem = [];

    if (event.target.value.includes('Empty')) {
      let updatedCondition = conditions
        ? JSON.parse(JSON.stringify(conditions))
        : [];
      updatedCondition[i][fieldName] = '';
      setConditions(updatedCondition);

      setRemovedFieldArr(condition?.fieldName);
      condition?.fieldName.forEach((element) => {
        const found = fields.find((o) => o.name === element);
        if (found) {
          const newField = {
            ...found,
            inDependent: false,
            parentQueName: null
          };
          removedElem.push(newField);
        }
      });
      setUpdatedFieldList([...updatedFieldList, ...removedElem]);
      setSelectedChildArr([]);
    } else {
      let childArr = [];
      condition?.fieldName?.forEach((o) => {
        if (!event.target.value.includes(o)) {
          childArr.push(o);
        }
      });
      const uniqueArray = [...new Set([...removedFieldArr, ...childArr])];
      setRemovedFieldArr(uniqueArray);
      uniqueArray.forEach((element) => {
        const found = fields.find((o) => o.name === element);
        if (found) {
          const newField = {
            ...found,
            inDependent: false,
            parentQueName: null
          };
          removedElem.push(newField);
        }
      });
      // updateChild(removedElem);
      setUpdatedFieldList([...updatedFieldList, ...removedElem]);
      setSelectedChildArr([...selectedChildArr, ...event.target.value]);

      const {
        target: { value }
      } = event;
      handleSelectOption(event, condition, i, fieldName);
    }
  };

  const handleSelectOption = (event, condition, i, fieldName) => {
    let updatedCondition = conditions
      ? JSON.parse(JSON.stringify(conditions))
      : [];
    updatedCondition[i][fieldName] = event.target.value;
    setConditions(updatedCondition);
  };

  const deleteCondition = (condition) => {
    setConditions((prev) =>
      prev?.filter((cdn) => cdn.conditionId !== condition.conditionId)
    );
    const deletedCondition = conditions.filter(
      (elem) => elem.conditionId === condition.conditionId
    );
    if (deletedCondition.length > 0) {
      let removedChild = [];
      let deletedConditionField = deletedCondition[0]?.fieldName;
      deletedConditionField.forEach((element) => {
        const found = fields.find((o) => o.name === element);
        if (found) {
          const newField = {
            ...found,
            inDependent: false,
            parentQueName: null
          };
          removedChild.push(newField);
        }
      });
      setUpdatedFieldList([...updatedFieldList, ...removedChild]);
    }
  };

  const onFormValueChanged = (e) => {
    switch (e.target.name) {
      case 'label':
        const val = e.target.value;
        const modifiedStr = toSnakeCase(val);
        setForm({
          ...form,
          label: val,
          field_name: modifiedStr
        });
        break;
      case 'length':
        setForm({
          ...form,
          length: e.target.value
        });
        break;
      case 'mandatory':
        setForm({
          ...form,
          mandatory: e.target.checked
        });
        break;
      case 'hidden':
        setForm({
          ...form,
          hidden: e.target.checked
        });
        break;
      case 'variant':
        if (form.category === 'TextArea' && e.target.value === 'RichText') {
          setHideLength(true);
          setForm({
            ...form,
            length: 0,
            variant: e.target.value,
            dataType: 'Longtext'
          });
        } else {
          setHideLength(false);
          setForm({
            ...form,
            variant: e.target.value,
            dataType:
              form.category === 'Number' ? e.target.value : form.dataType
          });
        }
        break;
      case 'prependText':
        setForm({
          ...form,
          prependText: e.target.value
        });
        break;
      case 'validation':
        setForm({
          ...form,
          validation: e.target.value
        });
        break;
      case 'instruction':
        setForm({
          ...form,
          instruction: e.target.value
        });
        break;
      case 'readOnly':
        setForm({
          ...form,
          readOnly: e.target.checked
        });
        break;
      case 'readOnlyText':
        setForm({
          ...form,
          readOnlyText: e.target.value
        });
        break;
      case 'defaultText':
        setForm({
          ...form,
          defaultText: e.target.value
        });
        break;
      default:
    }
  };

  const showDataSource = (field) => {
    if (!field) return;
    switch (field.dataSourceType) {
      case 'Manual':
        return (
          <DataSourceManual
            form={form}
            field={field}
            staticOptions={field.options}
            onOptionChange={(optns) => setOptions(optns)}
          />
        );

      case 'Dynamic':
        return (
          <DataSourceDynamic
            category={field.category}
            dynamicOptions={field.lookup}
            onOptionChange={(lkup) => setLookup(lkup)}
          />
        );

      default:
        return null;
    }
  };
  return (
    <form>
      <Typography level="title-sm" paddingY="10px">
        {field.category} Properties
      </Typography>
      <Divider />
      <div
        style={{
          maxHeight: 'calc(100vh - 260px )',
          overflowY: 'scroll'
        }}
      >
        <div className="flex items-center gap-2 py-2">
          <div className="w-50 flex flex-col">
            <TextField
              setErrorMsg={setLabelError}
              submitFlag={submitFlag}
              required={true}
              labelname="Name"
              fullWidth
              type="text"
              placeholder="Label"
              name="label"
              onChange={onFormValueChanged}
              value={form.label}
              sx={{
                '& .MuiInputBase-root': {
                  height: '30px',
                  fontSize: '13px'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                width: '460px',
                minWidth: '200px'
                // maxWidth: '320px'
              }}
            />
          </div>
        </div>
        <Divider />

        {field.category === 'AutoIncrement' && (
          <div className="flex flex-col py-2">
            <TextField
              setErrorMsg={setLabelError}
              submitFlag={submitFlag}
              labelname="Prepend Text"
              fullWidth
              type="text"
              name="prependText"
              placeholder="Text"
              onChange={onFormValueChanged}
              value={form.prependText}
              sx={{
                bgcolor: COLORS.WHITE,
                '& .MuiInputBase-root': {
                  height: '30px',
                  fontSize: '13px'
                }
              }}
            />
          </div>
        )}
        {['text', 'number', 'password', 'textarea', 'date'].includes(
          field.type
        ) ? (
          <div className="flex w-full flex-col">
            <DefaultTextField
              setErrorMsg={setdefaultValueError}
              submitFlag={submitFlag}
              labelname="Default Value"
              variant="outlined"
              name="defaultText"
              type={field.type}
              maxLength={256}
              value={form.defaultText || ''}
              onChange={onFormValueChanged}
              sx={{
                '& .MuiInputBase-root': {
                  height: '30px',
                  fontSize: '13px'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                width: '460px',
                minWidth: '200px'
                // maxWidth: '320px'
              }}
            />
          </div>
        ) : null}
        <Divider />
        <div className="flex flex-col py-2">
          <Typography level="title-sm" paddingY="10px">
            Validation
          </Typography>
          <div className="flex justify-evenly">
            <FormControlLabel
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '13px' },
                margin: 0.5
              }}
              control={
                <Checkbox
                  size="sm"
                  name="mandatory"
                  checked={form.mandatory}
                  onChange={onFormValueChanged}
                />
              }
              label="Mandatory"
            />

            <FormControlLabel
              sx={{
                '& .MuiFormControlLabel-label': { fontSize: '13px' },
                margin: 0.5
              }}
              control={
                <Checkbox
                  size="sm"
                  name="hidden"
                  checked={form.hidden}
                  onChange={onFormValueChanged}
                />
              }
              label="Hidden"
            />
            {field.category === 'TextArea' && (
              <FormControlLabel
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '13px' },
                  margin: 0.5
                }}
                control={
                  <Checkbox
                    size="sm"
                    name="readOnly"
                    checked={form.readOnly}
                    onChange={onFormValueChanged}
                  />
                }
                label="ReadOnly"
              />
            )}

            <FormControl sx={{ bgcolor: COLORS.WHITE, width: '100px' }}>
              <Typography level="title-sm">Select Validation</Typography>
              <Select
                name="validation"
                id="demo-select-parent1"
                value={form.validation}
                onChange={onFormValueChanged}
                sx={{
                  height: '30px',
                  fontSize: '13px',
                  margin: 1
                }}
              >
                <MenuItem value="^\d{10}$">Mobile </MenuItem>
                <MenuItem value="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$">
                  Email{' '}
                </MenuItem>
                <MenuItem value="^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$">
                  Phone number
                </MenuItem>
                <MenuItem value="^(?! )[A-Za-z ]+(?<! )$">Name </MenuItem>
              </Select>
            </FormControl>
          </div>
          {form?.readOnly ? (
            <div className="flex w-full flex-col">
              <TextField
                setErrorMsg={setLabelError}
                submitFlag={submitFlag}
                labelname="ReadOnlyText"
                fullWidth
                type="text"
                placeholder="ReadOnlyText"
                name="readOnlyText"
                onChange={onFormValueChanged}
                value={form.readOnlyText}
                sx={{
                  bgcolor: COLORS.WHITE,
                  '& .MuiInputBase-root': {
                    height: '30px',
                    fontSize: '13px'
                  }
                }}
              />
            </div>
          ) : null}
          <div className="">
            <TextField
              setErrorMsg={setLabelError}
              submitFlag={submitFlag}
              labelname="Instruction"
              fullWidth
              type="text"
              placeholder="instruction"
              name="instruction"
              onChange={onFormValueChanged}
              value={form.instruction}
              sx={{
                '& .MuiInputBase-root': {
                  height: '30px',
                  fontSize: '13px'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                width: '460px',
                minWidth: '200px'
                // maxWidth: '320px'
              }}
            />
          </div>
        </div>
        {field.variant && (
          <div className="py-2">
            <Typography level="title-sm" paddingY="10px">
              Variant
            </Typography>
            <FormControl fullWidth>
              <Select
                name="variant"
                value={form.variant}
                onChange={onFormValueChanged}
                sx={{
                  height: '30px',
                  fontSize: '13px',
                  bgcolor: COLORS.WHITE
                }}
              >
                {catalogVariants[field.category]?.map((variant) => {
                  return (
                    <MenuItem
                      key={variant.name}
                      value={variant.name}
                      sx={{
                        fontSize: '13px'
                      }}
                    >
                      {variant.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        )}
        <Divider />
        {showDataSource(field)}
        <Divider />
        {field?.options?.length > 0 ? (
          <>
            <div className="my-3 flex items-center justify-between">
              <Typography level="title-sm" paddingY="10px">
                Add Question with Option{' '}
              </Typography>

              <Tooltip title="Add" variant="solid">
                <PlusCircle
                  fontSize="medium"
                  onClick={addCondition}
                  sx={{
                    color: COLORS.SECONDARY,
                    cursor: 'pointer'
                  }}
                />
              </Tooltip>
            </div>

            {conditions &&
              conditions.map((condition, i) => {
                return (
                  <div
                    className="card bg-light mb-3 flex flex-col p-1 shadow-sm"
                    key={i}
                  >
                    <div className="bg-light flex items-center justify-end p-1">
                      <Tooltip title="Delete">
                        <Trash
                          className="pointer"
                          color="error"
                          onClick={() => deleteCondition(condition, i)}
                        />
                      </Tooltip>
                    </div>
                    {/* style={{ width: "40%" }} */}
                    <div className="row flex w-full flex-row">
                      <div className="col-5 flex flex-col">
                        <Typography
                          level="title-sm"
                          style={{ marginLeft: '10px' }}
                        >
                          Options
                        </Typography>
                        <FormControl fullWidth sx={{ bgcolor: COLORS.WHITE }}>
                          {/* first dropdown */}
                          <Select
                            id="demo-simple-select"
                            value={condition.value}
                            onChange={(event) => {
                              handleSelectOption(event, condition, i, 'value');
                            }}
                            sx={{
                              height: '30px',
                              fontSize: '13px',
                              margin: '8px 0 10px 7px'
                            }}
                          >
                            {options.map((item, i) => (
                              <MenuItem key={i} value={item?.optionId}>
                                {item?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      {
                        condition?.isMultiSelect === true ? (
                          <div className="col-7 flex flex-col">
                            <Typography
                              level="title-sm"
                              style={{ marginLeft: '10px' }}
                            >
                              Select Field Name
                            </Typography>
                            <FormControl
                              fullWidth
                              sx={{ bgcolor: COLORS.WHITE }}
                            >
                              <Select
                                id="demo-multiple-name"
                                multiple
                                value={condition.fieldName || []}
                                onChange={(event) =>
                                  handleChange(
                                    field,
                                    event,
                                    condition,
                                    i,
                                    'fieldName'
                                  )
                                }
                                sx={{
                                  height: '30px',
                                  fontSize: '13px',
                                  margin: '8px 7px 10px 0px'
                                }}
                              >
                                <MenuItem key={field.columnIndex} value="Empty">
                                  Empty
                                </MenuItem>
                                {fieldList.map((field) => (
                                  <MenuItem
                                    key={field.columnIndex}
                                    value={field.name}
                                  >
                                    {field?.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        ) : null
                        // <div>
                        // <FormControl
                        //   fullWidth
                        //   sx={{ bgcolor: COLORS.WHITE, width: '60%' }}
                        // >
                        //   <Select
                        //     id="demo-simple-select"
                        //     value={condition.fieldName}
                        //     onChange={(event) => {
                        //       handleSelectOption(event, condition, i, 'fieldName');
                        //     }}
                        //     sx={{
                        //       height: '30px',
                        //       fontSize: '13px',
                        //       margin: 1
                        //     }}
                        //   >
                        //     {fieldList.map((field) => (
                        //       <MenuItem key={field.columnIndex} value={field?.name}>
                        //         {field?.label}
                        //       </MenuItem>
                        //     ))}
                        //   </Select>
                        // </FormControl>
                        // </div>
                      }
                    </div>
                  </div>
                );
              })}
          </>
        ) : null}
        <div className="flex justify-start">
          <Button
            type="button"
            sx={{
              backgroundColor: COLORS.PRIMARY
            }}
            onClick={applyChange}
          >
            Apply
          </Button>
          <Button
            sx={{
              backgroundColor: COLORS.PRIMARY,
              marginLeft: '10px'
            }}
            onClick={handleClosePanel}
          >
            Close
          </Button>
        </div>
      </div>
    </form>
  );
};

export default memo(Property);
