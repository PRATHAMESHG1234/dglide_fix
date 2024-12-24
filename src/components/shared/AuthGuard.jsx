import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthGuard = ({ children }) => {
  const { isLogin } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && location.pathname === '/login') {
      navigate('/');
    }
  }, [location, navigate]);

  if (isLogin) {
    return <>{children}</>;
  }

  return <Navigate to="/login" />;
};

export default AuthGuard;
