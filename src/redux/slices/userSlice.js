import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as USER_SERVICE from '../../services/user';

const initialState = {
  isLoading: false,
  isError: false,
  users: [],
  user: {}
};

export const fetchUsers = createAsyncThunk('fetchUsers', async () => {
  const data = await USER_SERVICE.fetchUsers();
  return data.result;
});

export const fetchUser = createAsyncThunk('fetchUser', async ({ id }) => {
  const data = await USER_SERVICE.fetchUser(id);
  return data.result;
});

export const createUser = createAsyncThunk('createUser', async ({ user }) => {
  const data = await USER_SERVICE.createUser(user);
  return data.result;
});

export const updateUser = createAsyncThunk(
  'updateUser',
  async ({ id, user }) => {
    const data = await USER_SERVICE.updateUser(id, user);
    return data.result;
  }
);

export const deleteUser = createAsyncThunk('deleteUser', async (id) => {
  const data = await USER_SERVICE.deleteUser(id);
  return data.result;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = [...state.users, action.payload];
    });
    builder.addCase(createUser.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users?.map((user) => {
        if (user.userId === action.payload.userId) return action.payload;
        return user;
      });
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users?.filter((grp) => grp.userId !== action.payload);
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default userSlice.reducer;
