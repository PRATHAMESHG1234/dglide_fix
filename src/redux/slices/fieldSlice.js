import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as FIELD_SERVICE from '../../services/field';
import * as PREFERENCE_SERVICE from '../../services/fieldPreference';

const initialState = {
  isLoading: false,
  isError: false,
  fields: [],
  preferences: [],
  gridPreferences: []
};

export const fetchFieldsByFormId = createAsyncThunk(
  'fetchFieldsByFormId',
  async ({ formInfoId }) => {
    const res = await FIELD_SERVICE.fetchFieldsByFormId(formInfoId);
    return res.result;
  }
);

export const fetchFieldPreference = createAsyncThunk(
  'fetchFieldPreference',
  async ({ formInfoId }) => {
    const res = await PREFERENCE_SERVICE.fetchFieldPreference(formInfoId);
    return res.result;
  }
);

export const fetchGridFieldPreference = createAsyncThunk(
  'fetchGridFieldPreference',
  async ({ fieldInfoId }) => {
    const res = await PREFERENCE_SERVICE.fetchGridFieldPreference(fieldInfoId);
    return res.result;
  }
);

export const fieldSlice = createSlice({
  name: 'field',
  initialState,
  reducers: {
    updateFieldsToForm: (state, action) => {
      state.fields = action.payload.fields;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFieldsByFormId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFieldsByFormId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.fields = action.payload || [];
    });
    builder.addCase(fetchFieldsByFormId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchFieldPreference.pending, (state) => {});
    builder.addCase(fetchFieldPreference.fulfilled, (state, action) => {
      state.preferences = action.payload;
    });
    builder.addCase(fetchFieldPreference.rejected, (state) => {
      state.isError = true;
    });

    builder.addCase(fetchGridFieldPreference.pending, (state) => {});
    builder.addCase(fetchGridFieldPreference.fulfilled, (state, action) => {
      state.gridPreferences = action.payload;
    });
    builder.addCase(fetchGridFieldPreference.rejected, (state) => {
      state.isError = true;
    });
  }
});

export const { updateFieldsToForm } = fieldSlice.actions;

export default fieldSlice.reducer;
