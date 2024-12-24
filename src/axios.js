import axios from 'axios';
import { getTimezone, getTimezoneOffset } from './common/utils/helpers';

axios.interceptors.request.use(
  (config) => {
    getTimezoneOffset();
    const timezone = getTimezone();
    const timezoneOffset = getTimezoneOffset();
    const tokenDetail = JSON.parse(localStorage.getItem('auth-token'));

    config.headers['timezone'] = timezone;
    config.headers['timezone-offset'] = timezoneOffset;
    if (tokenDetail?.token) {
      config.headers['Authorization'] = `Bearer ${tokenDetail.token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use((res) => {
  if (res) {
    return {
      data: res.data,
      headers: res.headers,
      status: true
    };
  }
});

axios.interceptors.response.use(
  (resp) => resp,
  (error) => Promise.reject({ ...error, message: 'API failed' })
);

const makeHttpCall = async ({ headers = {}, ...options }) => {
  const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

  const tokenDetail = JSON.parse(localStorage.getItem('auth-token'));
  try {
    if (tokenDetail && tokenDetail?.expirationTime < Date.now()) {
      console.log('Token expired ---- generating new');
      const refrshTokenURL = API_ENDPOINT + '/user/refresh/token';

      const response = await axios({
        method: 'POST',
        url: refrshTokenURL,
        data: tokenDetail?.token
      });
      localStorage.setItem('auth-token', JSON.stringify(response.data.result));
    }

    if (options.url.indexOf('https://') === -1) {
      options.url = API_ENDPOINT + options.url;
    }

    const result = await axios({
      ...options,
      headers: {
        ...headers
      }
    });
    return result.data ? result.data : null;
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

export const makeETLHttpCall = async ({ headers = {}, ...options }) => {
  const API_ENDPOINT = process.env.REACT_APP_ETL_BACKEND_URL;
  const tokenDetail = JSON.parse(localStorage.getItem('auth-token'));

  try {
    if (tokenDetail && tokenDetail?.expirationTime < Date.now()) {
      console.log('Token expired ---- generating new');
      const refrshTokenURL = API_ENDPOINT + '/user/refresh/token';
      console.log(refrshTokenURL);
      const response = await axios({
        method: 'POST',
        url: refrshTokenURL,
        data: tokenDetail?.token
      });
      localStorage.setItem('auth-token', JSON.stringify(response.data.result));
    }
    if (options.url.indexOf('https://') === -1) {
      options.url = API_ENDPOINT + options.url;
    }
    const result = await axios({
      ...options,
      headers: {
        ...headers
      }
    });
    return result.data ? result.data : null;
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};
export const makeOuterHttpCall = async ({ headers = {}, ...options }) => {
  try {
    const result = await axios({
      ...options,
      headers: headers
    });
    if (result.data) {
      return result.data;
    }
    return null;
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

const errorHandler = (error) => {
  const { response } = error;
  if (response?.status === 502) {
    window.location.href = '/maintenance';
  }
  if (!response || [403, 401, 302].includes(response.status)) {
    localStorage.removeItem('auth-token');
    window.location.href = '/login';
    return {
      open: true,
      message: 'Authentication required, redirecting to login.',
      severity: 'error'
    };
  }

  const message = response?.data?.message || 'Something went wrong';

  return {
    ...response?.data,
    message
  };
};

export const makeCommonAIRequest = async ({ headers = {}, ...options }) => {
  try {
    const result = await axios({
      ...options,
      headers: headers
    });
    if (result.data) {
      return result.data;
    }
    return null;
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

export default makeHttpCall;

// export const makeCommonAIRequest = async ({ headers = {}, ...options }) => {
//   try {
//     const result = await axios({
//       ...options,
//       headers: headers
//     });
//     if (result.data) {
//       return result.data;
//     }
//     return null;
//   } catch (err) {
//     console.error(err);
//     return errorHandler(err);
//   }
// };
