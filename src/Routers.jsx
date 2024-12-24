import { Outlet, Route, Routes } from 'react-router-dom';

//Auth
import AuthGuard from './components/shared/AuthGuard';
import NavBar from './components/shared/nav-bar/NavBar';

//Pages
import Field from './pages/Field';
import Form from './pages/Form';

import ModifyRecord from './pages/ModifyRecord';
import Module from './pages/Module';
import Records from './pages/Records';

//Security

//Editors
import Articles from './components/articles/Articles';
import TextEditor from './components/articles/TextEditor';
import CatalogFlow from './components/catelogflow/CatalogFlow';
import CatalogFlowEditer from './components/catelogflow/CatalogFlowEditer';
import CreatorPreview from './components/catelogflow/Creator/CreatorPreview';
import MyChatbot from './components/chatbot/Chatbot';
import WorkFlowEditer from './components/workflow/WorkFlowEditer';
import Workflow from './components/workflow/Workflow';

import Config from './components/dashboard/config/Config';
import Build from './components/dashboard/dashboardBuild/Build';
import { ArtificialInteligents } from './components/ArtificialInteligents';
import UnderConstruction from './components/UnderConstruction';
import AddEditUser from './components/admin/AddEditUser';
import { Channels } from './components/admin/Admin-Tabs/Channels';
import { ImportExport } from './components/admin/Admin-Tabs/ImportExport';
import { Operation } from './components/admin/Admin-Tabs/Operation';
import { UserProfile } from './components/admin/Admin-Tabs/UserProfile';
import DataTable from './components/admin/DataTable';
import Home from './components/admin/Home';
import AddEditTemplate from './components/admin/template/AddEditTemplate';
import Template from './components/admin/template/Template';
import MyRequestList from './components/catelogflow/Creator/MyRequestList';
import { MyrequestDetail } from './components/catelogflow/Creator/MyrequestDetail';
import Dashboard from './components/dashboard/Dashboard';
import Action from './components/form/actions/Action';
import FieldGroup from './components/form/field-group/FieldGroup';
import Schema from './components/form/schema/Schema';
import { DumpList } from './components/import-Export/DumpList';
import { ExportDetail } from './components/import-Export/ExportDetail';
import ImportExportData from './components/import-Export/ImportExportData';
import DataGridTable from './components/records/data-grid/DataGridTableX';
import GlobleSearch from './components/shared/nav-bar/GlobleSearch';
import TreeStructure from './components/sortable-tree/TreeStructure';
import UIRules from './components/ui-rules/UIRules';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Login from './pages/Login/Login';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import { DataGridAdmin } from './components/admin/Admin-Tabs/DataGridAdmin';
import Website from './website/Website';
import { EtlLanding } from './components/admin/Admin-Tabs/ETLintegration/EtlLanding';
import JobEditor from './components/admin/Admin-Tabs/ETLintegration/Editor';
import { useSelector } from 'react-redux';
import CreateDashboard from './components/dashboard/dashboardBuild/CreateDashboard';

const Routers = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const RoleGuard = ({ allowedRoles, children }) => {
    if (!allowedRoles.includes(currentUser?.role?.name)) {
      return <UnderConstruction />;
    }
    return children;
  };
  return (
    <div>
      <Routes>
        <Route path="/maintenance" element={<UnderConstruction />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/website" element={<Website />} />
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={currentUser?.role?.level == 1 ? <Module /> : <Dashboard />}
          />
          <Route path="app/:moduleName/:formName" element={<Records />} />
          <Route
            path="app/:moduleName/:formName/modify"
            element={<ModifyRecord />}
          />

          <Route path="/globleSearch" element={<GlobleSearch />} />

          <Route path="account-settings" element={<Outlet />}>
            <Route path="" element={<AccountSettings />} />
          </Route>

          <Route path="articles" element={<Outlet />}>
            <Route path="" element={<Articles />} />
            <Route path="editor" element={<TextEditor />} />
          </Route>
          <Route
            path=""
            element={
              <AuthGuard>
                {/* <RoleGuard allowedRoles={['Super Admin']}> */}
                <Outlet />
                {/* </RoleGuard> */}
              </AuthGuard>
            }
          >
            <Route path="fields" element={<Field />} />
            <Route path="catalogflow" element={<Outlet />}>
              <Route path="" element={<CatalogFlow />} />
              <Route
                path=":catalogFlowInfoId"
                element={<CatalogFlowEditer />}
              />
              <Route
                path="creatorPreview/:catalogFlowInfoId"
                element={<CreatorPreview />}
              />
            </Route>
            <Route path="portal" element={<Outlet />}>
              <Route path="" element={<CatalogFlow />} />
              <Route
                path="request/:catalogFlowInfoId"
                element={<CreatorPreview />}
              />
              <Route path="myRequest" element={<MyRequestList />} />
              <Route path="myRequest/:uuid" element={<MyrequestDetail />} />
            </Route>
            <Route path="workflow" element={<Outlet />}>
              <Route path="" element={<Workflow />} />
              <Route path=":workFlowId" element={<WorkFlowEditer />} />
            </Route>
            <Route path="chatbot" element={<Outlet />}>
              <Route path="" element={<MyChatbot />} />
            </Route>
            <Route path="import-export" element={<Outlet />}>
              <Route path="" element={<ImportExportData />} />
              <Route path="export-detail" element={<ExportDetail />} />
              <Route path="dump" element={<DumpList />} />
            </Route>
            <Route path="ai" element={<ArtificialInteligents />} />
          </Route>

          <Route
            path="admin"
            element={
              <AuthGuard>
                {/* <RoleGuard allowedRoles={['Super Admin']}> */}
                <Outlet />
                {/* </RoleGuard> */}
              </AuthGuard>
            }
          >
            <Route path="user-profile" element={<UserProfile />}></Route>
            <Route path="user-profile/:formname" element={<DataGridAdmin />} />
            <Route path="channels" element={<Channels />} />
            <Route path="channels/:formname" element={<DataGridAdmin />} />
            <Route path="operation" element={<Operation />} />
            <Route path="operation/:formname" element={<DataGridAdmin />} />
            <Route path="importExport" element={<ImportExport />} />
            <Route path="integration" element={<EtlLanding />} />
            <Route path="integration/job/:jobId" element={<JobEditor />} />

            <Route path="user" element={<Outlet />}>
              <Route path="datatable" element={<DataTable />} />
              <Route path="modify" element={<AddEditUser />} />
            </Route>
            <Route path="form-template" element={<Outlet />}>
              <Route path="" element={<Template />} />
              <Route path="modify" element={<AddEditTemplate />} />
            </Route>
          </Route>

          <Route
            path="app"
            element={
              <AuthGuard>
                {/* <RoleGuard allowedRoles={['Super Admin']}> */}
                <Outlet />
                {/* </RoleGuard> */}
              </AuthGuard>
            }
          >
            <Route path=":moduleName" element={<Form />} />

            <Route path=":moduleName/dashboard">
              <Route path="manage-charts" element={<Config />} />
              <Route path="build-dash" element={<Build />} />
              <Route path="analytics" element={<Dashboard />} />
              <Route path="create" element={<CreateDashboard />} />
            </Route>

            <Route path=":moduleName" element={<Outlet />}>
              <Route path="ui-rules" element={<UIRules />} />
              <Route path="actions" element={<Action />} />
            </Route>
            <Route
              path=":moduleName/:formName/field-groups"
              element={<FieldGroup />}
            />
            <Route path=":moduleName/:formName/schema" element={<Schema />} />

            <Route path=":moduleName/:formName/x" element={<DataGridTable />} />
            <Route
              path=":moduleName/:formName/tree-structure"
              element={<TreeStructure />}
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default Routers;

const Layout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);
