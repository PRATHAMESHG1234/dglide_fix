/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import '../modify-record.css';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
import { FIELD } from '../../../common/constants/fields';
import { colors } from '../../../common/constants/styles';
import { fetchFieldObjectByFormId } from '../../../services/field';
import {
  fetchRecordsBytableName,
  fetchTableReferenceData,
  fetchTableReferenceDataByUUID
} from '../../../services/table';
import Attachment from '../Attachment';
import ModifyReferenceRecord from '../ModifyReferenceRecord';
import {
  Tabs,
  Tab,
  Box,
  Chip,
  Typography,
  // Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  FormControl
} from '@mui/material';
import TextArea from '../../../elements/TextArea';
import { fetchBatchTableCountValues } from '../../../redux/slices/tableSlice';
import { fetchAttachmentCount } from '../../../services/attachment';
import HeaderActions from './HeaderActions';
import TabsData from './TabsData';
import { DefaultSortIcon, SortAscIcon, SortDecIcon } from './icons';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconColumns2, IconColumns3 } from '@tabler/icons-react';
import AuditList from './AuditList';
import RichTextEditor from '../../../elements/RichTextEditor';
import ComposeDialog from '../../../pages/ComposeDialog';
import {
  createGridFieldPreference,
  fetchGridFieldPreference
} from '../../../services/fieldPreference';
import AddEditRecord from '../addEditRecord/AddEditRecord';
import { Field } from 'formik';
import RecordDetailsView from './RecordDetailsView';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/componentss/ui/menubar';
import { ArrowLeft, Columns2, Columns3, Pencil } from 'lucide-react';
import { Button } from '@/componentss/ui/button';
import { notify } from '../../../hooks/toastUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

const DataTableTabs = ({
  fields,
  data,
  editableData,
  setEditableData,
  selectedRecordId,
  isMinimized,
  setIsMinimized,
  hasTabs,
  setHasTabs,
  height,
  fieldValues,
  recordActions,
  recordSubmitHandler,
  showEditRecord,
  setShowEditRecord,
  // toggle,
  assetsTreeStructure
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentForm, currentModule } = useSelector((state) => state.current);
  const [open, setOpen] = useState(false);
  const { tableRecord, recordCount } = useSelector((state) => state.table);
  const { currentTheme } = useSelector((state) => state.auth);
  const { fieldGroups } = useSelector((state) => state.fieldGroup);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [referenceLookupTabs, setReferenceLookupTabs] = useState([]);
  const [attachmentTab, setAttachmentTab] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [selectedTable, setSelectedTable] = useState();
  const [totalRecords, setTotalRecords] = useState(0);
  const [isDeftabData, setIsDeftabData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedTabDataRecordId, setSelectedTabDataRecordId] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [atValues, setAtValues] = useState([]);
  const [showColumnPreference, setShowColumnPreference] = useState(false);
  const [taggedEmails, setTaggedEmails] = useState([]);

  const [toggle, setToggle] = useState('Format-1');
  const [refField, setRefField] = useState({
    open: false,
    formId: 0,
    label: '',
    fieldName: ''
  });
  const [pagination, setPagination] = useState({
    pageSize: 20,
    page: 0
  });
  const [fieldLabels, setFieldLabels] = useState({});
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [sort, setSort] = useState([]);
  const [sortIcon, setSortIcon] = useState(DefaultSortIcon);
  const [dateRangeObj, setDateRangeObj] = useState({});
  const [where, setWhere] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [currentTab, setCurrentTab] = useState('details');
  const [recordActionShow, setRecordActionShow] = useState(false);
  const index = referenceLookupTabs.filter(
    (item) => item.isTabExpanded === true
  );

  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchAndSetRecords = async () => {
      const data = await fetchRecordsBytableName('system_user', 1000);

      const mappedData = data?.data?.map((item, index) => {
        return {
          id: index + 1,
          name: item?.user_name || 'name',
          email: item?.user_email || 'nam@example.com'
        };
      });
      setAtValues(mappedData);
    };

    if (currentTab === 'Activity') {
      fetchAndSetRecords();
    }
  }, [currentTab]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    setRows([]);
    setColumns([]);
    setLoading(true);
    setSelectedTabIndex(newValue);

    const selectedTab = referenceLookupTabs[newValue - 1];
    const newData = referenceLookupTabs.map((ele) => {
      ele.isTabExpanded = false;
      ele.openFormModal = false;
      ele.openFormInline = false;

      if (ele) {
        ele.isTabExpanded = true;
        return ele;
      }
      return ele;
    });

    setReferenceLookupTabs([...newData]);

    setSelectedTable(selectedTab);
  };

  const handleChange = (fieldName, value) => {
    setEditableData((prevState) => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  useEffect(() => {
    if (selectedRecordId) {
      const tables = [];
      const fieldRefLookup = fields?.filter(
        (field) =>
          field.category === 'TableReference' ||
          field.category === 'TableLookup' ||
          field.category === 'activity'
      );
      if (fieldRefLookup) {
        fieldRefLookup.forEach((field) => {
          tables.push({
            id: field.lookup?.formInfoId || 0,
            fieldInfoId: field.fieldInfoId,
            name: field.name,
            label: field.label,
            lookupFormName: field.lookup?.formName,
            type: field.category,
            isTabExpanded: field.lookup?.defaultTabExpanded || false,
            openFormModal: false,
            openFormInline: false,
            totalRecords: field.totalRecords,
            field
          });
        });
        setReferenceLookupTabs(tables);
      }
    }

    const attachmentField = currentForm?.attachment;
    const isEnableAudit = currentForm?.audit;
    if (attachmentField) {
      setAttachmentTab({
        id: 0,
        label: 'Attachments',
        type: 'Attachment',
        isTabExpanded: false
      });
    }
    const textAreaFields = fields?.filter(
      (field) => field.category === 'TextArea' && field.showOnTab
    );

    if (textAreaFields) {
      textAreaFields.forEach((field) => {
        let textAreaTab = {
          id: field.fieldInfoId,
          label: field.label,
          type: 'textarea',
          variant: field.variant,
          field: field,
          fieldInfoId: field.fieldInfoId,
          isTabExpanded: false
        };
        setReferenceLookupTabs((prevTabs) => [...prevTabs]);
      });
    }

    if (isEnableAudit) {
      const auditTab = {
        id: 'audit',
        label: 'Audit',
        type: 'audit',
        isTabExpanded: false
      };
      setReferenceLookupTabs((prevTabs) => [...prevTabs, auditTab]);
    }
    if (attachmentTab) {
      const attachmentTab = {
        id: 'attachment',
        label: 'Attachment',
        type: 'attachment',
        isTabExpanded: false
      };
      setReferenceLookupTabs((prevTabs) => [...prevTabs, attachmentTab]);
    }
  }, [fields, tableRecord]);

  useEffect(() => {
    let isMounted = true;

    const fetchAttachmentData = async () => {
      if (!currentForm || !selectedRecordId || !refetch) return;

      try {
        const res = await fetchAttachmentCount(
          currentForm.name,
          selectedRecordId
        );
        if (isMounted) {
          setAttachmentCount(res?.result || 0);
        }
      } catch (error) {
        console.error('Error fetching attachment count:', error);
      } finally {
        if (isMounted) {
          setRefetch(false);
        }
      }
    };

    fetchAttachmentData();

    return () => {
      isMounted = false;
    };
  }, [currentForm, selectedRecordId, refetch]);

  const getCounts = async () => {
    const tablePayload = {};
    for (const field of fields) {
      if (field) {
        if (
          field.category === 'TableReference' ||
          field.category === 'TableLookup' ||
          field?.category === 'activity'
        ) {
          const conditions = field.lookup?.conditions;

          const whereDynamicValue =
            ((field?.category === 'TableLookup' ||
              field?.category === 'TableReference') &&
              field?.activityReferenceField) ||
            field?.category === 'activity'
              ? {
                  record_id: {
                    value: tableRecord?.uuid
                  },
                  form_info_id: {
                    value: currentForm?.formInfoId
                  }
                }
              : tableRecord
                ? Object.fromEntries(
                    conditions
                      ?.filter((cond) => cond?.valueDynamic && cond?.fieldName)
                      .map((cond) => [
                        cond.fieldName,
                        { value: tableRecord[cond.fieldName] || '' }
                      ])
                  )
                : {};
          tablePayload[field.fieldInfoId] = {
            recordId: tableRecord?.uuid,
            type: field.category,
            where: [],
            whereDynamicValue: whereDynamicValue || {}
          };
        }
      }
    }
    dispatch(fetchBatchTableCountValues({ data: tablePayload }));
  };

  useEffect(() => {
    if (refetch) {
      getCounts();
    }
  }, [fields, tableRecord, refetch]);

  useEffect(() => {
    setRefetch((prev) => !prev);
  }, []);

  useEffect(() => {
    if ((pagination, selectedTable, sort, where, currentTab)) {
      setTimeout(() => {
        fetchTableReferenceRecords();
      }, 500);
    }
  }, [
    pagination,
    selectedTable,
    sort,
    where,
    refetch,
    tableRecord,
    currentTab
  ]);

  const openFormModal = (tab) => {
    const newData = referenceLookupTabs.map((ele) => {
      if (ele.name === tab.name) {
        ele.openFormModal = true;
        return ele;
      }
      return ele;
    });
    setReferenceLookupTabs([...newData]);
  };

  const closeIndivisualModal = () => {
    const newData = referenceLookupTabs.map((ele) => {
      ele.openFormModal = false;
      return ele;
    });
    setReferenceLookupTabs([...newData]);
  };

  useEffect(() => {
    setIsDeftabData(true);
  }, []);

  if (isDeftabData) {
    const expandedTabData = referenceLookupTabs?.filter(
      (tab) => tab.isTabExpanded
    );
    const tabVal = Object.assign({}, ...expandedTabData);

    if (tabVal) {
      setSelectedTable(tabVal);
    }
    setIsDeftabData(false);
  }
  const handleAttachmentTabChange = (_index, tab) => (_event, isExpanded) => {
    isExpanded ? setSelectedTable(tab) : setSelectedTable(null);

    setAttachmentTab((prev) => {
      return { ...prev, isTabExpanded: isExpanded };
    });
  };
  const openFormInlineHandler = (tab) => {
    const newData = referenceLookupTabs.map((ele) => {
      if (ele.name === tab.name) {
        if (!ele.openFormModal) {
          ele.openFormInline = !ele.openFormInline;
        }
        return ele;
      }
      ele.openFormInline = false;
      return ele;
    });
    setReferenceLookupTabs([...newData]);
  };

  const addNewRecord = (tab) => {
    setSelectedRecord({});

    // openFormInlineHandler(tab);
    openFormModal(tab);
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return format(dateTime, 'yyyy-MM-dd HH:mm');
  };

  const fetchTableReferenceRecords = async () => {
    if (
      !selectedTable ||
      !selectedTable.id ||
      !selectedTable.fieldInfoId ||
      !selectedRecordId
    )
      return;

    setLoading(true);
    setRows([]);
    setColumns([]);
    setSelectedTabDataRecordId('');

    try {
      const fieldLabels = await fetchFieldObjectByFormId(selectedTable.id);
      setFieldLabels(fieldLabels);

      const conditions = selectedTable.field.lookup?.conditions;

      const whereDynamicValue =
        (selectedTable?.field?.category === 'TableLookup' &&
          selectedTable?.field?.activityReferenceField) ||
        selectedTable?.field?.category === 'activity'
          ? {
              record_id: {
                value: tableRecord['uuid']
              },
              form_info_id: {
                value: currentForm?.formInfoId
              }
            }
          : tableRecord
            ? Object.fromEntries(
                conditions
                  ?.filter((cond) => cond?.valueDynamic && cond?.fieldName)
                  .map((cond) => [
                    cond.fieldName,
                    { value: tableRecord[cond.fieldName] || '' }
                  ])
              )
            : {};

      fetchGridFieldPreference(selectedTable?.fieldInfoId).then((res) => {
        setPreferences(res?.result);
      });

      if (!selectedTable?.field || !selectedTable?.field?.lookup) return;
      setRefField({
        open: true,
        fieldInfoId: selectedTable.field.fieldInfoId,
        formId: selectedTable.field.lookup.formInfoId,
        lookupFormName: selectedTable.field.lookup.formName,
        name: selectedTable.field.name,
        fieldName: selectedTable.field.lookup.fieldName,
        parentFormInfoId: selectedTable.field.lookup.parentFormInfoId
      });
      const currentPages = {
        pageSize: rowsPerPage,
        page: currentPage - 1
      };

      const { data, totalRecords } = await fetchTableReferenceData(
        selectedTable.fieldInfoId,
        selectedTable.type,
        selectedRecordId,
        currentPages,
        sort,
        where,
        whereDynamicValue
      );

      setLoading(false);
      getCounts();
      setTotalRecords(totalRecords);

      setReferenceLookupTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.name === selectedTable.name ? { ...tab, totalRecords } : tab
        )
      );
      if (data.length > 0) {
        const keysData = Object.keys(data[0]);
        const headers = keysData
          .filter((key) => key !== 'uuid')
          .map((key) => ({
            headerName: fieldLabels[key] || key,
            field: key,
            flex: 1,
            minWidth: 180,
            valueGetter: (params) =>
              key === FIELD.CREATED_AT
                ? formatDateTime(params.value)
                : params.value
          }));

        const modifiedData = data.map((record) => ({
          ...record,
          id: record[FIELD.UUID]
        }));

        setRows(modifiedData);
        setColumns(headers);
      }
    } catch (error) {
      setLoading(false);
      setRows([]);
      setColumns([]);
      console.error(error);
    }
  };

  const columnPreferenceHandler = async (fieldId, data) => {
    const fieldPreference = createGridFieldPreference(fieldId, {
      fieldNames: data
    });
    await fieldPreference;
    fieldPreference.then((data) => {
      if (data.statusCode === 200) {
        notify.success('Column Preference successful');
        setRefetch(!refetch);
      } else {
        notify.error('Column Preference failed');
      }
    });
    setShowColumnPreference(false);
  };

  const onRecordSelected = (selectedRowId, tab) => {
    if (!selectedRowId || !tab) return null;
    setSelectedTabDataRecordId(selectedRowId);
    fetchTableReferenceDataByUUID(tab?.fieldInfoId, selectedRowId).then(
      (res) => {
        setSelectedRecord(res?.result);
        openFormModal(tab);
      }
    );
  };

  const onclickSort = () => {
    let newSortDirection = 'asc';
    if (sort.length > 0) {
      const existingSort = sort.find((s) => s.order === 'asc');

      newSortDirection = existingSort ? 'desc' : 'asc';
      const sorting = {
        columnName: 'created_at',
        order: newSortDirection
      };
      setSort([sorting]);
      setSortIcon(newSortDirection === 'asc' ? SortAscIcon : SortDecIcon);
    } else {
      const sorting = {
        columnName: 'created_at',
        order: newSortDirection
      };
      setSort([sorting]);
      setSortIcon(SortAscIcon);
    }
  };

  const onDateRangeChanged = (name, value) => {
    if (!name && !value) return;

    if (name === 'from') {
      setDateRangeObj((obj) => {
        return {
          ...obj,
          [name]: {
            fieldName: 'created_at',
            operator: '>=',
            value
          }
        };
      });
    }
    if (name === 'to') {
      setDateRangeObj((obj) => {
        return {
          ...obj,
          [name]: {
            fieldName: 'created_at',
            operator: '<=',
            value
          }
        };
      });
    }
  };

  const onClickSearch = () => {
    if (!dateRangeObj.from || !dateRangeObj.to) return;
    const operatorObj = {
      operator: 'AND',
      value: 'AND'
    };
    const selectedRangeArr = [dateRangeObj.from, operatorObj, dateRangeObj.to];
    setWhere(selectedRangeArr);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }
  function TabPanel({ children, value, index, ...other }) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
      </div>
    );
  }
  useEffect(() => {
    if (referenceLookupTabs?.length === 0 && !attachmentTab) {
      setHasTabs(false);
    } else if (referenceLookupTabs?.length > 0 || attachmentTab) {
      setHasTabs(true);
    }
  }, [referenceLookupTabs, attachmentTab]);

  if (hasTabs === null) {
    return <div>Loading...</div>;
  }

  const onReactQuillValueChanged = (content, field) => {
    const name = field?.name;
    const URL = process.env.REACT_APP_STORAGE_URL;
    const updatedData = content?.replace(new RegExp(URL, 'g'), 'STORAGE_URL');
    if (!updatedData) return;
    setEditableData((prevState) => ({
      ...prevState,
      [name]: updatedData
    }));
  };

  const testAreaFields = (tab) => {
    const field = tab?.field;
    const textArea =
      tab?.variant === 'RichText' ? (
        <RichTextEditor
          className="ReactQuill"
          style={{ maxWidth: 840 }}
          label=""
          value={editableData[field?.name] || fieldValues[field?.name] || ''}
          onChange={(content) => onReactQuillValueChanged(content, field)}
          placeholder="Enter..."
          form={currentForm}
        />
      ) : (
        <TextArea
          className="m-1 border-0 pt-2"
          labelname=""
          autoFocus
          name="editable-text"
          value={editableData[field?.name] || fieldValues[field?.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          minRows={4}
          maxRows={4}
          style={{ minWidth: '200px', width: 'calc(100% - 30px)' }}
        />
      );

    return textArea;
  };
  const tabStyle = {
    // height: 'calc(100vh - 95px)',
    // overflow: 'auto',
    // paddingBottom: '100px'
  };
  const handleToggleChanges = (event, newToggle) => {
    if (newToggle !== null) {
      setToggle(newToggle);

      const existingData = localStorage.getItem('Format');
      let formatData = {};

      if (existingData) {
        formatData = JSON.parse(existingData);
      }

      formatData[currentForm.formInfoId] = newToggle;
      localStorage.setItem('Format', JSON.stringify(formatData));
    }
  };
  const togglebarStyle = (format) => ({
    backgroundColor: toggle === format ? '#BFDBFE' : 'transparent',
    color: '#047eae'
  });

  const fieldFormats = (
    <Menubar className="bg-white">
      <MenubarMenu>
        <Tooltip>
          <TooltipTrigger>
            <MenubarTrigger
              onClick={() => handleToggleChanges(null, 'Format-1')}
              className={`cursor-pointer rounded-md p-2 text-secondary transition-all duration-200 ease-in-out`}
              aria-label="format 1"
              style={togglebarStyle('Format-1')}
            >
              <Columns2 size={14} />
            </MenubarTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="mt-2">
            <p>Two column view</p>
          </TooltipContent>
        </Tooltip>
      </MenubarMenu>
      <MenubarMenu>
        <Tooltip>
          <TooltipTrigger>
            <MenubarTrigger
              onClick={() => handleToggleChanges(null, 'Format-2')}
              className={`cursor-pointer rounded-md p-2 text-secondary transition-all duration-200 ease-in-out`}
              aria-label="format 2"
              style={togglebarStyle('Format-2')}
            >
              <Columns3 size={14} />
            </MenubarTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="mt-2">
            <p>Three column view</p>
          </TooltipContent>
        </Tooltip>
      </MenubarMenu>
    </Menubar>
  );

  return (
    <div className="relative">
      <div className="flex items-center bg-[#f7f8fa]">
        <div
          className={`hover:bg-primary-dark z-10 mx-2 mb-2 flex cursor-pointer items-center justify-center rounded-md bg-accent p-2 hover:text-primary`}
          onClick={() => {
            showEditRecord && currentTab === 'details'
              ? setShowEditRecord(false)
              : navigate(-1);
          }}
        >
          <Tooltip>
            <TooltipTrigger>
              <ArrowLeft size={16} className="cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="mt-2">
              <p>Back</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="">
          <Tabs
            value={value}
            variant="scrollable"
            indicatorColor="primary"
            onChange={handleChangeTab}
            sx={{
              fontSize: '0.875rem',
              mb: 2,
              minHeight: 'auto',
              zIndex: 100,
              '& button': {
                minWidth: 100
              },
              '& .MuiTabs-indicator': {
                color: '#047eae',
                bgcolor: '#047eae'
              },
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                // py: 1.5,
                pb: '10px',
                px: 1,
                mr: 2.25,
                color: colors.grey[600],
                textDecoration: 'none !important'
              },
              '& a.Mui-selected': {
                color: '#047eae'
              },
              borderBottom: `1px solid ${colors.grey[200]}`
            }}
            aria-label="simple tabs example"
          >
            <Tab
              to="#"
              key={0}
              label={
                <Typography
                  sx={{
                    display: 'flex',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}
                >
                  {'Details'}
                </Typography>
              }
              {...a11yProps(0)}
              sx={{ textTransform: 'none' }}
            />

            {referenceLookupTabs?.map((tab, index) => {
              return (
                <Tab
                  key={index}
                  onClick={() => {
                    setCurrentTab(tab?.label);
                    setRecordActionShow(false);
                  }}
                  to="#"
                  label={
                    <Typography
                      sx={{
                        display: 'flex',
                        fontWeight: 500,
                        fontSize: '0.875rem'
                      }}
                    >
                      {tab?.label}
                      {tab.type !== 'textarea' && tab.type !== 'audit' && (
                        <Chip
                          label={
                            recordCount?.[tab.fieldInfoId] ||
                            (tab?.type === 'attachment' && attachmentCount) ||
                            0
                          }
                          size="small"
                          sx={{
                            color: '#047eae',
                            background: colors.primary.light,
                            ml: 1.3
                          }}
                        />
                      )}
                    </Typography>
                  }
                  {...a11yProps(index + 1)}
                  sx={{ textTransform: 'none' }}
                />
              );
            })}
          </Tabs>
        </div>
      </div>

      {referenceLookupTabs?.map((tab, index) => {
        let fieldName = tab?.field?.name;

        return (
          <div
            role="tabpanel"
            hidden={value !== index + 1}
            id={`simple-tabpanel-${index + 1}`}
            aria-labelledby={`simple-tab-${index + 1}`}
            style={currentTab?.toLowerCase() === 'audit' ? tabStyle : {}}
            className="bg-background"
          >
            {value === index + 1 && (
              <div>
                {currentTab === 'textarea' ? (
                  testAreaFields(tab)
                ) : (
                  <>
                    <ModifyReferenceRecord
                      formName={tab.label}
                      formInfoId={tab?.id}
                      lookupFormName={tab?.lookupFormName}
                      onSubmit={(prev) => setRefetch(!prev)}
                      rowValue={selectedRecord || {}}
                      formExpand={tab.openFormInline}
                      setFormExpand={() => openFormInlineHandler(tab)}
                      openModal={tab?.openFormModal || false}
                      setOpenModal={closeIndivisualModal}
                      openFormModal={() => openFormModal(tab)}
                      field={tab?.field}
                      selectedTabDataRecordId={selectedTabDataRecordId}
                      setSelectedTabDataRecordId={setSelectedTabDataRecordId}
                      setTaggedEmails={setTaggedEmails}
                      taggedEmails={taggedEmails}
                      atValues={atValues}
                      setAtValues={setAtValues}
                    />

                    <HeaderActions
                      onclickSort={onclickSort}
                      addNewRecord={addNewRecord}
                      tab={tab}
                      handleClickOpen={() => setOpen(true)}
                    />

                    {open && (
                      <ComposeDialog
                        setOpen={setOpen}
                        fields={fields}
                        open={open}
                        selectedRecordId={selectedRecordId}
                        setRefetch={setRefetch}
                        fieldInfoId={
                          fields.find((f) => f.name === 'requester')
                            ?.fieldInfoId
                        }
                        uploadTab={fields.find(
                          (f) => f.name.toLowerCase() === 'activity'
                        )}
                      />
                    )}

                    <TabsData
                      currentTheme={currentTheme}
                      open={open}
                      formInfoId={tab?.id}
                      colors={colors}
                      tab={tab}
                      rows={rows}
                      handleSortClick={onclickSort}
                      setWhere={setWhere}
                      preferences={preferences}
                      fieldLabels={fieldLabels}
                      columns={columns}
                      loading={loading}
                      addNewRecord={addNewRecord}
                      onRecordSelected={onRecordSelected}
                      totalRecords={totalRecords}
                      pagination={pagination}
                      setPagination={setPagination}
                      columnPreferenceHandler={columnPreferenceHandler}
                      height={height}
                      refField={refField}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      setRefetch={setRefetch}
                      currentTab={currentTab?.toLowerCase()}
                      selectedRecordId={selectedRecordId}
                      attachmentTab={attachmentTab}
                      uploadTab={fields.filter(
                        (f) => f.category === 'activity'
                      )}
                      leftChildComponent={() => {
                        return (
                          <RecordDetailsView
                            showEditRecord={showEditRecord}
                            fields={fields}
                            fieldGroups={fieldGroups}
                            fieldValues={fieldValues}
                            toggle={toggle}
                            minimizeView={true}
                          />
                        );
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div
        role="tabpanel"
        hidden={value !== 0}
        id={`simple-tabpanel-${value}`}
        aria-labelledby={`simple-tab-${value}`}
        className={`${showEditRecord ? '' : ''}`}
      >
        <div className="absolute right-3 top-2 flex items-center justify-between gap-2">
          <div>{fieldFormats}</div>
          <div>
            <Button
              className="bg-primary font-bold"
              onClick={() => !showEditRecord && setShowEditRecord(true)}
              form="normal"
              type="submit"
            >
              {showEditRecord ? (
                'Save'
              ) : (
                <>
                  <span>
                    <Pencil size={14} />
                  </span>
                  Edit
                </>
              )}
            </Button>
          </div>
        </div>
        {!showEditRecord ? (
          <RecordDetailsView
            showEditRecord={showEditRecord}
            fields={fields}
            fieldGroups={fieldGroups}
            fieldValues={fieldValues}
            toggle={toggle}
            minimizeView={false}
          />
        ) : (
          <div className="h-[calc(100vh-140px)] max-h-[calc(100vh-140px)] overflow-scroll bg-background pl-2">
            <AddEditRecord
              fieldData={fields}
              fieldValues={fieldValues}
              fieldGroups={fieldGroups}
              formId="normal"
              hasDataTableTabs={hasTabs}
              hasTabs={
                selectedRecordId &&
                fields?.some(
                  (field) =>
                    field.category === 'Attachment' ||
                    field.category === 'TableReference' ||
                    field.category === 'TableLookup' ||
                    field.category === 'TextArea' ||
                    field.category === 'Text Area'
                )
              }
              isMinimized={isMinimized}
              mode="preview"
              onSubmit={recordSubmitHandler}
              selectedRecordId={selectedRecordId}
              setIsMinimized={setIsMinimized}
              showSystemDefaultField={selectedRecordId && false}
              toggles={toggle}
              showEditRecord={showEditRecord}
              indentType="row"
              style={{ height: 'calc(100vh - 200px)' }}
            />
          </div>
        )}
        {assetsTreeStructure}
      </div>
    </div>
  );
};

export default DataTableTabs;
