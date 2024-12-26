import {
  Tooltip,
  Typography,
  Zoom,
  tooltipClasses,
  TextField as TextFields,
  InputAdornment
} from '@mui/material';
import { useState, useEffect } from 'react';
import { colors } from '../common/constants/styles';
import { useDispatch } from 'react-redux';
import { IconCopy } from '@tabler/icons-react';
import { notify } from '../hooks/toastUtils';

const TextField = (props) => {
  const [touched, setTouched] = useState(false);
  const [helperText, setHelperText] = useState('');
  const dispatch = useDispatch();

  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        notify.success('link copied successfully');
      })
      .catch((err) => {
        console.error('Failed to copy URL: ', err);

        notify.error('Failed to copy URL');
      });
  };

  useEffect(() => {
    if (props.required && touched && !props.value?.length) {
      setHelperText(
        `${props.labelname ? props.labelname : ''} field can't be empty..!`
      );
    } else if (
      props.maxLength &&
      touched &&
      (props.value?.length || 0) > props.maxLength
    ) {
      setHelperText(`Maximum ${props.maxLength} characters allowed..!`);
    } else if (props?.validation?.message) {
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
    props.required,
    props.maxLength,
    props.labelname,
    props?.validation?.type
  ]);

  const handleTouch = () => setTouched(true);

  return (
    <div className="input-wrapper" style={props.fieldstyle}>
      <div className="flex items-center justify-start p-0">
        {props.preLabelText && (
          <p
            style={{
              fontSize: '13.5px',
              paddingLeft: '3px',
              paddingRight: '3px'
            }}
          >
            {props.preLabelText}
          </p>
        )}
        <span style={{ ...props.inputAreaStyle, flexGrow: 1 }}>
          <Tooltip
            title={props.isShowTooltip && props.value}
            placement="bottom"
            TransitionComponent={Zoom}
            PopperProps={{
              sx: {
                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                  {
                    marginTop: '2px'
                  }
              }
            }}
          >
            <TextFields
              fullWidth
              size="small"
              label={props.labelname}
              onFocus={handleTouch}
              placeholder={props.placeholder || 'Enter...'}
              error={Boolean(helperText)}
              InputLabelProps={{
                shrink: true
              }}
              style={{
                '& .MuiFormLabel-root': {
                  fontSize: '0.875rem',
                  bgcolor: colors.white
                },
                '& .MuiInputBase-root': {
                  fontSize: '0.875rem'
                },
                minWidth: '244px',
                bgcolor: colors.white,
                ...props.sx
              }}
              InputProps={{
                ...props.InputProps,
                endAdornment:
                  props.category === 'AutoIncrement' ? (
                    <Tooltip title="copy link" placement="top">
                      <InputAdornment
                        position="end"
                        style={{ cursor: 'pointer' }}
                      >
                        <IconCopy
                          color={colors.primary.main}
                          size="20px"
                          onClick={() => handleCopyUrl()}
                          style={{ cursor: 'pointer' }}
                        />
                      </InputAdornment>
                    </Tooltip>
                  ) : null
              }}
              value={props.value || ''}
              {...props}
            />
          </Tooltip>
        </span>
        {props.postLabelText && (
          <p
            style={{
              fontSize: '13.5px',
              paddingLeft: '3px',
              paddingRight: '3px'
            }}
          >
            {props.postLabelText}
          </p>
        )}
      </div>
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
    </div>
  );
};

export default TextField;
