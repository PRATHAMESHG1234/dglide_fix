/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Typography
} from '@mui/material';

import { colors, COLORS } from '../common/constants/styles';
import AddAttachment from '../components/modify-record/AddAttachment';
import AddEditRecord from '../components/modify-record/addEditRecord/AddEditRecord';
import PreviewRecord from '../components/modify-record/addEditRecord/PreviewRecord';
import DataTableTabs from '../components/modify-record/tabs/DataTableTabs';
import ActionList from '../components/records/data-grid/ActionList';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import SelectField from '../elements/SelectField';
import { fetchActions } from '../redux/slices/actionSlice';
import { setSelectedRecordId } from '../redux/slices/currentSlice';
import { fetchFieldsByFormId } from '../redux/slices/fieldSlice';
import { fetchRecordById, resetTableStore } from '../redux/slices/tableSlice';
import {
  fetchAllTemplateByFormInfoId,
  fetchTemplateByRecordId
} from '../services/formTemplate';

import { Menubar, MenubarMenu, MenubarTrigger } from '@/componentss/ui/menubar';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

import {
  createTableRecord,
  deleteTableRecord,
  fetchRecords,
  saveTreeData,
  updateMultipleTableRecord
} from '../services/table';
import {
  fetchParentTreeListByChildFormId,
  fetchTreeStructureByFormId
} from '../services/form';
import { fetchFieldsByFormId as fetchFieldsByFormInfoId } from '../services/field';
import FailedPage from './FailedPage';

import './modifyRecord.css';
import { fetchFieldGroups } from '../redux/slices/fieldGroupSlice';
import { notify } from '../hooks/toastUtils';
import { Button } from '@/componentss/ui/button';
import { Dropdown } from '@/componentss/ui/dropdown';
import { useSidebar } from '@/componentss/ui/sidebar';

import { ArrowLeft, Columns2, Columns3 } from 'lucide-react';
const templateAccessFormName = 'system_form_template';

const ModifyRecord = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const { tableRecord } = useSelector((state) => state.table);
  const { currentTheme } = useSelector((state) => state.auth);
  const { attachments } = useSelector((state) => state.attachment);
  const { fieldGroups } = useSelector((state) => state.fieldGroup);
  const { isLoading, fields, tableData } = useSelector((state) => state.field);
  const { isOpen } = useSelector((state) => state.sidebar);
  const { currentForm, currentModule, selectedRecordId } = useSelector(
    (state) => state.current
  );
  const { actions } = useSelector((state) => state.action);
  const [toggle, setToggle] = useState('Format-1');

  const [selectedRows, setSelectedRows] = useState([]);
  const [updateRecordData, setUpdateRecordData] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [selectedActionData, setSelectedActionData] = useState([]);
  const [preview, setPreview] = useState(false);
  const [deleteRecordData, setDeleteRecordData] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState();
  const [templates, setTemplates] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [accessedFormNames, setAccessedFormNames] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasTabs, setHasTabs] = useState(null);
  const [height, setHeight] = useState(0);
  const [showAttachmentField, setShowAttachmentField] = useState(false);
  const [failedPage, setFailedPage] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [selectedAssetsList, setSelectedAssetsList] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState(0);
  const [assetsFields, setAssetsFields] = useState({});
  const [treeValues, setTreeValues] = useState({});
  const [treeListValues, setTreeListValues] = useState({});
  const [isOpenAccordianData, setIsOpenAccordianData] = useState({});
  const [showEditRecord, setShowEditRecord] = useState(false);
  const [currentTab, setCurrentTab] = useState();
  const searchParam = new URLSearchParams(window.location.search);
  const { open } = useSidebar();
  const path2 = `/app/${currentModule?.name}/${currentForm?.name}/modify`;
  const minimalViewType = window.location.search === '?view-type=minimal';
  const redirect = useNavigate();
  const { isMobile } = useSidebar();

  useEffect(() => {
    const savedFormat = localStorage.getItem('Format');
    if (savedFormat) {
      const formatData = JSON.parse(savedFormat);
      const defaultFormat = formatData[currentForm?.formInfoId];
      if (defaultFormat) {
        setToggle(defaultFormat);
      }
    }
  }, [currentForm?.formInfoId]);

  useEffect(() => {
    const formInfoId = currentForm?.formInfoId;

    if (formInfoId) {
      dispatch(fetchFieldGroups({ formInfoId }));
    }

    const fetchAssetsStructure = async () => {
      if (formInfoId) {
        const res = await fetchTreeStructureByFormId(formInfoId);
        const result = res?.result;
        if (!res) return;

        setAssetsList(result);
      }
    };

    const fetchRecordsForTemplate = async () => {
      if (templateAccessFormName) {
        const res = await fetchRecords(templateAccessFormName, {
          pagination: {
            pageSize: 100,
            page: 0
          },
          where: [
            {
              fieldInfoId: 136,
              operator: '=',
              value: currentForm?.formInfoId
            }
          ],
          sort: []
        });
        const result = res?.data;
        const formNameList = result?.map((l) => l.form_info_id);

        setAccessedFormNames(formNameList);
      }
    };

    if (currentForm && !selectedRecordId) {
      fetchRecordsForTemplate();
    }
    if (currentForm?.tree) {
      fetchAssetsStructure();
    }
  }, [currentForm]);

  const isTemplateAccess = accessedFormNames?.includes(
    currentForm?.displayName
  );

  useEffect(() => {
    if (tableRecord && selectedRecordId) {
      setFieldValues(tableRecord);
      if (currentForm?.tree) {
        const data = tableRecord?.childData;
        const selectedId = tableRecord?.child_form_info_ids?.split(',').pop();

        fetchAssetsList(selectedId);

        const convertArrayToObject = (arr) => {
          return arr?.reduce((acc, item) => {
            acc[item.formInfoId] = item.data;
            return acc;
          }, {});
        };
        const values = convertArrayToObject(data);

        setTreeValues(values);
      }
    }
  }, [tableRecord]);

  useEffect(() => {
    const formInfoId = currentForm?.formInfoId;
    if (currentForm) {
      if (selectedRecordId) {
        dispatch(fetchActions({ formInfoId }));
      }
      dispatch(fetchFieldsByFormId({ formInfoId: currentForm?.formInfoId }));
    }
  }, [currentForm, dispatch]);

  useEffect(() => {
    const formInfoId = currentForm?.formInfoId;
    if (!formInfoId) return;

    if (isTemplateAccess) {
      fetchFormTemplates(formInfoId);
    }
  }, [isTemplateAccess]);

  useEffect(() => {
    dispatch(resetTableStore());
    setSelectedAssetId(currentForm?.formInfoId);
    setSelectedAssetsList([]);
  }, []);

  const fetchFormTemplates = async (formInfoId) => {
    const res = await fetchAllTemplateByFormInfoId(formInfoId);
    const formTepm = await res?.result;
    setTemplates(formTepm);
  };

  const fetchTemplateDetail = async (tempId) => {
    const res = await fetchTemplateByRecordId(tempId);
    const data = res?.result;
    const payloadString = data?.payload || {};
    const payload = JSON.parse(payloadString);
    setFieldValues(payload);
  };

  useEffect(() => {
    let selected = [selectedRecordId];
    setSelectedRows(selected);
  }, [selectedRecordId, dispatch]);

  useEffect(() => {
    const id = searchParams.get('id');
    dispatch(setSelectedRecordId({ recordId: id }));
  }, [searchParams]);

  useEffect(() => {
    if (currentForm?.formInfoId && selectedRecordId) {
      dispatch(
        fetchRecordById({
          tableName: currentForm.name,
          UUID: selectedRecordId
        })
      )
        .then((response) => {
          if (response.payload) {
            setData(response.payload);
            setLoading(false);
          } else {
            setFailedPage(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentForm, selectedRecordId, showEditRecord]);

  const deleteRecord = () => {
    deleteTableRecord({
      tableName: currentForm?.name,
      UUID: selectedRecordId
    })
      .then((data) => {
        if (data.status) {
          navigate(-1);
        } else {
          alert(data.message);
        }
      })
      .catch((e) => console.log(e));

    navigate(-1);
  };

  const submitHandler = (values) => {
    const data = {
      ...values,
      ...(editableData ? editableData : {}),
      files: (!selectedRecordId && attachments) || null
    };

    function convertObjectToArray(obj) {
      const filterIds = selectedAssetsList.map((item) => item.formInfoId);

      return Object.entries(obj)
        .filter(([key]) => filterIds.includes(parseInt(key)))
        .map(([key, value]) => ({
          formInfoId: key,
          payload: { ...value, files: [] }
        }));
    }

    if (!currentForm?.tree) {
      createTableRecord(currentForm?.name, data)
        .then((data) => {
          if (data.statusCode === 200) {
            if (showEditRecord) {
              setShowEditRecord(false);
            } else {
              navigate(-1);
            }
            notify.success(data?.message || 'Data saved sucessfully');
          } else {
            notify.error(data?.message || 'something went wrong !');
          }
        })
        .catch((e) => console.log(e));
    } else {
      const childPayloads = convertObjectToArray(treeListValues) || [];

      saveTreeData(currentForm?.name, {
        childPayloads: childPayloads,

        defaultPayload: data
      })
        .then((data) => {
          if (data.statusCode === 200) {
            navigate(-1);
            selectedAssetId(0);
            notify.success(data?.message || 'Data saved sucessfully');
          } else {
            notify.error(data?.message || 'something went wrong !');
          }
        })
        .catch((e) => console.log(e));
    }
  };

  const attachmentField = currentForm?.attachment;
  const shouldShowAttachment =
    attachmentField &&
    !(window.location.pathname === path2 && searchParam.has('id'));
  const goToDataManagement = (type, rowId) => {
    if (type === 'edit') {
      dispatch(setSelectedRecordId({ recordId: rowId }));
      navigate(`modify?id=${rowId}`);
      return;
    }
    dispatch(setSelectedRecordId({ recordId: 0 }));
    navigate('');
  };

  const onActionClickHandler = (action) => {
    if (selectedRows?.length <= 0) {
      alert('Please select one or more records to update');
      return;
    }
    if (action.type === 'Update') {
      const actionData = action.options.map((option) => {
        const field = fields.find(
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
      const headers = JSON.parse(action?.options[0].headerData);
      const payload = JSON.parse(action?.options[0].payload);

      const updatedPayload = () => {
        const xLabel = payload['x_label'];
        const typeOfXLabel = typeof xLabel;

        if (typeOfXLabel === 'object' && action.visibility === 'Record') {
          const selectedField = xLabel?.field;
          const fieldValue = fieldValues[selectedField?.toLowerCase()];
          return {
            ...payload,
            x_label: fieldValue
          };
        }
        return payload;
      };

      async function RestApiCall() {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              ...headers,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPayload())
          });

          const data = await res.json();

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
            const field = fields.find(
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
  const handleUpdateRecord = (actionData) => {
    let originalUrl = new URL(window.location.href);
    let modifiedUrl = originalUrl.pathname.replace(/\/modify/g, '');
    originalUrl.searchParams.delete('id');
    if (actionData) {
      updateMultipleTableRecord(currentForm.name, selectedRows, actionData)
        .then(() => {
          setRefetch(!refetch);
          setPreview(false);

          redirect(modifiedUrl + originalUrl.search);
          notify.success('Data saved succesfully');
        })
        .catch(() => notify.error('Something went wrong!'));
    }
    setUpdateRecordData(false);
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
    backgroundColor:
      toggle === format
        ? 'hsl(var(--secondary-foreground)) !important' // 50% opacity
        : 'transparent',

    color: 'hsl(var(--secondary)) !important'
  });
  const fieldFormats = (
    <Menubar>
      <MenubarMenu>
        <Tooltip>
          <TooltipTrigger>
            <MenubarTrigger
              onClick={() => handleToggleChanges(null, 'Format-1')}
              className={`${
                toggle === 'Format-1'
                  ? 'bg-blue-200 text-secondary'
                  : 'cursor-pointer dark:text-white'
              }`}
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
              className={`${
                toggle === 'Format-2'
                  ? 'bg-blue-200 text-secondary'
                  : 'cursor-pointer dark:text-white'
              }`}
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

  const flattenTree = (node, parentLabel = '') => {
    let flatList = [];

    const label = parentLabel
      ? `${parentLabel} > ${node.displayName}`
      : node.displayName;
    flatList.push({ value: node.formInfoId, label });

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        flatList = [...flatList, ...flattenTree(child, label)];
      });
    }

    return flatList;
  };

  const flatTree = flattenTree(assetsList);

  const recordActions = (modified = false) => {
    return (
      <>
        <div className="flex items-center justify-end gap-2">
          {currentForm?.tree && (
            <div className="px-2">
              <SelectField
                labelname="Assets"
                name="assets"
                value={
                  selectedAssetId ? selectedAssetId : currentForm?.formInfoId
                }
                id="input_category"
                options={flatTree.map((asset) => {
                  const { label, value } = asset;
                  return {
                    label,
                    value
                  };
                })}
                onChange={(e) => {
                  fetchAssetsList(e.target.value);

                  setIsOpenAccordianData((prev) => {
                    const allClosed = Object.keys(prev).reduce((acc, key) => {
                      acc[key] = false;
                      return acc;
                    }, {});

                    return {
                      ...allClosed
                    };
                  });
                }}
                size={'small'}
                style={{
                  height: '30px',
                  fontSize: '0.75rem',
                  bgcolor: COLORS.WHITE,
                  minWidth: '244px'
                }}
                fieldstyle={{
                  width: '300px',
                  minWidth: '500px'
                }}
                labelstyle={{
                  fontWeight: '500'
                }}
              />
            </div>
          )}

          {fieldFormats}
          {selectedRecordId && (
            <ActionList
              Key={'modify-record'}
              goToDataManagement={goToDataManagement}
              onActionClickHandler={onActionClickHandler}
              setDeleteRecordData={setDeleteRecordData}
              tableData={tableData}
              actions={actions}
              selectedRowsLength={selectedRecordId && 1}
            />
          )}

          <Button form="normal" type="submit" className="font-bold">
            {modified ? 'Update' : 'Submit'}
          </Button>
        </div>
      </>
    );
  };

  const fetchAssetsList = async (formInfoId) => {
    if (formInfoId) {
      setSelectedAssetId(formInfoId);
      const res = await fetchParentTreeListByChildFormId(formInfoId);
      const result = res?.result;

      setSelectedAssetsList(result);
      const isOpenAccordiansData = result.reduce((acc, curr) => {
        acc[curr.formInfoId] = false;
        return acc;
      }, {});

      setIsOpenAccordianData(isOpenAccordiansData);
    }
  };

  const fetchFieldsForTreeList = async (asset) => {
    const formInfoId = asset?.formInfoId;
    if (!formInfoId) return;
    const res = await fetchFieldsByFormInfoId(formInfoId);
    const result = res?.result;

    setAssetsFields((prev) => ({
      ...prev,
      [formInfoId]: result
    }));
    if (result) {
      setRefresh(false);
    }
    return result;
  };

  const handleAccordionChange = (asset, expanded) => {
    const { formInfoId } = asset;

    setIsOpenAccordianData((prev) => ({
      ...prev,
      [formInfoId]: expanded
    }));

    if (expanded) {
      setRefresh(true);
      fetchFieldsForTreeList(asset);
    }
  };

  const assetsTreeStructure = selectedAssetsList
    ?.filter((asset) => asset.formInfoId !== currentForm?.formInfoId)
    .map((asset) => {
      return (
        <Accordion
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '20px',
            marginLeft: '20px'
            // marginBottom: '15px'
          }}
          expanded={isOpenAccordianData[asset?.formInfoId]}
          onChange={(e, expanded) => handleAccordionChange(asset, expanded)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            style={{
              borderBottom: '1px solid #ccc'
            }}
          >
            <Typography>{asset.displayName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {!refresh && (
              <AddEditRecord
                mode={'new-record'}
                formId={asset.formInfoId}
                toggles={toggle}
                fieldData={assetsFields[asset.formInfoId]}
                fieldValues={treeValues?.[asset.formInfoId]}
                showSystemDefaultField={false}
                setTreeListValues={setTreeListValues}
              />
            )}
          </AccordionDetails>
        </Accordion>
      );
    });

  return (
    <>
      <div
        className="flex-col"
        style={{
          height: isMinimized ? '100vh' : '',
          backgroundColor: COLORS.WHITE,
          borderRadius: '10px',

          display: 'flex',
          justifyContent: 'center',
          boxShadow:
            '0px 0.3320707678794861px 2.2138051986694336px 0px #00000003,0px 0.7980122566223145px 5.32008171081543px 0px #00000004,0px 1.5025862455368042px 10.017241477966309px 0px #00000005,0px 2.680356979370117px 17.869047164916992px 0px #00000006,0px 5.013313293457031px 33.422088623046875px 0px #00000007,0px 12px 80px 0px #0000000A'
        }}
      >
        <div
          style={{
            height: isMinimized ? '100vh' : '',
            borderRadius: '10px',
            background:
              currentTheme === 'Dark' ? colors.darkBackground : colors.white
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 170px)'
              }}
            >
              <CircularProgress style={{ color: colors.primary.main }} />
            </div>
          ) : (
            <>
              <div
                className="p-0"
                style={{
                  backgroundColor: colors.white,
                  borderRadius: '10px'
                }}
              >
                {selectedRecordId && currentForm?.enableModifiedFormUi ? (
                  <div>
                    <div className="border-1 flex justify-end pe-4 pt-3">
                      <ActionList
                        Key={'modify-record'}
                        goToDataManagement={goToDataManagement}
                        onActionClickHandler={onActionClickHandler}
                        setDeleteRecordData={setDeleteRecordData}
                        tableData={tableData}
                        actions={actions}
                        selectedRowsLength={selectedRecordId && 1}
                      />
                    </div>
                    <PreviewRecord
                      formId="normal"
                      fieldData={fields || []}
                      fieldValues={fieldValues}
                      onSubmit={submitHandler}
                    />
                  </div>
                ) : (
                  <>
                    {!selectedRecordId && (
                      <div
                        className={`border-bottom flex items-center justify-between ${open ? 'pl-2 pr-[1rem]' : 'px-2 pr-6'} bg-background py-3`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`hover:bg-primary-dark z-10 mb-2 flex cursor-pointer items-center justify-center rounded-md bg-accent p-2 hover:text-primary`}
                            onClick={() => navigate(-1)}
                          >
                            <Tooltip>
                              <TooltipTrigger>
                                <ArrowLeft
                                  size={16}
                                  className="cursor-pointer"
                                />
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="mt-2">
                                <p>Back</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="mb-2 text-xl text-black">
                            Create New {currentForm?.displayName}
                          </div>
                        </div>
                        <div
                          className={`flex ${isMobile ? 'w-full items-start' : 'w-1/2 items-center'} `}
                          style={{
                            borderRadius: '5px',

                            justifyContent: isTemplateAccess
                              ? 'space-between'
                              : 'end'
                          }}
                        >
                          {isTemplateAccess && (
                            <div className="flex w-full items-center gap-1 pe-2">
                              <div className="w-full">
                                <Dropdown
                                  id={`dropdown-template`}
                                  label="Form Template"
                                  name="formTemplate"
                                  onChange={(e) =>
                                    fetchTemplateDetail(e.target.value)
                                  }
                                  indentType="row"
                                  options={templates.map((t) => {
                                    return {
                                      label: t?.name,
                                      value: t?.uuid
                                    };
                                  })}
                                />
                              </div>
                            </div>
                          )}
                          {recordActions()}
                        </div>
                      </div>
                    )}

                    {!searchParam.has('id') && (
                      <div
                        className="bg-background px-2"
                        style={{
                          height: 'calc(100vh - 9.5rem)',
                          overflowY: 'scroll'
                        }}
                      >
                        <AddEditRecord
                          mode={'new-record'}
                          formId="normal"
                          toggles={toggle}
                          fieldData={fields || []}
                          fieldValues={fieldValues}
                          showSystemDefaultField={selectedRecordId && false}
                          onSubmit={submitHandler}
                          viewType={minimalViewType && 'minimal'}
                          isMinimized={isMinimized}
                          setIsMinimized={setIsMinimized}
                          selectedRecordId={selectedRecordId}
                          fieldGroups={fieldGroups}
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
                          hasDataTableTabs={hasTabs}
                          style={{
                            height:
                              currentForm?.name === 'assets'
                                ? 'calc(50vh)'
                                : 'calc(100vh - 9.5rem)'
                          }}
                          otherFields={
                            <>
                              {!showAttachmentField && showAttachmentField && (
                                <Button
                                  variant="contained"
                                  onClick={() => setShowAttachmentField(true)}
                                >
                                  Attachment
                                </Button>
                              )}
                              {shouldShowAttachment && showAttachmentField && (
                                <div
                                  className="pt-1"
                                  style={{
                                    width: 948,
                                    minWidth: '100%',
                                    maxWidth: 948,
                                    backgroundColor: colors.white
                                  }}
                                >
                                  <AddAttachment
                                    attachmentTab={true}
                                    selectedRecordId={null}
                                    form={currentForm}
                                  />
                                </div>
                              )}
                            </>
                          }
                          indentType={'row'}
                        />
                        {assetsTreeStructure}
                      </div>
                    )}
                  </>
                )}
              </div>
              {failedPage ? (
                <FailedPage />
              ) : (
                <>
                  {selectedRecordId && (
                    <>
                      <DataTableTabs
                        data={data}
                        editableData={editableData}
                        fieldValues={fieldValues}
                        fields={fields}
                        hasTabs={hasTabs}
                        height={height}
                        toggle={toggle}
                        isMinimized={isMinimized}
                        recordActions={recordActions}
                        recordSubmitHandler={submitHandler}
                        selectedRecordId={selectedRecordId}
                        setEditableData={setEditableData}
                        setFieldValues={setFieldValues}
                        setHasTabs={setHasTabs}
                        setHeight={setHeight}
                        setIsMinimized={setIsMinimized}
                        assetsTreeStructure={assetsTreeStructure}
                        showEditRecord={showEditRecord}
                        setShowEditRecord={setShowEditRecord}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {deleteRecordData && (
        <ConfirmationModal
          open={deleteRecordData}
          heading="Delete record"
          onConfirm={deleteRecord}
          onCancel={() => setDeleteRecordData(false)}
          secondButtonText="Confirm"
          firstButtonText="Cancel"
          message={'Are you sure you want to delete this record ?'}
        />
      )}
      {updateRecordData && (
        <ConfirmationModal
          open={updateRecordData}
          heading="Update record"
          message="Are you sure you want to update this record ?"
          onConfirm={() => handleUpdateRecord(selectedActionData)}
          onCancel={() => setUpdateRecordData(false)}
          secondButtonText="Update"
          firstButtonText="Cancel"
        />
      )}
    </>
  );
};

export default ModifyRecord;
