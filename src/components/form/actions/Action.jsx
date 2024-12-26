import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Separator } from '@/componentss/ui/separator';
import {
  MODAL,
  initialState,
  reducer
} from '../../../common/utils/modal-toggle';
import { Button } from '@/componentss/ui/button';

import {
  createAction,
  deleteAction,
  fetchActionsByModuleOrFormId,
  updateAction
} from '../../../redux/slices/actionSlice';
import ActionModal from './ActionModal';
import ConfirmationModal from '../../shared/ConfirmationModal';
import GridTableSimple from '../../../elements/GridTableSimple';
import { fetchFormsByModuleId } from '../../../services/form';
import { Plus } from 'lucide-react';

const Action = () => {
  const dispatch = useDispatch();
  const { actions } = useSelector((state) => state.action);
  const { currentTheme } = useSelector((state) => state.auth);
  const [state, emit] = useReducer(reducer, initialState);
  const [selectedActionId, setSelectedActionId] = useState();
  const [currentId, setCurrentId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { currentForm, currentModule } = useSelector((state) => state.current);

  const [where, setWhere] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [fields, setFields] = useState([]);
  const [tableData, setTableData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [compiledTables, setCompiledTables] = useState([]);

  const [rowSelectionModel, setRowSelectionModel] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const moduleId = currentModule?.moduleInfoId;

      const data = {
        formInfoId: 0,
        keyword: '',
        moduleInfoId: moduleId || 0,
        pagination: null,
        sort: {
          sortBy: '',
          sortOrder: ''
        }
      };

      if (moduleId) {
        dispatch(fetchActionsByModuleOrFormId({ data }));
        const res = await fetchFormsByModuleId(moduleId);
        setCompiledTables(res?.result);
      }
    };

    fetchData();
  }, [currentModule]);

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setRefetch(!refetch);
  };

  const actionSubmitHandler = (action) => {
    if (!action) return;
    if (state.type === MODAL.create) {
      dispatch(createAction({ data: action }));
    } else if (state.type === MODAL.edit) {
      dispatch(updateAction({ actionInfoId: selectedActionId, data: action }));
    }
    actionModalActionHandler(MODAL.cancel);
  };

  const deleteActionHandler = () => {
    dispatch(deleteAction({ actionInfoId: selectedActionId }));
    actionModalActionHandler(MODAL.cancel);
  };

  const actionModalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.edit:
        const actionEdit = actions?.find((c) => c.actionInfoId === id);
        emit({ type: MODAL.edit, data: actionEdit });
        setSelectedActionId(id);
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedActionId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      default:
        console.log('actionModalActionHandler');
    }
  };
  const onRowSelectionModelChange = (rowId) => {
    setCurrentId(rowId.data.id);
    actionModalActionHandler(MODAL.edit, rowId.data.id);
  };
  const headers = [
    { headerName: 'Sr No', field: 'srno', sortable: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'FormName', field: 'formName', sortable: true, filter: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true }
  ];
  return (
    <>
      <div className="min-h-screen w-full bg-accent">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between space-x-6">
            <div>
              <p
                className={`text-lg font-semibold ${currentTheme === 'Dark' ? 'text-white' : 'text-gray-900'}`}
              >
                Actions
              </p>
            </div>

            <div>
              <Button
                onClick={() => actionModalActionHandler(MODAL.create)}
                className="bg-primary font-bold text-white dark:bg-primary"
              >
                <Plus size={16} strokeWidth={3} />
                Add action
              </Button>
            </div>
          </div>
        </div>
        <Separator className="mb-4 h-1" />
        <div className="flex min-h-[calc(100vh-220px)] w-full flex-wrap justify-start gap-3 overflow-auto px-3">
          <div className="border-slate-200 bg-background flex w-full flex-row gap-2 overflow-hidden rounded-xl border border-[0.1px]">
            <GridTableSimple
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRecords={actions.length}
              headers={headers}
              handledRowClick={onRowSelectionModelChange}
              setSelectedRows={setSelectedRows}
              currentForm={currentForm}
              setRefetch={setRefetch}
              rows={actions?.map((action, index) => {
                return {
                  ...action,
                  srno: index + 1,
                  id: action?.actionInfoId
                };
              })}
              setWhere={setWhere}
              handleRowsPerPageChange={handleRowsPerPageChange}
              rowSelectionMode="single"
              usedElements={['table', 'pagination']}
              rowTooltip="Double click to edit record"
            />
          </div>
        </div>
      </div>
      {state.show &&
        (state.type === MODAL.create || state.type === MODAL.edit) && (
          <ActionModal
            state={state}
            onConfirm={actionSubmitHandler}
            compiledTables={compiledTables}
            onDelete={() => actionModalActionHandler(MODAL.delete, currentId)}
            onCancel={() => actionModalActionHandler(MODAL.cancel)}
          />
        )}
      {state.show && state.type === MODAL.delete && (
        <ConfirmationModal
          open={state.show}
          heading={`Delete this action?`}
          message="Are you sure you want to delete this action?"
          onConfirm={deleteActionHandler}
          onCancel={() => actionModalActionHandler(MODAL.cancel)}
          firstButtonText="Cancel"
          secondButtonText="Confirm"
        />
      )}
    </>
  );
};

export default Action;
