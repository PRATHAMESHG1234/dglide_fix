import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as AUTH_SERVICE from '../../services/auth';

import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  isLogin: !!localStorage.getItem('auth-token'),
  currentUser: null,
  // currentTheme: null,
  currentTheme: 'Light',
  themeLabel: null,
  localization: '',
  localizationJson: ''
};

export const userLogin = createAsyncThunk(
  'userLogin',
  async ({ username, password, persistent }) => {
    localStorage.clear();
    const bodyData = {
      username: username,
      password: password,
      persistent: persistent
    };
    const data = await AUTH_SERVICE.userLogin(bodyData);
    return data.result;
  }
);

export const getLoggedInUser = createAsyncThunk('getLoggedInUser', async () => {
  const data = await AUTH_SERVICE.getLoggedInUser();
  const result = data.result;

  result['localizationJson'] = result?.localizationJson
    ? JSON.parse(result?.localizationJson)
    : '';

  return result;
});

export const updateProfile = createAsyncThunk('updateProfile', async (data) => {
  const res = await AUTH_SERVICE.updateProfile(data);

  if (res.statusCode === 200) {
    notify.success('profile updated successfully');
  } else {
    notify.error(res.message || 'Operation Failed');
  }
  return res.result;
});

export const updateTheme = createAsyncThunk('updateTheme', async (data) => {
  const res = await AUTH_SERVICE.updateTheme(data);
  notify.success('Theme updated successfully');
  return res.result;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      if (localStorage.getItem('auth-token')) {
        localStorage.removeItem('auth-token');
      }
      state.currentUser = null;
      state.isLogin = false;
      window.location.href = '/login';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLogin = true;
    });
    builder.addCase(userLogin.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isLogin = false;
    });

    builder.addCase(getLoggedInUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getLoggedInUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.themeLabel = action.payload?.themeLabel;
      // localStorage.setItem(
      //   'theme',
      //   action.payload?.themeLabel === 'System'
      //     ? window.matchMedia('(prefers-color-scheme: dark)').matches
      //       ? 'Dark'
      //       : 'Light'
      //     : action.payload?.themeLabel
      // );

      // state.currentTheme = localStorage.getItem('theme');
      state.isLogin = true;
    });
    builder.addCase(getLoggedInUser.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isLogin = false;
    });

    builder.addCase(updateTheme.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateTheme.fulfilled, (state, theme) => {
      state.isLoading = false;
      state.themeLabel = theme.payload?.themeLabel;

      // localStorage.setItem(
      //   'theme',
      //   theme.payload?.themeLabel === 'System'
      //     ? window.matchMedia('(prefers-color-scheme: dark)').matches
      //       ? 'Dark'
      //       : 'Light'
      //     : theme.payload?.themeLabel
      // );

      // state.currentTheme = localStorage.getItem('theme');
    });
    builder.addCase(updateTheme.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
