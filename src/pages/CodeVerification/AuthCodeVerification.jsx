import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
// import { Button, Grid, Stack, Typography } from '@mui/material';

import OtpInput from 'react18-input-otp';
import { colors } from '../../common/constants/styles';
import { otpVerify } from '../../services/auth';
import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { notify } from '../../hooks/toastUtils';
import {Button} from '@/componentss/ui/button'
// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = ({ email }) => {
  const theme = useTheme();
  const [otp, setOtp] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const borderColor =
    theme.palette.mode === 'dark' ? theme.palette.grey[200] : colors.grey[300];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await otpVerify(email, otp);

      if (response.statusCode === 200) {
        setSuccess('OTP verified successfully!');

        notify.success('OTP verified successfully!');
        localStorage.setItem(
          'auth-token',
          JSON.stringify(response?.result?.tokenDetail)
        );
        navigate('/');
        window.location.reload();
        setError('');
      } else {
        notify.success(response?.message || 'something went wrong!');
        setError('Failed to verify OTP. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred while verifying OTP.');
      setSuccess('');
    }
  };

  useEffect(() => {
    if (otp.length === 4) {
      handleSubmit(new Event('submit'));
    }
  }, [otp]);

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
      <div className="space-y-6">
        <div>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            containerStyle={{ justifyContent: 'space-between' }}
            inputStyle={{
              width: '100%',
              margin: '8px',
              padding: '10px',
              border: `1px solid ${borderColor}`,
              borderRadius: 4
            }}
            focusStyle={{
              outline: 'none',
              border: `2px solid #047eae`
            }}
          />
        </div>
        <div>
          <Button
            disabled={otp.length !== 4}
            type="submit"
            className="w-full"
          >
            Continue
          </Button>
        </div>
        {error && (
          <div>
            <p className="text-error font-normal leading-normal">{error}</p>
          </div>
        )}
        {success && (
          <div>
            <p className="text-success font-normal leading-normal">{success}</p>
          </div>
        )}
      </div>
    </form>
  );
};

export default AuthCodeVerification;
