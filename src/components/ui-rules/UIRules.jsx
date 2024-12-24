import React, { useState } from 'react';

import AddEditUIRules from './AddEditUIRules';
import UIRulesDataTable from './UIRulesDataTable';
import {
  deleteUIRuleByRuleId,
  fetchUIRuleByRuleId,
  updateUIRule,
  createUIRule,
  fetchUIRulesByModuleOrFormId
} from '../../redux/slices/UIRuleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ConfirmationModal from '../shared/ConfirmationModal';
import { fetchFormsByModuleId } from '../../services/form';

const UIRules = () => {
  const { rules } = useSelector((state) => state.uiRule);

  const { currentModule } = useSelector((state) => state.current);
  const dispatch = useDispatch();
  const [preview, setPreview] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [conformationForDelete, setConformationForDelete] = useState(false);
  const [forms, setForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rows, setRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    if (rules) {
      setTotalRecords(rules?.length);
      const Data = rules?.map((rule) => {
        return {
          id: rule?.ruleAndValidationInfoId,
          name: rule?.ruleName,
          event: rule?.event,
          description: rule?.ruleDescription,
          enable: rule?.enable ? rule?.enable : false,
          ruleData: rule
        };
      });
      setRows(Data);
    }
  }, [rules]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentModule) return;

      const moduleId = currentModule.moduleInfoId || 0;

      const data = {
        formInfoId: 0,
        keyword: '',
        moduleInfoId: moduleId,
        pagination: {
          pageSize: rowsPerPage,
          page: currentPage - 1
        },
        sort: {
          sortBy: '',
          sortOrder: ''
        }
      };

      dispatch(fetchUIRulesByModuleOrFormId({ data }));

      const res = await fetchFormsByModuleId(moduleId);

      setForms(res?.result || []);
    };

    fetchData();
  }, [currentModule, refetch]);

  const onActionDelete = (id) => {
    if (id) {
      setConformationForDelete(true);
      setSelectedRuleId(id);
    }
  };

  const onActionEdit = (id) => {
    if (id) {
      dispatch(fetchUIRuleByRuleId(id))
        .unwrap()
        .then(() => {
          setSelectedRuleId(id);
          setTimeout(() => {
            setPreview(!preview);
          }, 100);
        });
    }
  };

  const deleteHandler = () => {
    if (!selectedRuleId) return;

    dispatch(deleteUIRuleByRuleId(selectedRuleId));
    setConformationForDelete(false);
  };

  const onCloseDrawer = () => {
    setPreview(false);
    setSelectedRuleId(null);
  };

  const onSubmitHandler = (payload, id) => {
    if (id) {
      dispatch(updateUIRule({ id, rule: payload }))
        .unwrap()
        .then(() => {
          onCloseDrawer();
          setSelectedRuleId(null);
        });
    } else {
      dispatch(createUIRule(payload))
        .unwrap()
        .then(() => {
          onCloseDrawer();
          setSelectedRuleId(null);
        });
    }
  };

  return (
    <div>
      <UIRulesDataTable
        preview={preview}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        setRefetch={setRefetch}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalRecords={totalRecords}
        setPreview={setPreview}
        onActionDelete={onActionDelete}
        onActionEdit={onActionEdit}
        onSubmitHandler={onSubmitHandler}
        setSelectedRuleId={setSelectedRuleId}
        rows={rows}
      />
      <AddEditUIRules
        preview={preview}
        onCloseDrawer={onCloseDrawer}
        selectedRuleId={selectedRuleId}
        forms={forms}
        setSelectedRuleId={setSelectedRuleId}
        onSubmitHandler={onSubmitHandler}
      />
      {conformationForDelete && (
        <ConfirmationModal
          open={conformationForDelete}
          heading="Are you sure you want to delete this record ?"
          onConfirm={deleteHandler}
          onCancel={() => setConformationForDelete(false)}
          secondButtonText="Delete"
        />
      )}
    </div>
  );
};

export default UIRules;
