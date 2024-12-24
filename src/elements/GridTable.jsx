import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

import { AgGridReact } from 'ag-grid-react';
import LinearProgress from '@mui/material/LinearProgress';
import ColumnPreferenceX from '../components/records/preference/ColumnPreferenceX';
import { colors } from '../common/constants/styles';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  ArrowDown,
  ArrowDownCircle,
  ArrowDownUp,
  ArrowUp,
  ArrowUpCircle,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { ChevronsUp } from 'lucide-react';
import { ChevronsDown } from 'lucide-react';
import { Dropdown } from '@/componentss/ui/dropdown';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { useLocation } from 'react-router-dom';
import PaginationComponent from '@/componentss/ui/paginationcomponent';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/componentss/ui/avatar';
import { Input } from '@/componentss/ui/input';
import { Button } from '@/componentss/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/componentss/ui/popover';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
const GridTable = ({
  totalRecords,
  currentPage,
  rowsPerPage,
  fields,
  preferences,
  handledRowClick,
  setSelectedRows,
  currentForm,
  setRefetch,
  setCurrentPage,
  fieldLabels,
  tableData,
  setWhere,
  type = 'form',
  refField,
  headerLabel = 'Records',
  CustomToolbar,
  usedElements,
  rowSelectionMode = 'multiRow',
  columnPreferenceHandler,
  loading,
  where,
  sort,
  paginationRowOptions = [20, 30, 40],
  handleRowsPerPageChange,
  handleSortClick,
  rowSelectionEnabled = true,
  rowTooltip = ''
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const gridRef = useRef();
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPreferernces, setShowPreference] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [activeFilters, setActiveFilters] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [filterPopUp, setFilterPopUp] = useState({
    open: false,
    columnKey: null,
    category: 'String',
    position: { top: 0, left: 0 },
    operator: '=',
    filterValue: '',
    options: []
  });
  const onRowClicked = (event) => {
    if (!rowSelectionEnabled) {
      setSelectedRowId(event.data.id);
      setSelectedRows([event.data.id]);
    }
  };

  const getRowClass = (params) => {
    return params.data.id === selectedRowId && !rowSelectionEnabled
      ? 'highlight-color'
      : null;
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopUp = () => {
    setFilterPopUp({ ...filterPopUp, open: false });
  };
  const gridApiRef = useRef(null);
  const onGridReady = (params) => {
    // Store the grid API reference
    gridApiRef.current = params.api;
  };

  const handleApplyFilter = () => {
    const { columnKey, operator, filterValue } = filterPopUp;

    if (!filterValue) return;

    setActiveFilters((prev) => ({
      ...prev,
      [columnKey]: { operator, value: filterValue }
    }));

    handleClosePopUp();

    if (gridApiRef.current) {
      gridApiRef.current.showNoRowsOverlay();
    }
  };

  const handleClearFilter = () => {
    const { columnKey } = filterPopUp;
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });

    handleClosePopUp();
  };

  const onchangeColumnFilter = useCallback(() => {
    const transformedArray = activeFilters
      ? Object.keys(activeFilters).map((field) => ({
          fieldName: field,
          operator: activeFilters[field]?.operator,
          value: activeFilters[field]?.value
        }))
      : [];

    setRefetch((prev) => !prev);
    setWhere(() => [...transformedArray]);
  }, [currentForm?.name, activeFilters]);

  useEffect(() => {
    if (activeFilters !== null) {
      onchangeColumnFilter();
    }
  }, [activeFilters]);

  const CustomHeader = (props) => {
    const { displayName, columnKey, onFilterIconClick, isActive } = props;
    const iconRef = useRef(null);

    const handleClick = () => {
      const iconPosition = iconRef.current.getBoundingClientRect();
      onFilterIconClick(columnKey, iconPosition);
    };

    const renderSortIcon = (sortedColumn) => {
      if (sortedColumn?.order === 'asc') {
        return <ArrowUpCircle className="h-4 w-4" />;
      } else if (sortedColumn?.order === 'desc') {
        return <ArrowDownCircle className="h-4 w-4" />;
      }
      return <ArrowUpDown className="h-4 w-4" />;
    };

    const sortedColumn = sort?.find((srt) => srt.columnName === columnKey);

    return (
      <span className="flex w-full cursor-pointer flex-row items-start justify-between px-1">
        <div>{displayName}</div>
        <div className="flex flex-row items-end justify-end gap-2">
          <Tooltip>
            <TooltipTrigger>{renderSortIcon(sortedColumn)}</TooltipTrigger>
            <TooltipContent>
              {sortedColumn?.order === 'asc'
                ? 'Sort Ascending'
                : sortedColumn?.order === 'desc'
                  ? 'Sort Descending'
                  : 'Sort'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Filter
                ref={iconRef}
                onClick={handleClick}
                className="h-4 w-4 cursor-pointer"
              />
            </TooltipTrigger>
            <TooltipContent>Filter</TooltipContent>
          </Tooltip>
        </div>
      </span>
    );
  };

  function truncateString(str) {
    if (str.length > 10) {
      return str.substring(0, 10) + '...';
    }
    return str;
  }
  useEffect(() => {
    if (tableData?.data?.length > 0 && fieldLabels) {
      const keysData = Object.keys(tableData?.data[0]);
      const headersOrder = preferences?.map(
        (pre) => pre.fieldName || pre.datasourceFieldName
      );

      const headers = [
        {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 40,
          minWidth: 40,
          maxWidth: 40,
          suppressSizeToFit: true,
          resizable: false,
          filter: false,
          suppressMovable: true,
          cellStyle: {
            borderRight: 'none'
          },
          headerClass: 'ag-header-checkbox',
          cellClass: 'ag-checkbox-column'
        },
        ...keysData
          ?.filter(
            (k) =>
              preferences.find((f) => f?.fieldName === k)?.fieldName ||
              preferences.find((f) => f.datasourceFieldName === k)
                ?.datasourceFieldName
          )
          ?.sort((a, b) => headersOrder?.indexOf(a) - headersOrder?.indexOf(b))
          ?.map((key) => {
            const field = fields?.find((field) => field.name === key);
            return {
              headerName: fieldLabels[key] || key,
              field: key,
              minWidth: field?.highlightInitialCharacter ? 150 : 125,
              editable: false,
              flex: 1,
              sortable: true,
              data: field,
              cellRenderer: (params) => {
                if (params.colDef.data) {
                  const field =
                    fields?.find(
                      (field) => field.name === params.colDef.field
                    ) || null;
                  let option;
                  let initial;
                  let name;

                  if (
                    field &&
                    field.category &&
                    (field.category.toLowerCase() === 'radio' ||
                      field.category.toLowerCase() === 'checkbox' ||
                      field.category.toLowerCase() === 'dropdown')
                  ) {
                    option =
                      field?.options?.find(
                        (opt) => opt.label === params.value
                      ) || null;
                  }

                  const backgroundColor =
                    option && option?.style
                      ? JSON.parse(option.style)?.backgroundColor
                      : '';
                  const color =
                    option && option?.style
                      ? JSON.parse(option.style)?.color
                      : '';

                  if (
                    field &&
                    field.category &&
                    field.category.toLowerCase() === 'reference'
                  ) {
                    initial =
                      field.highlightInitialCharacter &&
                      params.value?.charAt(0)?.toUpperCase();
                    name = params.value;
                  }

                  return (
                    <span
                      className={`line-clamp-1 flex max-w-[125px] items-center ${backgroundColor || color ? 'justify-center' : 'justify-start'} m-1 gap-2 ${initial ? 'font-normal' : 'font-medium'} ${backgroundColor ? 'h-7' : 'h-auto'} ${backgroundColor ? 'rounded-2xl' : 'rounded-none'} `}
                      style={{
                        backgroundColor: backgroundColor,
                        color: color,
                        padding:
                          backgroundColor && !initial
                            ? '10px'
                            : initial
                              ? '0'
                              : '5px'
                      }}
                    >
                      {initial ? (
                        <div className="relative line-clamp-1 flex h-[29px] max-w-[125px] items-center gap-x-2 rounded-full bg-[#e3f2fd] px-3 text-sm font-normal text-secondary">
                          <Avatar className="absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2 bg-secondary">
                            <AvatarFallback className="bg-secondary text-xs text-white">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-ellipsis whitespace-nowrap pl-5 text-xs">
                            {truncateString(name)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm">{params.value}</div>
                      )}
                    </span>
                  );
                }
                return <div className="text-sm">{params.value}</div>;
              },
              cellStyle: { textAlign: 'left' },
              tooltipValueGetter: (params) => rowTooltip,
              headerComponent: CustomHeader,
              category: ['Date', 'Number', 'Dropdown'].includes(field?.category)
                ? field?.category
                : 'String'
            };
          })
      ];

      const modified = tableData?.data?.map((data) => {
        return {
          ...data,
          id: data?.uuid
        };
      });
      setRows(modified);
      setColumns(headers);
    } else {
      setRows([]);
      setColumns([]);
    }

    if (tableData?.totalRecords === 0) {
      const headers = preferences?.map((p) => {
        const field = fields?.find(
          (field) => field.name === (p.fieldName || p.datasourceFieldName)
        );
        return {
          headerName: field?.label,
          field: p.fieldName,
          minWidth: 100,
          editable: false,
          flex: 1,
          headerComponent: CustomHeader,
          category: ['Date', 'Number', 'Dropdown'].includes(field?.category)
            ? field?.category
            : 'String'
        };
      });
      setColumns(headers);
    }
  }, [tableData, fieldLabels, preferences, fields, currentTheme]);

  const handleFilterIconClick = (columnKey, position) => {
    const selectedColumn = columns?.find((f) => f.field === columnKey)?.data;
    const activeFilter = activeFilters?.[columnKey];
    const popUpWidth = 200;
    const adjustedLeft = Math.min(
      position.left,
      window.innerWidth - popUpWidth - 20
    );

    setFilterPopUp({
      open: true,
      columnKey,
      category: selectedColumn?.category || '',
      options: selectedColumn?.options || [],
      label: selectedColumn?.label || '',
      position: {
        top: position.bottom + window.scrollY,
        left: adjustedLeft + window.scrollX
      },
      operator: activeFilter?.operator || '=',
      filterValue: activeFilter?.value || ''
    });
  };

  const gridOptions = {
    suppressCellSelection: true,
    selection: {
      mode: 'multiRow'
    },
    rowSelection: 'multiple',
    multiSelect: true
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    setRefetch((prev) => !prev);
  };

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(
    () => ({
      height: '100%',
      width: '100%',
      overflow: 'hidden'
    }),
    []
  );
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,

      editable: false,
      sortable: true,

      resizable: true,
      tooltipComponentParams: {
        color: '#ececec'
      }
    };
  }, []);
  const operators = {
    String: [
      { label: 'equal to', value: '=' },
      { label: 'not equal to', value: '<>' },
      { label: 'like', value: 'LIKE' },
      { label: 'not like', value: 'NOT LIKE' },
      { label: 'in', value: 'IN' },
      { label: 'Is Empty', value: 'IS EMPTY' },
      { label: 'Is not empty', value: 'IS NOT EMPTY' }
    ],
    Number: [
      { label: 'equal to', value: '=' },
      { label: 'not equal to', value: '<>' },
      { label: 'greater than', value: '>' },
      { label: 'less than', value: '<' },
      { label: 'greater than or equal to', value: '>=' },
      { label: 'less than or equal to', value: '<=' },
      { label: 'Is Empty', value: 'IS EMPTY' },
      { label: 'Is not empty', value: 'IS NOT EMPTY' }
    ],
    Date: [
      { label: 'equal to', value: '=' },
      { label: 'not equal to', value: '<>' },
      { label: 'greater than', value: '>' },
      { label: 'less than', value: '<' },
      { label: 'greater than or equal to', value: '>=' },
      { label: 'less than or equal to', value: '<=' },
      { label: 'Is Empty', value: 'IS EMPTY' },
      { label: 'Is not empty', value: 'IS NOT EMPTY' }
    ]
  };

  const rowStyle = { cursor: 'pointer' };
  useEffect(() => {
    const noRowsElement = document.querySelector('.ag-overlay-no-rows-wrapper');
    if (noRowsElement && rows?.length === 0 && where?.length > 0) {
      noRowsElement.innerHTML = ``;
    } else if (noRowsElement) {
      noRowsElement.innerHTML = `No rows to show`;
    }
  }, [rows]);
  const rowSelection = useMemo(() => {
    return {
      mode: rowSelectionMode,
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: true
    };
  }, []);
  return (
    <>
      <div
        className={`flex w-full flex-col gap-y-2 rounded-lg bg-background p-4`}
      >
        {usedElements?.includes('header') && (
          <div className="flex h-7 items-center justify-between py-5">
            <div className="text-lg font-semibold text-black">
              {headerLabel}
            </div>
            <div>{CustomToolbar}</div>
          </div>
        )}
        <div className="flex flex-row gap-2 overflow-hidden rounded-xl border border-[0.1px] border-slate-200 bg-background">
          <div className="flex w-full flex-wrap items-center justify-center overflow-auto">
            <div className="w-full overflow-hidden">
              <div
                className={`${currentTheme === 'Light' ? 'bg-white' : 'bg-darkLevel2'} w-full`}
              >
                <div>
                  <div className="ag-theme-alpine">
                    <div
                      className={`border-lightgrey relative overflow-hidden border-b ${
                        type === 'field' ? 'h-[calc(100vh-9rem)]' : ''
                      }`}
                    >
                      <AgGridReact
                        ref={gridRef}
                        rowData={rows}
                        columnDefs={columns.map((col) => ({
                          ...col,

                          headerComponentParams: {
                            checkboxSelection: true,
                            columnKey: col.field,
                            onFilterIconClick: handleFilterIconClick,
                            isActive: !!(
                              activeFilters && activeFilters[col.field]
                            )
                          }
                        }))}
                        defaultColDef={defaultColDef}
                        rowStyle={rowStyle}
                        suppressDragLeaveHidesColumns={true}
                        gridOptions={gridOptions}
                        selection={rowSelectionEnabled ? rowSelection : null}
                        suppressMovableColumns={true}
                        rowGroupPanelShow={'always'}
                        pivotPanelShow={'always'}
                        onRowDoubleClicked={handledRowClick}
                        onRowClicked={
                          !rowSelectionEnabled ? onRowClicked : null
                        }
                        getRowClass={!rowSelectionEnabled ? getRowClass : null}
                        onSelectionChanged={(event) => {
                          const selectedNodes = event.api.getSelectedNodes();
                          const selectedData = selectedNodes.map(
                            (node) => node.data.uuid
                          );
                          setSelectedRows(selectedData);
                        }}
                        loadingOverlayComponentFramework={LinearProgress}
                        overlayLoadingTemplate={
                          '<span class="ag-overlay-loading-center">Loading...</span>'
                        }
                      />

                      {rows?.length === 0 && where?.length > 0 && (
                        <div className="hello absolute left-[30%] top-[50%] z-[100] flex items-center justify-center">
                          <p className="text-sm">
                            No rows match your current filter settings. You can
                            modify the filter or
                            <button
                              className="text-sm text-primary no-underline hover:underline"
                              onClick={() => {
                                setWhere([]);
                                setActiveFilters({});
                              }}
                            >
                              Click here to view all records.
                            </button>
                          </p>
                        </div>
                      )}
                      {usedElements?.includes('columnPreference') && (
                        <>
                          <div
                            className="border-primary-light hover:text-primary-main absolute left-full top-0 z-10 flex h-[30px] w-full origin-top-left rotate-90 transform cursor-pointer select-none items-center border bg-white px-1 pl-4 text-xs text-[#047eae]"
                            onClick={() =>
                              setShowPreference((prev) => !showPreferernces)
                            }
                          >
                            {!showPreferernces ? (
                              <ChevronDown className="mr-2" size={14} />
                            ) : (
                              <ChevronUp className="mr-2" size={14} />
                            )}
                            Column Preference
                          </div>
                          {showPreferernces && (
                            <div className="absolute right-[31px] top-0 z-[100] h-[calc(100vh_-_280px)] w-[200px] overflow-y-auto overflow-x-hidden">
                              <ColumnPreferenceX
                                open
                                currentForm={currentForm}
                                columnPreferenceHandler={
                                  columnPreferenceHandler
                                }
                                setShowColumnPreference={setShowPreference}
                                fields={fields}
                                preferences={preferences}
                                type={type}
                                refField={refField}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {/* Pagination */}

                    {usedElements?.includes('pagination') && (
                      <div className="flex flex-col pb-1 pt-2">
                        <PaginationComponent
                          currentPage={currentPage}
                          rowsPerPage={rowsPerPage}
                          totalRecords={totalRecords}
                          handleChangePage={handleChangePage}
                          handleRowsPerPageChange={handleRowsPerPageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Filter Pop-up */}
                <Popover
                  open={filterPopUp.open}
                  style={{
                    top: filterPopUp.position.top,
                    left: filterPopUp.position.left,
                    zIndex: 1300
                  }}
                >
                  <PopoverTrigger
                    asChild
                    className="absolute"
                    style={{
                      top: filterPopUp.position.top,
                      left: filterPopUp.position.left,
                      zIndex: 1300
                    }}
                  >
                    <div></div>
                  </PopoverTrigger>
                  <PopoverContent
                    className={`border-none bg-transparent shadow-none top-${filterPopUp.position.top} left-${filterPopUp.position.left} z-[1300]`}
                    style={{
                      top: filterPopUp.position.top,
                      left: filterPopUp.position.left,
                      zIndex: 1300
                    }}
                  >
                    <div
                      className="bg-white"
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        width: '250px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <div className="flex items-center justify-between pb-3">
                        <span className="text-sm font-semibold text-black">
                          {filterPopUp?.label}
                        </span>

                        <X
                          size={16}
                          className="cursor-pointer text-black"
                          onClick={handleClosePopUp}
                        />
                      </div>
                      <div className="py-1">
                        <Dropdown
                          value={filterPopUp.operator}
                          onChange={(e) =>
                            setFilterPopUp({
                              ...filterPopUp,
                              operator: e.target.value
                            })
                          }
                          options={
                            operators[
                              filterPopUp?.category === 'Date'
                                ? 'Date'
                                : filterPopUp?.category === 'Number'
                                  ? 'Number'
                                  : 'String'
                            ]
                          }
                          placeholder="Select operator"
                          required={true} // Adjust if needed
                          id="operator"
                          indentType="row" // Adjust the layout as needed
                          disabled={false} // Set to true if disabled
                        />
                      </div>
                      <div className="py-1">
                        {filterPopUp?.category === 'DropDown' ? (
                          <Dropdown
                            value={filterPopUp.filterValue}
                            onChange={(e) =>
                              setFilterPopUp({
                                ...filterPopUp,
                                filterValue: e.target.value
                              })
                            }
                            options={filterPopUp?.options}
                            placeholder="Select filter value"
                            required={false} // Adjust if needed
                            id="filter-value"
                            indentType="row" // Adjust the layout as needed
                            disabled={false} // Set to true if disabled
                          />
                        ) : (
                          <Input
                            type={
                              filterPopUp?.category === 'Number'
                                ? 'Number'
                                : 'String'
                            }
                            value={filterPopUp.filterValue}
                            required
                            onChange={(e) =>
                              setFilterPopUp({
                                ...filterPopUp,
                                filterValue: e.target.value
                              })
                            }
                            placeholder={'Enter...'}
                          />
                        )}
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleClearFilter}
                          className="font-bold"
                        >
                          Clear & Close
                        </Button>

                        <Button
                          size="sm"
                          onClick={handleApplyFilter}
                          className="font-bold"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GridTable;
