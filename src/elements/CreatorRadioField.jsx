import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';

const RadioField = (props) => {
  const selectedValue = props.value;

  return (
    <div className="input-wrapper" style={props.fieldstyle}>
      <FormLabel style={{ fontSize: '13px', fontWeight: 'bold' }}>
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
              value={option.label}
              control={
                <Radio
                  style={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 15
                    }
                  }}
                  size="lg"
                />
              }
              label={option.label}
            />
          );
        })}
      </RadioGroup>
      {!selectedValue && props.submitFlag && props.required && (
        <Typography className="error" style={{ height: '15px' }}>
          {`${props.labelname}
          field can't be empty..!`}
        </Typography>
      )}
    </div>
  );
};

export default RadioField;
