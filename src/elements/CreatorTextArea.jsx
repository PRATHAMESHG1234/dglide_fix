/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import { FormLabel, Typography } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import styled from '@emotion/styled';
import { colors, COLORS } from '../common/constants/styles';
import { useSelector } from 'react-redux';

const TextAreaField = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 320px;
  font-size: 0.85rem;
  padding: 8px 12px;
  border-radius: 5px;
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
  // const [touched, setTouched] = useState(false);
  const [helperText, setHelperText] = useState('');
  const { currentTheme } = useSelector((state) => state.auth);
  useEffect(() => {
    if (props.required && props.value?.length === 0) {
      setHelperText(
        `${props.labelname}
      field can't be empty..!`
      );
    } else if (
      props.maxcharacter &&
      props.maxcharacter < props.value?.length &&
      props.value?.length > 0
    ) {
      setHelperText(
        `maximum ${props.maxcharacter}
          characters allowed..!`
      );
    } else {
      setHelperText('');
    }
  }, [props.submitFlag, props.value]);

  // const handleTouch = () => {
  //   setTouched(true);
  // };
  return (
    <>
      <div className="input-wrapper flex  flex-col " style={props.fieldstyle}>
        <FormLabel sx={{ fontSize: '13px', fontWeight: 'bold' }}>
          {props.labelname}
          {props.required && <span className="text-danger"> *</span>}
        </FormLabel>
        <TextAreaField
          fullWidth
          id={props.labelname}
          // onFocus={handleTouch}
          placeholder={props.placeholder ? props.placeholder : 'Enter...'}
          {...props}
          required={false}
          style={{
            width: '100%',
            backgroundColor:
              currentTheme === 'Dark' ? colors.darkTab : colors.white
          }}
        />
      </div>
      {props.helpertext !== 'none' && props.submitFlag && props.required && (
        <Typography className="error" sx={{ height: '15px' }}>
          {helperText}
        </Typography>
      )}
    </>
  );
};

export default TextArea;
