import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import MuiChip from '@mui/material/Chip';

import { useSelector } from 'react-redux';
import { colors } from '../common/constants/styles';
// ==============================|| CHIP ||============================== //

const Chip = ({ chipcolor, disabled, sx = {}, variant, ...others }) => {
  const theme = useTheme();

  const { currentTheme } = useSelector((state) => state.auth);

  let defaultSX = {
    color: currentTheme === 'Dark' ? colors.primary.light : colors.primary.main,
    bgcolor:
      currentTheme === 'Dark' ? colors.primary.main : colors.primary.light,
    ':hover': {
      color: colors.primary.light,
      bgcolor:
        currentTheme === 'Dark' ? colors.primary.dark + 90 : colors.primary.dark
    }
  };

  let outlineSX = {
    color: colors.primary.main,
    bgcolor: 'transparent',
    border: '1px solid',
    borderColor: colors.primary.main,
    ':hover': {
      color:
        currentTheme === 'Dark' ? colors.primary.light : colors.primary.light,
      bgcolor:
        currentTheme === 'Dark' ? colors.primary.main : colors.primary.dark
    }
  };

  switch (chipcolor) {
    case 'secondary':
      if (variant === 'outlined')
        outlineSX = {
          color: colors.secondary.main,
          bgcolor: 'transparent',
          border: '1px solid',
          borderColor: colors.secondary.main,
          ':hover': {
            color:
              currentTheme === 'Dark'
                ? colors.secondary.dark
                : colors.secondary.light,
            bgcolor:
              currentTheme === 'Dark'
                ? colors.secondary.light
                : colors.secondary.dark
          }
        };
      else
        defaultSX = {
          color:
            currentTheme === 'Dark'
              ? colors.secondary.light
              : colors.secondary.main,
          bgcolor:
            currentTheme === 'Dark'
              ? colors.secondary.dark
              : colors.secondary.light,
          ':hover': {
            color: colors.secondary.light,
            bgcolor:
              currentTheme === 'Dark'
                ? colors.secondary.dark + 90
                : colors.secondary.main
          }
        };
      break;
    case 'success':
      if (variant === 'outlined')
        outlineSX = {
          color: colors.success.Dark,
          bgcolor: 'transparent',
          border: '1px solid',
          borderColor: colors.success.Dark,
          ':hover': {
            color:
              currentTheme === 'Dark'
                ? colors.success.light
                : colors.success.dark,
            bgcolor:
              currentTheme === 'Dark'
                ? colors.success.dark
                : colors.success.light + 60
          }
        };
      else
        defaultSX = {
          color:
            currentTheme === 'Dark'
              ? colors.success.light
              : colors.success.dark,
          bgcolor:
            currentTheme === 'Dark'
              ? colors.success.dark
              : colors.success.light + 60,
          ':hover': {
            color: colors.success.light,
            bgcolor:
              currentTheme === 'Dark'
                ? colors.success.dark + 90
                : colors.success.dark
          }
        };
      break;
    case 'error':
      if (variant === 'outlined')
        outlineSX = {
          color: colors.error.main,
          bgcolor: 'transparent',
          border: '1px solid',
          borderColor: colors.error.main,
          ':hover': {
            color:
              currentTheme === 'Dark' ? colors.error.light : colors.error.dark,
            bgcolor:
              currentTheme === 'Dark' ? colors.error.dark : colors.error.light
          }
        };
      else
        defaultSX = {
          color:
            currentTheme === 'Dark' ? colors.error.light : colors.error.dark,
          bgcolor:
            currentTheme === 'Dark'
              ? colors.error.dark
              : colors.error.light + 60,
          ':hover': {
            color: colors.error.light,
            bgcolor:
              currentTheme === 'Dark'
                ? colors.error.dark + 90
                : colors.error.dark
          }
        };
      break;
    case 'orange':
      if (variant === 'outlined')
        outlineSX = {
          color: colors.orange?.dark,
          bgcolor: 'transparent',
          border: '1px solid',
          borderColor: colors.orange?.main,
          ':hover': {
            color: colors.orange?.dark,
            bgcolor: colors.orange?.light
          }
        };
      else
        defaultSX = {
          color: colors.orange?.dark,
          bgcolor: colors.orange?.light,
          ':hover': {
            color: colors.orange?.light,
            bgcolor: colors.orange?.dark
          }
        };
      break;
    case 'warning':
      if (variant === 'outlined')
        outlineSX = {
          color: colors.warning.dark,
          bgcolor: 'transparent',
          border: '1px solid',
          borderColor: colors.warning.dark,
          ':hover': {
            color: colors.warning.dark,
            bgcolor: colors.warning.light
          }
        };
      else
        defaultSX = {
          color: colors.warning.dark,
          bgcolor: colors.warning.light,
          ':hover': {
            color: colors.warning.light,
            bgcolor:
              currentTheme === 'Dark'
                ? colors.warning.dark + 90
                : colors.warning.dark
          }
        };
      break;
    default:
  }

  if (disabled) {
    if (variant === 'outlined')
      outlineSX = {
        color: colors.grey[500],
        bgcolor: 'transparent',
        border: '1px solid',
        borderColor: colors.grey[500],
        ':hover': {
          color: colors.grey[500],
          bgcolor: 'transparent'
        }
      };
    else
      defaultSX = {
        color: colors.grey[500],
        bgcolor: colors.grey[50],
        ':hover': {
          color: colors.grey[500],
          bgcolor: colors.grey[50]
        }
      };
  }

  let SX = defaultSX;
  if (variant === 'outlined') {
    SX = outlineSX;
  }
  SX = { ...SX, ...sx };
  return <MuiChip {...others} sx={SX} />;
};

Chip.propTypes = {
  sx: PropTypes.object,
  chipcolor: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool
};

export default Chip;
