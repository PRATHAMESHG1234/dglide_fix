import { configureStore } from '@reduxjs/toolkit';

import actionReducer from './slices/actionSlice';
import fieldGroupReducer from './slices/fieldGroupSlice';
import dashboardReducer from './slices/dashboardSlice';
import authReducer from './slices/authSlice';
import catalogflowReducer from './slices/catalogFlowSlice';
import currentReducer from './slices/currentSlice';
import fieldReducer from './slices/fieldSlice';
import formReducer from './slices/formSlice';
import groupReducer from './slices/groupSlice';
import moduleReducer from './slices/moduleSlice';
import tableReducer from './slices/tableSlice';
import attachmentReducer from './slices/attachmentSlice';
import userReducer from './slices/userSlice';
import workflowReducer from './slices/workflowSlice';
import dumpReducer from './slices/dumpSlice';
import SidebarReducer from './slices/sidebarSlice';
import uiRuleReducer from './slices/UIRuleSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    module: moduleReducer,
    form: formReducer,
    action: actionReducer,
    fieldGroup: fieldGroupReducer,
    dashboard: dashboardReducer,
    field: fieldReducer,
    table: tableReducer,
    attachment: attachmentReducer,
    current: currentReducer,
    user: userReducer,
    group: groupReducer,
    workflow: workflowReducer,
    catalogFlow: catalogflowReducer,
    dump: dumpReducer,
    sidebar: SidebarReducer,
    uiRule: uiRuleReducer
  }
});

export default store;
