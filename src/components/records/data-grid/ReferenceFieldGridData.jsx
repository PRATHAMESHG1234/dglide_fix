import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/componentss/ui/button';
import { Input } from '@/componentss/ui/input';

import { colors, COLORS } from '../../../common/constants/styles';
import {
  fetchFieldObjectByFormId,
  fetchFieldsByFormId,
  fetchIndivualReferenceGridValues
} from '../../../services/field';
import { useSelector } from 'react-redux';
import {
  createGridFieldPreference,
  fetchGridFieldPreference
} from '../../../services/fieldPreference';
import GridTable from '../../../elements/GridTable';
import { Sheet, SheetContent } from '@/componentss/ui/sheet';
import { notify } from '../../../hooks/toastUtils';
import { CircleX, Plus, Search } from 'lucide-react';
const ReferenceFieldGridData = ({
  refField,
  setRefFieldAddData,
  updateTable,
  onConfirm,
  onCancel,
  form,
  refFieldAddData
}) => {
  const inputRef = useRef(null);

  const { currentForm } = useSelector((state) => state.current);
  const [refGridData, setRefGridData] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState();
  const [defaultField, setDefaultField] = useState('');
  const [fields, setFields] = useState([]);
  const [tableCount, setTableCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [showColumnPreference, setShowColumnPreference] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [where, setWhere] = useState([]);
  const [fieldLabels, setFieldLabels] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState([]);
  const [searchBoxProperty, setSearchBoxProperty] = useState({
    value: '',
    focus: false,
    clearInput: false
  });

  useEffect(() => {
    if (refField?.fieldInfoId && updateTable.refresh) {
      if (refField.parentFormInfoId || refField?.formId) {
        const formInfoId =
          refField?.parentFormInfoId > 0
            ? refField?.parentFormInfoId
            : refField?.formId;
        const fetchFieldsByParentFormInfoId = async (formId) => {
          const res = await fetchFieldsByFormId(formId);
          const result = res.result;
          const field = result.find((fld) => fld.defaultLabel);
          setDefaultField(field.name);
          setFields(result);
        };

        fetchFieldsByParentFormInfoId(formInfoId);

        fetchFieldObjectByFormId(formInfoId).then((fieldObj) =>
          setFieldLabels(fieldObj)
        );
      }
      const fetchFieldPreference = async () => {
        const res = await fetchGridFieldPreference(refField?.fieldInfoId);
        const result = res?.result;
        setPreferences(result);
      };
      fetchFieldPreference();
    }
  }, [refField, updateTable.refresh]);

  useEffect(() => {
    const fetchGridValues = async () => {
      const data = await fetchIndivualReferenceGridValues(
        refField.fieldInfoId,
        {
          pagination: {
            pageSize: rowsPerPage,
            page: currentPage - 1
          },
          payload: {},
          search,
          sort,
          where
        }
      );

      const result = data?.result;
      if (result) {
        setRefGridData(result);
        setTableCount(result.totalRecords);
      }

      updateTable.setRefresh(false);
    };
    if (updateTable.refresh) {
      fetchGridValues();
    }
  }, [refField, updateTable.refresh, currentPage, where, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateTable.setRefresh((prev) => !prev);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const onConfirmHandler = () => {
    const selectedRow = refGridData?.data?.find(
      (row) => row.uuid === selectedRows[0]
    );
    const selected = {
      name: refField.name,
      value: selectedRows[0],
      column: defaultField
        ? selectedRow[defaultField]
        : selectedRow[refField.fieldName]
    };

    onConfirm(selected);

    onCancel();
  };

  const onRowSelectionModelChange = (rowId) => {
    const selectedRows = rowId;
    if (selectedRows.length > 0) setRowSelectionModel(selectedRows);
    else setRowSelectionModel([]);
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const onchangeColumnFilter = useCallback(
    (name, value) => {
      if (value) {
        setSearch({
          fieldName: name || '',
          keyword: value.trim()
        });
      }
      updateTable?.setRefresh((prev) => !prev);
    },
    [search]
  );

  const debouncedOnSearch = useCallback(debounce(onchangeColumnFilter, 1000), [
    onchangeColumnFilter
  ]);
  const columnPreferenceHandler = async (fieldId, data) => {
    const fieldPreference = createGridFieldPreference(fieldId, {
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
    setShowColumnPreference(false);
    updateTable.setRefresh(true);
  };

  const handleSearch = (e) => {
    const { value, name } = e.target;
    setSearchBoxProperty((prev) => {
      return {
        ...prev,
        value: value
      };
    });
    debouncedOnSearch(name, value);
  };
  const handleMouseEnter = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    updateTable.setRefresh(true);
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
          ...prev,
          {
            columnName: columnKey,
            order: newSortOrder
          }
        ];
      }
    });
  };

  const CustomToolbar = () => (
    <div>
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <Input
            id={`input-requester-search`}
            placeholder="Search"
            onChange={handleSearch}
            name={refField?.fieldName}
            variant="outlined"
            value={searchBoxProperty.value || ''}
            inputRef={inputRef}
            startIcon={<Search size={16} />}
            endIcon={
              searchBoxProperty.value && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setSearch(null);
                    setSearchBoxProperty((prev) => {
                      return { ...prev, value: '' };
                    });
                    updateTable?.setRefresh((prev) => !prev);
                  }}
                >
                  <CircleX size={16} />
                </div>
              )
            }
          />

          <Button
            onClick={() =>
              setRefFieldAddData({
                formInfoId: refField.parentFormInfoId,
                open: true
              })
            }
            size="sm"
            variant="outline"
          >
            <Plus size={16} strokeWidth={3} /> New
          </Button>
          <Button
            onClick={onConfirmHandler}
            size="sm"
            className="font-bold text-white"
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet key={'right'} open={refField.open} onOpenChange={onCancel}>
      <SheetContent
        side={'right'}
        className="m-0 w-[800px] max-w-[800px] p-0 sm:max-w-[800px]"
      >
        {refFieldAddData?.open ? (
          form
        ) : (
          <div className="pt-5">
            <GridTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              totalRecords={tableCount}
              fields={fields}
              preferences={preferences}
              handledRowClick={onRowSelectionModelChange}
              setSelectedRows={setSelectedRows}
              currentForm={currentForm}
              setRefetch={updateTable?.setRefresh}
              fieldLabels={fieldLabels}
              tableData={refGridData}
              headerLabel={refField?.field.label}
              setWhere={setWhere}
              sort={sort}
              type="field"
              refField={refField}
              CustomToolbar={CustomToolbar()}
              rowSelectionMode={'single'}
              columnPreferenceHandler={columnPreferenceHandler}
              handleRowsPerPageChange={handleRowsPerPageChange}
              handleSortClick={handleSortClick}
              rowSelectionEnabled={false}
              usedElements={['header', 'pagination', 'columnPreference']}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ReferenceFieldGridData;
