import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

const RadioField = (props) => {
  const [touched, setTouched] = useState(false);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    if (props.required && touched && props.value?.length === 0) {
      setHelperText(
        `${props.labelname}
      field can't be empty..!`
      );
    } else if (
      props.maxLength &&
      touched &&
      props.maxLength < props.value?.length &&
      props.value?.length > 0
    ) {
      setHelperText(
        `maximum ${props.maxLength}
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
    <FormControl style={props.fieldstyle}>
      <FormLabel style={{ fontSize: '13.5px', ...props.labelstyle }}>
        {props.labelname}
        {props.required && <span className="text-danger"> *</span>}
      </FormLabel>
      <RadioGroup {...props}>
        {props.options?.map((option) => {
          return (
            <FormControlLabel
              style={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '13px'
                },
                display: 'flex',
                flexWrap: 'wrap'
              }}
              key={option.value}
              value={option.value}
              onFocus={handleTouch}
              control={
                <Radio
                  style={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 15
                    }
                  }}
                />
              }
              label={option.label}
            />
          );
        })}
      </RadioGroup>
      {helperText && (
        <div style={{ height: '13px' }}>
          <Typography
            className={`${props?.validation?.type === 'info' ? 'text-warning' : 'text-danger'}`}
            style={{ fontSize: '11px' }}
          >
            {helperText}
          </Typography>
        </div>
      )}
    </FormControl>
  );
};

export default RadioField;
