import React, { useState } from 'react';
import { Paper, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { FIELD } from '../../../common/constants/fields';
import { colors } from '../../../common/constants/styles';

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';

// assets
import LaptopMacIcon from '@mui/icons-material/LaptopMacTwoTone';
import RepeatIcon from '@mui/icons-material/RepeatTwoTone';
import Dialog from '../../../elements/Dialog';
import MailDetails from '../../../pages/MailDetails';
import { fetchTableReferenceDataByUUID } from '../../../services/table';
import SocialActivity from '../../../pages/SocialActivity';

const TimeLine = ({
  rows,
  columns,
  tab,
  onRecordSelected,
  uploadTab,
  open
}) => {
  const systemDefaultFields = [];
  systemDefaultFields.push(Object.keys(FIELD).map((key, index) => FIELD[key]));
  const columnsArr = columns?.map((k) => k.field);

  const filteredColumns = columnsArr?.filter(
    (col) => !systemDefaultFields[0].includes(col)
  );
  const [showMailDialog, setShowMailDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const color = ['#673AB7', '#2196F3'];
  const icons = [LaptopMacIcon, RepeatIcon];
  function assignColorById(id) {
    const colorIndex = id % color.length;
    const assignedColor = color[colorIndex];

    return assignedColor;
  }

  function assignIconById(id) {
    const colorIndex = id % icons.length;
    const assignedIcon = icons[colorIndex];

    return assignedIcon;
  }

  const theme = useTheme();
  const paper = {
    p: 2.5,
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? theme.palette.dark.main
        : colors.primary.light,
    border: '1px dashed',
    borderColor:
      theme.palette.mode === 'dark'
        ? theme.palette.dark.dark
        : colors.primary.dark,
    transition: 'transform 0.2s',
    borderRadius: '8px',
    '&:hover': {
      border: `1px solid ${colors.primary.main}`,
      transform: 'scale(1.03)',
      cursor: 'pointer'
    }
  };

  const [selectedMail, setSelectedMail] = useState(null);
  const onMailSelected = (selectedRowId, tab) => {
    if (!selectedRowId || !tab) return null;
    // setSelectedTabDataRecordId(selectedRowId);

    fetchTableReferenceDataByUUID(tab?.fieldInfoId, selectedRowId).then(
      (res) => {
        setSelectedMail(res?.result);
      }
    );
    setShowMailDialog(true);
  };
  const onSocialSelected = (selectedRowId, tab) => {
    if (!selectedRowId || !tab) return null;
    // setSelectedTabDataRecordId(selectedRowId);
    fetchTableReferenceDataByUUID(tab?.fieldInfoId, selectedRowId).then(
      (res) => {
        setSelectedMail(res?.result);
      }
    );
    setShowActivityDialog(true);
  };

  function truncateString(str, maxLength) {
    // Check if the string length is greater than the maximum length
    if (str.length > maxLength) {
      // Truncate the string and add "..." at the end
      return str.slice(0, maxLength) + '...';
    }
    // Return the original string if it's within the maxLength
    return str;
  }

  return (
    <div>
      <div
        className="flex justify-between"
        style={{
          marginLeft: '98px',
          marginRight: '98px'
        }}
      ></div>
      {rows?.map((row, i) => {
        const data = filteredColumns?.reduce(
          (obj, key) => ({ ...obj, [key]: row[key.toLowerCase()] }),
          {}
        );
        const IconComponent = assignIconById(i);
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            {row.type !== 'Inbound Email' && (
              <>
                <Timeline position="right">
                  <TimelineItem>
                    <TimelineOppositeContent>
                      <Typography
                        style={{
                          letterSpacing: '0em',
                          fontWeight: 400,
                          lineHeight: '1.5em',
                          color: colors.grey[600],
                          fontSize: '0.875rem'
                        }}
                        color="textSecondary"
                      >
                        {moment(row?.created_at).format('DD MMM hh:mm a')}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot style={{ bgcolor: assignColorById(i) }}>
                        <IconComponent style={{ color: '#fff' }} />
                      </TimelineDot>
                      <TimelineConnector style={{ height: '50px' }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper
                        elevation={3}
                        style={paper}
                        onClick={() => {
                          if (row.type === 'Outbound Email') {
                            onMailSelected(row?.id, tab);
                            setSelectedId(row?.id);
                          } else if (row.type === 'Social Activity') {
                            onSocialSelected(row?.id, tab);
                          } else {
                            onRecordSelected(row?.id, tab);
                          }
                        }}
                      >
                        {Object.keys(data)
                          .filter((key) => key !== 'ticketid')
                          .map((key, index) => (
                            <React.Fragment key={key}>
                              {index === 0 ? (
                                <Typography
                                  style={{
                                    fontSize: '0.875rem',
                                    color: colors.grey[900],
                                    fontWeight: 500,
                                    fontFamily: 'Roboto, sans-serif'
                                  }}
                                  component="h1"
                                >
                                  {data[key]}{' '}
                                </Typography>
                              ) : /<\/?[a-z][\s\S]*>/i.test(data[key]) ? (
                                <Typography
                                  style={{
                                    fontSize: '0.875rem',
                                    fontFamily: 'Roboto, sans-serif'
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: truncateString(data[key], 100)
                                  }}
                                />
                              ) : null}
                            </React.Fragment>
                          ))}
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </>
            )}
            {showMailDialog && (
              <Dialog
                title={'Email'}
                // width="sm"
                secondButtonText={'Close'}
                open={showMailDialog}
                setOpen={setShowMailDialog}
                body={
                  selectedMail && (
                    <MailDetails
                      mailData={selectedMail}
                      formId={tab?.id}
                      uploadTab={uploadTab}
                      selectedId={selectedId}
                      open={open}
                    />
                  )
                }
              />
            )}

            {showActivityDialog && (
              <Dialog
                title={'Social Activity'}
                // width="sm"
                secondButtonText={'Close'}
                open={showActivityDialog}
                setOpen={setShowActivityDialog}
                body={
                  selectedMail && (
                    <SocialActivity
                      socialData={selectedMail}
                      formId={tab?.id}
                    />
                  )
                }
              />
            )}

            {row.type === 'Inbound Email' && (
              <Timeline position="left">
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography
                      style={{
                        letterSpacing: '0em',
                        fontWeight: 400,
                        lineHeight: '1.5em',
                        color: colors.grey[600],
                        fontSize: '0.875rem'
                      }}
                      color="textSecondary"
                    >
                      {moment(row?.created_at).format('DD MMM hh:mm a')}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot style={{ bgcolor: assignColorById(i) }}>
                      <IconComponent style={{ color: '#fff' }} />
                    </TimelineDot>
                    <TimelineConnector style={{ height: '50px' }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper
                      elevation={3}
                      style={paper}
                      onClick={() => {
                        onMailSelected(row?.id, tab);
                        setSelectedId(row?.id);
                      }}
                    >
                      {Object.keys(data)
                        .filter((key) => key !== 'ticketid')
                        .map((key, index) => (
                          <React.Fragment key={key}>
                            {index === 0 ? (
                              <Typography
                                style={{
                                  fontSize: '0.875rem',
                                  color: colors.grey[900],
                                  fontWeight: 500,
                                  fontFamily: 'Roboto, sans-serif'
                                }}
                                component="h1"
                              >
                                {data[key]}
                              </Typography>
                            ) : /<\/?[a-z][\s\S]*>/i.test(data[key]) ? (
                              <Typography
                                style={{
                                  fontSize: '0.875rem',
                                  fontFamily: 'Roboto, sans-serif'
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: truncateString(data[key], 100)
                                }}
                              />
                            ) : null}
                          </React.Fragment>
                        ))}
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            )}
          </div>
          // </div>
        );
      })}
    </div>
  );
};

export default TimeLine;
