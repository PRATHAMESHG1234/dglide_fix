import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as ACTIONS_SERVICE from '../../services/action';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  action: null,
  actions: []
};

const handleSnackBar = (dispatch, message, statusCode) => {
  if (statusCode === 200) {
    notify.success(message || 'Operation Failed');
  } else {
    notify.error(message || 'Operation Failed');
  }
};

export const fetchAction = createAsyncThunk(
  'fetchAction',
  async ({ actionInfoId }) => {
    const res = await ACTIONS_SERVICE.fetchAction(actionInfoId);
    return res;
  }
);

export const fetchActions = createAsyncThunk(
  'fetchActions',
  async ({ formInfoId }) => {
    const res = await ACTIONS_SERVICE.fetchActions(formInfoId);
    return res;
  }
);

export const fetchActionsByModuleOrFormId = createAsyncThunk(
  'fetchActionsByModuleOrFormId',
  async ({ data }) => {
    const res = await ACTIONS_SERVICE.fetchActionsByModuleOrFormId(data);
    return res;
  }
);

export const createAction = createAsyncThunk(
  'createAction',
  async ({ data }, { dispatch }) => {
    const res = await ACTIONS_SERVICE.createAction(data);
    handleSnackBar(dispatch, res.message, res.statusCode);
    return res.result;
  }
);

export const updateAction = createAsyncThunk(
  'updateAction',
  async ({ actionInfoId, data }, { dispatch }) => {
    const res = await ACTIONS_SERVICE.updateAction(actionInfoId, data);
    handleSnackBar(dispatch, res.message, res.statusCode);
    return res.result;
  }
);

export const deleteAction = createAsyncThunk(
  'deleteAction',
  async ({ actionInfoId }, { dispatch }) => {
    const res = await ACTIONS_SERVICE.deleteAction(actionInfoId);
    handleSnackBar(dispatch, res.message, res.statusCode);
    return res.result;
  }
);

export const actionSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchActions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchActions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.actions = action.payload;
    });
    builder.addCase(fetchActions.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.action = action.payload;
    });
    builder.addCase(fetchAction.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchActionsByModuleOrFormId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchActionsByModuleOrFormId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.actions = action.payload;
    });
    builder.addCase(fetchActionsByModuleOrFormId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.actions = [...state.actions, action.payload];
    });
    builder.addCase(createAction.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(updateAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateAction.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.actions = state.actions?.map((app) => {
          if (app.actionInfoId === action.payload.actionInfoId)
            return action.payload;
          return app;
        });
      }
    });
    builder.addCase(updateAction.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.actions = state.actions?.filter(
        (app) => app.actionInfoId !== action.payload
      );
    });
    builder.addCase(deleteAction.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default actionSlice.reducer;
