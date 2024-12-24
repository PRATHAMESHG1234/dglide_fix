import { Link } from 'react-router-dom';
import { useState } from 'react';

import AuthFooter from '../Login/AuthFooter';
import AuthForgotPassword from './AuthForgotPassword';
import CheckMail from './CheckMail';

const ForgotPassword = () => {
  const [mailConfirm, setMailConfirm] = useState(false);
  const [getUserName, setGetUserName] = useState('');

  return (
    <>
      {!mailConfirm ? (
        <div className="flex min-h-screen flex-col justify-between bg-gray-100">
          <div className="flex min-h-[calc(100vh-68px)] items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center p-4 lg:w-1/2">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex items-center">
                  <img
                    src={'https://d3bzo30ykdobe9.cloudfront.net/logo/logo.svg'}
                    alt="Logo"
                    className="h-[4.5rem]"
                  />
                </div>
              </div>
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-6 text-center">
                  <h2 className="py-4 text-2xl font-bold">Forgot password?</h2>
                  <p className="text-sm text-gray-600">
                    Enter your email to receive a password reset link.
                  </p>
                </div>
                <AuthForgotPassword
                  setMailConfirm={setMailConfirm}
                  setGetUserName={setGetUserName}
                />
                <div className="mt-4 text-center">
                  <Link to="/login" className="text-sm text-black">
                    Back to login
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-4 mt-1">
            <AuthFooter />
          </div>
        </div>
      ) : (
        <CheckMail getUserName={getUserName} setGetUserName={setGetUserName} />
      )}
    </>
  );
};

export default ForgotPassword;
