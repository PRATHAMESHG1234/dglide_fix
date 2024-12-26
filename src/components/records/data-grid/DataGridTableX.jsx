import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { colors } from '../../../common/constants/styles';
import { generateUId } from '../../../common/utils/helpers';

import GridTable from '../../../elements/GridTable';
import { Button } from '@/componentss/ui/button';

import { fetchActions } from '../../../redux/slices/actionSlice';
import { setSelectedRecordId } from '../../../redux/slices/currentSlice';
import { fetchFieldPreference } from '../../../redux/slices/fieldSlice';

import {
  fetchRecordById,
  fetchRecords,
  fetchReferenceFieldRecordById
} from '../../../redux/slices/tableSlice';
import { fetchFieldObjectByFormId } from '../../../services/field';
import { createFieldPreference } from '../../../services/fieldPreference';
import {
  deleteTableRecords,
  fetchCountByFilter,
  updateMultipleTableRecord
} from '../../../services/table';
import ConfirmationModal from '../../shared/ConfirmationModal';
import ImportData from '../data-import/ImportData';
import FilterFromStatus from '../preference/FilterFromStatus';
import SearchPreference from '../preference/search-preference/SearchPreference';
import ActionList from './ActionList';

import { CirclePlus, Filter, Plus } from 'lucide-react';
import { notify } from '../../../hooks/toastUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

const DataGridTableX = ({
  dataExport,
  setSelectedCard,
  setConditionsForExport
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const { tableData, tableRecord } = useSelector((state) => state.table);
  const { preferences, fields } = useSelector((state) => state.field);

  const { currentForm } = useSelector((state) => state.current);

  const { actions } = useSelector((state) => state.action);
  const [fieldLabels, setFieldLabels] = useState({});
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [where, setWhere] = useState([]);
  const [sort, setSort] = useState([]);
  const [preview, setPreview] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [fullSize, setFullSize] = useState(true);
  const [conformationForDelete, setConformationForDelete] = useState(false);
  const [updateRecordData, setUpdateRecordData] = useState(false);
  const [selectedActionData, setSelectedActionData] = useState([]);
  const { selectedRecordId } = useSelector((state) => state.current);
  const [selectedCondition, setSelectedCondition] = useState([]);
  const [filterCount, setFilterCount] = useState([]);
  const [selectedFilterTab, setSelectedFilterTab] = useState('');
  const [predictField, setPredictField] = useState({});
  const [fieldsData, setFieldsData] = useState([]);
  const [openImportDrawer, setImportDrawer] = useState(false);
  const [data, setData] = useState();
  const [checkedId, setCheckedId] = useState();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const location = useLocation();
  const [conditions, setConditions] = useState([
    {
      conditionId: generateUId(),
      fieldInfoId: 0,
      operator: '',
      value: '',
      category: ''
    }
  ]);

  useEffect(() => {
    if (currentForm) {
      fetchFieldObjectByFormId(currentForm.formInfoId).then((fieldObj) =>
        setFieldLabels(fieldObj)
      );
      dispatch(fetchActions({ formInfoId: currentForm.formInfoId }));
    }
  }, [currentForm]);

  useEffect(() => {
    if (!fields) return;

    setFieldsData(fields);
  }, [fields]);

  useEffect(() => {
    setRefetch(!refetch);
  }, [currentForm]);

  useEffect(() => {
    if (setSelectedCard && selectedRows) {
      setSelectedCard(selectedRows);
    }
  }, [selectedRows]);

  useEffect(() => {
    if (currentForm && checkedId) {
      dispatch(
        fetchRecordById({
          tableName: currentForm?.name,
          UUID: checkedId
        })
      )
        .then((response) => {
          setData(response.payload);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentForm, checkedId]);

  useEffect(() => {
    if (currentForm && refetch) {
      setLoading(true);
      dispatch(
        fetchRecords({
          formName: currentForm.name,
          data: {
            pagination: {
              pageSize: rowsPerPage,
              page: currentPage - 1
            },
            where,
            sort
          }
        })
      ).then((data) => {
        setTotalRecords(data?.payload?.totalRecords);
      });
      setRefetch(false);
      setLoading(false);
    }
  }, [currentForm, refetch]);
  const apiData = location.state?.data;

  useEffect(() => {
    if (apiData?.length > 0) {
      searchFilterHandler(apiData);
    }
  }, [apiData]);
  useEffect(() => {
    if (selectedRecordId) {
      const selected = [selectedRecordId];
      setSelectedRows(selected);
    }
  }, [selectedRecordId]);

  useEffect(() => {
    if (typeof setConditionsForExport === 'function') {
      setConditionsForExport(where);
    }
  }, [where]);

  const searchFilterHandler = (conditions) => {
    setShowSearchFilter(false);
    setWhere(conditions);
    setRefetch(!refetch);
    if (conditions) {
      const lastIndex = conditions?.length - 1;
      if (
        selectedField?.fieldInfoId === conditions[lastIndex]?.fieldInfoId &&
        conditions[lastIndex].operator === '='
      ) {
        setSelectedFilterTab(conditions[lastIndex].value);
      } else {
        setSelectedFilterTab('');
      }
    }
  };

  const handledRowClick = (selected) => {
    if (currentForm?.name === 'requests') {
      dispatch(setSelectedRecordId({ recordId: selected.data.id }));
      goToDataManagement('edit', selected.data.id);
    } else {
      dispatch(setSelectedRecordId({ recordId: selected.data.id }));
      // setPreview(true);
      goToDataManagement('edit', selected.data.id);
    }
  };

  const goToDataManagement = (type, rowId) => {
    if (type === 'edit') {
      dispatch(setSelectedRecordId({ recordId: rowId }));
      navigate(`modify?id=${rowId}`);
      return;
    }
    if (type === 'minimalView') {
      dispatch(setSelectedRecordId({ recordId: 0 }));
      navigate(`modify?view-type=minimal`);
    } else {
      dispatch(setSelectedRecordId({ recordId: 0 }));
      navigate('modify');
    }
  };

  const hiddenFileInput = React.useRef(null);
  const onImportFile = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };

  const columnPreferenceHandler = async (formId, data) => {
    const fieldPreference = createFieldPreference(formId, {
      fieldNames: data
    });

    await fieldPreference;
    fieldPreference.then((data) => {
      if (data.statusCode === 200) {
        notify.success('Column Preference successful');
      } else {
        notify.error('Column Preference failed');
      }
    });
    dispatch(fetchFieldPreference({ formInfoId: currentForm.formInfoId }));
    setRefetch(true);
  };

  const onActionClickHandler = (action) => {
    if (action.type === 'url') {
      const option = action?.options[0];
      if (option?.url.length === 0) {
        alert('selected url is blank');
      } else {
        const openInNewTab = (url) => {
          const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
          if (newWindow) newWindow.opener = null;
        };
        openInNewTab(option?.url);
      }
    }

    if (selectedRows?.length <= 0 && action.type !== 'url') {
      alert('Please select one or more records to update');
      return;
    }
    if (action.type === 'Update') {
      const actionData = action.options.map((option) => {
        const field = fields?.find(
          (field) => field.fieldInfoId === option.fieldInfoId
        );

        if (option && field) {
          return {
            fieldName: field?.name,
            value: option?.value
          };
        }
      });

      handleUpdateRecord(actionData);
    }
    if (action.type === 'REST API') {
      const url = action?.options[0].url;
      const headers =
        action?.options[0].headerData &&
        JSON.parse(action?.options[0].headerData);
      const payload =
        action?.options[0].payload && JSON.parse(action?.options[0].payload);
      const replacePlaceholders = (obj, placeholderPrefix, record) => {
        const regex = new RegExp(`{${placeholderPrefix}\\.(\\w+)}`, 'g');
        if (typeof obj === 'string') {
          return obj
            .replace(regex, (match, key) => {
              return record[key] !== undefined && record[key] !== ''
                ? record[key]
                : '';
            })
            .trim();
        } else if (typeof obj === 'object' && obj !== null) {
          const newObj = {};
          for (let key in obj) {
            newObj[key] = replacePlaceholders(
              obj[key],
              placeholderPrefix,
              record
            );
          }
          return newObj;
        }
        return obj;
      };

      const updatedPayload = replacePlaceholders(
        payload,
        'ticket',
        tableRecord
      );

      async function RestApiCall() {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              ...headers,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPayload, null, 2)
          });

          const data = await res.json();
          const dataKeysArr = Object.keys(data);

          const fieldData = action.options[0].fieldData;

          const predictedDataArr = fieldData.map((f) => {
            if (!dataKeysArr.includes(f.fieldDataValue)) return;
            const field = fields?.find(
              (field) => field.fieldInfoId === f.fieldDataLabel
            );
            return { [field.label]: data[f.fieldDataValue] };
          });
          const updatedActionOptionsData = await action.options.map(
            (option) => {
              const fieldData = option?.fieldData.map((field) => {
                if (field && data) {
                  return {
                    value: data,
                    field: field
                  };
                }
              });
              return fieldData;
            }
          );
          const actionData = updatedActionOptionsData[0]?.map((f) => {
            const field = fields?.find(
              (field) => field.fieldInfoId === f.field.fieldDataLabel
            );
            const fieldValue = f.field.fieldDataValue;
            const value = Object.fromEntries(
              Object.entries(f.value).filter(([k]) => [fieldValue].includes(k))
            );
            return {
              fieldName: field?.name,
              value: value[fieldValue] || null
            };
          });

          const referanceFieldData = async () => {
            try {
              const res = await dispatch(
                fetchReferenceFieldRecordById({
                  formName: currentForm?.name,
                  fieldName: actionData[0]?.fieldName,
                  id: data?.y_label
                })
              );
              const fieldValue = res?.payload?.result?.group_name;
              const fieldLabel = actionData[0]?.fieldName;
              setPredictField({ label: [fieldLabel], value: fieldValue });
            } catch (error) {
              console.error(
                'Error fetching Reference Field Record detail:',
                error
              );
            }
          };

          const recordUpdateConf = action.options[0].isRequireConformation;

          if (recordUpdateConf) {
            setSelectedActionData(actionData);
            setUpdateRecordData(true);
          } else {
            handleUpdateRecord(actionData);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

      RestApiCall();
    }
  };

  const CustomToolbar = () => {
    return (
      <div
        className={`flex w-full items-center justify-between gap-5 rounded-xl`}
      >
        <div
          className={`relative flex cursor-pointer items-center space-x-1 rounded-lg`}
        >
          <Tooltip>
            <TooltipTrigger>
              <Filter
                size={20}
                onClick={() => setShowSearchFilter(true)}
                className="text-secondary"
              />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="mt-1">
              <p>Filters</p>
            </TooltipContent>
          </Tooltip>

          {selectedCondition.length > 0 && (
            <CirclePlus
              size={16}
              className={`absolute right-[-0.8rem] top-[-0.4rem] cursor-pointer rounded-full bg-primary text-white`}
              onClick={() => {
                searchFilterHandler([
                  {
                    fieldInfoId: 0,
                    operator: '',
                    value: ''
                  }
                ]);
                setSelectedCondition([]);
                setConditions([
                  {
                    conditionId: generateUId(),
                    fieldInfoId: 0,
                    operator: '',
                    value: '',
                    operatorType: ''
                  }
                ]);
              }}
            />
          )}
        </div>

        <FilterFromStatus
          onSearchFilter={searchFilterHandler}
          selectedFilterTab={selectedFilterTab}
          selectedCondition={selectedCondition}
          filterCount={filterCount}
          field={selectedField}
        />

        {!dataExport && (
          <div className="flex flex-row items-center gap-2 space-x-1">
            <ActionList
              Key="dataGrid"
              buttonColor={colors.primary.main}
              goToDataManagement={goToDataManagement}
              onActionClickHandler={onActionClickHandler}
              setDeleteRecordData={setConformationForDelete}
              selectedRowsLength={selectedRows?.length}
              actions={actions}
              onImportFile={onImportFile}
            >
              <span onClick={() => goToDataManagement('minimalView')}>
                Minimal View
              </span>
              <span
                className="flex w-full items-center justify-start gap-2"
                style={{ color: '#1976d1' }}
                onClick={() => setImportDrawer(true)}
              >
                Import
              </span>
            </ActionList>
            {currentUser?.roles?.some((role) => role.level !== '3') && (
              <Button
                onClick={goToDataManagement}
                size="sm"
                className="font-bold text-white"
              >
                <Plus size={16} strokeWidth={3} className="text-white" /> New
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleDeleteAll = () => {
    deleteTableRecords(currentForm?.name, selectedRows).then((data) => {
      if (data.statusCode === 200) {
        setRefetch(!refetch);
        setSelectedRows([]);

        notify.success('Data deleted succesfully');
      } else {
        notify.error('Something went wrong!');
      }
    });
    setConformationForDelete(false);
  };
  const handleUpdateRecord = (actionData) => {
    if (actionData) {
      updateMultipleTableRecord(currentForm.name, selectedRows, actionData)
        .then(() => {
          setRefetch(!refetch);
          setPreview(false);

          notify.success('Data saved succesfully');
        })
        .catch(() => {
          notify.error('Something went wrong!');
        });
    }
    setUpdateRecordData(false);
  };

  const field = fields?.filter((field) => field.enableFilterPanel);
  const selectedField = field[0];
  useEffect(() => {
    if (selectedField && currentForm) {
      fetchFilterCount(currentForm?.name, selectedField?.name, {
        where:
          selectedCondition.length !== 0
            ? selectedCondition
            : [
                {
                  fieldName: selectedField?.name,
                  operator: 'IS NOT EMPTY',
                  value: 'IS NOT EMPTY'
                }
              ]
      });
    }
  }, [selectedField, selectedCondition]);

  const fetchFilterCount = async (formName, fieldName, where) => {
    const response = await fetchCountByFilter(formName, fieldName, where);
    const data = response?.result;
    if (data) {
      setFilterCount(data);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setRefetch(!refetch);
  };

  const handleSortClick = (columnKey) => {
    setSort((prev) => {
      const existingSort = prev.find((sort) => sort.columnName === columnKey);
      const newSortOrder =
        existingSort?.order === 'asc'
          ? 'desc'
          : existingSort?.order === 'desc'
            ? null
            : 'asc';

      if (existingSort) {
        if (newSortOrder === null) {
          return prev.filter((sort) => sort.columnName !== columnKey);
        }

        return prev.map((sort) =>
          sort.columnName === columnKey
            ? { ...sort, order: newSortOrder }
            : sort
        );
      } else {
        return [
          // ...prev,
          {
            columnName: columnKey,
            order: newSortOrder
          }
        ];
      }
    });
    setRefetch(!refetch);
  };

  if (loading) {
    return (
      <div class="flex h-screen w-full items-center justify-center">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  return (
    <>
      <GridTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        fields={fields}
        preferences={preferences}
        handledRowClick={handledRowClick}
        setSelectedRows={setSelectedRows}
        currentForm={currentForm}
        setRefetch={setRefetch}
        fieldLabels={fieldLabels}
        tableData={tableData}
        setWhere={setWhere}
        CustomToolbar={CustomToolbar()}
        loading={loading}
        columnPreferenceHandler={columnPreferenceHandler}
        where={where}
        sort={sort}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handleSortClick={handleSortClick}
        usedElements={['header', 'pagination', 'columnPreference']}
        rowTooltip="Double click to edit record"
        headerLabel={`${currentForm?.displayName} view`}
      />

      {showSearchFilter && (
        <SearchPreference
          open={showSearchFilter}
          onSearchFilter={searchFilterHandler}
          setShowSearchFilter={setShowSearchFilter}
          setSelectedCondition={setSelectedCondition}
          conditions={conditions}
          setConditions={setConditions}
          fields={fieldsData}
          setFields={setFieldsData}
        />
      )}

      {conformationForDelete && (
        <ConfirmationModal
          open={conformationForDelete}
          heading="Delete record"
          message={'Are you sure you want to delete this record ?'}
          onConfirm={handleDeleteAll}
          onCancel={() => setConformationForDelete(false)}
          secondButtonText="Confirm"
          firstButtonText="Cancel"
        />
      )}

      {updateRecordData && (
        <ConfirmationModal
          open={updateRecordData}
          data={predictField}
          heading="Update record"
          message="Are you sure you want to update this record ?"
          onConfirm={() => handleUpdateRecord(selectedActionData)}
          onCancel={() => setUpdateRecordData(false)}
          secondButtonText="Update"
          firstButtonText="Cancel"
        />
      )}

      {openImportDrawer && (
        <ImportData
          openImportDrawer={openImportDrawer}
          setImportDrawer={setImportDrawer}
          fields={fieldsData}
          setRefetch={setRefetch}
        />
      )}
    </>
  );
};

export default DataGridTableX;
