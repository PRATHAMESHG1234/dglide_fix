import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as TABLE_SERVICE from '../../services/attachment';

const initialState = {
  isLoading: false,
  isError: false,
  attachments: [],
  attachmentCount: {}
};

export const fetchAttachmentCount = createAsyncThunk(
  'fetchAttachmentCount',
  async ({ formName, recordId }) => {
    const res = await TABLE_SERVICE.fetchAttachmentCount(formName, recordId);
    return res.result;
  }
);

export const uploadAttachment = createAsyncThunk(
  'uploadAttachment',
  async ({ formName, data }) => {
    const res = await TABLE_SERVICE.uploadAttachment(formName, data);
    return res.result;
  }
);

export const uploadAttachments = createAsyncThunk(
  'uploadAttachments',
  async ({ formName, data, recordId }) => {
    const res = await TABLE_SERVICE.uploadAttachments(formName, data, recordId);
    return res.result;
  }
);
export const attachmentSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    resetTableStore: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.attachments = [];
      state.attachmentCount = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(uploadAttachment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(uploadAttachment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.attachments = [...state.attachments, action.payload];
    });
    builder.addCase(uploadAttachment.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(uploadAttachments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(uploadAttachments.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.attachments.length > 0) {
        for (const file of action.payload) {
          state.attachments.push(file);
        }
      } else {
        state.attachments = action.payload;
      }
    });
    builder.addCase(uploadAttachments.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchAttachmentCount.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAttachmentCount.fulfilled, (state, action) => {
      state.isLoading = false;
      state.attachmentCount = { ...action.payload };
    });
    builder.addCase(fetchAttachmentCount.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const { resetAttachmentStore } = attachmentSlice.actions;

export default attachmentSlice.reducer;
