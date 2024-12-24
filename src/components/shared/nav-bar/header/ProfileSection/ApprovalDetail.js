import React from 'react';
import Dialog from '../../../Dialog';
import { Avatar, Box, Button, Link, Typography } from '@mui/material';
import { colors } from '../../../../../common/constants/styles';
import { useSelector } from 'react-redux';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import approveImage from '../../../../../assets/approv.png';
export const ApprovalDetail = ({
  openDetailPanel,
  setOpenDetailPanel,
  requestData,
  selectedIdData,
  handleApprove,
  handleReject
}) => {
  const { currentUser, currentTheme } = useSelector((state) => state.auth);
  const aprovalModalHeader = () => {
    return (
      <div className="felx-row flex">
        <Avatar
          alt="User 1"
          sx={{
            color: currentTheme === 'Dark' ? colors.white : '',
            width: '50px',
            marginRight: '10px',
            height: '50px'
          }}
          src={approveImage}
        />
        <div>
          <div>Approval</div>
          <Typography
            sx={{
              letterSpacing: '0em',
              fontWeight: 400,
              lineHeight: '1.5em',
              color: currentTheme === 'Dark' ? colors.white : colors.grey[900],
              fontSize: '13px'
            }}
          >
            Approval Request Detail
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Dialog
        footerNone="footerNone"
        Header={{
          open: openDetailPanel,
          close: () => setOpenDetailPanel(false),
          maxWidth: 'xs',
          dialogTitle: aprovalModalHeader()
        }}
        Footer={{
          clear: () => setOpenDetailPanel(false),
          cancelBtnLabel: 'Cancel',
          saveBtnLabel: 'Save'
        }}
      >
        <Box>
          <Typography
            sx={{
              letterSpacing: '0em',
              fontWeight: 400,
              lineHeight: '1.5em',
              color: currentTheme === 'Dark' ? colors.white : colors.grey[900],
              fontSize: '16px'
            }}
          >
            {`Approval ID : ${selectedIdData?.approval_id}`}
          </Typography>
          <Typography
            sx={{
              letterSpacing: '0em',
              fontWeight: 400,
              lineHeight: '1.5em',
              color: currentTheme === 'Dark' ? colors.white : colors.grey[900],
              fontSize: '16px'
            }}
          >
            {`Request : ${selectedIdData?.request_id}`}
          </Typography>
          <Typography
            sx={{
              letterSpacing: '0em',
              fontWeight: 400,
              lineHeight: '1.5em',
              color: currentTheme === 'Dark' ? colors.white : colors.grey[900],
              fontSize: '16px'
            }}
          >
            {`Requested User : ${selectedIdData?.requester_display}`}
          </Typography>
          <Typography
            sx={{
              letterSpacing: '0em',
              fontWeight: 400,
              lineHeight: '1.5em',
              color: currentTheme === 'Dark' ? colors.white : colors.grey[900],
              fontSize: '16px'
            }}
          >
            {`Approver : ${selectedIdData?.approver_display} `}
          </Typography>

          <Typography
            sx={{
              marginTop: '15px',
              letterSpacing: '0em',
              fontWeight: 500,
              lineHeight: '1.5em',
              color: currentTheme === 'Dark' ? colors.white : colors.grey[900],
              fontSize: '18px'
            }}
          >
            Questions & Answers
          </Typography>
          {Object.entries(requestData).map(([key, value]) => {
            const newKey = key
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            return (
              <Typography
                sx={{
                  letterSpacing: '0em',
                  lineHeight: '1.5em',
                  color:
                    currentTheme === 'Dark' ? colors.white : colors.grey[900],
                  fontSize: '15px'
                }}
              >
                {`${newKey} : ${value}`}
              </Typography>
            );
          })}
          <Typography
            sx={{
              marginTop: '15px',
              letterSpacing: '0em',
              fontWeight: 500,
              lineHeight: '1.5em',
              color: currentTheme === 'Dark' ? colors.white : colors.grey[900],
              fontSize: '16px'
            }}
          >
            View Request :{' '}
            <Link
              href={`https://prod.dglide.com/app/catalog/requests/modify?id=${selectedIdData?.request_id}`}
            >
              click here
            </Link>
          </Typography>
          <div className="mt-2 flex justify-around">
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleReject(selectedIdData)}
            >
              {' '}
              <XCircle sx={{
                  color: colors.error.main,
                  width: 16,
                  height: 16,
                  marginRight: 0.5
                }}
              />
              Reject
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleApprove(selectedIdData)}
            >
              <CheckCircle sx={{
                  color: colors.success.main,
                  width: 16,
                  height: 16,
                  marginRight: 0.5
                }}
              />
              Approve
            </Button>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};
