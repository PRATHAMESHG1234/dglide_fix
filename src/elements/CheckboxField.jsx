import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function CheckboxField(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    if (props.checkedlabel) {
      setSelectedOptions(props.checkedlabel.split(','));
    }
  }, [props.checkedlabel]);

  useEffect(() => {
    if (props.required && selectedOptions.length === 0) {
      setHelperText(`${props.labelname} field can't be empty!`);
    } else if (props?.validation?.type) {
      setHelperText(
        props?.validation?.message ||
          `${props.labelname} field can't be empty..!`
      );
    } else {
      setHelperText('');
    }
  }, [
    selectedOptions,
    props.required,
    props.labelname,
    props?.validation?.type
  ]);

  const handleCheckboxChange = (value) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <FormControl sx={props.fieldstyle} className="w-full">
      <FormLabel sx={{ fontSize: '13.5px', ...props.labelstyle }}>
        {props.labelname}
        {props.required && <span className="text-danger"> *</span>}
      </FormLabel>
      <List sx={{ p: 0 }}>
        {props.options?.map((opn, i) => (
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
                checked={selectedOptions.includes(opn.value)}
                onChange={() => handleCheckboxChange(opn.value)}
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 15 }
                }}
              />
            }
          />
        ))}
      </List>
      {/* {helperText && (
        <div style={{ height: '13px' }}>
          <Typography
            className={`${props?.validation?.type === 'info' ? 'text-warning' : 'text-danger'}`}
            sx={{ fontSize: '11px' }}
          >
            {helperText}
          </Typography>
        </div>
      )} */}
    </FormControl>
  );
}
