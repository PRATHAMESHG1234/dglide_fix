import React, { useEffect, useRef, useState } from 'react';
import { colors } from '../../common/constants/styles';
import { useNavigate } from 'react-router-dom';
import {
  createTableRecord,
  deleteTableRecords,
  fetchRecords,
  updateBulkRecord
} from '../../services/table';
import {
  fetchFieldObjectByFormId,
  fetchFieldsWithValuesForReference
} from '../../services/field';
import { fetchFormByName } from '../../services/form';
import { fetchFormByName as fetchFormFromService } from '../../redux/slices/currentSlice';
import ConfirmationModal from '../shared/ConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import AddEditRecord from '../modify-record/addEditRecord/AddEditRecord';
import { fetchRecordById } from '../../redux/slices/tableSlice';
import { replaceUnderscore } from '../../common/constants/helperFunction';
import AddEditUser from './AddEditUser';
import AddEditTemplate from './template/AddEditTemplate';
import AddEditHolidays from './AddEditHoliday';

import ImportData from '../records/data-import/ImportData';
import { EmailInboundSytem } from './EmailInbound';
import { Separator } from '@/componentss/ui/separator';
import GridTable from '../../elements/GridTable';
import {
  createFieldPreference,
  fetchFieldPreference
} from '../../services/fieldPreference';
import Availability from './Availability/Availability';
import { SlaPolicies } from './SlaPolicies';
import { fetchFieldGroups } from '../../services/fieldGroup';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';
import {
  ArrowLeft,
  ChevronDown,
  Pencil,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import { Button } from '@/componentss/ui/button';
import { Sheet, SheetContent } from '@/componentss/ui/sheet';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/componentss/ui/menubar';
import { notify } from '../../hooks/toastUtils';

const DataTable = ({ FormName, title, isBackArrowEnabled = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const { currentTheme } = useSelector((state) => state.auth);
  const { selectedRecordId } = useSelector((state) => state.current);
  const { tableRecord } = useSelector((state) => state.table);
  const { attachments } = useSelector((state) => state.attachment);

  // Flags and Toggles
  const [submitFlag, setSubmitFlag] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [openImportDrawer, setImportDrawer] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const [prevLoading, setPrevLoading] = useState(false);

  // Data Management
  const [formData, setFormData] = useState([]);
  const [allFormData, setAllFormData] = useState([]);
  const [editFormData, setEditFormData] = useState([]);
  const [fields, setFields] = useState([]);
  const [fieldLabels, setFieldLabels] = useState({});
  const [fieldValues, setFieldValues] = useState({});
  const [editableData, setEditableData] = useState({});
  const [data, setData] = useState();
  const [transformedData, setTransformedData] = useState({});
  const transformedDataRef = useRef({});

  // UI State
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRecordAction, setSelectedRecordAction] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [prefrences, setPrefrences] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  // Refetch Control
  const [refetch, setRefetch] = useState(false);

  // Form Details
  const [formdetail, setFormdetail] = useState();
  const userFormName = FormName;

  const addUserHandler = () => {
    setDrawer(true);
    setNewRecord(true);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [where, setWhere] = useState([]);
  const [fieldGroups, setFieldGroups] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  useEffect(() => {
    if (tableRecord) {
      setFieldValues(tableRecord);
      setPrevLoading(false);
    } else {
      setPrevLoading(true);
    }
  }, [tableRecord]);

  function findRecordByDay(data, days) {
    const uniqueRecords = {};

    for (const day of days) {
      const recordsForDay = data.filter((item) => item.day === day);
      for (const record of recordsForDay) {
        if (!uniqueRecords[record.name]) {
          uniqueRecords[record.name] = record;
        }
      }
    }
    return Object.values(uniqueRecords);
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (userFormName) {
      const data = {
        pagination: {
          pageSize: rowsPerPage,
          page: currentPage - 1
        },
        where: [],
        sort: []
      };

      fetchRecords(userFormName, data).then((data) => {
        let fetchedFormData = data?.data;
        setTotalRecords(data.totalRecords);

        let obj = {};
        if (userFormName === 'system_slots') {
          const daysOrder = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ];
          const filteredRecords = findRecordByDay(fetchedFormData, daysOrder);
          setAllFormData(fetchedFormData);
          obj = {
            totalRecords: filteredRecords.length,
            data: filteredRecords
          };
          setFormData(filteredRecords);
          transformedDataRef.current = obj;
          setTransformedData(obj);
        } else {
          obj = {
            totalRecords: fetchedFormData.length,
            data: fetchedFormData
          };
          setFormData(fetchedFormData);
          transformedDataRef.current = obj;
          setTransformedData(obj);
        }
      });

      fetchFormByName(userFormName).then((data) => {
        setFormdetail(data.result);
        fetchFieldObjectByFormId(data.result?.formInfoId).then((fieldObj) =>
          setFieldLabels(fieldObj)
        );
        fetchFieldPreference(data.result?.formInfoId).then((res) => {
          setPrefrences(res?.result);
        });
        fetchFields(data.result);
      });
    }

    setFetchData(false);
  }, [userFormName, fetchData, refetch]);
  const fetchGroups = async (formInfoId) => {
    const res = await fetchFieldGroups(formInfoId);
    setFieldGroups(res);
  };
  const fetchFields = (formDetails) => {
    const formInfoId = formDetails?.formInfoId;

    if (formInfoId) {
      fetchGroups(formInfoId);
      fetchFieldsWithValuesForReference(formInfoId)
        .then((data) => {
          setFields(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching form fields:', error);
        });
    }
  };

  useEffect(() => {
    if (FormName && currentId) {
      dispatch(
        fetchRecordById({
          tableName: FormName,
          UUID: currentId
        })
      ).then((response) => {
        setData(response.payload);
      });
    }
  }, [FormName, currentId]);
  useEffect(() => {
    if (!drawer) {
      setNewRecord(false);
    }
  }, [drawer]);

  const deleteEnty = (id) => {
    deleteTableRecords(userFormName, id).then((data) => {
      if (data.statusCode === 200) {
        setFetchData(true);
        setSelectedRecordAction({});

        notify.success('Data deleted succesfully');
      }
    });
  };

  const deleteActionHandler = () => {
    const recordId = selectedRecordAction?.record;
    if (Array.isArray(recordId)) {
      const uuidArray = recordId.map((item) => item.uuid);
      if (uuidArray) {
        deleteEnty(uuidArray);
      }
    } else {
      deleteEnty([recordId]);
    }
  };

  const getUniqueKeys = (data) => {
    let keys = [];
    data.forEach((item) => {
      keys = keys.concat(Object.keys(item));
    });
    return keys;
  };
  const handleDrawerOpen = () => {
    setDrawer(false);
    setCurrentId(null);
  };
  const submitHandler = (values) => {
    setSubmitFlag(true);
    createTableRecord(FormName, {
      ...values,
      ...(editableData ? editableData : {}),
      files: (!selectedRecordId && attachments) || null
    })
      .then((data) => {
        if (data.status) {
          setDrawer(false);
          setSubmitFlag(false);
          setFetchData(true);

          notify.success('Data Updated succesfully');
        } else {
          alert(data.message);
        }
      })
      .catch((e) => console.log(e));
  };
  const handleBulkSave = (name, payload) => {
    const formName = name;
    const data = payload;

    updateBulkRecord(formName, data)
      .then((response) => {
        if (response.status) {
          setDrawer(false);
          setSubmitFlag(false);
          setFetchData(true);
          notify.success('Data Updated succesfully');
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error saving bulk data:', error);
      });
  };

  const columnPreferenceHandler = async (formId, data) => {
    const fieldPreference = createFieldPreference(formId, {
      fieldNames: data
    });

    await fieldPreference;
    fieldPreference.then((data) => {
      if (data.statusCode === 200) {
        notify.success('Column Preference successful');
        setFetchData(true);
      } else {
        notify.error('Column Preference failed');
      }
    });
  };

  const onRowSelectionModelChange = (rowId) => {
    dispatch(
      fetchRecordById({
        tableName: FormName,
        UUID: rowId.data.uuid
      })
    );

    let selectedObj = allFormData.filter((k) => k.uuid === rowId.data.uuid);
    if (userFormName === 'system_slots' && rowId) {
      const filteredShiftData = allFormData.filter(
        (o) => o?.name === selectedObj[0].name
      );
      setEditFormData(filteredShiftData);
    }

    setSelectedRecordAction({
      type: 'edit',
      record: selectedObj[0]
    });
    setDrawer(true);
    setCurrentId(rowId.data.uuid);
  };

  const handleImportCSV = () => {
    setImportDrawer(true);
    dispatch(fetchFormFromService({ name: 'system_holidays' }));
  };
  useEffect(() => {
    if (transformedDataRef.current?.data && searchTerm) {
      const lowercasedSearchTerm = searchTerm.trim().toLowerCase();
      const filtered = transformedDataRef.current.data.filter((item) => {
        return getUniqueKeys(transformedDataRef.current.data).some((key) =>
          item[key]?.toString().toLowerCase().includes(lowercasedSearchTerm)
        );
      });
      setFilteredData(filtered);
      const obj = {
        totalRecords: filtered.length,
        data: filtered
      };
      setTransformedData(obj);
    }
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="mx-auto flex min-w-full max-w-screen-lg items-center justify-center">
        <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
      </div>
    );
  }
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setRefetch(!refetch);
  };
  const handleBackNavigation = () => {
    navigate(-1);
  };

  const CustomToolbar = () => {
    return (
      <div className="flex items-center justify-between py-4 pr-2" style={{}}>
        <div className="flex items-center">
          <Input
            id="input-search-card-style1"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Search size={16} />}
          />

          {FormName === 'system_holidays' ? (
            <Button className="mx-1" onClick={handleImportCSV}>
              Import CSV
            </Button>
          ) : null}
          <div className="mx-2">
            <Menubar onClick={handleClick} className="border-none">
              <MenubarMenu className>
                <MenubarTrigger
                  asChild
                  className="cursor-pointer focus:bg-primary focus:text-white data-[state=close]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-white"
                >
                  <Button
                    className="cursor-pointer focus:bg-transparent focus:text-secondary data-[state=open]:bg-transparent data-[state=open]:text-secondary"
                    variant={'outline'}
                  >
                    Action <ChevronDown size={20} />
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="min-w-[6rem]">
                  <MenubarItem
                    onClick={(e) => {
                      const selectedObj = allFormData.filter(
                        (k) => k.uuid === selectedRows[0]
                      );

                      if (
                        userFormName === 'system_slots' &&
                        selectedRows.length > 0
                      ) {
                        const filteredShiftData = allFormData.filter(
                          (o) => o?.name === selectedObj[0].name
                        );
                        setEditFormData(filteredShiftData);
                      }

                      e.stopPropagation();
                      setSelectedRecordAction({
                        type: 'edit',
                        record: selectedObj[0]
                      });
                      setDrawer(true);
                      setCurrentId(selectedRows[0]);
                    }}
                    className="flex cursor-pointer items-center justify-start gap-x-2 text-secondary"
                  >
                    <Pencil size={16} className="" />
                    Edit
                  </MenubarItem>
                  <MenubarItem
                    onClick={(e) => {
                      const selectedObj = allFormData.filter(
                        (k) => k.uuid === selectedRows[0]
                      );

                      if (userFormName === 'system_slots') {
                        const filteredShiftData = allFormData.filter(
                          (o) => o?.name === selectedObj[0].name
                        );
                        setEditFormData(filteredShiftData);
                        setSelectedRecordAction({
                          type: 'delete',
                          record: filteredShiftData
                        });
                      } else {
                        setSelectedRecordAction({
                          type: 'delete',
                          record: selectedRows[0]
                        });
                      }

                      e.stopPropagation();
                    }}
                    className="flex cursor-pointer items-center justify-start gap-x-2 text-secondary"
                  >
                    <Trash2 size={16} className="" />
                    Delete
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          <Button
            onClick={addUserHandler}
            className="bg-primary font-bold dark:bg-primary"
          >
            <Plus size={16} strokeWidth={3} />
            Add New
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div
      className=""
      style={{
        borderRadius: '8px',
        backgroundColor:
          currentTheme === 'Dark' ? colors.darkLevel2 : colors.white
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
    >
      <div className="h-[calc(100vh-100px)] bg-background">
        <GridTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRecords={totalRecords}
          fields={fields}
          preferences={prefrences}
          handledRowClick={onRowSelectionModelChange}
          rowSelectionMode="single"
          setSelectedRows={setSelectedRows}
          CustomToolbar={CustomToolbar()}
          currentForm={formdetail}
          setRefetch={setRefetch}
          fieldLabels={fieldLabels}
          tableData={transformedData}
          setWhere={setWhere}
          loading={loading}
          where={where}
          handleRowsPerPageChange={handleRowsPerPageChange}
          columnPreferenceHandler={columnPreferenceHandler}
          usedElements={['header', 'table', 'pagination']}
          rowTooltip="Double click to edit record"
          headerLabel={
            <div className="flex items-center">
              <div
                className={`hover:bg-primary-dark z-10 mx-2 flex cursor-pointer items-center justify-center rounded-md bg-accent hover:text-primary`}
                onClick={() => handleBackNavigation()}
              >
                {isBackArrowEnabled && (
                  <Tooltip>
                    <TooltipTrigger>
                      <ArrowLeft size={16} className="cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="mt-2">
                      <p>Back</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {/* <Label className="text-base font-medium"> */}
              {title || formdetail?.displayName}
              {/* </Label> */}
            </div>
          }
        />
      </div>

      <ConfirmationModal
        open={selectedRecordAction?.type === 'delete'}
        heading={`Delete record`}
        onConfirm={deleteActionHandler}
        onCancel={() => setSelectedRecordAction({})}
        firstButtonText="Cancel"
        secondButtonText="Confirm"
        message={'Are you sure you want to delete this record?'}
      />
      <Sheet key={'right'} open={drawer} onOpenChange={handleDrawerOpen}>
        <SheetContent
          side={'right'}
          className="max-w-[700px] bg-white sm:max-w-[700px]"
        >
          {drawer && (
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800">
              <div className="py-1.5 pr-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Label className={`text-lg font-medium text-gray-700`}>
                    {newRecord
                      ? `Add ${title || 'record'} `
                      : `Edit ${title || 'record'} `}
                  </Label>
                  <div className="space-x-2">
                    <Button form="system_user" type="submit">
                      {newRecord ? 'Save' : 'Update'}
                    </Button>

                    {!newRecord && (
                      <Button
                        variant="outline"
                        className="rounded px-4 py-2 text-sm hover:bg-red-600 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          let selectedObj = allFormData.filter(
                            (k) => k.uuid === currentId
                          );
                          if (userFormName === 'system_slots') {
                            const filteredShiftData = allFormData.filter(
                              (o) => o?.name === selectedObj[0].name
                            );
                            setEditFormData(filteredShiftData);
                            setSelectedRecordAction({
                              type: 'delete',
                              record: filteredShiftData
                            });
                          } else {
                            setSelectedRecordAction({
                              type: 'delete',
                              record: currentId
                            });
                          }
                          setDrawer(false);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                <div className="py-2">
                  <Separator className="h-[1px]" />
                </div>
              </div>
              <div className="relative h-[calc(100vh-6.875rem)]">
                {prevLoading ? (
                  <div className="mx-auto flex min-w-full max-w-screen-lg items-center justify-center">
                    <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
                  </div>
                ) : FormName === 'system_user' ? (
                  <AddEditUser
                    formId="system_user"
                    fieldValues={newRecord ? null : tableRecord}
                    setDrawer={setDrawer}
                    drawer={drawer}
                    setRefetch={setRefetch}
                    setSubmitFlag={setSubmitFlag}
                    setFetchData={setFetchData}
                  />
                ) : FormName === 'system_form_template' ? (
                  <AddEditTemplate
                    formName="system_user"
                    selectedRecordId={currentId}
                  />
                ) : FormName === 'system_email_inbound_rules' ? (
                  <EmailInboundSytem
                    mode="preview"
                    newRecord={newRecord}
                    formId="system_user"
                    fieldData={fields || []}
                    fieldValues={newRecord ? null : tableRecord}
                    showSystemDefaultField={currentId && true}
                    onSubmitAllData={submitHandler}
                    selectedRecordId={currentId}
                    fieldGroups={fieldGroups}
                  />
                ) : FormName === 'system_slots' ? (
                  (console.log(editFormData, '1111'),
                  (
                    <Availability
                      newRecord={newRecord}
                      apiData={newRecord ? null : editFormData}
                      formId="system_user"
                      onSubmit={handleBulkSave}
                    />
                  ))
                ) : FormName === 'system_holidays' ? (
                  <AddEditHolidays
                    newRecord={newRecord}
                    formId="system_user"
                    fieldData={newRecord ? null : tableRecord}
                    onSubmit={submitHandler}
                  />
                ) : FormName === 'system_sla_policies' ? (
                  <SlaPolicies
                    mode="preview"
                    formId="system_user"
                    newRecord={newRecord}
                    fieldData={fields || []}
                    fieldValues={newRecord ? null : tableRecord}
                    showSystemDefaultField={currentId && true}
                    onSubmitAllData={submitHandler}
                    selectedRecordId={currentId}
                    fieldGroups={fieldGroups}
                  />
                ) : FormName !== 'system_user' ? (
                  <AddEditRecord
                    formId="system_user"
                    fieldData={fields || []}
                    fieldValues={newRecord ? null : tableRecord}
                    showSystemDefaultField={currentId && true}
                    onSubmit={submitHandler}
                    fieldGroups={fieldGroups}
                  />
                ) : null}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {openImportDrawer && (
        <ImportData
          openImportDrawer={openImportDrawer}
          setImportDrawer={setImportDrawer}
          fields={fields}
          setRefetch={setRefetch}
        />
      )}
    </div>
  );
};

export default DataTable;
