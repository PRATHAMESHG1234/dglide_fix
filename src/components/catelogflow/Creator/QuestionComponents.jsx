/* eslint-disable no-duplicate-case */
/* eslint-disable no-fallthrough */
/* eslint-disable no-undef */
import { useEffect, useRef } from 'react';
import {
  Autocomplete,
  FormControlLabel,
  FormLabel,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import TextField from '../../../elements/CreatorTextField';
import { COLORS } from '../../../common/constants/styles';
import MultipleSelect from '../../../elements/CreatorMultiSelect';
import SelectField from '../../../elements/CreatorSelectField';
import RadioField from '../../../elements/CreatorRadioField';
import CheckboxField from '../../../elements/CreatorCheckboxField';
import InfoIcon from '@mui/icons-material/Info';
import ReactQuill, { Quill } from 'react-quill';
import { Textarea } from '@mui/joy';
import TextArea from '../../../elements/CreatorTextArea';
import { useSelector } from 'react-redux';

const QuestionComponent = ({
  formId,
  field,
  value,
  onFormValueChanged,
  formObj,
  onClickSubmit
}) => {
  const { currentForm, selectedRecordId } = useSelector(
    (state) => state.current
  );
  // const inputRef = useRef(null);

  // useEffect(() => {
  // 	if (inputRef.current) {
  // 		inputRef.current.focus();
  // 	}
  // }, [field]);
  const renderInputField = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let newUrl;
    if (field?.instruction) {
      newUrl = field?.instruction.match(urlRegex)?.[0];
    }
    switch (field.type) {
      case 'text':
      case 'number':
      case 'password':
      case 'number':
        return (
          <div className=" mb-4">
            <TextField
              key={field.name}
              labelname={field.label}
              // id="outlined-basic"
              // ref={inputRef}
              variant="outlined"
              submitFlag={onClickSubmit}
              name={field.name}
              regex={field.validation}
              // maxLength={field?.length}
              type={field.type}
              required={field.mandatory}
              value={formObj[field.name] || ''}
              onChange={(e) => onFormValueChanged(e, field)}
              inputProps={{
                autoComplete: 'new-password'
              }}
              sx={{
                '& .MuiInputBase-root': {
                  height: '30px',
                  width: '100%',
                  fontSize: '13px'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                minWidth: '200px',
                width: '98%'
              }}
            />
            {field?.instruction && (
              <Tooltip
                title={
                  <a
                    href={newUrl}
                    target="blank"
                    style={{
                      color: '#dee2e6',
                      fontSize: '13px'
                    }}
                  >
                    {field?.instruction}
                  </a>
                }
                arrow
              >
                <InfoIcon
                  sx={{ color: COLORS.GRAY, cursor: 'pointer' }}
                ></InfoIcon>
              </Tooltip>
            )}
          </div>
        );
      case 'textarea':
        if (!field.variant || field.variant.toLowerCase() === 'plaintext') {
          return (
            <div className="flex  flex-col -reverse">
              {field.readOnly === true ? (
                <div className="input-wrapper flex  flex-col ">
                  <FormLabel
                    sx={{
                      fontSize: '13px',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}
                  >
                    {field.label}
                  </FormLabel>
                  <Textarea
                    name={field.name}
                    labelname={field.label}
                    variant="plain"
                    value={decodeURIComponent(field.readOnlyText)}
                    readOnly={field.readOnly}
                  />
                </div>
              ) : (
                <TextArea
                  key={field.name}
                  labelname={field.label}
                  submitFlag={onClickSubmit}
                  id={field.name}
                  minRows={4}
                  maxRows={4}
                  type={field.type}
                  name={field.name}
                  required={field.mandatory}
                  // maxcharacter={field?.length}
                  value={
                    field.readOnly === true
                      ? field.readOnlyText
                      : formObj[field.name] || ''
                  }
                  onChange={(e) => onFormValueChanged(e, field)}
                  fieldstyle={{
                    minWidth: '200px',
                    width: '98%',
                    height: '142px'
                  }}
                />
              )}
              {field?.instruction && (
                <Tooltip
                  title={
                    <a
                      href={newUrl}
                      target="blank"
                      style={{
                        color: '#dee2e6',
                        fontSize: '13px'
                      }}
                    >
                      {field?.instruction}
                    </a>
                  }
                  arrow
                >
                  <InfoIcon
                    sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                  ></InfoIcon>
                </Tooltip>
              )}
            </div>
          );
        } else {
          return (
            <div className="ReactQuill flex  flex-col  reactQuillExtra mb-4 ">
              <FormLabel sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                {field.label}
                {field.mandatory && <span className="text-danger"> *</span>}
              </FormLabel>

              <ReactQuill
                theme="snow"
                value={formObj[field.name] || ''}
                onChange={(content, e) => {
                  onReactQuillValueChanged(content, e, field);
                }}
                modules={Toolkit}
                placeholder="Enter..."
                style={{ width: '100%', height: '200px' }}
              />

              {field?.instruction && (
                <Tooltip
                  title={
                    <a
                      href={newUrl}
                      target="blank"
                      style={{
                        color: '#dee2e6',
                        fontSize: '13px'
                      }}
                    >
                      {field?.instruction}
                    </a>
                  }
                  arrow
                >
                  <InfoIcon
                    sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                  ></InfoIcon>
                </Tooltip>
              )}
            </div>
          );
        }
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
          <>
            <div className=" mb-4">
              <RadioField
                key={field.name}
                submitFlag={onClickSubmit}
                labelname={field.label}
                value={formObj[field.name] || ''}
                name={field.name}
                required={field.mandatory}
                onChange={(e) => onFormValueChanged(e, field)}
                options={field.options}
                fieldstyle={{
                  width: '20vw'
                  // minWidth: "100%",
                }}
              />
              {field.options.map((option) => (
                <div>
                  {value === option.label && option.child.length > 0 && (
                    <div style={{ paddingLeft: '20px', marginTop: '10px' }}>
                      {option.child.map((child) => (
                        <QuestionComponent
                          key={child.name}
                          field={child}
                          formObj={formObj}
                          value={formObj[child.name] || ''}
                          onFormValueChanged={(e) =>
                            onFormValueChanged(e, child)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {field?.instruction && (
              <Tooltip
                title={
                  <a
                    href={newUrl}
                    target="blank"
                    style={{
                      color: '#dee2e6',
                      fontSize: '13px'
                    }}
                  >
                    {field?.instruction}
                  </a>
                }
                arrow
              >
                <InfoIcon
                  sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                ></InfoIcon>
              </Tooltip>
            )}
          </>
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
        if (!field.variant || field.variant.toLowerCase() === 'single') {
          return (
            <div className=" mb-4">
              <SelectField
                key={field.name}
                labelname={field.label}
                submitFlag={onClickSubmit}
                name={field.name}
                value={formObj[field.name]}
                required={field.mandatory}
                onChange={(e) => onFormValueChanged(e, field)}
                options={field.options}
                fieldstyle={{
                  minWidth: '200px',
                  width: '98%'
                  // marginBottom: "10px"
                }}
              />
              {field?.instruction && (
                <Tooltip
                  title={
                    <a
                      href={newUrl}
                      target="blank"
                      style={{
                        color: '#dee2e6',
                        fontSize: '13px'
                      }}
                    >
                      {field?.instruction}
                    </a>
                  }
                  arrow
                >
                  <InfoIcon
                    sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                  ></InfoIcon>
                </Tooltip>
              )}
              {field.options.map((option) => (
                <div>
                  {value == option.label && option.child.length > 0 && (
                    <div style={{ paddingLeft: '20px', marginTop: '10px' }}>
                      {option.child.map((child) => (
                        <QuestionComponent
                          key={child.name}
                          field={child}
                          formObj={formObj}
                          value={formObj[child.name] || ''}
                          onFormValueChanged={(e) =>
                            onFormValueChanged(e, child)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        } else if (field.variant.toLowerCase() === 'multiple') {
          return (
            <>
              <div className="">
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
                  required={field.mandatory}
                  fieldstyle={{
                    minWidth: '200px',
                    width: '98%'
                    // marginBottom: "10px"
                  }}
                />

                {field?.instruction && (
                  <Tooltip
                    title={
                      <a
                        href={newUrl}
                        target="blank"
                        style={{
                          color: '#dee2e6',
                          fontSize: '13px'
                        }}
                      >
                        {field?.instruction}
                      </a>
                    }
                    arrow
                  >
                    <InfoIcon
                      sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                    ></InfoIcon>
                  </Tooltip>
                )}
              </div>
              {!formObj[field.name] && onClickSubmit && field.mandatory && (
                <Typography className="error" sx={{ height: '15px' }}>
                  {`${field?.label} field can't be empty..!`}
                </Typography>
              )}
            </>
          );
        }
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
          <div className="flex mb-4" key={field.name}>
            <CheckboxField
              labelname={field.label}
              name={field.name}
              submitFlag={onClickSubmit}
              options={field.options}
              required={field.mandatory}
              checkedLabel={formObj[field.name]}
              onChange={(e) => onFormValueChanged(e, field)}
            />
            {field?.instruction && (
              <Tooltip
                title={
                  <a
                    href={newUrl}
                    target="blank"
                    style={{
                      color: '#dee2e6',
                      fontSize: '13px'
                    }}
                  >
                    {field?.instruction}
                  </a>
                }
                arrow
              >
                <InfoIcon
                  sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                ></InfoIcon>
              </Tooltip>
            )}
          </div>
        );
      case 'date':
        return (
          <div className="flex mb-4">
            <TextField
              key={field.name}
              labelname={field.label}
              submitFlag={onClickSubmit}
              id="outlined-basic"
              variant="outlined"
              name={field.name}
              type={field.variant === 'DateTime' ? 'datetime-local' : 'date'}
              required={field.mandatory}
              value={
                field.variant === 'DateTime' && formObj[field.name]
                  ? formObj[field.name] || ''
                  : formObj[field.name]?.split('T')[0] || ''
              }
              onChange={(e) => onFormValueChanged(e, field)}
              sx={{
                '& .MuiInputBase-root': {
                  height: '30px',
                  fontSize: '13px',
                  width: '100%'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                minWidth: '200px',
                width: '98%',
                marginBottom: '5px'
              }}
            />
            {field?.instruction && (
              <Tooltip
                title={
                  <a
                    href={newUrl}
                    target="blank"
                    style={{
                      color: '#dee2e6',
                      fontSize: '13px'
                    }}
                  >
                    {field?.instruction}
                  </a>
                }
                arrow
              >
                <InfoIcon
                  sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                ></InfoIcon>
              </Tooltip>
            )}
          </div>
        );

      case 'lookup':
        return (
          <div className=" mb-4">
            <SelectField
              key={field.name}
              labelname={field.label}
              name={field.name}
              submitFlag={onClickSubmit}
              value={formObj[field.name]}
              required={field.mandatory}
              onChange={(e) => onFormValueChanged(e, field)}
              options={field.lookupDropdownData}
              fieldstyle={{
                minWidth: '200px',
                width: '98%'
              }}
            />
            {field?.instruction && (
              <Tooltip
                title={
                  <a
                    href={newUrl}
                    target="blank"
                    style={{
                      color: '#dee2e6',
                      fontSize: '13px'
                    }}
                  >
                    {field?.instruction}
                  </a>
                }
                arrow
              >
                <InfoIcon
                  sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                ></InfoIcon>
              </Tooltip>
            )}
          </div>
        );

      case 'reference':
        if (
          (formId === 'reference' || formId === 'reference-modal') &&
          currentForm?.name === field.lookup?.formName
        ) {
          return null;
        }
        if (field.variant === 'Dropdown') {
          return (
            <div className="mb-4">
              <div className=" ">
                <Autocomplete
                  disablePortal
                  id={`autocomplete-${field.name}`}
                  options={field.referenceDropdownData || []}
                  value={field.referenceDropdownData?.find(
                    (option) => option.value === formObj[field.name]
                  )}
                  name={field.name}
                  getOptionLabel={(option) =>
                    option.label ? option.label : ''
                  }
                  onChange={(event, newValue) => {
                    const syntheticEvent = {
                      target: {
                        name: field.name,
                        value: newValue ? newValue.value : ''
                      }
                    };
                    onFormValueChanged(syntheticEvent, field);
                  }}
                  renderInput={(params) => (
                    <TextField
                      labelname={
                        <Typography
                          style={{
                            color: COLORS.SECONDARY,
                            fontSize: '13px',
                            fontWeight: 500
                          }}
                        >
                          {field.label}
                          {field.mandatory && (
                            <span style={{ color: 'red' }}> *</span>
                          )}
                        </Typography>
                      }
                      fullWidth
                      {...params}
                      variant="outlined"
                      placeholder=""
                      sx={{
                        '& .MuiInputBase-root': {
                          width: '100%',
                          height: '30px',
                          fontSize: '13px',
                          p: 0,
                          px: 1
                        },
                        bgcolor: COLORS.WHITE
                      }}
                      fieldstyle={{
                        minWidth: '200px',
                        width: '98%'
                      }}
                      {...params}
                    />
                  )}
                />
                {field?.instruction && (
                  <Tooltip
                    title={
                      <a
                        href={newUrl}
                        target="blank"
                        style={{
                          color: '#dee2e6',
                          fontSize: '13px'
                        }}
                      >
                        {field?.instruction}
                      </a>
                    }
                    arrow
                  >
                    <InfoIcon
                      sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
                    ></InfoIcon>
                  </Tooltip>
                )}
              </div>
              {!formObj[field.name] && field.mandatory && onClickSubmit && (
                <Typography className="error" sx={{ height: '15px' }}>
                  {`${field.label}
          field can't be empty..!`}
                </Typography>
              )}
            </div>
          );
        }
      case 'switch':
        return (
          <div className="mb-4">
            <FormLabel
              sx={{ fontSize: '13px', fontWeight: 'bold', marginY: 0.3 }}
            >
              {field?.label}
              {field.mandatory && <span className="text-danger"> *</span>}
            </FormLabel>
            <FormControlLabel
              name={field.name}
              type={field.type}
              control={
                <Switch
                  checkedLabel={formObj[field.name]}
                  color="secondary"
                  size="medium"
                />
              }
              onChange={(e) => onFormValueChanged(e, field)}
            />
            {!(formObj[field.name] === true || formObj[field.name] === false) &&
              onClickSubmit &&
              field.mandatory && (
                <Typography className="error" sx={{ height: '15px' }}>
                  {`${field?.label}
          field can't be empty..!`}
                </Typography>
              )}
            {field.options.map((option) => (
              <div>
                {value === option.value && option.child.length > 0 && (
                  <div style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    {option.child.map((child) => (
                      <QuestionComponent
                        key={child.name}
                        field={child}
                        formObj={formObj}
                        value={formObj[child.name] || ''}
                        onFormValueChanged={(e) => onFormValueChanged(e, child)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderInputField()}</div>;
};
export default QuestionComponent;
