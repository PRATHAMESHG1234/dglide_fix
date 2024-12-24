import React, { useEffect, useState } from 'react';
import { MODAL } from '../../common/utils/modal-toggle';
import { useLocation, useNavigate } from 'react-router-dom';

import List from './Creator/CatalogSelectionList';
import ViewSelector from '../shared/ViewSelector';
import ColumnPreference from '../records/preference/ColumnPreference';
import { fetchFieldPreference } from '../../services/fieldPreference';
import { fetchFormByName } from '../../services/form';
import { fetchFieldsByFormId } from '../../services/field';

const CatalogflowList = ({ MyCatalogflow, modalActionHandler, pathname }) => {
  const navigate = useNavigate();

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [formdetail, setFormdetail] = useState();
  const [showColumnPreference, setShowColumnPreference] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [formData, setFormData] = useState();
  const [preferences, setPrefrences] = useState([]);
  const [fields, setFields] = useState([]);

  const FetchWorkFlowID = () => {
    const FormName = 'system_catelogflow';
    fetchFormByName(FormName).then((res) => {
      setFormdetail(res?.result);
    });
  };
  // const handleRowDoubleClick = (params) => {
  //   window.localStorage.setItem("survey-json", params?.row?.jsonStr);
  //   navigate(`/catalogflow/${params.id}`);
  // };
  // const handlePreview = (params) => {
  //   navigate(`creatorPreview/${params.id}`, {
  //     state: {
  //       data: params?.row,
  //     },
  //   });
  // };
  useEffect(() => {
    if (MyCatalogflow?.length > 0 && preferences?.length > 0) {
      // const keysData = Object.keys(MyCatalogflow[0]);

      const preferenceFieldNames = preferences?.map(
        (preference) => preference?.fieldName
      );
      const headers = preferenceFieldNames
        ?.filter(
          (key) =>
            key !== 'catalogFlowInfoId' &&
            key !== 'jsonStr' &&
            key !== 'dataStr' &&
            key !== 'logo' &&
            key !== 'logoBytes' &&
            key !== 'recordId'
        )
        .map((key) => {
          return {
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            field: key,
            flex: 1
          };
        });
      setColumns(headers);

      const modified = MyCatalogflow?.map((data) => {
        return {
          ...data,
          id: data?.catalogFlowInfoId
        };
      });
      setRows(modified);
    }
  }, [MyCatalogflow, preferences]);

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

  const goToModulePanel = (module) => {
    // navigate(`/app/${module.name}`);
  };
  const goToFields = (module) => {
    // navigate("/fields", {
    //   state: {
    //     moduleId: module?.moduleInfoId || state.selected.moduleInfoId,
    //   },
    // });
  };
  const goToRecordPanel = (row) => {
    if (pathname === '/catalogflow') {
      navigate(`/catalogflow/${row.uuid}`);
    } else if (pathname === '/portal') {
      navigate(`request/${row.uuid}`, {
        state: {
          data: row
        }
      });
    }
  };
  const columnPreferenceHandler = () => {
    fetchFieldPreference(formdetail?.formInfoId).then((data) => {
      setFormData(data);
      setShowColumnPreference(false);
    });
    setShowColumnPreference(false);
    setRefetch(!refetch);
  };
  return (
    <>
      <div>
        {columns.length > 0 ? (
          <List
            actionHandler={modalActionHandler}
            rows={rows}
            columns={columns}
            density="compact"
            onCreateNew={() => modalActionHandler(MODAL.create)}
            // onRowDoubleClick={handleRowDoubleClick}
            goToRecordPanel={goToRecordPanel}
            setShowColumnPreference={setShowColumnPreference}
          ></List>
        ) : (
          <div className="main_catalog_container">
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
    </>
  );
};

export default CatalogflowList;
