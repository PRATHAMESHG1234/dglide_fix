import React from 'react';
import {
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField
} from '@mui/material';
import { Checkbox } from '@/componentss/ui/checkbox';

import { Input } from '@/componentss/ui/input';
import { Button } from '@/componentss/ui/button';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { colors } from '../../../common/constants/styles';
import { changePassword } from '../../../services/auth';
import { useDispatch } from 'react-redux';
import { updateFormData } from '../../../redux/slices/formSlice';
import { useSelector } from 'react-redux';
import { notify } from '../../../hooks/toastUtils';
import { Label } from '@/componentss/ui/label';

const Security = ({ userDetail, getUserData }) => {
  const dispatch = useDispatch();
  const { currentUser, currentTheme } = useSelector((state) => state.auth);

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        submit: null,
        twoFactorAuthentication: userDetail
          ? userDetail.two_factor_authentication
          : '2'
      }}
      validationSchema={Yup.object().shape({
        currentPassword: Yup.string()
          .max(255)
          .required('Current Password is required'),
        newPassword: Yup.string().max(255).required('New Password is required'),
        confirmNewPassword: Yup.string()
          .oneOf([Yup.ref('newPassword')], 'Passwords must match')
          .required('Confirm New Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response = await changePassword(
            values.currentPassword,
            values.newPassword
          );
          if (response.status) {
            setStatus({ success: true });

            notify.success('Password changed successfully');
            setStatus({ success: true });
            setSubmitting(false);
          } else {
            notify.error(response?.message);
          }
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        setFieldValue,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div container spacing={3}>
            <div item sm={6} md={8}>
              <div className="gap-3">
                <div>
                  <div
                    className={`p-4 shadow-sm ${
                      currentTheme === 'Dark' ? 'bg-dark-level-1' : 'bg-white'
                    } max-h-[400px] w-[60%] cursor-pointer rounded-lg transition-transform hover:outline hover:outline-1 hover:outline-secondary`}
                  >
                    <Label className="border-b-2 pb-2 text-lg font-semibold">
                      Change Password
                    </Label>

                    <div className="mt-4">
                      <div className="mb-3">
                        <Input
                          type="password"
                          id="current-password"
                          label="Current password"
                          name="currentPassword"
                          value={values.currentPassword}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(
                            touched.currentPassword && errors.currentPassword
                          )}
                          helperText={
                            touched.currentPassword && errors.currentPassword
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <Input
                          type="password"
                          id="new-password"
                          label="New Password"
                          name="newPassword"
                          value={values.newPassword}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(
                            touched.newPassword && errors.newPassword
                          )}
                          helperText={touched.newPassword && errors.newPassword}
                        />
                      </div>
                      <div className="mb-3">
                        <Input
                          type="password"
                          id="confirm-new-password"
                          label="Re-enter New Password"
                          name="confirmNewPassword"
                          value={values.confirmNewPassword}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(
                            touched.confirmNewPassword &&
                              errors.confirmNewPassword
                          )}
                          helperText={
                            touched.confirmNewPassword &&
                            errors.confirmNewPassword
                          }
                        />
                      </div>
                      {errors.submit && (
                        <div>
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </div>
                      )}
                      <div className="mb-5">
                        <Checkbox
                          name="twoFactorAuthentication"
                          endLabel="Enable Two-Factor Authentication"
                          checked={values.twoFactorAuthentication === '1'}
                          onCheckedChange={async (checked) => {
                            const isChecked =
                              values.twoFactorAuthentication === '1';
                            const newValue = isChecked ? '2' : '1';
                            setFieldValue('twoFactorAuthentication', newValue);

                            const newObj = {
                              uuid: currentUser.userUUID,
                              two_factor_authentication: newValue
                            };
                            const result = await dispatch(
                              updateFormData({
                                formname: 'system_user',
                                data: newObj
                              })
                            );
                            if (result.payload.statusCode === 200) {
                              getUserData();
                            }
                          }}
                        />
                      </div>
                      <div item xs={12}>
                        <Button type="submit" disabled={isSubmitting}>
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Security;
