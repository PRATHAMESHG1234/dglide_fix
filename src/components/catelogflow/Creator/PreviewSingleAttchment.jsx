import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  Box
} from '@mui/material';
import { COLORS } from '../../../common/constants/styles';
import { DownloadCloud } from 'lucide-react';
import { FileCheck } from 'lucide-react';
import { File } from 'lucide-react';
import { Eye } from 'lucide-react';
import { BsFiletypeXlsx } from 'react-icons/bs';
import { FaFileCsv } from 'react-icons/fa';
import '../../modify-record/Attachment.css';
import Modal from '@mui/joy/Modal';
import { X } from 'lucide-react';

const ODD_OPACITY = 0.5;

export const PreviewSingleAttchment = ({ attachmnetData, catlogFlag }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const closePreviewModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  const previewAttachmentHandler = async (attachment) => {
    setModalContent(attachment);
    setIsModalOpen(true);
  };

  useEffect(() => {
    return () => {
      if (modalContent) {
        URL.revokeObjectURL(modalContent);
      }
    };
  }, [modalContent]);

  const downloadAttachmentHandler = async (attachment) => {
    const URL = process.env.REACT_APP_STORAGE_URL;
    const fullUrl = URL + '/' + attachment.filePath + '/' + attachment.fileName;
    const a = document.createElement('a');
    a.href = fullUrl;
    a.download = attachment.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
          <X onClick={() => closePreviewModal()}
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
  return (
    <div
      className="w-full"
      style={{
        // height: '70%',
        borderRadius: '10px',
        backgroundColor: 'white',
        width: '100%',
        border: '1px solid lightgrey',
        marginBottom: '15px'
      }}
    >
      {attachmnetData && (
        <div className="flex items-center" style={{ cursor: 'default' }}>
          <div className="flex items-center p-2">
            <span
              style={{
                padding: 0,
                paddingLeft: 1,
                cursor: 'pointer'
              }}
            >
              {['jpg', 'jpeg', 'png'].includes(attachmnetData.fileExtension) ? (
                <img
                  src={attachmnetData.filePath}
                  alt=""
                  style={{
                    width: '50px',
                    height: '50px',
                    marginRight: '30px',
                    objectFit: 'cover'
                  }}
                />
              ) : attachmnetData.fileExtension === 'pdf' ? (
                <File style={{
                    fontSize: '50px',
                    marginRight: '30px',
                    color: 'lightgrey'
                  }}
                />
              ) : attachmnetData.fileExtension === 'xlsx' ||
                attachmnetData.fileExtension === 'xls' ? (
                <BsFiletypeXlsx
                  style={{
                    fontSize: '50px',
                    marginRight: '30px',
                    color: 'lightgrey'
                  }}
                />
              ) : attachmnetData.fileExtension === 'csv' ? (
                <FaFileCsv
                  style={{
                    fontSize: '50px',
                    marginRight: '30px',
                    color: 'lightgrey'
                  }}
                />
              ) : (
                <File style={{
                    color: 'lightgrey',
                    fontSize: '50px',
                    marginRight: '30px'
                  }}
                />
              )}
            </span>

            <span>
              <Tooltip title={attachmnetData?.fileName}>
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
                  {attachmnetData.fileName}
                </Typography>
              </Tooltip>
            </span>

            <span>
              <Stack spacing={1} direction="row">
                {catlogFlag !== 'DocumentType' ? (
                  <Tooltip title="Preview">
                    <IconButton
                      onClick={() => previewAttachmentHandler(attachmnetData)}
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
                    onClick={() => downloadAttachmentHandler(attachmnetData)}
                    style={{
                      color: COLORS.PRIMARY
                    }}
                  >
                    <DownloadCloud />
                  </IconButton>
                </Tooltip>
                {/* {catlogFlag !== 'DocumentType' ? (
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
                            <Trash2 style={{
                                color: 'darkred'
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      ) : null} */}
              </Stack>
            </span>
          </div>
          <PreviewModal />
        </div>
      )}
    </div>
  );
};
