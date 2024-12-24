/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import { FormLabel, TextField, Typography } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import styled from '@emotion/styled';
import { colors, COLORS } from '../common/constants/styles';
import { useSelector } from 'react-redux';

const TextAreaField = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${COLORS.GRAYSCALE};

  &:hover {
    border-color: ${COLORS.BLACK};
  }

  &:focus {
    border-color: ${COLORS.BLUEGRAY};
    box-shadow: 0 0 0 0.5px ${COLORS.BLUEGRAY};
  }

  &:focus-visible {
    outline: 0;
  }
`
);

const TextArea = (props) => {
  console.log(props?.validation?.message);
  const [touched, setTouched] = useState(false);
  const [helperText, setHelperText] = useState('');
  const { currentTheme } = useSelector((state) => state.auth);
  useEffect(() => {
    if (props.required && touched && props.value?.length === 0) {
      setHelperText(
        `${props.labelname}
      field can't be empty..!`
      );
    } else if (
      props.maxcharacter &&
      touched &&
      props.maxcharacter < props.value?.length &&
      props.value?.length > 0
    ) {
      setHelperText(
        `maximum ${props.maxcharacter}
          characters allowed..!`
      );
    } else if (props?.validation?.type) {
      setHelperText(
        props?.validation?.message ||
          `${props.labelname} field can't be empty..!`
      );
    } else {
      setHelperText('');
    }
  }, [touched, props.value, props?.validation?.type]);

  const handleTouch = () => {
    setTouched(true);
  };
  return (
    <div className="input-wrapper" style={props.fieldstyle}>
      {/* <FormLabel
        sx={{
          fontSize: '13.5px',
          ...props.labelstyle,
          paddingBottom: '0px'
        }}
      >
        {props.labelname}
        {props.required && <span className="text-danger"> *</span>}
      </FormLabel> */}
      <TextField
        fullWidth
        id="outlined-multiline-flexible"
        label={props.labelname || ''}
        multiline
        error={Boolean(helperText)}
        rows={3}
        defaultValue=""
        onFocus={handleTouch}
        autoFocus={props?.autoFocus ? props?.autoFocus : false}
        placeholder={props.placeholder ? props.placeholder : ' '}
        {...props}
        sx={{
          '& .MuiFormLabel-root': {
            fontSize: '0.875rem',
            color: currentTheme === 'Dark' ? colors.white : 'unset'
          },

          width: '99%',
          backgroundColor:
            currentTheme === 'Dark' ? colors.darkTab : colors.white,
          ...(props.labelname === 'Payload' && {
            '& textarea': {
              resize: 'both',
              overflow: 'auto'
            }
          })
        }}
      />

      <div style={{ height: '13px' }}>
        <Typography
          className={`${props?.validation?.type === 'info' ? 'text-warning' : 'text-danger'}`}
          sx={{ fontSize: '11px' }}
        >
          {helperText}
        </Typography>
      </div>
    </div>
  );
};

export default TextArea;
