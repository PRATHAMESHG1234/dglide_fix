import React from 'react';
import { ErrorMessage, useField } from 'formik';

export const LoginField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-2">
      <label htmlFor={field.name} className="login-page-input-fields-label">
        {label}
      </label>
      <input
        className={`form-control login-page-input-fields-input shadow-none ${
          meta.touched && meta.error && 'is-valid'
        }`}
        {...field}
        {...props}
        autoComplete="off"
      />
      <ErrorMessage component="div" name={field.name} className="error" />
    </div>
  );
};
