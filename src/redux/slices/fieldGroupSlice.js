import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as FIELDGROUP_SERVICE from '../../services/fieldGroup';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  fieldGroup: null,
  fieldGroups: []
};

export const fetchFieldGroup = createAsyncThunk(
  'fetchFieldGroup',
  async ({ fieldGroupInfoId }) => {
    const res = await FIELDGROUP_SERVICE.fetchFieldGroup(fieldGroupInfoId);
    return res;
  }
);

export const fetchFieldGroups = createAsyncThunk(
  'fetchFieldGroups',
  async ({ formInfoId }) => {
    const res = await FIELDGROUP_SERVICE.fetchFieldGroups(formInfoId);
    return res;
  }
);

export const createFieldGroup = createAsyncThunk(
  'createFieldGroup',
  async ({ data }, { dispatch }) => {
    const res = await FIELDGROUP_SERVICE.createFieldGroup(data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const updateFieldGroup = createAsyncThunk(
  'updateFieldGroup',
  async ({ fieldGroupInfoId, data }, { dispatch }) => {
    const res = await FIELDGROUP_SERVICE.updateFieldGroup(
      fieldGroupInfoId,
      data
    );
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const deleteFieldGroup = createAsyncThunk(
  'deleteFieldGroup',
  async ({ fieldGroupInfoId }, { dispatch }) => {
    const res = await FIELDGROUP_SERVICE.deleteFieldGroup(fieldGroupInfoId);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const fieldSGroupSlice = createSlice({
  name: 'fieldGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFieldGroups.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFieldGroups.fulfilled, (state, fieldGroup) => {
      state.isLoading = false;
      state.fieldGroups = fieldGroup.payload;
    });
    builder.addCase(fetchFieldGroups.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchFieldGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFieldGroup.fulfilled, (state, fieldGroup) => {
      state.isLoading = false;
      state.fieldGroup = fieldGroup.payload;
    });
    builder.addCase(fetchFieldGroup.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createFieldGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createFieldGroup.fulfilled, (state, fieldGroup) => {
      state.isLoading = false;
      state.fieldGroups = [...state.fieldGroups, fieldGroup.payload];
    });
    builder.addCase(createFieldGroup.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(updateFieldGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateFieldGroup.fulfilled, (state, fieldGroup) => {
      state.isLoading = false;
      if (fieldGroup.payload) {
        state.fieldGroups = state.fieldGroups?.map((group) => {
          if (group.fieldGroupInfoId === fieldGroup.payload.fieldGroupInfoId) {
            return { ...group, ...fieldGroup.payload };
          }
          return group;
        });
      }
    });

    builder.addCase(updateFieldGroup.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteFieldGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteFieldGroup.fulfilled, (state, fieldGroup) => {
      state.isLoading = false;
      state.fieldGroups = state.fieldGroups?.filter(
        (group) => group.fieldGroupInfoId !== fieldGroup.payload
      );
    });
    builder.addCase(deleteFieldGroup.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default fieldSGroupSlice.reducer;
