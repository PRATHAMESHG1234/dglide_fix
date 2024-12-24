import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('sidebarState');
    return serializedState ? JSON.parse(serializedState) : { isOpen: false };
  } catch (err) {
    return { isOpen: false };
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('sidebarState', serializedState);
  } catch (err) {}
};

const initialState = loadState();

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
      saveState(state);
    },
    openSidebar: (state) => {
      state.isOpen = true;
      saveState(state);
    },
    closeSidebar: (state) => {
      state.isOpen = false;
      saveState(state);
    }
  }
});

export const { toggleSidebar, openSidebar, closeSidebar } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
