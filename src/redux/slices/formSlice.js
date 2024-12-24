import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as FORM_SERVICE from '../../services/form';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  forms: [],
  form: {},
  hiddenView: false
};

export const fetchForms = createAsyncThunk('fetchForms', async () => {
  const data = await FORM_SERVICE.fetchForms();
  return data.result;
});

export const fetchFormById = createAsyncThunk(
  'fetchFormById',
  async ({ id }) => {
    const data = await FORM_SERVICE.fetchFormById(id);
    return data.result;
  }
);

export const fetchFormsByModuleId = createAsyncThunk(
  'fetchFormsByModuleId',
  async ({ moduleId }) => {
    const data = await FORM_SERVICE.fetchFormsByModuleId(moduleId);
    return data.result;
  }
);

export const createForm = createAsyncThunk(
  'createForm',
  async ({ data }, { dispatch }) => {
    const res = await FORM_SERVICE.createForm(data);

    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }

    return res.result;
  }
);

export const editForm = createAsyncThunk(
  'editForm',
  async ({ id, data }, { dispatch }) => {
    const res = await FORM_SERVICE.editForm(id, data);

    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const deleteForm = createAsyncThunk(
  'deleteForm',
  async ({ id }, { dispatch }) => {
    const res = await FORM_SERVICE.deleteForm(id);

    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const moveToAnotherModule = createAsyncThunk(
  'moveToAnotherModule',
  async ({ formInfoId, moduleInfoId }, { dispatch }) => {
    const res = await FORM_SERVICE.moveToAnotherModule(
      formInfoId,
      moduleInfoId
    );

    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const renameForm = createAsyncThunk(
  'renameForm',
  async ({ formInfoId, data }, { dispatch }) => {
    const res = await FORM_SERVICE.renameForm(formInfoId, data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const updateFormData = createAsyncThunk(
  'updateFormData',
  async ({ formname, data }, { dispatch }) => {
    const res = await FORM_SERVICE.updateFormData(formname, data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res;
  }
);

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    toggleHiddenView: (state) => {
      state.hiddenView = !state.hiddenView;
    },
    setHiddenView: (state, action) => {
      state.hiddenView = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchForms.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchForms.fulfilled, (state, action) => {
      state.isLoading = false;
      state.forms = action.payload;
    });
    builder.addCase(fetchForms.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchFormById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFormById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.form = action.payload;
    });
    builder.addCase(fetchFormById.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchFormsByModuleId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFormsByModuleId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.forms = action.payload;
    });
    builder.addCase(fetchFormsByModuleId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createForm.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createForm.fulfilled, (state, action) => {
      state.isLoading = false;
      state.forms = [...state.forms, action.payload];
    });
    builder.addCase(createForm.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(editForm.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editForm.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.forms = state.forms?.map((app) => {
          if (app.formInfoId === action.payload.formInfoId)
            return action.payload;
          return app;
        });
      }
    });
    builder.addCase(editForm.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteForm.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteForm.fulfilled, (state, action) => {
      state.isLoading = false;
      state.forms = state.forms?.filter(
        (app) => app.formInfoId !== action.payload
      );
    });
    builder.addCase(deleteForm.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(moveToAnotherModule.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(moveToAnotherModule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.forms = state.forms?.filter(
        (app) => app.formInfoId !== action.payload
      );
    });
    builder.addCase(moveToAnotherModule.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(renameForm.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(renameForm.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.forms = state.forms?.map((app) => {
          if (app.formInfoId === action.payload.formInfoId)
            return action.payload;
          return app;
        });
      }
    });
    builder.addCase(renameForm.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});
export const { toggleHiddenView, setHiddenView } = formSlice.actions;

export default formSlice.reducer;
