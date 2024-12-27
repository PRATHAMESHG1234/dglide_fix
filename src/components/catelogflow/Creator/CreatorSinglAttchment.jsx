import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import '../../modify-record/Attachment.css';
import { Trash, XCircle } from 'lucide-react';
import { FileCheck } from 'lucide-react';
import { Paperclip } from 'lucide-react';

import {
  Box,
  FormLabel,
  IconButton,
  Stack,
  Typography,
  Button
} from '@mui/material';
import { File } from 'lucide-react';
import { BsFiletypeXlsx } from 'react-icons/bs';
import { FaFileCsv } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsFiletypeJson } from 'react-icons/bs';
import { LuImage } from 'react-icons/lu';
import { BsFiletypeHtml } from 'react-icons/bs';

import { COLORS } from '../../../common/constants/styles';
import { uploadAttachment } from '../../../redux/slices/attachmentSlice';
import { notify } from '../../../hooks/toastUtils';

// const headers = ['File', '', 'Size', 'Created Date', 'Actions'];

const CreatorSinglAttchment = ({
  catlogFlag,
  attachmentFieldList,
  handleAttachFile
}) => {
  const dispatch = useDispatch();

  const [attachmentList, setAttachmentList] = useState([]);
  // const [modalContent, setModalContent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (attachmentFieldList.length > 0) {
      setAttachmentList(attachmentFieldList);
    }
  }, [attachmentFieldList]);

  // useEffect(() => {
  //     getAttachmentCatalog();
  // }, [selectedRecordId]);

  // useEffect(() => {
  //     return () => {
  //         if (modalContent) {
  //             URL.revokeObjectURL(modalContent);
  //         }
  //     };
  // }, [modalContent]);

  // const addAttachmentHandler = () => {
  //     setAttachments((prev) => [...prev, { attachmentId: generateUId() }]);
  // };

  // const getAttachmentCatalog = async () => {
  //     const res = await fetchAttachmentCatalogList(
  //         "requests",
  //         selectedRecordId,
  //     );
  //     setAttachmentList(res);
  //     // addAttachmentHandler();
  // };

  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current.classList.add('dragover');

  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

  const onDrop = () => wrapperRef.current.classList.remove('dragover');

  const uploadAttachmentsHandler = async (e, data) => {
    const files = e.target.files[0];

    // Check if the file size is 8MB or less
    if (files.size > 8 * 1024 * 1024) {
      notify.warning('File must be 8 MB or less.');
      return;
    }
    const uploadResult = await dispatch(
      uploadAttachment({
        formName: 'requests',
        data: files
      })
    );

    if (uploadResult.type === 'uploadAttachment/fulfilled') {
      const updatedField = JSON.parse(JSON.stringify(data));
      updatedField.attachmentFile = uploadResult?.payload;
      handleAttachFile(e, updatedField);
      setSelectedFiles((prev) => [
        ...prev.filter((file) => file.attachmentId !== data.name),
        { attachmentId: data?.name, files }
      ]);
    }
  };

  const deleteSelectedFileHandler = (id) => {
    let remaningElement = selectedFiles.filter(
      (element) => element.attachmentId !== id
    );
    setSelectedFiles(remaningElement);
  };

  return (
    <Box className="flex w-full flex-col px-2 pb-2">
      {catlogFlag !== 'DocumentType'
        ? attachmentList.map((field) => (
            <>
              <Stack className="mt-3 flex flex-row p-2 pt-0">
                <div className="mx-3">
                  <FormLabel
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 500,
                      paddingBottom: '8px'
                    }}
                  >
                    {field.label}
                  </FormLabel>
                </div>
                <div
                  ref={wrapperRef}
                  className="drop-file-input flex items-center justify-center"
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  id="attach-btn"
                  style={{ backgroundColor: 'white', width: '30px' }}
                >
                  <Button startIcon={<Paperclip />}>
                    <input
                      type="file"
                      onChange={(e) => uploadAttachmentsHandler(e, field)}
                    />
                  </Button>
                </div>
              </Stack>
              {selectedFiles.length > 0 &&
                selectedFiles
                  .filter((o) => o.attachmentId === field.name)
                  .map((attachment, index) => (
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        width: '70%',
                        border: '1px solid lightgrey'
                      }}
                    >
                      <div className="flex flex-col items-center justify-start p-2">
                        <div className="w-full">
                          <span key={attachment.attachmentId}>
                            <div
                              className="border-grey mb-1 flex items-center justify-between border p-1"
                              key={index}
                              style={{
                                borderRadius: '5px',
                                backgroundColor: COLORS.WHITE
                              }}
                            >
                              <div
                                className="flex items-center"
                                style={{ width: '90%' }}
                              >
                                {attachment.files?.type === 'text/html' ? (
                                  <BsFiletypeHtml
                                    style={{
                                      fontSize: '30px',
                                      marginRight: '7px',
                                      color: 'lightgrey'
                                    }}
                                  />
                                ) : attachment.files?.type ===
                                  'application/json' ? (
                                  <BsFiletypeJson
                                    style={{
                                      fontSize: '30px',
                                      marginRight: '7px',
                                      color: 'lightgrey'
                                    }}
                                  />
                                ) : attachment.files?.type === 'image/png' ||
                                  attachment.files?.type === 'image/jpeg' ||
                                  attachment.files?.type === 'image/x-icon' ? (
                                  <LuImage
                                    style={{
                                      fontSize: '30px',
                                      marginRight: '7px',
                                      color: 'lightgrey'
                                    }}
                                  />
                                ) : attachment.files?.type === 'text/plain' ? (
                                  <IoDocumentTextOutline
                                    style={{
                                      fontSize: '30px',
                                      marginRight: '7px',
                                      color: 'lightgrey'
                                    }}
                                  />
                                ) : attachment.files?.type ===
                                  'application/pdf' ? (
                                  <File
                                    style={{
                                      fontSize: '30px',
                                      marginRight: '7px',
                                      color: 'lightgrey'
                                    }}
                                  />
                                ) : attachment.files?.type ===
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                                  attachment.files?.type === 'xls' ? (
                                  <BsFiletypeXlsx
                                    style={{
                                      fontSize: '30px',
                                      marginRight: '7px',
                                      color: 'lightgrey'
                                    }}
                                  />
                                ) : attachment.files?.type === 'text/csv' ? (
                                  <FaFileCsv
                                    style={{
                                      fontSize: '30px',
                                      marginRight: '7px',
                                      color: 'lightgrey'
                                    }}
                                  />
                                ) : (
                                  attachment.files?.type ===
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                                    <File
                                      style={{
                                        color: 'lightgrey',
                                        fontSize: '30px',
                                        marginRight: '7px'
                                      }}
                                    />
                                  )
                                )}

                                <Typography
                                  style={{
                                    color: COLORS.SECONDARY,
                                    fontSize: '15px',
                                    textAlign: 'start',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    width: '25vw'
                                  }}
                                >
                                  {attachment.files?.name}
                                </Typography>
                              </div>
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  deleteSelectedFileHandler(
                                    attachment.attachmentId
                                  )
                                }
                              >
                                <Trash
                                  style={{
                                    color: 'darkred',
                                    fontSize: '20px'
                                  }}
                                />
                              </IconButton>
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </>
          ))
        : null}
    </Box>
  );
};

export default CreatorSinglAttchment;
