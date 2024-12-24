import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as GROUP_SERVICE from '../../services/group';

const initialState = {
  isLoading: false,
  isError: false,
  groups: [],
  group: {}
};

export const fetchGroups = createAsyncThunk('fetchGroups', async () => {
  const data = await GROUP_SERVICE.fetchGroups();
  return data.result;
});

export const fetchGroup = createAsyncThunk('fetchGroup', async ({ id }) => {
  const data = await GROUP_SERVICE.fetchGroup(id);
  return data.result;
});

export const createGroup = createAsyncThunk(
  'createGroup',
  async ({ group }) => {
    const data = await GROUP_SERVICE.createGroup(group);
    return data.result;
  }
);

export const updateGroup = createAsyncThunk(
  'updateGroup',
  async ({ id, group }) => {
    const data = await GROUP_SERVICE.updateGroup(id, group);
    return data.result;
  }
);

export const deleteGroup = createAsyncThunk('deleteGroup', async (id) => {
  const data = await GROUP_SERVICE.deleteGroup(id);
  return data.result;
});

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.isLoading = false;
      state.groups = action.payload;
    });
    builder.addCase(fetchGroups.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchGroup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.group = action.payload;
    });
    builder.addCase(fetchGroup.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.groups = [...state.groups, action.payload];
    });
    builder.addCase(createGroup.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(updateGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateGroup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.groups = state.groups?.map((group) => {
        if (group.groupId === action.payload.groupId) return action.payload;
        return group;
      });
    });
    builder.addCase(updateGroup.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteGroup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.groups = state.groups?.filter(
        (grp) => grp.groupId !== action.payload
      );
    });
    builder.addCase(deleteGroup.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default groupSlice.reducer;
