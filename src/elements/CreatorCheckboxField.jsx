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
    <div className="input-wrapper" sx={props.fieldstyle}>
      <FormLabel sx={{ fontSize: '13px', fontWeight: 'bold' }}>
        {props.labelname}
        {props.required && <span className="text-danger"> *</span>}
      </FormLabel>
      <List sx={{ p: 0 }}>
        {props.options?.map((opn, i) => {
          return (
            <FormControlLabel
              sx={{
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
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 15 }
                  }}
                />
              }
            />
          );
        })}
      </List>
      {!isAnyOptionSelected && props.required && props.submitFlag && (
        <Typography className="error" sx={{ height: '15px' }}>
          {`${props.labelname}
          field can't be empty..!`}
        </Typography>
      )}
    </div>
  );
}
