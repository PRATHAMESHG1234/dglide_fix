/* eslint-disable react-hooks/exhaustive-deps */

import './Login.css';

import AuthLogin from './AuthLogin';

import { colors } from '../../common/constants/styles';

import AuthCardWrapper from './AuthCardWrapper';

import BackgroundPattern2 from './BackgroundPattern2';
import AuthSlider from './AuthSlider';
import imgMain from '../../assets/auth/img-a2-login.svg';
import AuthWrapper2 from './AuthWrapper2';
import Logo from '../../assets/auth/logo.svg';
import AuthFooter from './AuthFooter';
import { useEffect, useState } from 'react';
import CodeVerification from '../CodeVerification/CodeVerification';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaLessThanEqual } from 'react-icons/fa';
import { Slider } from '@/componentss/ui/slider';

import { Button } from '@/componentss/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/componentss/ui/card';
import { Checkbox } from '@/componentss/ui/checkbox';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';
import { Separator } from '@/componentss/ui/separator';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Login = () => {
  const slides = [
    {
      image:
        'https://res.cloudinary.com/dg8byfecw/image/upload/v1731787305/3556960_orcrht.jpg',
      text: 'Create Interactive Dashboards',
      description: 'Design customizable dashboards for real-time data insights.'
    },
    {
      image:
        'https://res.cloudinary.com/dg8byfecw/image/upload/v1731787305/4966434_mba6re.jpg',
      text: 'Create Dynamic Forms',
      description:
        'Build responsive forms adapting to user inputs effortlessly.'
    },
    {
      image:
        'https://res.cloudinary.com/dg8byfecw/image/upload/v1731787308/NU_Flat_6_14_cixtrv.jpg',
      text: 'Create Powerful Workflows',
      description:
        'Automate workflows and streamline tasks using intuitive tools.'
    }
  ];

  const [isTwoStepVerfication, setIsTwoStepVerification] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');

    if (token && location.pathname === '/login') {
      navigate('/');
    }
  }, [location, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has('twostep')) {
      setIsTwoStepVerification(true);
    }
  }, [location.search]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (isTwoStepVerfication) {
    return <CodeVerification />;
  }
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left side - Image Slider and Logo (hidden on mobile) */}
      <div className="relative hidden lg:block lg:w-1/2">
        <BackgroundPattern2>
          <div className="flex items-center justify-center">
            <img
              className="mr-4 w-72"
              src="https://res.cloudinary.com/dg8byfecw/image/upload/v1731789959/img-a2-login.339d1afb2c0b604a4665ad8d90b73684_kshkev.svg"
              layout="fill"
              objectFit="cover"
              alt="Login background"
            />
          </div>
        </BackgroundPattern2>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pt-28">
          <div className="z-10 space-y-10">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="text-3xl font-bold text-black">
                {slides[currentSlide].text}
              </div>
              <div className="text-xs font-bold text-black">
                {slides[currentSlide].description}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 cursor-pointer rounded-full ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  } transition-all duration-300`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form (centered on mobile) */}
      <AuthLogin />
    </div>
  );
};

export default Login;
