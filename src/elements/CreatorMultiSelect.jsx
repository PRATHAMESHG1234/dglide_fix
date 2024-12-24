import React, { useEffect, useState } from 'react';
import { FormLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { COLORS } from '../common/constants/styles';

const MultipleSelect = (props) => {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (props['value']) {
      setSelectedItems(props.value || []);
    }
  }, [props.value]);

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;

    const updatedSelectedItems =
      typeof value === 'string' ? value.split(',') : value;
    setSelectedItems(updatedSelectedItems);

    // Call the parent component's onChange if it's provided
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name,
          value: updatedSelectedItems.join(',')
        }
      });
    }
  };
  return (
    <div className="input-wrapper">
      <FormControl sx={props.fieldstyle}>
        <FormLabel sx={{ fontSize: '13px', fontWeight: 'bold' }}>
          {props.labelname}
          {props.required && <span className="text-danger"> *</span>}
        </FormLabel>
        <Select
          fullWidth
          size="small"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedItems}
          onChange={handleChange}
          // input={<OutlinedInput label={props.labelname} />}
          renderValue={(selected) => {
            const result = props.options
              ?.filter((opn) => selected.includes(opn.label))
              .map((item) => item.label);
            return result.join(', ');
          }}
          sx={{
            width: '100%',
            height: '30px',
            fontSize: '13px',
            bgcolor: COLORS.WHITE
          }}
        >
          {props.options?.map((opn, j) => (
            <MenuItem
              key={j}
              value={opn.label}
              sx={{
                width: '100%',
                fontSize: '13px',
                paddingY: 0
              }}
            >
              <Checkbox
                checked={selectedItems.indexOf(opn.label) > -1}
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 18 }
                }}
              />
              {opn?.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelect;
