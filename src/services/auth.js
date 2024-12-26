import axios from 'axios';
import makeHttpCall from '../axios';
import { useNavigate } from 'react-router-dom';
import { notify } from '../hooks/toastUtils';

export const userLogin = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: '/user/login',
    data: data
  });

  if (response?.result?.auth?.isTwoFactorAuthentication) {
    const username = response?.result?.auth?.email;

    window.location.href = `/login?twostep=${username}`;
  } else {
    if (response.status) {
      localStorage.setItem(
        'auth-token',
        JSON.stringify(response.result.tokenDetail)
      );
      const themeMode = response?.result?.auth?.theme;
      const themes = ['default', 'forest', 'ruby', 'solar', 'ocean'];
      document.documentElement.className = themes[themeMode - 1] || 'default';
      localStorage.setItem('mode', themeMode);
      window.location.href = '/';

      if (data?.persistent !== undefined && data?.persistent) {
        localStorage.setItem('persistent', btoa(JSON.stringify(data)));
      } else {
        localStorage.removeItem('persistent');
      }
      return response.result.tokenDetail;
    } else {
      if (response?.status === false) {
        alert(response?.message);
      }
    }
  }
};

export const fetchGoogleClientId = async () => {
  try {
    const response = await makeHttpCall({
      method: 'GET',
      url: '/user/oauth/google/client-id'
    });

    return response.result;
  } catch (error) {
    console.error('Error fetching client ID:', error);
  }
};

export const handleGoogleLogin = async (token) => {
  try {
    const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;
    const apiResponse = await axios.post(`${API_ENDPOINT}/user/google/login`, {
      token
    });

    return apiResponse;
  } catch (error) {
    notify.error(error?.response?.data?.message);

    throw error;
  }
};

export const getLoggedInUser = () => {
  return makeHttpCall({
    method: 'GET',
    url: '/auth'
  });
};

export const updateTheme = (data) => {
  return makeHttpCall({
    method: 'PUT',
    url: '/auth/setting',
    data
  });
};
export const saveUser = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: '/auth/save',
    data
  });
  return response;
};

export const userandGroup = async (uuid) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/auth/role-group/${uuid}`
  });
  return response;
};

export const forgotPassword = async (email) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: '/user/forgot/password',
    data: { email }
  });
  return response;
};

export const resetPassword = async (password, token) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: '/user/reset/password',
    data: { password, token }
  });
  return response;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: '/auth/change/password',
    data: { oldPassword, newPassword }
  });
  return response;
};

export const otpVerify = async (email, otp) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: '/user/verify/otp',
    data: { email, otp }
  });
  return response;
};

export const ResendOtp = async (email) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: '/user/resend/otp',
    data: { email }
  });
  return response;
};

export const updateProfile = async (data) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: '/auth/profile/update',
    data: data
  });
  return response;
};
