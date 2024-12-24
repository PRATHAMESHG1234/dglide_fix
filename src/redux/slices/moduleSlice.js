import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as MODULE_SERVICE from '../../services/module';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  modules: [],
  module: {},
  currentModule: {}
};

export const fetchModules = createAsyncThunk('fetchModules', async () => {
  const data = await MODULE_SERVICE.fetchModules();
  return data.result;
});

export const fetchModuleById = createAsyncThunk(
  'fetchModuleById',
  async ({ id }) => {
    const data = await MODULE_SERVICE.fetchModuleById(id);
    return data.result;
  }
);

export const createModule = createAsyncThunk(
  'createModule',
  async ({ module }, { dispatch }) => {
    const data = await MODULE_SERVICE.createModule(module);
    if (data.statusCode === 200) {
      notify.success(data.message || 'Operation Failed');
    } else {
      notify.error(data.message || 'Operation Failed');
    }

    return data.result;
  }
);

export const editModule = createAsyncThunk(
  'editModule',
  async ({ id, module }, { dispatch }) => {
    const data = await MODULE_SERVICE.editModule(id, module);
    if (data.statusCode === 200) {
      notify.success(data.message || 'Operation Failed');
    } else {
      notify.error(data.message || 'Operation Failed');
    }

    return data.result;
  }
);

export const deleteModule = createAsyncThunk(
  'deleteModule',
  async ({ id }, { dispatch }) => {
    const data = await MODULE_SERVICE.deleteModule(id);
    if (data.statusCode === 200) {
      notify.success(data.message || 'Operation Failed');
    } else {
      notify.error(data.message || 'Operation Failed');
    }

    return data.result;
  }
);

export const importSchemaModel = createAsyncThunk(
  'importSchema',
  async ({ module, id }, { dispatch }) => {
    const data = await MODULE_SERVICE.ImportSchema(module, id);
    if (data.statusCode === 200) {
      notify.success(data.message || 'Operation Failed');
    } else {
      notify.error(data.message || 'Operation Failed');
    }

    return data.result;
  }
);
export const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchModules.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchModules.fulfilled, (state, action) => {
      state.isLoading = false;
      state.modules = action.payload;
    });
    builder.addCase(fetchModules.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchModuleById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchModuleById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.module = action.payload;
    });
    builder.addCase(fetchModuleById.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createModule.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createModule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.modules = [...state.modules, action.payload];
    });
    builder.addCase(createModule.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(editModule.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editModule.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.modules = state.modules?.map((app) => {
          if (app.moduleInfoId === action.payload.moduleInfoId)
            return action.payload;
          return app;
        });
      }
    });
    builder.addCase(editModule.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteModule.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteModule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.modules = state.modules?.filter(
        (app) => app.moduleInfoId !== action.payload
      );
    });
    builder.addCase(deleteModule.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default moduleSlice.reducer;
