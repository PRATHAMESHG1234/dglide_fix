import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import * as DUMP_SERVICE from '../../services/dump';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  dump: null,
  dumps: []
};

export const fetchDumps = createAsyncThunk(
  'fetchDumps',
  async ({ formInfoId }) => {
    const res = await DUMP_SERVICE.fetchDumps(formInfoId);
    return res;
  }
);

export const deleteDump = createAsyncThunk(
  'deleteDump',
  async ({ dumpInfoId }, { dispatch }) => {
    const res = await DUMP_SERVICE.deleteDump(dumpInfoId);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const createDump = createAsyncThunk(
  'createDump',
  async ({ formName }, { dispatch }) => {
    const res = await DUMP_SERVICE.createDump(formName);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);
export const getDumpByFilter = createAsyncThunk(
  'getDumpByFilter',
  async (data) => {
    const res = await DUMP_SERVICE.getDumpByFilter(data);
    return res;
  }
);
export const createCsvDataDump = createAsyncThunk(
  'createCsvDataDump',
  async ({ formName, data }, { dispatch }) => {
    const res = await DUMP_SERVICE.createCsvDataDump(formName, data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);
export const getDumpBySchema = createAsyncThunk(
  'getDumpBySchema',
  async ({ file, moduleInfoId }, { dispatch }) => {
    const res = await DUMP_SERVICE.getDumpBySchema(file, moduleInfoId);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const dumpSlice = createSlice({
  name: 'dump',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDumps.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDumps.fulfilled, (state, dump) => {
      state.isLoading = false;
      state.dumps = dump.payload;
    });
    builder.addCase(fetchDumps.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.dumps = [];
    });

    builder.addCase(deleteDump.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteDump.fulfilled, (state, dump) => {
      state.isLoading = false;
      state.fieldGroups = state.fieldGroups?.filter(
        (app) => app.dumpInfoId !== dump.payload
      );
    });
    builder.addCase(deleteDump.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default dumpSlice.reducer;
