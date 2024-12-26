import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import { Button } from '@/componentss/ui/button';
import { Label } from '@/componentss/ui/label';
import { AgGridReact } from 'ag-grid-react';
import { useSelector } from 'react-redux';
import PaginationComponent from '@/componentss/ui/paginationcomponent';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import NoRows from '@/assets/norows.svg';
import { X } from 'lucide-react';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const GridTableSimple = ({
  totalRecords,
  currentPage,
  rowsPerPage,
  headers,
  handledRowClick,
  setSelectedRows,
  currentForm,
  setRefetch,
  setCurrentPage,
  rows,
  setWhere,
  type = 'form',
  refField,
  headerLabel,
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
  const gridRef = useRef();
  const { currentTheme } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPreferernces, setShowPreference] = useState(false);
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

  // const onchangeColumnFilter = useCallback(() => {
  //   const transformedArray = activeFilters
  //     ? Object.keys(activeFilters).map((field) => ({
  //         fieldName: field,
  //         operator: activeFilters[field]?.operator,
  //         value: activeFilters[field]?.value
  //       }))
  //     : [];

  //   setRefetch((prev) => !prev);
  //   setWhere(() => [...transformedArray]);
  // }, [currentForm?.name, activeFilters]);

  // useEffect(() => {
  //   if (activeFilters !== null) {
  //     onchangeColumnFilter();
  //   }
  // }, [activeFilters]);

  // const handleFilterIconClick = (columnKey, position) => {
  //   const selectedColumn = columns?.find((f) => f.field === columnKey)?.data;
  //   const activeFilter = activeFilters?.[columnKey];
  //   const popUpWidth = 200;
  //   const adjustedLeft = Math.min(
  //     position.left,
  //     window.innerWidth - popUpWidth - 20
  //   );

  //   setFilterPopUp({
  //     open: true,
  //     columnKey,
  //     category: selectedColumn?.category || '',
  //     options: selectedColumn?.options || [],
  //     label: selectedColumn?.label || '',
  //     position: {
  //       top: position.bottom + window.scrollY,
  //       left: adjustedLeft + window.scrollX
  //     },
  //     operator: activeFilter?.operator || '=',
  //     filterValue: activeFilter?.value || ''
  //   });
  // };

  const gridOptions = {
    suppressCellSelection: true
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    setRefetch((prev) => !prev);
  };

  const rowSelection = useMemo(() => {
    return {
      mode: rowSelectionMode
    };
  }, []);
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

      // editable: true,
      sortable: true,

      resizable: true,
      tooltipComponentParams: {
        color: '#ececec' // Optional customization for tooltip appearance
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
  // useEffect(() => {
  //   const noRowsElement = document.querySelector('.ag-overlay-no-rows-wrapper');
  //   if (noRowsElement && rows?.length === 0 && where?.length > 0) {
  //     noRowsElement.innerHTML = ``;
  //   } else if (noRowsElement) {
  //     noRowsElement.innerHTML = `No rows to show`;
  //   }
  // }, [rows]);
  const handleSelectionChange = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data.id);
    setSelectedRows(selectedData); // Update selected row IDs
  }, []);
  return (
    <>
      <div
        className={`relative m-0 w-full rounded-lg p-0 ${
          currentTheme === 'Dark' ? 'bg-dark-level2' : 'bg-white'
        }`}
      >
        {rows?.length === 0 && (
          <div className="absolute z-50 flex h-[calc(100vh-130px)] w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <img src={NoRows} alt="no dashboard" className="h-44" />
              <div className="flex gap-x-2 py-2 text-sm font-normal text-black">
                {' '}
                No Records to show
              </div>
            </div>
          </div>
        )}
        {usedElements?.includes('header') && (
          <div className="flex h-[50px] items-center justify-between space-x-3">
            <div>
              <h2
                className={`text-lg font-medium ${
                  currentTheme === 'Dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {headerLabel || 'Records'}
              </h2>
            </div>
            <div>{CustomToolbar}</div>
          </div>
        )}
        <div className="flex flex-row gap-2">
          <div className="flex w-full flex-wrap items-center justify-center overflow-auto p-0">
            <div className="w-full overflow-hidden">
              <div
                className={`w-full ${
                  currentTheme === 'Light' ? 'bg-white' : 'bg-dark-level2'
                }`}
              >
                <div style={{}}>
                  <div style={{}} className="ag-theme-alpine">
                    <div className="border-lightgrey relative overflow-hidden border-b">
                      <AgGridReact
                        ref={gridRef}
                        rowData={rows}
                        columnDefs={headers}
                        defaultColDef={defaultColDef}
                        rowStyle={rowStyle}
                        suppressDragLeaveHidesColumns={true}
                        gridOptions={gridOptions}
                        // selection={rowSelectionEnabled ? rowSelection : null}
                        suppressMovableColumns={true}
                        rowGroupPanelShow={'always'}
                        pivotPanelShow={'always'}
                        onRowDoubleClicked={handledRowClick}
                        //   onRowClicked={ onRowClicked
                        //   }
                        getRowClass={!rowSelectionEnabled ? getRowClass : null}
                        onSelectionChanged={handleSelectionChange}
                        // loadingOverlayComponentFramework={LinearProgress}
                        overlayLoadingTemplate={
                          '<span class="ag-overlay-loading-center">Loading...</span>'
                        }
                      />
                      {rows?.length === 0 && where?.length > 0 && (
                        <div className="absolute left-[30%] top-[50%] z-[100] flex items-center justify-center">
                          <Label>
                            No rows match your current filter settings. You can
                            modify the filter or
                            <Button
                              onClick={() => {
                                setWhere([]);
                                setActiveFilters({});
                              }}
                            >
                              Click here to view all records.
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>
                    {/* Pagination */}

                    {usedElements?.includes('pagination') && (
                      <>
                        {' '}
                        <div className="flex flex-col">
                          <PaginationComponent
                            currentPage={currentPage}
                            rowsPerPage={rowsPerPage}
                            totalRecords={totalRecords}
                            handleChangePage={handleChangePage}
                            handleRowsPerPageChange={handleRowsPerPageChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Filter Pop-up */}
                {/* <Popper
                  open={filterPopUp.open}
                  placement="bottom-start"
                  style={{
                    top: filterPopUp.position.top,
                    left: filterPopUp.position.left,
                    zIndex: 1300
                  }}
                >
                  <Paper
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      width: '250px',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">
                        {filterPopUp?.label}
                      </Label>
                      <Button
                        onClick={handleClosePopUp}
                        title="Close"
                        size="small"
                      >
                        <X style={{ fontSize: '18px' }} />
                      </Button>
                    </div>
                    <SelectField
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
                      style={{
                        height: '27.5px',
                        minWidth: '144px',
                        fontSize: '0.75rem',
                        bgcolor: colors.white,
                        marginBottom: '10px'
                      }}
                      fieldstyle={{
                        minWidth: '160px'
                      }}
                      labelstyle={{
                        fontWeight: '500'
                      }}
                    />

                    {filterPopUp?.category === 'DropDown' ? (
                      <SelectField
                        value={filterPopUp.filterValue}
                        onChange={(e) =>
                          setFilterPopUp({
                            ...filterPopUp,
                            filterValue: e.target.value
                          })
                        }
                        options={filterPopUp?.options}
                        size={'small'}
                        style={{
                          height: '27.5px',
                          minWidth: '144px',
                          fontSize: '0.75rem',
                          bgcolor: colors.white
                        }}
                        fieldstyle={{
                          minWidth: '160px'
                        }}
                        labelstyle={{
                          fontWeight: '500'
                        }}
                      />
                    ) : (
                      <TextField
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
                        size="small"
                        fullWidth
                        variant="outlined"
                        style={{
                          '& .MuiInputBase-root': {
                            height: '27.5px',
                            fontSize: '0.75rem'
                          },
                          bgcolor: colors.white
                        }}
                      />
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <Button variant="outline" onClick={handleClearFilter}>
                        Clear & Close
                      </Button>
                      <Button onClick={handleApplyFilter}>Apply</Button>
                    </div>
                  </Paper>
                </Popper> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GridTableSimple;
