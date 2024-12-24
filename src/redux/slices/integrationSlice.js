import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Etl_SERVICE from '../../services/integration';
import * as PREFERENCE_SERVICE from '../../services/fieldPreference';

const initialState = {
  isLoading: false,
  isError: false,
  plugins: [],
  plugin: {}
};

export const deleteForm = createAsyncThunk('deleteForm', async (pluginId) => {
  const res = await Etl_SERVICE.deleteForm(pluginId);
  return res.result;
});

export const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    updateFieldsToForm: (state, action) => {
      state.fields = action.payload.fields;
    }
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchFieldsByFormId.pending, (state) => {
    //   state.isLoading = true;
    // });
    // builder.addCase(fetchFieldsByFormId.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.fields = action.payload || [];
    // });
    // builder.addCase(fetchFieldsByFormId.rejected, (state) => {
    //   state.isLoading = false;
    //   state.isError = true;
    // });
  }
});

export default integrationSlice.reducer;
