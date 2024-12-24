import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as TABLE_SERVICE from '../../services/table';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  tableRecord: {},
  tableData: [],
  recordCount: {}
};

export const createTable = createAsyncThunk(
  'createTable',
  async ({ formName, fields }, { dispatch }) => {
    const res = await TABLE_SERVICE.createTable(formName, fields);

    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);
export const fetchRecordbyFormName = createAsyncThunk(
  'fetchRecordbyFormName',
  async ({ formName, data }) => {
    const res = await TABLE_SERVICE.fetchRecordbyFormName(formName, data);
    return res;
  }
);

export const fetchRecords = createAsyncThunk(
  'fetchRecords',
  async ({ formName, data }) => {
    const res = await TABLE_SERVICE.fetchRecords(formName, data);
    return res;
  }
);

export const fetchBatchTableCountValues = createAsyncThunk(
  'fetchBatchTableCountValues',
  async ({ data }) => {
    const res = await TABLE_SERVICE.fetchBatchTableCountValues(data);
    return res.result;
  }
);

export const fetchRecordById = createAsyncThunk(
  'fetchRecordById',
  async ({ tableName, UUID }) => {
    const res = await TABLE_SERVICE.fetchRecordById(tableName, UUID);
    return res;
  }
);

export const createTableRecord = createAsyncThunk(
  'createTableRecord',
  async ({ tableName, data }, { dispatch }) => {
    const res = await TABLE_SERVICE.createTableRecord(tableName, data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const deleteTableRecord = createAsyncThunk(
  'deleteTableRecord',
  async ({ tableName, UUID }) => {
    const data = await TABLE_SERVICE.deleteTableRecord(tableName, UUID);
    return data.result;
  }
);
export const fetchReferenceFieldRecordById = createAsyncThunk(
  'fetchReferenceFieldRecordById',
  async ({ formName, fieldName, id }) => {
    const res = await TABLE_SERVICE.fetchReferenceFieldRecordById(
      formName,
      fieldName,
      id
    );
    return res;
  }
);
export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    resetTableStore: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.tableRecord = {};
      state.tableData = [];
      state.attachments = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createTable.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createTable.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createTable.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchRecords.pending, (state) => {
      state.isLoading = true;
      state.tableData = [];
    });
    builder.addCase(fetchRecords.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tableData = action.payload;
    });
    builder.addCase(fetchRecords.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchRecordById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchRecordById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tableRecord = action.payload;
    });
    builder.addCase(fetchRecordById.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createTableRecord.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createTableRecord.fulfilled, (state, action) => {
      state.isLoading = false;
      //state.tableData = [];
    });
    builder.addCase(createTableRecord.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteTableRecord.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteTableRecord.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deleteTableRecord.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchBatchTableCountValues.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBatchTableCountValues.fulfilled, (state, action) => {
      state.isLoading = false;
      state.recordCount = { ...state.recordCount, ...action.payload };
    });
    builder.addCase(fetchBatchTableCountValues.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const { resetTableStore } = tableSlice.actions;

export default tableSlice.reducer;
