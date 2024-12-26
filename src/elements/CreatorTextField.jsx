/* eslint-disable react-hooks/exhaustive-deps */
import { FormLabel, Typography } from '@mui/material';
import MUITextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';

const TextField = (props) => {
  const [helperText, setHelperText] = useState('');
  useEffect(() => {
    if (props?.required && props.value?.length === 0) {
      setHelperText(`${props.labelname} field can't be empty..!`);
      if (typeof props.setErrorMsg === 'function') {
        props?.setErrorMsg(`${props.labelname} field can't be empty..!`);
      }
    } else if (
      props.maxLength &&
      props.maxLength < props.value?.length &&
      props.value?.length > 0
    ) {
      setHelperText(`maximum ${props.maxLength} characters allowed..!`);
      if (typeof props.setErrorMsg === 'function') {
        props?.setErrorMsg(`maximum ${props.maxLength} characters allowed..!`);
      }
    } else if (props.regex && !new RegExp(props.regex).test(props.value)) {
      setHelperText(`Invalid ${props.labelname} format..!`);
    } else {
      setHelperText('');
      if (typeof props.setErrorMsg === 'function') {
        props?.setErrorMsg('');
      }
    }
  }, [props?.submitFlag, props.value]);

  return (
    <div className="input-wrapper" style={props.fieldstyle}>
      <FormLabel style={{ fontSize: '13px', fontWeight: 'bold' }}>
        {props.labelname}
        {props.required && <span className="text-danger"> *</span>}
      </FormLabel>
      <MUITextField
        fullWidth
        // size={"small"}

        id={props.labelname}
        // onFocus={handleTouch}
        placeholder={props.placeholder ? props.placeholder : 'Enter...'}
        {...props}
        required={false}
      />
      {/* {helperText !== "" && props.submitFlag && props.required && (
        <Typography className="error" style={{ height: "15px" }}>
          {helperText}
        </Typography>
      )} */}
    </div>
  );
};

export default TextField;
