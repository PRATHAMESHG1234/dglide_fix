import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import { Button } from '@/componentss/ui/button';
import DataListPreference from './DataListPreference';
import AttachFile from './AttachFile';
import { COLORS } from '../../../common/constants/styles';
import { importTableData } from '../../../services/table';
import Summary from './Summary';
import { notify } from '../../../hooks/toastUtils';

const ImportData = ({
  openImportDrawer,
  setImportDrawer,
  fields,
  setRefetch
}) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const { currentForm } = useSelector((state) => state.current);
  const dispatch = useDispatch();

  const [files, setFiles] = useState({});
  const [headerKeys, setHeaderKeys] = useState([]);
  const [fieldsData, setFieldsData] = useState({});
  const [attachedFile, setAttachedFile] = useState(false);
  const [isOpenPreferencePage, setIsOpenPreferencePage] = useState(false);
  const [isOpenSummaryPage, setIsOpenSummaryPage] = useState(false);
  const [summaryData, setSummaryData] = useState({});
  const importRecords = async (files, mappedFields) => {
    try {
      const res = await importTableData(
        currentForm?.formInfoId,
        files,
        mappedFields
      );

      if (res.status) {
        notify.success(res.message || 'Records imported successfully');
      } else {
        notify.error(res.message || 'Records imported successfully');
      }

      if (res.status === false) {
        setRefetch(true);
        setImportDrawer(false);
      } else {
        setSummaryData(res?.result);
        setIsOpenPreferencePage(false);
      }
      setIsOpenSummaryPage(true);
    } catch (error) {
      notify.error(error.message || 'An error occurred during import.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transformedFieldsData = transformFieldsData(fieldsData);
    const mappedFields = JSON.stringify(transformedFieldsData);

    if (!files || !mappedFields) return;

    importRecords(files, mappedFields);
  };

  const transformFieldsData = (fieldsData) => {
    return Object.entries(fieldsData).map(([key, value]) => ({
      fieldName: key,
      headerLabel: value
    }));
  };

  const handleDownloadCSV = () => {
    const labels = fields.map((field) => field.label);
    const csvContent = 'data:text/csv;charset=utf-8,' + labels.join(',');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sample_file.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shouldRenderButtons = !attachedFile || !isOpenPreferencePage;

  return (
    <Drawer
      anchor="right"
      open={openImportDrawer}
      onClose={() => setImportDrawer(false)}
    >
      <div
        style={{
          width: 500,
          paddingTop: '80px',
          paddingLeft: '10px',
          marginRight: '10px',
          backgroundColor:
            currentTheme === 'Light' ? COLORS.WHITE : COLORS.BLACK,
          height: 'calc(100vh - 135px)'
        }}
      >
        <div
          className="mb-2 border"
          style={{
            height: 'calc(100vh - 140px)',
            overflowY: !shouldRenderButtons && 'scroll',
            borderRadius: '5px'
          }}
        >
          {shouldRenderButtons && !isOpenSummaryPage ? (
            <AttachFile
              files={files}
              setFiles={setFiles}
              setHeaderKeys={setHeaderKeys}
              setAttachedFile={setAttachedFile}
              attachedFile={attachedFile}
              downloadCSV={handleDownloadCSV}
            />
          ) : isOpenSummaryPage ? (
            <Summary summaryData={summaryData} />
          ) : (
            <DataListPreference
              fields={fields}
              headerKeys={headerKeys}
              fieldsData={fieldsData}
              setFieldsData={setFieldsData}
            />
          )}
        </div>
        <div style={{ backgroundColor: COLORS.WHITESMOKE }}>
          {attachedFile && isOpenPreferencePage && !isOpenSummaryPage && (
            <div className="flex justify-center gap-2 py-2">
              <Button variant="outlined" onClick={() => setFieldsData({})}>
                Clear
              </Button>
              <Button
                type="button"
                variant="solid"
                sx={{
                  background: COLORS.PRIMARY
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          )}
          {shouldRenderButtons && !isOpenSummaryPage && (
            <div className="flex justify-center gap-2 py-2">
              <Button variant="outlined" onClick={() => setImportDrawer(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="solid"
                disabled={!attachedFile}
                sx={{
                  background: COLORS.PRIMARY
                }}
                onClick={() => setIsOpenPreferencePage(attachedFile)}
              >
                Next
              </Button>
            </div>
          )}
          {isOpenSummaryPage && (
            <div className="flex justify-center gap-2 py-2">
              <Button
                type="button"
                variant="solid"
                sx={{
                  background: COLORS.PRIMARY
                }}
                onClick={() => {
                  setRefetch(true);
                  setImportDrawer(false);
                }}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ImportData;
