import React, { useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import AnimateButton from '../Login/AnimateButton';
import { colors } from '../../common/constants/styles';
import { strengthColor, strengthIndicatorNumFunc } from './PasswordStrength';
import { useDispatch } from 'react-redux';

import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/auth';
import { notify } from '../../hooks/toastUtils';

const AuthResetPassword = ({ ...others }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [strength, setStrength] = React.useState(0);
  const [level, setLevel] = React.useState();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Function to parse query parameters
  const getQueryParams = (query) => {
    return query
      .substring(1)
      .split('&')
      .reduce((acc, param) => {
        const [key, value] = param.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
  };

  // Extract the token from the URL query parameters
  const { token } = getQueryParams(location.search);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicatorNumFunc(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <Formik
      initialValues={{
        password: '123456',
        confirmPassword: '123456',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string().max(255).required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')], 'Both Password must be match!')
          .required('Confirm Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response = await resetPassword(values.password, token);

          if (response.status) {
            setStatus({ success: true });

            notify.success('Password changed successfully');

            setTimeout(() => {
              navigate('/login');
            }, 1500);
          } else {
            notify.error(response?.message);
            throw new Error(response.message || 'Error resetting password');
          }
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl
            fullWidth
            error={Boolean(touched.password && errors.password)}
            style={{
              borderRadius: '8px',
              marginTop: 1,
              marginBottom: 1,
              '& > label': {
                top: 23,
                left: 0,
                color: colors.grey[500],
                '&[data-shrink="false"]': {
                  top: 5
                }
              },
              '& > div > input': {
                padding: '30.5px 14px 11.5px !important',
                borderRadius: '8px'
              },
              '& legend': {
                display: 'none'
              },
              '& fieldset': {
                top: 0
              }
            }}
          >
            <InputLabel htmlFor="outlined-adornment-password-reset">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-reset"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={(e) => {
                handleChange(e);
                changePassword(e.target.value);
              }}
              style={{ borderRadius: '8px' }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{}}
            />
          </FormControl>
          {touched.password && errors.password && (
            <FormControl fullWidth>
              <FormHelperText error id="standard-weight-helper-text-reset">
                {errors.password}
              </FormHelperText>
            </FormControl>
          )}
          {strength !== 0 && (
            <FormControl fullWidth>
              <Box style={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box
                      style={{ backgroundColor: level?.color }}
                      style={{
                        width: 85,
                        height: 8,
                        borderRadius: '7px'
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: colors.grey[900]
                      }}
                      fontSize="0.75rem"
                    >
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </FormControl>
          )}

          <FormControl
            fullWidth
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            style={{
              marginTop: 1,
              marginBottom: 1,
              '& > label': {
                top: 23,
                left: 0,
                color: colors.grey[500],
                '&[data-shrink="false"]': {
                  top: 5
                }
              },
              '& > div > input': {
                padding: '30.5px 14px 11.5px !important'
              },
              '& legend': {
                display: 'none'
              },
              '& fieldset': {
                top: 0
              }
            }}
          >
            <InputLabel htmlFor="outlined-adornment-confirm-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type="password"
              value={values.confirmPassword}
              name="confirmPassword"
              label="Confirm Password"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
              style={{ borderRadius: '8px' }}
            />
          </FormControl>

          {touched.confirmPassword && errors.confirmPassword && (
            <FormControl fullWidth>
              <FormHelperText
                error
                id="standard-weight-helper-text-confirm-password"
              >
                {errors.confirmPassword}
              </FormHelperText>
            </FormControl>
          )}

          {errors.submit && (
            <Box
              style={{
                mt: 3
              }}
            >
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box
            style={{
              mt: 1
            }}
          >
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: colors.secondary.main,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: colors.secondary.main
                  }
                }}
              >
                Reset Password
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthResetPassword;
