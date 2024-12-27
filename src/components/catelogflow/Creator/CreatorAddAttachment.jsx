import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Trash, Trash2 } from 'lucide-react';
import { X } from 'lucide-react';
import { DownloadCloud } from 'lucide-react';
import { FileCheck } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { File } from 'lucide-react';
import { Eye } from 'lucide-react';
import Modal from '@mui/joy/Modal';
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha
} from '@mui/material';
import { BsFiletypeHtml, BsFiletypeJson, BsFiletypeXlsx } from 'react-icons/bs';
import { FaFileCsv } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { LuImage } from 'react-icons/lu';

import { COLORS } from '../../../common/constants/styles';
import { generateUId } from '../../../common/utils/helpers';
import { uploadAttachments } from '../../../redux/slices/attachmentSlice';
import {
  deleteAttachment,
  fetchAttachmentCatalogList
} from '../../../services/attachment';
import '../../modify-record/Attachment.css';
import { notify } from '../../../hooks/toastUtils';

const ODD_OPACITY = 0.5;
const headers = ['File', '', 'Size', 'Created Date', 'Actions'];

const CreatorAddAttachment = ({ selectedRecordId, catlogFlag }) => {
  const dispatch = useDispatch();
  const [attachments, setAttachments] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    getAttachmentCatalog();
  }, [selectedRecordId]);

  useEffect(() => {
    return () => {
      if (modalContent) {
        URL.revokeObjectURL(modalContent);
      }
    };
  }, [modalContent]);

  const addAttachmentHandler = () => {
    setAttachments((prev) => [...prev, { attachmentId: generateUId() }]);
  };

  const getAttachmentCatalog = async () => {
    let formName;
    if (catlogFlag === 'catlogFlagTrue' || catlogFlag === 'DocumentType') {
      formName = 'system_catelogflow';
    } else {
      formName = 'requests';
    }
    const res = await fetchAttachmentCatalogList(formName, selectedRecordId);
    setAttachmentList(res);
    addAttachmentHandler();
  };
  const closePreviewModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  const previewAttachmentHandler = async (attachment) => {
    setModalContent(attachment);
    setIsModalOpen(true);
  };

  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current.classList.add('dragover');

  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

  const onDrop = () => wrapperRef.current.classList.remove('dragover');

  const PreviewModal = () => {
    return (
      <Modal
        open={isModalOpen}
        onClose={() => closePreviewModal()}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'black',
            borderRadius: 0,
            boxShadow: 24,
            p: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto'
          }}
        >
          <X
            onClick={() => closePreviewModal()}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              cursor: 'pointer',
              fontSize: '30px',
              color: 'grey'
            }}
          />
          {modalContent ? (
            modalContent?.fileExtension.toLowerCase() === 'jpg' ||
            modalContent?.fileExtension.toLowerCase() === 'jpeg' ||
            modalContent?.fileExtension.toLowerCase() === 'png' ? (
              <img
                src={modalContent?.fileUrl}
                alt="Preview"
                style={{
                  width: 'auto',
                  height: 'auto'
                }}
              />
            ) : modalContent?.fileExtension.toLowerCase() === 'pdf' ? (
              <iframe
                title="This is a unique title"
                src={modalContent?.fileUrl}
                type={modalContent?.fileContentType}
                style={{ width: '100%', height: '100%' }}
              />
            ) : modalContent?.fileExtension.toLowerCase() === 'txt' ||
              modalContent?.fileExtension.toLowerCase() === 'csv' ||
              modalContent?.fileExtension.toLowerCase() === 'xlsx' ||
              modalContent?.fileExtension.toLowerCase() === 'doc' ||
              modalContent?.fileExtension.toLowerCase() === 'docs' ? (
              <iframe
                title="text-preview"
                src={modalContent?.fileUrl}
                style={{ width: '100%', height: '100%' }}
              ></iframe>
            ) : null
          ) : null}
        </Box>
      </Modal>
    );
  };

  const uploadAttachmentsHandler = async (e, data) => {
    const files = e.target.files;

    // Check if the file size is 8MB or less
    if (files.size > 8 * 1024 * 1024) {
      notify.warning('File must be 8 MB or less.');
      return;
    }

    const updated = attachments?.map((attach) => {
      if (attach.attachmentId === data.attachmentId) {
        return {
          ...attach,
          files
        };
      }
      return attach;
    });

    const uploadResult = await dispatch(
      uploadAttachments({
        formName: 'system_catelogflow',
        data: files,
        recordId: selectedRecordId
      })
    ).unwrap();

    setAttachments(updated);

    setSelectedFiles((prev) => [
      ...prev,
      { attachmentId: data.attachmentId, files }
    ]);
    if (uploadResult) {
      if (selectedRecordId) {
        getAttachmentCatalog();
      }
    }
  };

  const downloadAttachmentHandler = async (attachment) => {
    const a = document.createElement('a');
    a.href = attachment.fileUrl;
    a.download = attachment.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const AttachmentDeleteHandler = (attachment) => {
    const list = attachmentList?.filter(
      (atta) => atta.attachmentId !== attachment.attachmentId
    );
    setAttachmentList(list);
    deleteAttachment('system_catelogflow', attachment).then((data) => {
      if (data.status) {
        notify.success(data.message || 'Attachment Download: Failed');
      } else {
        notify.error(data.message || 'Attachment Download: Failed');
      }
    });
  };

  const deleteSelectedFileHandler = (fileIndex) => {
    const list = Array.from(selectedFiles[0].files);
    list.splice(fileIndex, 1);
    setSelectedFiles((prev) => {
      // Update the last object in the array without creating a new one
      const updatedFiles = [...prev];
      updatedFiles[prev.length - 1] = {
        ...prev[prev.length - 1],
        files: list
      };
      return updatedFiles;
    });
  };
  return (
    <Box className="flex w-full flex-col px-2 pb-2">
      {catlogFlag !== 'DocumentType' && catlogFlag !== 'RequestType' && (
        <Stack className="w-full p-2 pt-0">
          <div
            ref={wrapperRef}
            className="drop-file-input default-attachment flex items-center justify-center"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={{ backgroundColor: 'white' }}
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
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <Typography
                style={{
                  color: COLORS.SECONDARY,
                  fontSize: '14px',
                  textAlign: 'center',
                  marginY: '10px'
                }}
              >
                Drag and drop file here <br />
                or
              </Typography>
              <input
                type="file"
                multiple
                onChange={(e) => uploadAttachmentsHandler(e, attachments)}
              />
              <Chip
                className="p-2"
                label=" Browse For File"
                style={{
                  backgroundColor: '#E8F2FF',
                  fontWeight: 500,
                  color: COLORS.SECONDARY
                }}
              />
            </div>
          </div>
        </Stack>
      )}
      <div
        className="w-full"
        style={{
          // paddingTop: '19px',
          paddingBottom: '7px',
          paddingRight: '8px'
        }}
      >
        {attachmentList.length > 0 && (
          <TableContainer style={{ cursor: 'default' }}>
            <Table
              aria-label="simple table"
              stickyHeader
              style={{
                m: 0,
                '& .MuiTableRow-root:hover': {
                  backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY + 8)
                }
              }}
            >
              {catlogFlag !== 'DocumentType' ? (
                <TableHead>
                  <TableRow
                    style={{
                      '& .MuiTableCell-head': {
                        backgroundColor: COLORS.TERTIARY
                      }
                    }}
                  >
                    {headers
                      .filter((o) => o !== 'Size' && o !== 'Created Date')
                      .map((header) => {
                        return <TableCell key={header}>{header}</TableCell>;
                      })}
                  </TableRow>
                </TableHead>
              ) : null}
              <TableBody style={{ cursor: 'default', height: '100px' }}>
                {attachmentList.map((attachment, i) => {
                  return (
                    <TableRow
                      style={{
                        '&:last-child td , &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell
                        style={{
                          padding: 0,
                          paddingLeft: 1,
                          cursor: 'pointer'
                        }}
                      >
                        {['jpg', 'jpeg', 'png'].includes(
                          attachment.fileExtension
                        ) ? (
                          <img
                            src={attachment.fileUrl}
                            alt=""
                            style={{
                              width: '50px',
                              height: '50px',
                              marginRight: '7px',
                              objectFit: 'cover'
                            }}
                          />
                        ) : attachment.fileExtension === 'pdf' ? (
                          <File
                            style={{
                              fontSize: '50px',
                              marginRight: '7px',
                              color: 'lightgrey'
                            }}
                          />
                        ) : attachment.fileExtension === 'xlsx' ||
                          attachment.fileExtension === 'xls' ? (
                          <BsFiletypeXlsx
                            style={{
                              fontSize: '50px',
                              marginRight: '7px',
                              color: 'lightgrey'
                            }}
                          />
                        ) : attachment.fileExtension === 'csv' ? (
                          <FaFileCsv
                            style={{
                              fontSize: '50px',
                              marginRight: '7px',
                              color: 'lightgrey'
                            }}
                          />
                        ) : (
                          <File
                            style={{
                              color: 'lightgrey',
                              fontSize: '50px',
                              marginRight: '7px'
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        <Tooltip title={attachment?.fileName}>
                          <Typography
                            style={{
                              color: COLORS.SECONDARY,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              width: '8vw',
                              fontSize: '14px'
                            }}
                          >
                            {attachment.fileName}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell>
                        <Stack spacing={1} direction="row">
                          {catlogFlag !== 'DocumentType' ? (
                            <Tooltip title="Preview">
                              <IconButton
                                onClick={() =>
                                  previewAttachmentHandler(attachment)
                                }
                                style={{
                                  color: COLORS.PRIMARY
                                }}
                              >
                                <Eye />
                              </IconButton>
                            </Tooltip>
                          ) : null}

                          <Tooltip title="Download">
                            <IconButton
                              onClick={() =>
                                downloadAttachmentHandler(attachment)
                              }
                              style={{
                                color: COLORS.PRIMARY
                              }}
                            >
                              <DownloadCloud />
                            </IconButton>
                          </Tooltip>
                          {catlogFlag === 'catlogFlagTrue' ? (
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() =>
                                  AttachmentDeleteHandler(attachment)
                                }
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
                                <Trash2
                                  style={{
                                    color: 'darkred'
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <PreviewModal />
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {selectedFiles.length > 0 && attachmentList.length === 0 ? (
          <div
            style={{
              height: '100%',
              borderRadius: '10px',
              backgroundColor: 'white',
              width: '100%',
              border: '1px solid lightgrey'
            }}
          >
            <div className="flex flex-col items-center justify-start p-2">
              <div className="w-full">
                {selectedFiles.map((attachment, index) => (
                  <span key={index}>
                    {[...attachment.files].map((file, fileIndex) => (
                      <div
                        className="border-grey mb-1 flex items-center justify-between border p-1"
                        key={fileIndex}
                        style={{
                          borderRadius: '5px',
                          backgroundColor: COLORS.WHITE
                        }}
                      >
                        <div
                          className="flex items-center"
                          style={{ width: '90%' }}
                        >
                          {file.type === 'text/html' ? (
                            <BsFiletypeHtml
                              style={{
                                fontSize: '30px',
                                marginRight: '7px',
                                color: 'lightgrey'
                              }}
                            />
                          ) : file.type === 'application/json' ? (
                            <BsFiletypeJson
                              style={{
                                fontSize: '30px',
                                marginRight: '7px',
                                color: 'lightgrey'
                              }}
                            />
                          ) : file.type === 'image/png' ||
                            file.type === 'image/jpeg' ||
                            file.type === 'image/x-icon' ? (
                            <LuImage
                              style={{
                                fontSize: '30px',
                                marginRight: '7px',
                                color: 'lightgrey'
                              }}
                            />
                          ) : file.type === 'text/plain' ? (
                            <IoDocumentTextOutline
                              style={{
                                fontSize: '30px',
                                marginRight: '7px',
                                color: 'lightgrey'
                              }}
                            />
                          ) : file.type === 'application/pdf' ? (
                            <File
                              style={{
                                fontSize: '30px',
                                marginRight: '7px',
                                color: 'lightgrey'
                              }}
                            />
                          ) : file.type ===
                              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                            file.type === 'xls' ? (
                            <BsFiletypeXlsx
                              style={{
                                fontSize: '30px',
                                marginRight: '7px',
                                color: 'lightgrey'
                              }}
                            />
                          ) : file.type === 'text/csv' ? (
                            <FaFileCsv
                              style={{
                                fontSize: '30px',
                                marginRight: '7px',
                                color: 'lightgrey'
                              }}
                            />
                          ) : (
                            file.type ===
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
                            {file.name}
                          </Typography>
                        </div>
                        <IconButton
                          aria-label="delete"
                          onClick={() => deleteSelectedFileHandler(fileIndex)}
                        >
                          <Trash
                            style={{
                              color: 'darkred',
                              fontSize: '20px'
                            }}
                          />
                        </IconButton>
                      </div>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Box>
  );
};

export default CreatorAddAttachment;
