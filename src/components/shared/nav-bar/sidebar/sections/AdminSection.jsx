import React from 'react';
import SectionList from './SectionList';
import {
  IconUserBolt,
  IconUser,
  IconDeviceLaptop,
  IconAutomation,
  IconArrowsDownUp,
  IconRepeat
} from '@tabler/icons-react';
const adminItems = () => [
  {
    path: '/admin/user-profile',
    name: 'User Profile',
    icon: IconUser
  },
  {
    path: '/admin/channels',
    name: 'Channels',
    icon: IconDeviceLaptop
  },
  {
    path: '/admin/operation',
    name: 'Operation',
    icon: IconAutomation
  },
  {
    path: '/admin/importExport',
    name: 'Import/Export',
    icon: IconArrowsDownUp
  },
  {
    path: '/admin/integration',
    name: 'Integration',
    icon: IconRepeat
  }
];

const AdminSection = ({ currentUser, selectedTab, onNavigationHandler }) => {
  return currentUser?.roles?.some((role) => role.level === '1') ? (
    <SectionList
      sectionTitle="Admin"
      sectionIcon={IconUserBolt}
      items={adminItems()}
      selectedTab={selectedTab}
      onNavigationHandler={onNavigationHandler}
      isAdmin
    />
  ) : null;
};

export default AdminSection;
