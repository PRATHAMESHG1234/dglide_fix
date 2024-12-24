import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as USER_SERVICE from '../../services/uiRule';
import { notify } from '../../hooks/toastUtils';

const initialState = {
  isLoading: false,
  isError: false,
  rules: [],
  rule: {}
};

export const fetchUIRulesByFormId = createAsyncThunk(
  'fetchUIRulesByFormId',
  async (formInfoId) => {
    const data = await USER_SERVICE.fetchUIRulesByFormId(formInfoId);
    return data.result;
  }
);

export const fetchUIRuleByRuleId = createAsyncThunk(
  'fetchUIRuleByRuleId',
  async (id) => {
    const data = await USER_SERVICE.fetchUIRuleByRuleId(id);
    return data.result;
  }
);

export const fetchUIRulesByModuleOrFormId = createAsyncThunk(
  'fetchUIRulesByModuleOrFormId',
  async ({ data }) => {
    const res = await USER_SERVICE.fetchUIRulesByModuleOrFormId(data);
    return res;
  }
);

export const createUIRule = createAsyncThunk(
  'createUIRule',
  async (rule, { dispatch }) => {
    const data = await USER_SERVICE.createUIRule(rule);
    if (data.statusCode === 200) {
      notify.success('UI rule created successfully.');

      return data.result;
    } else {
      notify.error(data.message || 'Failed to create UI rule.');
      return Promise.reject(data.message);
    }
  }
);

export const updateUIRule = createAsyncThunk(
  'updateUIRule',
  async ({ id, rule }, { dispatch }) => {
    const response = await USER_SERVICE.updateUIRule(id, rule);
    if (response.statusCode === 200) {
      notify.success('UI rule updated successfully.');
      return response.result;
    } else {
      notify.error(response.message || 'Failed to update UI rule.');
      return Promise.reject(response.message);
    }
  }
);

export const deleteUIRuleByRuleId = createAsyncThunk(
  'deleteUIRuleByRuleId',
  async (id, { dispatch }) => {
    const data = await USER_SERVICE.deleteUIRuleByRuleId(id);
    if (data.statusCode === 200) {
      notify.success('Rule deleted successfully.');
      return data.result;
    } else {
      notify.error(data.message || 'Failed to delete UI rule.');
      return Promise.reject(data.message);
    }
  }
);

export const deleteUIRuleByFormId = createAsyncThunk(
  'deleteUIRuleByFormId',
  async (formId, { dispatch }) => {
    const data = await USER_SERVICE.deleteUIRuleByFormId(formId);
    if (data.statusCode === 200) {
      notify.success('Rules deleted successfully for the form.');
      return data.result;
    } else {
      notify.error(data.message || 'Failed to delete rules for the form.');
      return Promise.reject(data.message);
    }
  }
);

const uiRulesSlice = createSlice({
  name: 'uiRule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUIRulesByFormId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUIRulesByFormId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rules = action.payload;
    });
    builder.addCase(fetchUIRulesByFormId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchUIRuleByRuleId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUIRuleByRuleId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rule = action.payload;
    });
    builder.addCase(fetchUIRuleByRuleId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(fetchUIRulesByModuleOrFormId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUIRulesByModuleOrFormId.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(action.payload?.data)) {
        state.rules = action.payload?.data;
      } else {
        console.warn('Expected array but received:', action.payload?.data);
        state.rules = [];
      }
    });
    builder.addCase(fetchUIRulesByModuleOrFormId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(createUIRule.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createUIRule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rules.push(action.payload);
    });
    builder.addCase(createUIRule.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(updateUIRule.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUIRule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.rules = state.rules.map((rule) =>
        rule.ruleAndValidationInfoId === action.payload.ruleAndValidationInfoId
          ? action.payload
          : rule
      );
    });
    builder.addCase(updateUIRule.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteUIRuleByRuleId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUIRuleByRuleId.fulfilled, (state, action) => {
      state.isLoading = false;

      state.rules = state.rules.filter(
        (rule) => rule.ruleAndValidationInfoId !== action.payload
      );
    });
    builder.addCase(deleteUIRuleByRuleId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addCase(deleteUIRuleByFormId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUIRuleByFormId.fulfilled, (state, action) => {
      state.isLoading = false;

      state.rules = state.rules.filter(
        (rule) => rule.formInfoId !== action.payload
      );
    });
    builder.addCase(deleteUIRuleByFormId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  }
});

export default uiRulesSlice.reducer;
