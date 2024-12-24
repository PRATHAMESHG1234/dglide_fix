import { Link, useLocation } from 'react-router-dom';

// material-ui

// project imports

import AuthFooter from '../Login/AuthFooter';

import { colors } from '../../common/constants/styles';
import AuthCodeVerification from './AuthCodeVerification';
import { ResendOtp } from '../../services/auth';

import { useDispatch } from 'react-redux';
import { notify } from '../../hooks/toastUtils';
import { useSelector } from 'react-redux';
import { Button } from '@/componentss/ui/button';
// assets

// ===========================|| AUTH3 - CODE VERIFICATION ||=========================== //

const CodeVerification = ({ currentEmail }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('twostep');

  const { currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  function maskEmail(email) {
    const atIndex = email.indexOf('@');

    // Check for a valid email format
    if (atIndex === -1) return email;

    const localPart = email.slice(0, atIndex);
    const domain = email.slice(atIndex);

    // Determine how much of the local part to mask
    const maskedLength = Math.ceil(localPart.length / 2);
    const visiblePart = localPart.slice(0, localPart.length - maskedLength);
    const maskedLocalPart = visiblePart + '*'.repeat(maskedLength);

    return `${maskedLocalPart}${domain}`;
  }

  const handleResendOtp = async () => {
    try {
      const response = await ResendOtp(email);
      if (response.statusCode === 200) {
        notify.success('OTP resend successfully! check email');
      } else {
        notify.error('something went Wrong!');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-end">
      <div className="flex-grow">
        <div className="flex min-h-[calc(100vh-68px)] items-center justify-center">
          <div className="m-4 mb-0 sm:m-12">
            <div className="rounded-2xl bg-white p-4 shadow-md">
              <div className="grid grid-cols-1 items-center justify-center gap-8">
                <Link
                  to="#"
                  className="flex items-center justify-center gap-2.5 p-4 no-underline"
                >
                  <img
                    src={'https://d3bzo30ykdobe9.cloudfront.net/logo/logo.svg'}
                    className="h-[4.5rem]"
                    alt="logo"
                  />
                </Link>

                <div className="w-full">
                  <div className={`flex items-center justify-center`}>
                    <div>
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <h2 className="mb-2 text-2xl font-bold text-secondary">
                          Enter Verification Code
                        </h2>

                        <p className={`text-left text-xs text-gray-900`}>
                          {`Hi  ${maskEmail(email)} , we've send you code on your email`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <AuthCodeVerification email={email} />
                </div>
                <hr className="w-full border-t border-gray-200" />
                <div className="w-full">
                  <div className="flex w-full flex-col items-center">
                    <p
                      className={`text-left text-sm font-medium text-gray-900`}
                    >
                      Did not receive the email? Check your spam filter, or
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <Button
                    className="w-full bg-white hover:bg-secondary hover:text-white"
                    onClick={handleResendOtp}
                    variant="outline"
                  >
                    Resend Code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-12 mb-12 mt-4">
        <AuthFooter />
      </div>
    </div>
  );
};

export default CodeVerification;
