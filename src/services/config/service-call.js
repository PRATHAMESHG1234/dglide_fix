import axios from "axios";
import { API_ENDPOINT } from "./constant";

axios.interceptors.response.use(
  (resp) => resp,
  (error) => Promise.reject({ ...error, message: "API failed" })
);

const getTimezoneOffset = () => {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const offsetHours = Math.abs(offsetMinutes) / 60;
  // Format the offset as +HH:mm or -HH:mm
  const offsetString =
    (offsetMinutes < 0 ? "+" : "-") +
    ("00" + Math.floor(offsetHours)).slice(-2) +
    ":" +
    ("00" + (offsetMinutes % 60)).slice(-2);
  return offsetString;
};

const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

axios.interceptors.request.use(
  async (config) => {
    getTimezoneOffset();
    const timezone = getTimezone();
    const timezoneOffset = getTimezoneOffset();
    const TOKEN = await localStorage.getItem("auth-token");
    try {
      config.headers["timezone"] = timezone;
      config.headers["timezone-offset"] = timezoneOffset;
      config.headers["Authorization"] = `Bearer ${TOKEN}`;
    } catch (erorr) {}
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
      status: true,
    };
  }
});

export const errorHandler = (error) => {
  const { request, response } = error;
  if (response) {
    let message = null;
    if (response.status === 403 || response.status === 401) {
      //localStorage.clear();
      if (localStorage.getItem("auth-token")) {
        localStorage.removeItem("auth-token");
      }
      window.location.href = "/login";
    } else if (response.status === 500) {
      console.error(response);
      if (response?.data) {
        message = response?.data?.message ? response?.data?.message : null;
      }
    } else {
      if (response?.data) {
        message = response?.data?.message ? response?.data?.message : null;
      }
    }
    return {
      message: message ? message : null,
      status: false,
    };
  } else if (request) {
    return {
      message: "server time out",
      status: false,
    };
  } else {
    return {
      message: "opps! something went wrong while setting up request",
      status: false,
    };
  }
};

const makeHttpCall = async ({ headers = {}, ...options }) => {
  if (options.url.indexOf("https://") === -1) {
    options.url = API_ENDPOINT + options.url;
  }
  try {
    const result = await axios({
      ...options,
      headers: {
        ...headers,
      },
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

export const makeOuterHttpCall = async ({ headers = {}, ...options }) => {
  try {
    const result = await axios({
      ...options,
      headers: headers,
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
