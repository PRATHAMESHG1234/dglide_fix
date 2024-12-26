import { Box, InputLabel, MenuItem, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import { colors } from '../common/constants/styles';
import { useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';

const MultipleSelect = (props) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [touched, setTouched] = useState(false);
  const [helperText, setHelperText] = useState('');
  const { currentTheme } = useSelector((state) => state.auth);

  useEffect(() => {
    if (props.required && touched && !props.value) {
      setHelperText(`${props.labelname} field can't be empty..!`);
    } else if (
      props.maxLength &&
      touched &&
      props.value?.length > props.maxLength
    ) {
      setHelperText(`Maximum ${props.maxLength} characters allowed..!`);
    } else if (props?.validation?.type) {
      setHelperText(
        props?.validation?.message ||
          `${props.labelname} field can't be empty..!`
      );
    } else {
      setHelperText('');
    }
  }, [
    touched,
    props.value,
    props.maxLength,
    props.required,
    props.labelname,
    props?.validation?.type
  ]);

  const handleTouch = () => {
    setTouched(true);
  };

  useEffect(() => {
    if (props['value']) {
      manageSelectedItems(props['value']);
    }
  }, [props]);

  useEffect(() => {
    setSelectedItems(props.value);
  }, [props.value]);

  const manageSelectedItems = (arg) => {
    if (arg) {
      const updatedSelectedItems =
        typeof arg === 'string' ? arg.split(',') : arg;
      let mySet = new Set();
      for (const item of updatedSelectedItems) {
        if (item) {
          if (isNumber(item)) {
            mySet.add(Number(item));
          } else {
            mySet.add(item);
          }
        }
      }
      return Array.from(mySet);
    }
    return null;
  };

  const isNumber = (value) => {
    return !isNaN(value);
  };

  const inputLabelStyles = {
    fontSize: '0.875rem',
    transform: 'translate(14px, -6px) scale(0.75)',
    zIndex: 1,
    backgroundColor: currentTheme === 'Dark' ? colors.darkTab : colors.white,
    paddingRight: 1.8,
    paddingLeft: 0.8,
    pointerEvents: 'none',
    marginLeft: -0.4,
    color: helperText ? colors.error.dark : ''
  };

  const selectStyles = {
    fontSize: '0.875rem',
    p: '0px 0px',
    height: '37.5px',
    backgroundColor: currentTheme === 'Dark' ? colors.darkTab : colors.white,
    '&.Mui-focused': {
      backgroundColor: currentTheme === 'Dark' ? colors.darkTab : colors.white
    },
    ...props.sx,
    color: helperText ? colors.error : ''
  };

  const menuItemStyles = {
    fontSize: '0.875rem',
    '&.Mui-selected': {
      backgroundColor: colors.primary[200],
      color: colors.white
    },
    '&.Mui-selected:hover': {
      backgroundColor: colors.primary[200]
    }
  };

  const MenuProps = {
    PaperProps: {
      sx: {
        maxHeight: 200,
        overflow: 'auto',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)'
      }
    }
  };

  const handleChange = (event) => {
    setSelectedItems(event.target.value);

    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name,
          value: event.target.value.join(',')
        }
      });
    }
  };
  return (
    <FormControl style={{ width: '100%' }} size="small">
      {props.labelname && (
        <InputLabel shrink style={inputLabelStyles} id={props.labelname}>
          {props.labelname}
          {props.required && <span className="text-danger">*</span>}
        </InputLabel>
      )}

      <div className="flex items-center justify-start p-0">
        <p
          style={{
            display: 'flex',
            fontSize: '13.5px',
            margin: 'auto',
            paddingLeft: props.preLabelText ? '3px' : '0',
            paddingRight: props.preLabelText ? '3px' : '0'
          }}
        >
          {props.preLabelText}
        </p>
        <div
          style={{
            flexGrow: 1,
            backgroundColor:
              currentTheme === 'Dark' ? colors.darkTab : colors.white
          }}
        >
          <Select
            fullWidth
            error={Boolean(helperText)}
            labelId={props.labelname || ''}
            label={props.labelname || ''}
            multiple
            placeholder={props.placeholder || 'Select...'}
            defaultValue=""
            onFocus={handleTouch}
            onChange={handleChange}
            style={selectStyles}
            MenuProps={MenuProps}
            // value={prop}
            {...props}
            renderValue={(selected) => {
              const result = props.options
                ?.filter((opn) => selected?.indexOf(opn?.value) !== -1)
                ?.map(function (item) {
                  return item.label;
                });
              return result.join(', ');
            }}
          >
            {props.options?.map((opn, j) => (
              <MenuItem key={j} value={opn.value} style={menuItemStyles}>
                <Checkbox
                  checked={selectedItems?.indexOf(opn.value) > -1}
                  style={{
                    '& .MuiSvgIcon-root': { fontSize: 18 }
                  }}
                />
                {props.renderItem ? (
                  props.renderItem(opn.label)
                ) : (
                  <span>{opn.label}</span>
                )}
              </MenuItem>
            ))}
          </Select>
        </div>
        <p
          style={{
            display: 'flex',
            fontSize: '0.875px',
            margin: 'auto',
            paddingLeft: props.postLabelText ? '3px' : '0',
            paddingRight: props.postLabelText ? '3px' : '0'
          }}
        >
          {props.postLabelText}
        </p>
      </div>

      {/* {helperText && (
        <div style={{ height: '13px' }}>
          <Typography
            className={`${props?.validation?.type === 'info' ? 'text-warning' : 'text-danger'}`}
            style={{ fontSize: '11px' }}
          >
            {helperText}
          </Typography>
        </div>
      )} */}
    </FormControl>
  );
};

export default MultipleSelect;
