import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as SERVICE from '../../services/notification';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  notifications: {},
  notification: {}
};

const handleSnackBar = (dispatch, message, statusCode) => {
  if (statusCode === 200) {
    notify.success(message || 'Operation Failed');
  } else {
    notify.error(message || 'Operation Failed');
  }
};

export const fetchMsgTemplateByPagination = createAsyncThunk(
  'fetchMsgTemplateByPagination',
  async (data) => {
    const res = await SERVICE.fetchMsgTemplateByPagination(data);
    return res.result;
  }
);

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMsgTemplateByPagination.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMsgTemplateByPagination.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload;
    });
    builder.addCase(fetchMsgTemplateByPagination.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default notificationSlice.reducer;
