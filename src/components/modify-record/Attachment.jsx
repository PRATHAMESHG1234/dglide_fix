import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Attachment.css';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/HighlightOff';
// import FileIcon from '@mui/icons-material/FilePresentOutlined';
import PreviewIcon from '@mui/icons-material/Preview';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { FileIcon, defaultStyles } from 'react-file-icon';
import {
  Box,
  Chip,
  FormLabel,
  Divider,
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
import { DeleteForever } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Modal from '@mui/joy/Modal';
import { BsFiletypeXlsx } from 'react-icons/bs';
import { FaFileCsv } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsFiletypeJson } from 'react-icons/bs';
import { LuImage } from 'react-icons/lu';
import { BsFiletypeHtml } from 'react-icons/bs';

import { COLORS } from '../../common/constants/styles';
import { generateUId } from '../../common/utils/helpers';
import { fetchAttachmentCount } from '../../redux/slices/attachmentSlice';
import {
  deleteAttachment,
  downloadJsonAttachment,
  fetchAttachments,
  previewAttachment
} from '../../services/attachment';
import { uploadAttachments } from '../../redux/slices/attachmentSlice';
import { saveAs } from 'file-saver';
import { CloudUpload, Eye, X } from 'lucide-react';
import { Button } from '@/componentss/ui/button';
import { notify } from '../../hooks/toastUtils';
const ODD_OPACITY = 0.5;
const headers = ['File', 'Name', 'Size', 'Created Date', 'Actions'];

const Attachment = ({
  attachmentTab,
  selectedRecordId,
  form,
  setRefetch,
  NoAttachmentImg
}) => {
  const { currentForm } = useSelector((state) => state.current);

  const dispatch = useDispatch();
  const { tableRecord } = useSelector((state) => state.table);

  const [attachments, setAttachments] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dataProcess(tableRecord);
  }, [tableRecord, form]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (attachmentTab && form) {
        getAttachmentData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form]);

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

  const getAttachmentData = async () => {
    const res = await fetchAttachments(form?.name, selectedRecordId);
    setAttachmentList(res);
    addAttachmentHandler();
  };

  const closePreviewModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  const previewAttachmentHandler = async (attachment) => {
    console.log(attachment, 'attachment');
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
          <CloseIcon
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
            modalContent?.fileExtension?.toLowerCase() === 'jpg' ||
            modalContent?.fileExtension?.toLowerCase() === 'jpeg' ||
            modalContent?.fileExtension?.toLowerCase() === 'png' ? (
              <img
                src={modalContent?.fileUrl}
                alt="Preview"
                style={{
                  width: 'auto',
                  height: 'auto'
                }}
              />
            ) : modalContent?.fileExtension?.toLowerCase() === 'pdf' ? (
              <iframe
                title="This is a unique title"
                src={modalContent?.fileUrl}
                type={modalContent?.fileContentType}
                style={{ width: '100%', height: '100%' }}
              />
            ) : modalContent?.fileExtension?.toLowerCase() === 'txt' ||
              modalContent?.fileExtension?.toLowerCase() === 'csv' ||
              modalContent?.fileExtension?.toLowerCase() === 'xlsx' ||
              modalContent?.fileExtension?.toLowerCase() === 'doc' ||
              modalContent?.fileExtension?.toLowerCase() === 'docs' ? (
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

  const dataProcess = async (tableRecord) => {
    if (!tableRecord || !form) {
      return;
    }

    if (
      tableRecord.attachment &&
      tableRecord.attachment.length > 0 &&
      form?.name
    ) {
      let data = [];
      for (const item of tableRecord.attachment) {
        const response = await previewAttachment(form.name, item);

        data.push({
          ...item,
          attachmentUrl: response.blobUrl
        });
      }
      setAttachmentList(data);
    }
  };

  const uploadAttachmentsHandler = async (e, data) => {
    setUploading(true);
    const files = e.target.files;

    // Check if the file size is 8MB or less
    if (files.size > 8 * 1024 * 1024) {
      notify.error('File must be 8 MB or less.');

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
        formName: form?.name,
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
        getAttachmentData();
        setUploading(false);
      }
    }
    setRefetch(true);
    setTimeout(() => {
      dispatch(
        fetchAttachmentCount({
          formName: form?.name,
          recordId: selectedRecordId
        })
      );
    }, 500);
  };
  const FormatBytes = (bytes) => {
    const units = ['Bytes', 'KB', 'MB'];

    let i = 0;

    for (i; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024;
    }

    return `${bytes?.toFixed(0)} ${units[i]}`;
  };

  const downloadAttachmentHandler = async (attachment) => {
    if (attachment?.fileExtension?.toLowerCase() === 'json') {
      try {
        const response = await downloadJsonAttachment(
          currentForm?.name,
          attachment?.attachmentId
        );
        if (!response) {
          throw new Error('Invalid response data');
        }
        const byteArray = new Uint8Array(response);
        const blob = new Blob([byteArray], { type: 'application/json' });
        saveAs(blob, attachment.fileName);
      } catch (error) {
        console.error('Failed to download file:', error);
      }
    } else {
      const a = document.createElement('a');
      a.href = attachment.fileUrl;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const AttachmentDeleteHandler = (attachment) => {
    const list = attachmentList?.filter(
      (atta) => atta.attachmentId !== attachment.attachmentId
    );
    setAttachmentList(list);
    deleteAttachment(form?.name, attachment).then((data) => {
      if (data.status) {
        notify.success(data.message);
      } else {
        notify.error(data.message || 'Attachment Delete: Failed');
      }

      setRefetch(true);
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

  let type = 'AddEditRecord';
  return (
    <div className="flex w-full flex-col pb-2">
      {/* Top Side Content (Attachment List) */}
      <div className="flex h-[calc(100vh-360px)] w-full flex-col overflow-y-auto">
        {attachmentList.length > 0 ? (
          <div className="h-full w-full">
            {attachmentList.map((attachment, i) => {
              const fileExtension = attachment.fileName
                .split('.')
                .pop()
                .toLowerCase();

              const isImageFile = ['jpg', 'jpeg', 'png', 'gif'].includes(
                fileExtension
              );

              return (
                <div
                  key={i}
                  className="mb-2 flex items-center justify-between rounded-lg border-b border-gray-200 bg-[#f7f8fa] p-3"
                >
                  <div className="flex items-center space-x-2">
                    {/* Conditionally render image or FileIcon */}
                    {isImageFile ? (
                      <img
                        src={attachment.fileUrl}
                        alt={attachment.fileName}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-white">
                        <FileIcon
                          extension={fileExtension}
                          {...(defaultStyles[fileExtension] || {
                            labelColor: '#AAA',
                            color: '#DDD',
                            glyphColor: '#333'
                          })}
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <p className="line-clamp-1 truncate text-sm font-medium text-gray-700">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-gray-500 text-primary">
                        {/* {(attachment?.fileSize / (1024 * 1024)).toFixed(2)} MB */}
                        {FormatBytes(attachment?.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`hover:bg-primary-dark z-10 mx-2 mb-2 flex cursor-pointer items-center justify-center rounded-md bg-[#e7f2fb] p-2 text-primary hover:bg-primary hover:text-white`}
                      onClick={() => previewAttachmentHandler(attachment)}
                    >
                      <Eye size={14} className="cursor-pointer" />
                    </div>
                    <div
                      className={`hover:bg-primary-dark z-10 mx-2 mb-2 flex cursor-pointer items-center justify-center rounded-md bg-[#e7f2fb] p-2 text-primary hover:bg-primary hover:text-white`}
                      onClick={() => AttachmentDeleteHandler(attachment)}
                    >
                      <X size={14} className="cursor-pointer" />
                    </div>
                  </div>
                  <PreviewModal />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded border bg-white">
            <div className="flex flex-col items-center gap-y-4">
              <img src={NoAttachmentImg} className="h-72" alt="noattachments" />
              <p className="text-sm">There is nothing attached here</p>
            </div>
          </div>
        )}
      </div>
      {/* Bottom Side Content (File Drop Area) */}
      <div className="flex h-44 w-full flex-col py-2">
        {type !== 'AddEditRecord' && (
          <label className="pb-2 text-[13.5px] font-medium">Attachment</label>
        )}
        <div
          ref={wrapperRef}
          className="drop-file-input flex h-full items-center justify-center rounded border-dashed border-sky-400 bg-[#e7f2fb] outline-sky-400"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="drop-file-input__label text-center">
            <div className="flex items-center justify-center">
              {/* SVG Icon */}
              <div
                className={`hover:bg-primary-dark z-10 mx-2 mb-2 flex cursor-pointer items-center justify-center rounded-full bg-[#d1e6f8] p-2`}
              >
                <CloudUpload size={28} className="text-primary" />
              </div>
            </div>
            <p className="my-3 text-xs text-gray-600">
              Drags and drop your file
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => uploadAttachmentsHandler(e, attachments)}
              className="h-full border-sky-400"
            />
            <Button
              className="flex w-36 items-center justify-center bg-primary text-sm"
              disabled={uploading} // Disable the button while uploading
            >
              {uploading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : null}
              Browse for File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attachment;
