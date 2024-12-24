import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as CATALOGFLOW_SERVICE from '../../services/catalogFlow';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: true,
  catalogFlows: [],
  catalogFlow: {}
};

export const fetchCatalogFlows = createAsyncThunk(
  'fetchCatalogFlows',
  async () => {
    const res = await CATALOGFLOW_SERVICE.fetchCatalogFlows();
    return res.result;
  }
);

export const fetchCatalogFlow = createAsyncThunk(
  'fetchCatalogFlow',
  async ({ catalogFlowInfoId }) => {
    const data = await CATALOGFLOW_SERVICE.fetchCatalogFlow(catalogFlowInfoId);
    return data.result;
  }
);
export const createCatalogFlow = createAsyncThunk(
  'createCatalogFlow',
  async ({ catalogFlow }, { dispatch }) => {
    const res = await CATALOGFLOW_SERVICE.createCatalogFlow(catalogFlow);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const updateCatalogFlow = createAsyncThunk(
  'updateCatalogFlow',
  async (updatedData, { dispatch }) => {
    const res = await CATALOGFLOW_SERVICE.updateCatalogFlow(
      updatedData?.uuid,
      updatedData
    );
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    if (res?.statusCode === 200) {
      dispatch(fetchCatalogFlows());
    }
    return res.result;
  }
);

export const updateCatelogRequest = createAsyncThunk(
  'updateCatelogRequest',
  async (updatedData, { dispatch }) => {
    const res = await CATALOGFLOW_SERVICE.doUpdateRequest(updatedData);
    
    if(res.statusCode === 200){
      notify.success(`Request id (${res.result?.request_id}) Submitted` ||
          'Operation Failed')
    }else{
      notify.error(`Request id (${res.result?.request_id}) Submitted` ||
          'Operation Failed')
    }
    return res.result;
  }
);

export const deleteCatalogFlow = createAsyncThunk(
  'deleteCatalogFlow',
  async ({ id }, { dispatch }) => {
    const res = await CATALOGFLOW_SERVICE.deleteCatalogFlow(id);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    if (res?.statusCode === 200) {
      dispatch(fetchCatalogFlows());
    }
    return res.result;
  }
);
export const getAllCatagoryList = createAsyncThunk(
  'getAllCatagoryList',
  async () => {
    const res = await CATALOGFLOW_SERVICE.getCatagoryList({});
    return res.result;
  }
);
export const catalogflowSlice = createSlice({
  name: 'catalogFlow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCatalogFlows.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCatalogFlows.fulfilled, (state, action) => {
      state.isLoading = false;
      state.catalogFlows = action.payload;
    });
    builder.addCase(fetchCatalogFlows.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchCatalogFlow.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCatalogFlow.fulfilled, (state, action) => {
      state.isLoading = false;
      state.catalogFlow = action.payload;
    });
    builder.addCase(fetchCatalogFlow.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(createCatalogFlow.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createCatalogFlow.fulfilled, (state, action) => {
      state.isLoading = false;
      state.catalogFlows = [...state.catalogFlows, action.payload];
    });
    builder.addCase(createCatalogFlow.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteCatalogFlow.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteCatalogFlow.fulfilled, (state, action) => {
      state.isLoading = false;
      state.catalogFlows = state.catalogFlows?.filter(
        (app) => app.catalogFlowInfoId !== action.payload
      );
    });
    builder.addCase(deleteCatalogFlow.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(updateCatalogFlow.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCatalogFlow.fulfilled, (state, action) => {
      state.isLoading = false;
      state.catalogFlows = state.catalogFlows?.map((app) => {
        if (app.catalogFlowInfoId === action.payload.catalogFlowInfoId)
          return action.payload;
        return app;
      });
    });
    builder.addCase(updateCatalogFlow.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default catalogflowSlice.reducer;
