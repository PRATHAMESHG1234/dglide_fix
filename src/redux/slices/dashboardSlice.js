import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as CHARTS_SERVICE from '../../services/chart';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  chart: null,
  charts: [],
  dashboard: [],
  dashboards: []
};

export const fetchChart = createAsyncThunk(
  'fetchChart',
  async ({ dashboardItemInfoId }) => {
    const res = await CHARTS_SERVICE.fetchChart(dashboardItemInfoId);
    return res;
  }
);

export const fetchCharts = createAsyncThunk(
  'fetchCharts',
  async ({ moduleInfoId }) => {
    const res = await CHARTS_SERVICE.fetchCharts(moduleInfoId);
    return res;
  }
);

export const fetchChartDetailByModuleInfoId = createAsyncThunk(
  'fetchChartDetailByModuleInfoId',
  async ({ moduleInfoId }) => {
    const res =
      await CHARTS_SERVICE.fetchChartDetailByModuleInfoId(moduleInfoId);
    return res;
  }
);

export const fetchDashboardsByModuleInfoId = createAsyncThunk(
  'fetchDashboardsByModuleInfoId',
  async ({ moduleInfoId }) => {
    const res =
      await CHARTS_SERVICE.fetchDashboardsByModuleInfoId(moduleInfoId);
    return res;
  }
);

export const fetchDashboardByDashboardInfoId = createAsyncThunk(
  'fetchDashboardByDashboardInfoId',
  async ({ dashboardInfoId, data }) => {
    const res = await CHARTS_SERVICE.fetchDashboardByDashboardInfoId(
      dashboardInfoId,
      data
    );
    return res;
  }
);

export const createChart = createAsyncThunk(
  'createChart',
  async ({ data }, { dispatch }) => {
    const res = await CHARTS_SERVICE.createChart(data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const createDashboard = createAsyncThunk(
  'createDashboard',
  async ({ data }, { dispatch }) => {
    const res = await CHARTS_SERVICE.createDashboard(data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const updateDashboard = createAsyncThunk(
  'updateDashboard',
  async ({ dashboardInfoId, data }, { dispatch }) => {
    const res = await CHARTS_SERVICE.updateDashboard(dashboardInfoId, data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const updateChart = createAsyncThunk(
  'updateChart',
  async ({ dashboardItemInfoId, data }, { dispatch }) => {
    const res = await CHARTS_SERVICE.updateChart(dashboardItemInfoId, data);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const deleteDashboard = createAsyncThunk(
  'deleteDashboard',
  async ({ dashboardInfoId }, { dispatch }) => {
    const res = await CHARTS_SERVICE.deleteDashboard(dashboardInfoId);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const deleteChart = createAsyncThunk(
  'deleteChart',
  async ({ dashboardItemInfoId }, { dispatch }) => {
    const res = await CHARTS_SERVICE.deleteChart(dashboardItemInfoId);
    if (res.statusCode === 200) {
      notify.success(res.message || 'Operation Failed');
    } else {
      notify.error(res.message || 'Operation Failed');
    }
    return res.result;
  }
);

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCharts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCharts.fulfilled, (state, chart) => {
      state.isLoading = false;
      state.charts = chart.payload;
    });
    builder.addCase(fetchCharts.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchDashboardByDashboardInfoId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchDashboardByDashboardInfoId.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
      }
    );
    builder.addCase(fetchDashboardByDashboardInfoId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchDashboardsByModuleInfoId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchDashboardsByModuleInfoId.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.dashboards = action.payload;
      }
    );
    builder.addCase(fetchDashboardsByModuleInfoId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchChart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChart.fulfilled, (state, chart) => {
      state.isLoading = false;
      state.charts = chart.payload;
    });
    builder.addCase(fetchChart.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createChart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createChart.fulfilled, (state, chart) => {
      state.isLoading = false;
      state.charts = [...state.charts, chart.payload];
    });
    builder.addCase(createChart.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    /////////CREATE DASHBOARD////////////////
    builder.addCase(createDashboard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dashboards = [...state.dashboards, action.payload];
    });
    builder.addCase(createDashboard.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    /////////CREATE DASHBOARD////////////////

    /////////UPDATE DASHBOARD////////////////
    builder.addCase(updateDashboard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.dashboards = state.dashboards?.map((app) => {
          if (app.dashboardInfoId === action.payload.dashboardInfoId)
            return action.payload;
          return app;
        });
      }
    });
    builder.addCase(updateDashboard.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    /////////UPDATE DASHBOARD////////////////

    /////////DELETE DASHBOARD////////////////

    builder.addCase(deleteDashboard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dashboards = state.charts?.filter(
        (app) => app.dashboardInfoId !== action.payload
      );
    });
    builder.addCase(deleteDashboard.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    /////////DELETE DASHBOARD////////////////

    builder.addCase(updateChart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateChart.fulfilled, (state, chart) => {
      state.isLoading = false;
      if (chart.payload) {
        state.charts = state.charts?.map((app) => {
          if (app.dashboardItemInfoId === chart.payload.dashboardItemInfoId)
            return chart.payload;
          return app;
        });
      }
    });
    builder.addCase(updateChart.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteChart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteChart.fulfilled, (state, chart) => {
      state.isLoading = false;
      state.charts = state.charts?.filter(
        (app) => app.dashboardItemInfoId !== chart.payload
      );
    });
    builder.addCase(deleteChart.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default chartSlice.reducer;
