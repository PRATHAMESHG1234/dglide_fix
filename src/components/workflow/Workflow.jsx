/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../shared/GridView.css';

import { colors } from '../../common/constants/styles';
import { Label } from '@/componentss/ui/label';
import { Button } from '@/componentss/ui/button';
import { Separator } from '@/componentss/ui/separator';

import {
  createWorkFlow,
  deleteWorkFlow,
  fetchWorkflowByPagination,
  fetchWorkFlows,
  updateWorkFlow
} from '../../redux/slices/workflowSlice';
import { EditWorkFlow } from './EditWorkFlow';
import ConfirmationModal from '../shared/ConfirmationModal';
import { initBpmn, initJson } from './BPMN/util';
import { fetchForms } from '../../redux/slices/formSlice';
import { useNavigate } from 'react-router-dom';
import { fetchWorkFlow } from '../../services/workFlow';
import { initialState, MODAL, reducer } from '../../common/utils/modal-toggle';
// import WorkflowNewTable from './WorkFlowGridTable';
import WorkflowGridView from './WorkFlowGridView';
import { Plus, Search } from 'lucide-react';
// import NewAgTable from './NewAgTable'
import { Input } from '@/componentss/ui/input';

const Workflow = () => {
  const dispatch = useDispatch();
  const { currentUser, currentTheme } = useSelector((state) => state.auth);
  const { workFlows, isLoading } = useSelector((state) => state.workflow);
  const [tableData, setTableData] = useState({});

  const [selectedId, setSelectedId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState('');
  const [workFlowData, setWorkFlowData] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const menuOpen = Boolean(anchorEl);
  const [state, emit] = useReducer(reducer, initialState);
  const { currentView } = useSelector((state) => state.current);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchForms());
  }, []);

  useEffect(() => {
    const obj = {
      pagination: {
        page: currentPage - 1,
        pageSize: rowsPerPage
      },
      sort: null,
      where: null
    };
    dispatch(fetchWorkflowByPagination(obj));
  }, [refetch]);

  const deleteWorkflowRecord = () => {
    dispatch(deleteWorkFlow({ id: selectedId }));
    modalActionHandler(MODAL.cancel);
    setSelectedId();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (selectedRows.length > 1) {
      alert('Please select only one record to Edit or Delete');
      setAnchorEl(null);
    }
  }, [selectedRows]);
  useEffect(() => {
    if (workFlows?.data) {
      const filteredData = workFlows?.data?.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
      setTotalRecords(workFlows?.totalRecords);
      setWorkFlowData(filteredData);
      setTotalRecords(workFlows?.totalRecords);
      setTableData(workFlows);
    }
  }, [search, workFlows?.data]);

  const submitWorkflowRecord = (value) => {
    if (state.type === MODAL.create) {
      const data = {
        workflow_record_id: value.workflowId,
        name: value.name,
        description: value.description,
        operation: value.operation,
        status: value.status,
        source_type: value.sourceType,
        catalog_id: value.catalog ? value.catalog : null,
        form_name: value.tableName,
        form_info_id: value.formInfoId,
        bpmn_str: initBpmn,
        is_time_trigger: value.is_time_trigger,
        triggering_time: value.triggering_time,
        json_str: JSON.stringify(initJson),
        temp_time: value.temp_time
      };
      dispatch(createWorkFlow({ workflow: data }));
    } else if (state.type === MODAL.edit) {
      const data = {
        uuid: state.selected ? state.selected?.uuid : null,
        workflow_record_id: value.workflowId,
        name: value.name,
        description: value.description,
        operation: value.operation,
        status: value.status,
        form_name: value.tableName,
        source_type: value.sourceType,
        is_time_trigger: value.is_time_trigger,
        triggering_time: value.triggering_time,
        catalog_id: value.catalog ? value.catalog : null,
        form_info_id: value.formInfoId,
        temp_time: value.temp_time
      };
      dispatch(updateWorkFlow({ workflow: data }));
    }
    modalActionHandler(MODAL.cancel);
    setRefetch((prev) => !prev);
  };

  const updateStatus = (status, items) => {
    console.log(status);
    fetchWorkFlow(items?.uuid)
      .then((res) => {
        const data = {
          uuid: res.result.uuid,
          status: status,
          name: res.result.name,
          description: res.result.description,
          operation: res.result.operation,
          form_name: res.result.form_info_id_display,
          source_type: res.result.source_type,
          catalog_id: res.result.catalog_id ? res.result.catalog_id : null,
          form_info_id: res.result.form_info_id,
          bpmn_str: res.result.bpmn_str,
          json_str: res.result.json_str
        };
        dispatch(updateWorkFlow({ workflow: data }));
        setRefetch((prev) => !prev);
      })
      .catch((err) => {
        console.error('Error updating workflow status:', err);
      });
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.edit:
        const data = workFlows?.data.find((c) => c.uuid === id);
        emit({ type: MODAL.edit, data: data });
        setSelectedId(id);
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      default:
        console.log('modalActionHandler');
    }
  };

  const viewStyle = {
    overflowY: currentView === 'List' ? null : 'scroll',
    backgroundColor: currentView === 'List' ? colors.white : ''
  };
  const goToRecordPanel = (params) => {
    localStorage.setItem('xmlDataBPMN', params.bpmn_str);
    navigate(`/workflow/${params.uuid}`);
  };
  const handleSearch = (event) => {
    const trimmedValue = event.target.value.trim();
    setSearch(trimmedValue);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-accent">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between space-x-6">
            <div className="flex items-center">
              <div className="flex h-12 items-center justify-between gap-2">
                <div item>
                  <Label className="text-xl font-semibold">WorkFlow</Label>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="search"
                id="subsearch"
                value={search}
                onChange={handleSearch}
                startIcon={<Search size={16} />}
              />

              {/* <ToggleButtonGroup
                size="small"
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
                color="primary"
              >
                <Tooltip title="List view">
                  <ToggleButton
                    value="center"
                    sx={{
                      color:
                        currentView === 'List'
                          ? colors.primary.main
                          : colors.grey[900],

                      fontWeight: 'bold'
                    }}
                    aria-label="left aligned"
                    onClick={() => dispatch(setCurrentView({ view: 'List' }))}
                  >
                    <ListOutlinedIcon />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Grid view">
                  <ToggleButton
                    sx={{
                      color:
                        currentView === 'Grid'
                          ? colors.primary.main
                          : colors.grey[900],

                      fontWeight: 'bold'
                    }}
                    value="left"
                    aria-label="centered"
                    onClick={() => dispatch(setCurrentView({ view: 'Grid' }))}
                  >
                    <GridViewOutlinedIcon />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
              {currentView === 'List' ? (
                <div>
                  <AnimateButton>
                    <Buttons
                      onClick={handleClick}
                      disabled={selectedRows.length > 1}
                      variant="contained"
                      size="small"
                      sx={{
                        height: '36.6px',
                        fontSize: '0.75rem',
                        textTransform: 'none',

                        backgroundColor: colors.primary.main,
                        '&:hover': {
                          backgroundColor: colors.primary.main
                        }
                      }}
                      endIcon={
                        <IconCaretDown
                          stroke={1.5}
                          size="20px"
                          style={{ color: colors.white }}
                        />
                      }
                    >
                      Action
                    </Buttons>
                  </AnimateButton>

                  <Menu
                    keepMounted
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    open={menuOpen}
                    sx={{
                      top: '8px'
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        modalActionHandler('edit', selectedRows[0]);
                        handleClose();
                      }}
                      sx={{
                        bgcolor: COLORS.LAVENDER
                      }}
                    >
                      <EditIcon />
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        modalActionHandler('delete', selectedRows[0]);
                        handleClose();
                      }}
                      sx={{
                        color: COLORS.RED,
                        bgcolor: COLORS.LAVENDER
                      }}
                    >
                      <DeleteIcon />
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              ) : null} */}

              <Button
                className="flex items-center font-bold"
                onClick={() => modalActionHandler(MODAL.create)}
              >
                <Plus size={16} strokeWidth={3} />
                Add Workflow
              </Button>
            </div>
          </div>
        </div>
        <Separator className="mb-4 h-1" />
        <div className="view_container flex">
          <div
            className="flex w-full flex-row flex-wrap items-start justify-start overflow-auto pb-2"
            style={viewStyle}
          >
            {
              currentView === 'Grid' ? (
                <WorkflowGridView
                  items={workFlowData}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  totalRecords={totalRecords}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  setRefetch={setRefetch}
                  type={'workflow'}
                  modalActionHandler={modalActionHandler}
                  goToRecordPanel={goToRecordPanel}
                  updateStatus={updateStatus}
                />
              ) : null
              // <WorkflowNewTable
              //   rowsPerPage={rowsPerPage}
              //   setRowsPerPage={setRowsPerPage}
              //   setCurrentPage={setCurrentPage}
              //   currentPage={currentPage}
              //   tableData={tableData}
              //   totalRecords={totalRecords}
              //   setSelectedRows={setSelectedRows}
              //   setRefetch={setRefetch}
              //   refetch={refetch}
              // />
            }
            {state.show &&
              (state.type === MODAL.create || state.type === MODAL.edit) && (
                <EditWorkFlow
                  state={state}
                  onConfirm={submitWorkflowRecord}
                  onCancel={() => modalActionHandler(MODAL.cancel)}
                  modalActionHandler={modalActionHandler}
                />
              )}
            {state.show && state.type === MODAL.delete && (
              <ConfirmationModal
                open={state.show}
                message={'Delete workflow'}
                heading={`Are you sure you want to delete this Workflow ?`}
                onConfirm={deleteWorkflowRecord}
                onCancel={() => modalActionHandler(MODAL.cancel)}
                firstButtonText="Cancel"
                secondButtonText="Confirm"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Workflow;
