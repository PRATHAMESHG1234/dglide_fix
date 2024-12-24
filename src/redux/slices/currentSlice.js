import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as FORM_SERVICE from '../../services/form';
import * as MODULE_SERVICE from '../../services/module';

const initialState = {
  currentModule: null,
  currentForm: null,
  selectedRecordId: 0,
  currentView: 'Grid',
  currentModulePage: 1,
  currentFormPage: 1,
  currentRows: 10
};

export const fetchModuleByName = createAsyncThunk(
  'fetchModuleByName',
  async ({ name }) => {
    const data = await MODULE_SERVICE.fetchModuleByName(name);
    return data.result;
  }
);

export const fetchFormByName = createAsyncThunk(
  'fetchFormByName',
  async ({ name }) => {
    if (name) {
      const data = await FORM_SERVICE.fetchFormByName(name);
      return data.result;
    }
    return null;
  }
);

export const currentSlice = createSlice({
  name: 'current',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload.view;
    },
    setCurrentModule: (state, action) => {
      state.currentModule = action.payload.module;
    },
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload.form;
    },
    setSelectedRecordId: (state, action) => {
      state.selectedRecordId = action.payload.recordId;
    },
    setCurrentModulePage: (state, action) => {
      state.currentModulePage = action.payload.page;
    },
    setCurrentFormPage: (state, action) => {
      state.currentFormPage = action.payload.page;
    },
    setCurrentRows: (state, action) => {
      state.currentRows = action.payload.rows;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModuleByName.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchModuleByName.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentModule = action.payload;
    });
    builder.addCase(fetchModuleByName.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchFormByName.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFormByName.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentForm = action.payload;
    });
    builder.addCase(fetchFormByName.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export const {
  setCurrentView,
  setCurrentModule,
  setCurrentForm,
  setSelectedRecordId,
  setCurrentModulePage,
  setCurrentFormPage,
  setCurrentRows
} = currentSlice.actions;

export default currentSlice.reducer;
