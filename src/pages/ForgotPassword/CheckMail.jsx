import { useNavigate } from 'react-router-dom';

// project imports
import Logo from '../../assets/auth/logo.svg';

import { Button } from '@/componentss/ui/button';

// ==============================|| AUTH3 - CHECK MAIL ||============================== //

const CheckMail = ({ getUserName, setGetUserName }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo Section */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex items-center">
              <img
                src={'https://d3bzo30ykdobe9.cloudfront.net/logo/logo.svg'}
                alt="Logo"
                className="h-[4.5rem]"
              />
            </div>
          </div>

          {/* Message Section */}
          <div className="text-center">
            <span className="block py-2 text-xl font-bold text-black">
              {`Hi ${getUserName ? getUserName : ''}, Check Your Mail`}
            </span>
            <span className="block text-base font-normal text-gray-600">
              We have sent password recovery instructions to your email.
            </span>
          </div>

          {/* Button Section */}
          <div className="w-full">
            <Button
              onClick={() => {
                navigate('/login');
                setGetUserName('');
              }}
              className="w-full bg-primary text-base capitalize text-white focus:ring-2 focus:ring-secondary"
            >
              Go to login page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckMail;
