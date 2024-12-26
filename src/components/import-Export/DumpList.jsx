import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteDump, getDumpByFilter } from '../../redux/slices/dumpSlice';
import { MODAL, initialState, reducer } from '../../common/utils/modal-toggle';
import SchemaList from '../form/schema/SchemaList';

import { Label } from '@/componentss/ui/label';

import { COLORS, colors } from '../../common/constants/styles';
import ConfirmationModal from '../shared/ConfirmationModal';
import { fetchForms } from '../../services/form';
import MainCard from '../../elements/MainCard';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/joy';
import { IconDownload, IconTrash } from '@tabler/icons-react';
import { downloadDump } from '../../services/dump';
import { saveAs } from 'file-saver';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Separator } from '@/componentss/ui/separator';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';

const list = [
  { label: 'Import', value: 'Import' },
  { label: 'Export', value: 'Export' }
];
export const DumpList = () => {
  const [state, emit] = useReducer(reducer, initialState);
  const { currentTheme } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [dumpList, setDumpList] = useState([]);
  const [selectedDumpId, setSelectedDumpId] = useState();
  const [allTableList, setAllTableList] = useState([]);

  const getAllDump = async () => {
    const payload = {
      action: selectedAction ? selectedAction : null,
      formInfoId: selectedForm ? selectedForm : null,
      pagination: null
    };
    const result = await dispatch(getDumpByFilter(payload));
    if (result.payload.statusCode === 200) {
      setDumpList(result.payload.result.data);
    }
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedDumpId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      default:
        console.log('dumpModalActionHandler');
    }
  };
  useEffect(() => {
    getAllDump();
    getAllFormsList();
  }, []);

  useEffect(() => {
    getAllDump();
  }, [selectedAction, selectedForm]);

  const getAllFormsList = async () => {
    const tableListData = await fetchForms();
    setAllTableList(tableListData?.result);
  };

  const deleteHandler = async () => {
    await dispatch(deleteDump({ dumpInfoId: selectedDumpId }));
    getAllDump();
    modalActionHandler(MODAL.cancel);
  };
  // const handleFormChange=(event)=>{
  //     console.log(event.target.value);

  // }

  const handleDownload = async (item) => {
    try {
      const response = await downloadDump(item.dumpInfoId);
      if (!response) {
        throw new Error('Invalid response data');
      }
      const byteArray = new Uint8Array(response);
      const blob = new Blob([byteArray], { type: 'application/json' });
      saveAs(blob, item.fileName);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const headers = [
    { headerName: 'Sr no', field: 'srNo', sortable: true },
    { headerName: 'File Name', field: 'fileName', sortable: true },
    {
      headerName: 'Form',
      field: 'formDisplayName',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Export Date',
      field: 'createdOn',
      sortable: true,
      filter: true
    },
    { headerName: 'Action', field: 'action', sortable: true, filter: true },
    {
      headerName: 'Actions',
      field: 'action',
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <Stack spacing={1} direction="row">
          <Tooltip>
            <TooltipTrigger>
              <IconDownload
                stroke={1.5}
                color={colors.primary.main}
                style={{
                  color: COLORS.PRIMARY
                }}
                onClick={() => handleDownload(params.data)}
              />
            </TooltipTrigger>
            <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
              Download
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <IconTrash
                stroke={1.5}
                color={colors.error.main}
                onClick={(e) => {
                  e.stopPropagation();
                  modalActionHandler(MODAL.delete, params.data.id);
                }}
              />
            </TooltipTrigger>
            <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
              Delete
            </TooltipContent>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <>
      <div className="min-h-screen w-full bg-accent">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between space-x-6">
            <div className="">
              <Label>Schema</Label>
            </div>

            <div className="flex gap-3">
              <Dropdown
                label="Select Form"
                name="select-form"
                options={allTableList.map((o) => ({
                  label: o.displayName,
                  value: o.formInfoId
                }))}
                // value={selectedFormName}
                onChange={(event) => setSelectedForm(event.target.value)}
              />

              <Dropdown
                label="Select Action"
                name="select-form"
                options={list}
                onChange={(event) => setSelectedAction(event.target.value)}
              />
            </div>
          </div>
        </div>
        <Separator className="mb-4 h-1" />
        <div className="">
          <SchemaList
            items={dumpList?.map((dump, index) => {
              return {
                ...dump,
                srNo: index + 1,
                id: dump.dumpInfoId
              };
            })}
            headers={headers}
          />
        </div>
      </div>
      ;
      {state.show && state.type === MODAL.delete && (
        <ConfirmationModal
          open={state.show}
          heading={`Delete this dump?`}
          message={'Are you sure you want to delete this dump?'}
          onConfirm={deleteHandler}
          onCancel={() => modalActionHandler(MODAL.cancel)}
          secondButtonText="Confirm"
          firstButtonText="Cancel"
        />
      )}
    </>
  );
};
