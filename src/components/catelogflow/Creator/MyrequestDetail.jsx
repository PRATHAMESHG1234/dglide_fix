import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TextField from '../../../elements/TextField';
import { fetchRecordById, updateTableRecord } from '../../../services/table';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { Button } from '@/componentss/ui/button';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { COLORS } from '../../../common/constants/styles';
import CreatorAddAttachment from './CreatorAddAttachment';
import { PreviewSingleAttchment } from './PreviewSingleAttchment';

export const MyrequestDetail = () => {
  const { uuid } = useParams();
  // const dispatch = useDispatch();
  // const { tableRecord } = useSelector((state) => state.table);
  const [requestData, setRequestData] = useState([]);
  const [requestDetail, setRequestDetail] = useState({});

  const fetchRecordDataById = async (payload) => {
    const response = await fetchRecordById(payload.tableName, payload?.UUID);
    if (response) {
      setRequestDetail(response);
      setRequestData(JSON.parse(response?.details));
    }
  };
  useEffect(() => {
    let payload = {
      tableName: 'requests',
      UUID: uuid
    };
    if (uuid) {
      fetchRecordDataById(payload);
    }
  }, [uuid]);

  const cancelTicket = async (ticketDetail) => {
    let updateStatus = await updateTableRecord('requests', ticketDetail, {
      status: '5'
    });
  };

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
  return (
    <div
      style={{
        minWidth: 800,
        maxWidth: 1200,
        borderRadius: '5px',
        border: '1px dashed #b4c4e0',
        padding: '20px'
      }}
    >
      {requestDetail && (
        <div className="m-2 flex flex-wrap items-center justify-start px-3 py-1">
          <div className="mb-4">
            <TextField
              style={{
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '13.5px',
                  borderRadius: '3px',
                  with: '200px'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                width: '200px',
                marginRight: '25px'
              }}
              labelstyle={{
                fontWeight: '500'
              }}
              labelname="Request Id"
              variant="outlined"
              readOnly
              value={requestDetail?.id}
            />
          </div>
          <div className="">
            <TextField
              style={{
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '13.5px',
                  borderRadius: '3px',
                  with: '80%'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                width: '200px',
                marginRight: '25px'
              }}
              labelstyle={{
                fontWeight: '500'
              }}
              labelname="Customer"
              variant="outlined"
              readOnly
              value={requestDetail?.customer_display}
            />
          </div>
          <div className="">
            <TextField
              style={{
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '13.5px',
                  borderRadius: '3px'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                width: '200px',
                marginRight: '25px'
              }}
              labelstyle={{
                fontWeight: '500'
              }}
              labelname="Status"
              variant="outlined"
              readOnly
              value={requestDetail?.status_display}
            />
          </div>
          <div className="">
            <TextField
              style={{
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '13.5px',
                  borderRadius: '3px'
                },
                bgcolor: COLORS.WHITE
              }}
              fieldstyle={{
                width: '200px',
                marginRight: '25px'
              }}
              labelstyle={{
                fontWeight: '500'
              }}
              labelname="Catalog"
              variant="outlined"
              readOnly
              value={requestDetail?.catalog}
            />
          </div>
          <div className="">
            <TextField
              style={{
                '& .MuiInputBase-root': {
                  height: '35px',
                  fontSize: '13.5px',
                  borderRadius: '3px'
                },
                bgcolor: COLORS.WHITE
              }}
              // fieldstyle={{
              //     // width: width,
              //     minWidth: '180px',
              // }}
              labelstyle={{
                fontWeight: '500'
              }}
              labelname="Catalog ID"
              variant="outlined"
              readOnly
              value={requestDetail?.catalog_id}
            />
          </div>
        </div>
      )}
      <div className="flex">
        <Button
          style={{
            margin: '0px 5px',
            Padding: '10px'
          }}
          variant="outlined"
        >
          Add worklog
        </Button>
        <Button
          style={{
            margin: '0px 10px'
          }}
          variant="outlined"
        >
          Escalate{' '}
        </Button>
        <Button
          variant="outlined"
          style={{
            margin: '0px 0px'
          }}
          className="my-2"
          onClick={() => cancelTicket(requestDetail?.uuid)}
        >
          Cancel
        </Button>
      </div>
      <div
        className={`my-3 flex flex-wrap items-center justify-start px-3 py-1`}
        style={{
          minWidth: 800,
          maxWidth: 1200,
          borderRadius: '5px',
          border: '1px dashed #b4c4e0'
        }}
      >
        <div className="Add-edit-box">
          {Object.entries(requestData).map(([key, value], index) => {
            const newKey = key
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            return (
              <div key={key}>
                {Array.isArray(value) ? (
                  <div className="w-full">
                    <CreatorAddAttachment
                      selectedRecordId={
                        requestDetail?.uuid ? requestDetail?.uuid : null
                      }
                      catlogFlag="RequestType"
                    />
                  </div>
                ) : typeof value === 'object' ? (
                  <>
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
                      {key}
                    </Typography>
                    <PreviewSingleAttchment
                      catlogFlag=""
                      attachmnetData={value}
                    />
                  </>
                ) : (
                  <div className="json-question mb-3" style={{ width: '20vw' }}>
                    <Typography
                      style={{
                        color: COLORS.SECONDARY,
                        marginRight: '25px',
                        fontWeight: '400',
                        fontSize: '14px'
                      }}
                    >
                      {newKey}
                    </Typography>
                    <Typography
                      style={{
                        color: COLORS.GRAY,
                        fontSize: '14px'
                      }}
                    >
                      {value}
                    </Typography>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
