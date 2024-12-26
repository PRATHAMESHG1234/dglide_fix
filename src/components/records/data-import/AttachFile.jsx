import React, { useRef, useState } from 'react';
import {
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha
} from '@mui/material';
import { COLORS } from '../../../common/constants/styles';
import '../../modify-record/Attachment.css';
import { FaFileCsv } from 'react-icons/fa';
import { DeleteForever } from '@mui/icons-material';

const AttachFile = ({
  files,
  setFiles,
  setHeaderKeys,
  setAttachedFile,
  attachedFile,
  downloadCSV
}) => {
  const wrapperRef = useRef(null);
  const fileReader = new FileReader();
  const [error, setError] = useState('');
  const onDragEnter = () => wrapperRef.current.classList.add('dragover');
  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e) => {
    setError('');
    e.preventDefault();
    e.stopPropagation();
    wrapperRef.current.classList.remove('dragover');
    const droppedFiles = e.dataTransfer.files;
    handleDroppedFiles(droppedFiles);
  };

  const uploadAttachmentsHandler = (e) => {
    setError('');
    const file = e.target.files[0];
    handleDroppedFiles([file]);
  };

  const handleDroppedFiles = (files) => {
    const file = files[0];
    if (file) {
      if (file.type === 'text/plain' || file.name.endsWith('.csv')) {
        setFiles(file);
        setAttachedFile(true);
        fileReader.onload = function (event) {
          const text = event.target.result;
          csvFileToArray(text);
        };
        fileReader.readAsText(file);
      } else {
        setError('Please drop a CSV or text file.');
      }
    }
  };

  const csvFileToArray = (string) => {
    const [header, ...rows] = string
      .trim()
      .split('\n')
      .map((line) => line.split(',').map((value) => value.trim()));
    setHeaderKeys(header);
  };

  const handleInvalidFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) {
      setError('Please select a CSV or text file.');
      // Clear the file input
      e.target.value = null;
    }
  };

  return (
    <div
      className="flex w-full flex-col items-center justify-center p-2"
      style={{
        height: 'calc(100vh - 140px)',
        paddingRight: '15px'
      }}
    >
      <div className="w-full ps-2">
        <Typography
          variant="body2"
          fontSize="15px"
          sx={{
            fontWeight: 'bolder',
            color: COLORS.SECONDARY
          }}
        >
          File Upload: CSV/Text
        </Typography>
      </div>
      <div className="w-full px-2">
        <Typography
          fontSize="11px"
          sx={{ color: COLORS.SECONDARY, fontWeight: 500 }}
        >
          Import your records effortlessly with a CSV file—just ensure your
          column headers match the required field names (such as Name, Email,
          etc.) exactly.
        </Typography>
      </div>
      <Stack className="w-full p-2">
        <div
          ref={wrapperRef}
          className="drop-file-input flex items-center justify-center"
          onClick={() => wrapperRef.current.querySelector('input').click()}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          style={{ cursor: 'pointer' }}
        >
          <div className="drop-file-input__label p-4">
            <svg
              width="35"
              height="30"
              viewBox="0 0 46 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.236 16.1176V13.7647C11.236 7.26725 16.5032 2 23.0007 2C29.4981 2 34.7654 7.26725 34.7654 13.7647V16.1176C39.9633 16.1176 44.1772 20.3315 44.1772 25.5294C44.1772 29.0132 42.2845 32.1374 39.4713 33.7647M11.236 16.1176C6.03801 16.1176 1.82422 20.3315 1.82422 25.5294C1.82422 29.0132 3.71692 32.1374 6.5301 33.7647M11.236 16.1176C12.2545 16.1176 13.2352 16.2795 14.1538 16.5786M23.0007 20.8235V42M23.0007 20.8235L30.0595 27.8824M23.0007 20.8235L15.9419 27.8824"
                stroke="#404040"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Typography
              style={{
                color: COLORS.SECONDARY,
                fontSize: '13px',
                textAlign: 'center'
              }}
            >
              Drop your{' '}
              <span style={{ color: COLORS.PRIMARY, fontWeight: 500 }}>
                CSV
              </span>{' '}
              file here <br /> or
            </Typography>
            <input
              type="file"
              accept=".csv, text/plain"
              onChange={(e) => uploadAttachmentsHandler(e)}
              onInvalid={handleInvalidFile}
              style={{ height: '100%', display: 'none' }}
            />
            <Chip
              className="mt-2 p-2"
              label="Select CSV File"
              sx={{
                backgroundColor: alpha(COLORS.PRIMARY, 0.7),
                color: COLORS.WHITE,
                fontWeight: 600,
                fontSize: '12px'
              }}
            />
            <Typography
              style={{
                color: COLORS.SECONDARY,
                fontSize: '11px',
                textAlign: 'center',
                color: 'red',
                paddingTop: '8px'
              }}
            >
              {error}
            </Typography>
          </div>
        </div>
      </Stack>
      <div
        className="flex w-full justify-end px-2"
        onClick={() => downloadCSV()}
      >
        <Typography
          fontSize="12px"
          sx={{ color: COLORS.PRIMARY, fontWeight: 500, cursor: 'pointer' }}
        >
          Sample_File.csv
        </Typography>
      </div>

      {files?.name && (
        <div
          className="mt-1 flex w-full items-center border ps-2"
          style={{ borderRadius: '5px' }}
        >
          <div className="flex flex-1 items-center">
            <FaFileCsv
              style={{
                fontSize: '30px',
                marginRight: '7px',
                color: 'lightblue'
              }}
            />
            <Typography
              variant="body2"
              fontSize="13px"
              sx={{
                fontWeight: 'bolder'
              }}
            >
              {files?.name}
            </Typography>
          </div>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setFiles({});
                setAttachedFile(false);
              }}
              slots={{
                root: IconButton
              }}
              slotProps={{
                root: {
                  variant: 'plain',
                  color: 'danger',
                  size: 'small'
                }
              }}
            >
              <DeleteForever
                sx={{
                  color: 'darkred'
                }}
              />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default AttachFile;
