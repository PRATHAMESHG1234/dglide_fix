import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  List,
  Typography
} from '@mui/material';

export default function CheckboxField(props) {
  const checkedLabels = props.checkedLabel ? props.checkedLabel.split(',') : [];

  const isAnyOptionSelected = checkedLabels.length > 0;

  return (
    <div className="input-wrapper" style={props.fieldstyle}>
      <FormLabel style={{ fontSize: '13px', fontWeight: 'bold' }}>
        {props.labelname}
        {props.required && <span className="text-danger"> *</span>}
      </FormLabel>
      <List style={{ p: 0 }}>
        {props.options?.map((opn, i) => {
          return (
            <FormControlLabel
              style={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '13px'
                },
                display: 'flex',
                flexWrap: 'wrap'
              }}
              key={i}
              label={opn.label}
              control={
                <Checkbox
                  checked={checkedLabels.includes(opn.label)}
                  value={opn.label}
                  {...props}
                  required={false}
                  style={{
                    '& .MuiSvgIcon-root': { fontSize: 15 }
                  }}
                />
              }
            />
          );
        })}
      </List>
      {!isAnyOptionSelected && props.required && props.submitFlag && (
        <Typography className="error" style={{ height: '15px' }}>
          {`${props.labelname}
          field can't be empty..!`}
        </Typography>
      )}
    </div>
  );
}
