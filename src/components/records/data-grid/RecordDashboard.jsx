import * as React from 'react';

import { Alarm } from 'lucide-react';
import { Circle } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Settings } from 'lucide-react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Badge, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';

import { COLORS } from '../../../common/constants/styles';
import { Button } from '@/componentss/ui/button';

const RecordDashboard = () => {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabsData = [
    {
      value: 'one',
      label: 'All',
      content: 88,
      badgeColor: 'primary',
      tabData: [
        {
          title: 'The Travel Connection',
          createdAt: '22 Oct 2011',
          owner: 'sysmanager',
          sharedWith: 'L',
          name: 'Travel Connection'
        },

        {
          title: 'First Class Tours',
          createdAt: '08 Dec 2008',
          owner: 'sysagent',
          sharedWith: 'W',
          name: 'Class Tours'
        },

        {
          title: 'Travel Bug',
          createdAt: '01 Jan 2024',
          owner: 'sysmanager',
          sharedWith: 'E',
          name: 'Travel Bug'
        },

        {
          title: 'Royalty Travel Systems',
          createdAt: '14 Mar 2020',
          owner: 'sysagent',
          sharedWith: 'R',
          name: 'Travel Systems'
        },

        {
          title: 'Outside Outfitters',
          createdAt: '23 Feb 2016',
          owner: 'sysmanager',
          sharedWith: 'O',
          name: 'Outfitters'
        }
      ]
    },
    {
      value: 'two',
      label: 'Resolved',
      content: 62,
      badgeColor: 'success',
      tabData: [
        {
          title: 'Login does not work',
          createdAt: '28 Nov 2018',
          owner: 'sysagent',
          sharedWith: 'S',
          name: 'Percepta (security)'
        },

        {
          title: 'Advertising agency',
          createdAt: '18 Oct 2017',
          owner: 'sysmanager',
          sharedWith: 'M',
          name: 'Advertising agency'
        },

        {
          title: 'NGO asking for a discount',
          createdAt: '28 Nov 2018',
          owner: 'sysmanager',
          sharedWith: 'K',
          name: 'Percepta (security)'
        },

        {
          title: 'How to set up custom fields',
          createdAt: '12 Oct 2014',
          owner: 'sysagent',
          sharedWith: 'L',
          name: 'Custom fields'
        },

        {
          title: 'Outfitters Advertising agency',
          createdAt: '28 Nov 2018',
          owner: 'sysmanager',
          sharedWith: 'I',
          name: 'Outfitters'
        }
      ]
    },
    {
      value: 'three',
      label: 'Rejected',
      content: 15,
      badgeColor: 'secondary',

      tabData: [
        {
          title: 'Demo Work package subproject',
          createdAt: '12 Oct 2014',
          owner: 'sysmanager',
          sharedWith: 'K',
          name: 'subproject'
        },

        {
          title: 'Publish external articles',
          createdAt: '28 Nov 2018',
          owner: 'sysmanager',
          sharedWith: 'M',
          name: 'Articles'
        },

        {
          title: 'Demo Work package subproject',
          createdAt: '12 Oct 2014',
          owner: 'sysagent',
          sharedWith: 'K',
          name: 'Percepta Demo Work'
        },

        {
          title: 'How to set up custom fields',
          createdAt: '28 Nov 2018',
          owner: 'sysmanager',
          sharedWith: 'O',
          name: 'Feature Images'
        },

        {
          title: 'WISH New feature images',
          createdAt: '20 Mar 2020',
          owner: 'sysagent',
          sharedWith: 'D',
          name: 'Discount Security'
        }
      ]
    },
    {
      value: 'four',
      label: 'Pending',
      content: 12,
      badgeColor: 'warning',

      tabData: [
        {
          title: 'NGO asking for a discount',
          createdAt: '18 Feb 2019',
          owner: 'sysagent',
          sharedWith: 'U',
          name: 'For a discount'
        },

        {
          title: 'WISH New feature images',
          createdAt: '08 Jan 2013',
          owner: 'sysagent',
          sharedWith: 'I',
          name: 'Subproject security'
        },

        {
          title: 'Work package subproject',
          createdAt: '28 Nov 2018',
          owner: 'sysmanager',
          sharedWith: 'P',
          name: 'sysmanager Subproject'
        },

        {
          title: 'Advertising agency',
          createdAt: '08 Jan 2013',
          owner: 'sysagent',
          sharedWith: 'K',
          name: 'Subproject '
        }
      ]
    },
    {
      value: 'six',
      label: 'Deleted',
      content: 24,
      badgeColor: 'error',

      tabData: [
        {
          title: 'Create a project plan.',
          createdAt: '28 Nov 2018',
          owner: 'sysmanager',
          sharedWith: 'J',
          name: 'project plan'
        },

        {
          title: 'User guide released',
          createdAt: '08 Jan 2013',
          owner: 'sysagent',
          sharedWith: 'H',
          name: 'guide released'
        },

        {
          title: 'Create a new project',
          createdAt: '28 Nov 2018',
          owner: 'sysmanager',
          sharedWith: 'G',
          name: 'new project'
        },

        {
          title: 'Blog post about agile',
          createdAt: '28 Nov 2018',
          owner: 'sysmanager',
          sharedWith: 'A',
          name: 'post about agile'
        },

        {
          title: 'Advertising Blog agency',
          createdAt: '08 Jan 2013',
          owner: 'sysagent',
          sharedWith: 'N',
          name: 'Advertising ecurity'
        }
      ]
    }
  ];
  return (
    <div style={{ height: 'calc(100vh - 80px)' }}>
      <div className="mb-3 flex justify-between">
        <div className="flex items-center px-1">
          <Typography
            sx={{
              fontSize: '18px',
              color: COLORS.SECONDARY
            }}
            fontWeight="bold"
          >
            Tickets
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button
            tooltipTitle="Filter"
            variant={'outlined'}
            startDecorator={<Filter fontSize="small" />}
          >
            Filter
          </Button>
          <Button
            tooltipTitle="View More"
            sx={{
              backgroundColor: COLORS.PRIMARY
            }}
          >
            View More
          </Button>
        </div>
      </div>

      <div
        style={{
          height: 'calc(100vh - 150px)',
          backgroundColor: COLORS.WHITE,
          borderRadius: '10px'
        }}
      >
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider', paddingTop: 1.2 }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: COLORS.PRIMARY
                  },
                  '.Mui-selected': {
                    color: COLORS.PRIMARY,
                    fontWeight: 'bold'
                  }
                }}
              >
                {TabsData.map((tab) => (
                  <Tab
                    key={tab.label}
                    value={tab.value}
                    label={
                      <Badge
                        badgeContent={tab.content}
                        color={tab.badgeColor}
                        sx={{ padding: 0.6 }}
                      >
                        {tab.label}
                      </Badge>
                    }
                  />
                ))}
              </TabList>
            </Box>
            <div
              className="m-3 flex flex-col py-2"
              style={{
                borderRadius: '10px',
                height: 'calc(100vh - 245px)',
                backgroundColor: COLORS.TERTIARY,
                overflowY: 'scroll'
              }}
            >
              <div
                className="flex flex-col"
                style={{
                  backgroundColor: COLORS.TERTIARY,
                  overflowY: 'scroll',
                  width: '100%'
                }}
              >
                <TabInfo TabsData={TabsData} />
              </div>
            </div>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default RecordDashboard;

const TabInfo = ({ TabsData }) => {
  return (
    <Box>
      {TabsData.map((tab) => {
        const data = tab.tabData;
        return (
          <TabPanel key={tab.label} value={tab.value} className="m-0 p-0 px-3">
            {data.map((val, i) => {
              return (
                <div
                  key={i}
                  className="my-3 flex items-start justify-start"
                  style={{
                    borderRadius: '5px',
                    height: '150px',
                    backgroundColor: COLORS.WHITE,
                    boxShadow: '1px 1px 8px 3px #4C586A1A'
                  }}
                >
                  <div
                    className="flex items-center justify-start"
                    style={{
                      borderRadius: '5px',
                      height: '150px',
                      width: '20%'
                    }}
                  >
                    <RecordIcon
                      sx={{ fontSize: '40px', color: '#0000001D', marginX: 2 }}
                    />
                    <Typography
                      sx={{
                        fontSize: '18px',
                        color: COLORS.SECONDARY,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      fontWeight="bold"
                    >
                      {val.title}
                    </Typography>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{
                      borderRadius: '5px',
                      height: '150px',
                      width: '15%'
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#0000004D'
                        }}
                        fontWeight="bold"
                      >
                        Created at:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: COLORS.SECONDARY
                        }}
                        fontWeight="bold"
                      >
                        {val.createdAt}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#0000004D',
                          mt: 1
                        }}
                        fontWeight="bold"
                      >
                        Owner
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: COLORS.SECONDARY
                        }}
                        fontWeight="bold"
                      >
                        {val.owner}
                      </Typography>
                    </Box>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{
                      borderRadius: '5px',
                      height: '150px',
                      width: '16%'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#0000004D'
                      }}
                      fontWeight="bold"
                    >
                      Shared with
                    </Typography>
                    <AvatarGroup sx={{ mt: 2 }}>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                        sx={{ width: 35, height: 35 }}
                        className="bg-danger"
                      >
                        {val.sharedWith}
                      </Avatar>

                      <Avatar
                        alt="Agnes Walker"
                        src="/static/images/avatar/4.jpg"
                        sx={{ width: 35, height: 35 }}
                        className="bg-success"
                      />
                    </AvatarGroup>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{
                      borderRadius: '5px',
                      height: '150px',
                      width: '18%'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '15px',
                        color: COLORS.SECONDARY
                      }}
                      fontWeight="bold"
                    >
                      {val.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#0000004D'
                      }}
                      fontWeight="bold"
                    >
                      system admin
                    </Typography>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{
                      borderRadius: '5px',
                      height: '150px',
                      width: '15.35%'
                    }}
                  >
                    <Box
                      className="rounded-pill flex items-center justify-center"
                      style={{
                        background: '#EEE9FF',
                        color: COLORS.PRIMARY,
                        fontWeight: 'bold',
                        padding: 6
                      }}
                    >
                      <Reminder />
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: COLORS.PRIMARY,
                          paddingX: 1
                        }}
                        fontWeight="bold"
                      >
                        Add Reminder
                      </Typography>
                    </Box>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{
                      borderRadius: '5px',
                      height: '150px',
                      width: '16%'
                    }}
                  >
                    <Box className="flex items-start justify-center">
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#1cdc75',
                          paddingX: 1
                        }}
                        fontWeight="bold"
                      >
                        Signed
                      </Typography>
                      <CircleIcon
                        sx={{ color: '#1cdc75', fontSize: '15px', mt: 0.3 }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#0000004D'
                      }}
                      fontWeight="bold"
                    >
                      {val.createdAt}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </TabPanel>
        );
      })}
    </Box>
  );
};
