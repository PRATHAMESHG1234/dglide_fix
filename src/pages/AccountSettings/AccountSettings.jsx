import React, { useEffect, useState } from 'react';
import Profile from './Profile/Profile';
import Security from './security/security';
import Notifications from './Notifications/Notification';
import { fetchRecordById } from '../../services/table';
import { useSelector } from 'react-redux';
import { CustomTabs } from '@/componentss/ui/custom-tabs';

// ==============================|| PROFILE 3 ||============================== //

const AccountSettings = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [value, setValue] = useState(0);
  const [userDetail, setUserDetail] = useState({});
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getUserData = async () => {
    try {
      const response = await fetchRecordById(
        'system_user',
        currentUser?.userUUID
      );
      setUserDetail(response);
    } catch (error) {
      console.error('Error fetching record:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [currentUser]);

  const tabItems = [
    {
      label: 'Profile',
      value: 'Profile',
      content: (
        <div className="rounded-lg bg-gray-100 py-4">
          <Profile userDetail={userDetail} getUserData={getUserData} />
        </div>
      )
    },
    {
      label: 'Security',
      value: 'Security',
      content: (
        <div className="rounded-lg bg-gray-100 py-4">
          <Security userDetail={userDetail} getUserData={getUserData} />
        </div>
      )
    },
    {
      label: 'Notifications',
      value: 'Notifications',
      content: (
        <div className="rounded-lg bg-gray-100 py-4">
          <Notifications />
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen w-full bg-accent">
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between space-x-6">
          <CustomTabs items={tabItems} />
          {/* <Tabs
            value={value}
            indicatorColor="primary"
            onChange={handleChange}
            sx={{
              mb: 3,

              minHeight: 'auto',
              '& button': {
                minWidth: 100
              },
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.25,
                color: colors.grey[900],
                textTransform: 'none',
                '&:hover': {
                  color: colors.primary.main
                }
              },
              '& a.Mui-selected': {
                color: colors.primary.main
              }
            }}
            aria-label="simple tabs example"
            variant="scrollable"
          >
            <Tab
              sx={{
                '&:hover': {
                  textDecoration: 'none'
                },
                '&.Mui-selected': {
                  textDecoration: 'none'
                },
                color: 'inherit'
              }}
              component={Link}
              to="#"
              label="Profile"
              {...a11yProps(0)}
            />

            <Tab
              sx={{
                '&:hover': {
                  textDecoration: 'none'
                },
                '&.Mui-selected': {
                  textDecoration: 'none'
                },
                color: 'inherit'
              }}
              component={Link}
              to="#"
              label="Security"
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                '&:hover': {
                  textDecoration: 'none'
                },
                '&.Mui-selected': {
                  textDecoration: 'none'
                },
                color: 'inherit'
              }}
              component={Link}
              to="#"
              label="Notifications"
              {...a11yProps(2)}
            />
          </Tabs> */}
        </div>
      </div>
      <div className="w-full">
        {/* <TabPanel value={value} index={0}>
          <Profile userDetail={userDetail} getUserData={getUserData} />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Security userDetail={userDetail} getUserData={getUserData} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Notifications />
        </TabPanel> */}
      </div>
    </div>
  );
};

export default AccountSettings;
