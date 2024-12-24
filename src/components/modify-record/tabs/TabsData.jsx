import React, { useEffect, useState } from 'react';
import TimeLine from './TimeLine';
import Timeline from './time-line';
import CalendarView from './CalendarView';
import Loader from '../../shared/Loader';
import { Plus, PlusCircle } from 'lucide-react';
import GridTable from '../../../elements/GridTable';
import { fetchFieldsWithValuesForReference } from '../../../services/field';
import { useSelector } from 'react-redux';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { useSidebar } from '@/componentss/ui/sidebar';
import AuditList from './AuditList';
import Attachment from '../Attachment';
import { useDispatch } from 'react-redux';
import { toggleHiddenView, setHiddenView } from '@/redux/slices/formSlice';
import NoAttachmentImg from '@/assets/noattachment.svg';
import NoActivityImg from '@/assets/noactivity.svg';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

const TabsData = ({
  currentTheme,
  tab,
  rows,
  columns,
  loading,
  setWhere,
  handleSortClick,
  onRecordSelected,
  totalRecords,
  formInfoId,
  refField,
  addNewRecord,
  preferences,
  fieldLabels,
  columnPreferenceHandler,
  setRefetch,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  leftChildComponent,
  currentTab,
  selectedRecordId,
  attachmentTab,
  open,
  uploadTab
}) => {
  const { currentForm } = useSelector((state) => state.current);
  // const [refetch, setRefetch] = useState(false);
  const [fields, setFields] = useState([]);
  const [tableData, setTableData] = useState({});
  const [formDetail, setFormDetail] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState();
  const hiddenView = useSelector((state) => state.form.hiddenView);
  const dispatch = useDispatch();
  const { open: isOpen } = useSidebar();

  useEffect(() => {
    if (rows) {
      const obj = {
        totalRecords: rows.length,
        data: rows
      };
      setTableData(obj);
    }
  }, [rows]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fieldsData = await fetchFieldsWithValuesForReference(formInfoId);
        setFields(fieldsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (formInfoId) {
      fetchData();
    }
  }, [formInfoId]);

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };

  const onRowSelectionModelChange = (rowId) => {
    if (rowId) {
      setRowSelectionModel(rowId);
      onRecordSelected(rowId?.data?.id, tab);
    } else setRowSelectionModel();
  };

  return (
    <div className="relative flex w-full">
      {hiddenView && (
        <div
          className={`hover:bg-primary-dark absolute hover:text-primary ${hiddenView && isOpen ? 'left-2' : !hiddenView && isOpen ? 'right-0' : !hiddenView && !isOpen ? 'right-0' : hiddenView && !isOpen ? 'left-2' : ''} top-1 z-10 flex cursor-pointer items-center justify-center rounded-md bg-accent p-2`}
          onClick={() => dispatch(toggleHiddenView())}
        >
          <Tooltip>
            <TooltipTrigger>
              <PanelLeftOpen size={16} className="cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="bottom" className="mt-2">
              <p>expand </p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <div
        className={`relative transform pt-1 transition-all duration-500 ${
          hiddenView
            ? 'w-0 -translate-x-full pl-5 opacity-0'
            : 'w-1/3 translate-x-0 opacity-100'
        }`}
      >
        {!hiddenView && (
          <div
            className={`hover:bg-primary-dark absolute hover:text-primary ${hiddenView && isOpen ? 'left-2' : !hiddenView && isOpen ? 'right-0' : !hiddenView && !isOpen ? 'right-0' : hiddenView && !isOpen ? 'left-2' : ''} top-1 z-10 flex cursor-pointer items-center justify-center rounded-md bg-accent p-2`}
            onClick={() => dispatch(toggleHiddenView())}
          >
            <Tooltip>
              <TooltipTrigger>
                <PanelRightOpen size={16} className="cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="mt-2">
                <p>collapse </p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        {leftChildComponent()}
        <div>
          {hiddenView && (
            <PanelLeftOpen
              size={22}
              onClick={() => dispatch(setHiddenView(false))}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>
      <div
        className={`h-[calc(100vh-100px)] transform overflow-y-scroll bg-background pt-1 transition-all duration-500 ${
          hiddenView ? 'w-full translate-x-0 pl-6' : 'w-2/3 translate-x-0'
        } ${currentTheme === 'Dark' ? 'bg-darkLevel2' : ''}`}
      >
        {tab?.field?.variant === 'TimeLine' && (
          <>
            <div className="px-3 pb-1 text-xl text-black">
              {currentTab?.charAt(0)?.toUpperCase() + currentTab?.slice(1) ||
                ''}
            </div>
            {rows.length <= 0 ? (
              <div
                className={`mt-4 flex h-[calc(100vh-150px)] items-center justify-center overflow-y-auto rounded-md text-xs ${
                  currentTheme === 'Dark' ? 'bg-darkLevel2' : 'bg-white'
                }`}
              >
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center gap-y-4">
                      <img
                        src={NoActivityImg}
                        className="h-72"
                        alt="noattachments"
                      />
                      <p className="px-2 text-sm">
                        {`No ${currentTab?.charAt(0)?.toUpperCase() + currentTab?.slice(1)} added yet! Add new ${currentTab}`}
                      </p>
                    </div>
                    <div className="tooltip" data-tooltip="Add Record">
                      <button
                        className="bg-primary-main hover:bg-primary-main flex h-6 min-h-6 w-8 items-center justify-center rounded-[5px] text-white hover:text-white"
                        onClick={() => addNewRecord(tab)}
                      >
                        <span className="text-[1.2rem]">+</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-[calc(100vh-11.5rem)] overflow-auto pt-6">
                <Timeline
                  rows={rows}
                  columns={columns}
                  tab={tab}
                  onRecordSelected={onRecordSelected}
                  uploadTab={uploadTab}
                  open={open}
                />
                {/* <TimeLine
                  rows={rows}
                  columns={columns}
                  tab={tab}
                  onRecordSelected={onRecordSelected}
                  uploadTab={uploadTab}
                  open={open}
                /> */}
              </div>
            )}
          </>
        )}
        {tab?.field?.variant === 'Calendar' && (
          <>
            {rows.length <= 0 ? (
              <div className="flex h-full items-center justify-center text-xs">
                {loading ? <Loader /> : `No ${tab?.field?.label}`}
              </div>
            ) : (
              <CalendarView
                rows={rows}
                columns={columns}
                tab={tab}
                onRecordSelected={onRecordSelected}
              />
            )}
          </>
        )}
        {(tab?.field?.variant === 'Table' || tab?.field?.variant === null) && (
          <>
            {loading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="loader"></div>
              </div>
            ) : (
              <>
                <div className="px-3 text-xl text-black">Lookup Table</div>
                <GridTable
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  totalRecords={totalRecords}
                  fields={fields}
                  type="field"
                  preferences={preferences}
                  refField={refField}
                  handledRowClick={onRowSelectionModelChange}
                  setSelectedRows={setSelectedRows}
                  currentForm={currentForm}
                  setRefetch={setRefetch}
                  fieldLabels={fieldLabels}
                  tableData={tableData}
                  setWhere={setWhere}
                  handleSortClick={handleSortClick}
                  handleRowsPerPageChange={handleRowsPerPageChange}
                  rowSelectionEnabled={false}
                  columnPreferenceHandler={columnPreferenceHandler}
                  usedElements={['table', 'pagination', 'columnPreference']}
                  rowTooltip="Double click to edit record"
                />
              </>
            )}
          </>
        )}
        {currentTab?.toLowerCase() === 'audit' && (
          <>
            <div className="flex flex-col gap-0 px-3">
              <div className="text-xl text-black">Audit</div>

              <AuditList
                currentForm={currentForm}
                selectedRecordId={selectedRecordId}
                fields={fields}
              />
            </div>
          </>
        )}
        {attachmentTab && currentTab === 'attachment' && (
          <div
            key="attachments"
            className="flex flex-col gap-4 overflow-hidden px-3"
          >
            <div className="text-xl text-black">Attachments</div>
            <Attachment
              attachmentTab={attachmentTab}
              selectedRecordId={selectedRecordId}
              form={currentForm}
              setRefetch={setRefetch}
              NoAttachmentImg={NoAttachmentImg}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsData;
