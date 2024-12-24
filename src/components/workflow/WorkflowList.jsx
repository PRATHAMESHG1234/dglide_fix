import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyDataTable } from '../records/data-grid/DataTable';
import ViewSelector from '../shared/ViewSelector';
import { MODAL } from '../../common/utils/modal-toggle';
import { fetchFormByName } from '../../services/form';
import ColumnPreference from '../records/preference/ColumnPreference';
import { fetchFieldPreference } from '../../services/fieldPreference';
import { fetchFieldsByFormId } from '../../services/field';

const WorkflowList = ({ workFlows, modalActionHandler, goToRecordPanel }) => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [formdetail, setFormdetail] = useState();
  const [showColumnPreference, setShowColumnPreference] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [formData, setFormData] = useState();
  const [fields, setFields] = useState([]);
  const [preferences, setPrefrences] = useState([]);

  const FormName = 'system_workflow';
  const FetchWorkFlowID = () => {
    fetchFormByName(FormName).then((res) => {
      setFormdetail(res?.result);
    });
  };

  useEffect(() => {
    FetchWorkFlowID();
    if (formdetail) {
      fetchFieldsByFormId(formdetail?.formInfoId).then((res) => {
        setFields(res?.result);
      });

      fetchFieldPreference(formdetail?.formInfoId).then((res) => {
        setPrefrences(res?.result);
      });
    }
  }, [showColumnPreference, formdetail?.formInfoId]);

  useEffect(() => {
    if (workFlows?.length > 0 && preferences?.length > 0) {
      // const keysData = Object.keys(workFlows[0]);

      const preferenceFieldNames = preferences?.map(
        (preference) => preference?.fieldName
      );

      const headers = preferenceFieldNames
        ?.filter(
          (key) =>
            key !== 'workflowId' && key !== 'bpmnStr' && key !== 'jsonStr'
        )
        ?.map((key) => {
          if (key === 'tableName') {
            return {
              headerName: 'Table',
              field: key,
              flex: 1
            };
          } else {
            return {
              headerName: key.charAt(0).toUpperCase() + key.slice(1),
              field: key,
              flex: 1
            };
          }
        });

      const modified = workFlows?.map((data) => {
        return {
          ...data,
          id: data.uuid,
          tableName:
            data.tableName?.charAt(0).toUpperCase() + data.tableName?.slice(1)
        };
      });
      setRows(modified);
      setColumns(headers);
    }
  }, [workFlows, preferences]);

  const columnPreferenceHandler = () => {
    fetchFieldPreference(formdetail?.formInfoId).then((data) => {
      setFormData(data);
      setShowColumnPreference(false);
    });
    setShowColumnPreference(false);
    setRefetch(!refetch);
  };

  return (
    <div style={{ width: '100%' }}>
      {columns.length > 0 ? (
        <MyDataTable
          // onRowDoubleClick={handleRowDoubleClick}
          fullWidth
          rows={rows}
          columns={columns}
          density="compact"
          disableColumnMenu
          goToPanel={goToRecordPanel}
          modalActionHandler={modalActionHandler}
          style={{ height: 'calc(100vh - 90px)' }}
          setShowColumnPreference={setShowColumnPreference}
        ></MyDataTable>
      ) : (
        <div className="main_catalog_container" style={{ paddingTop: '12px' }}>
          <ViewSelector
            onCreateNew={() => modalActionHandler(MODAL.create)}
            type="forms"
          />
          <div className="view_catalog_container flex items-center justify-center">
            No data available
          </div>
        </div>
      )}

      {showColumnPreference && (
        <ColumnPreference
          open={showColumnPreference}
          onColumnPreference={columnPreferenceHandler}
          setShowColumnPreference={setShowColumnPreference}
          formInfoId={formdetail?.formInfoId}
          fields={fields}
          preferences={preferences}
        />
      )}
    </div>
  );
};

export default WorkflowList;
