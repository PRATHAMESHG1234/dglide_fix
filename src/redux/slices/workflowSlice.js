import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as WORKFLOW_SERVICE from '../../services/workFlow';

import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: true,
  workFlows: {},
  workFlow: {}
};

export const fetchWorkFlows = createAsyncThunk('fetchWorkFlows', async () => {
  const res = await WORKFLOW_SERVICE.fetchWorkFlows();
  return res.result;
});

export const fetchWorkflowByPagination = createAsyncThunk(
  'fetchWorkflowByPagination',
  async (data) => {
    const res = await WORKFLOW_SERVICE.fetchWorkflowByPagination(data);
    return res.result;
  }
);

export const fetchWorkFlow = createAsyncThunk(
  'fetchWorkFlow',
  async ({ workFlowId }) => {
    const data = await WORKFLOW_SERVICE.fetchWorkFlow(workFlowId);
    return data.result;
  }
);

export const fetchUpdatedDiagram = createAsyncThunk(
  'fetchUpdatedDiagram',
  async ({ workflow }, { dispatch }) => {
    const res = await WORKFLOW_SERVICE.fetchUpdatedDiagram(workflow);

    if (res.statusCode === 200) {
      notify.success(res.message);
    } else {
      notify.error(res.message || 'Operation Failed');
    }

    return res.result;
  }
);

export const createWorkFlow = createAsyncThunk(
  'createWorkFlow',
  async ({ workflow }, { dispatch }) => {
    const res = await WORKFLOW_SERVICE.createWorkFlow(workflow);

    if (res.statusCode === 200) {
      notify.success(res.message);
    } else {
      notify.error(res.message || 'Operation Failed');
    }

    return res.result;
  }
);

export const updateWorkFlow = createAsyncThunk(
  'updateWorkFlow',
  async ({ workflow }, { dispatch }) => {
    const res = await WORKFLOW_SERVICE.updateWorkFlow(workflow.uuid, workflow);

    if (res.statusCode === 200) {
      notify.success(res.message);
    } else {
      notify.error(res.message || 'Operation Failed');
    }

    return res.result;
  }
);

export const deleteWorkFlow = createAsyncThunk(
  'deleteWorkFlow',
  async ({ id }, { dispatch }) => {
    const res = await WORKFLOW_SERVICE.deleteWorkFlow(id);

    if (res.statusCode === 200) {
      notify.success(res.message);
    } else {
      notify.error(res.message || 'Operation Failed');
    }

    return res.result;
  }
);

export const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(fetchWorkFlows.pending, (state) => {
    //   state.isLoading = true;
    // });
    // builder.addCase(fetchWorkFlows.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.workFlows = action.payload;
    // });
    // builder.addCase(fetchWorkFlows.rejected, (state) => {
    //   state.isLoading = false;
    //   state.isError = true;
    // });
    builder.addCase(fetchWorkflowByPagination.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchWorkflowByPagination.fulfilled, (state, action) => {
      state.isLoading = false;
      state.workFlows = action.payload;
    });
    builder.addCase(fetchWorkflowByPagination.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchWorkFlow.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchWorkFlow.fulfilled, (state, action) => {
      state.isLoading = false;
      state.workFlow = action.payload;
    });
    builder.addCase(fetchWorkFlow.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createWorkFlow.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createWorkFlow.fulfilled, (state, action) => {
      state.isLoading = false;
      state.workFlows = [...state.workFlows, action.payload];
    });
    builder.addCase(createWorkFlow.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(updateWorkFlow.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateWorkFlow.fulfilled, (state, action) => {
      state.isLoading = false;
      // state.workFlows = state.workFlows?.map((app) => {
      //   if (app.workflowId === action.payload.workflowId) return action.payload;
      //   return app;
      // });
    });
    builder.addCase(updateWorkFlow.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteWorkFlow.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteWorkFlow.fulfilled, (state, action) => {
      state.isLoading = false;
      state.workFlows = state.workFlows?.filter(
        (app) => app.workflowId !== action.payload
      );
    });
    builder.addCase(deleteWorkFlow.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default workflowSlice.reducer;
