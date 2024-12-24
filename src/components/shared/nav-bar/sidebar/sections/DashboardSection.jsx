import React from 'react';
import SectionList from './SectionList';
import {
  IconLayoutDashboard,
  IconPresentationAnalytics,
  IconBuildings,
  IconChartHistogram
} from '@tabler/icons-react';
const dashboardItems = (currentModule) => [
  {
    id: 'config',
    name: 'Config',
    icon: IconPresentationAnalytics,
    path: `app/${currentModule?.name}/dashboard/config`
  },
  {
    id: 'build',
    name: 'Build',
    icon: IconBuildings,
    path: `app/${currentModule?.name}/dashboard/build`
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: IconChartHistogram,
    path: `app/${currentModule?.name}/dashboard/analytics`
  }
];

const DashboardSection = ({
  selectedTab,
  onNavigationHandler,
  currentModule
}) => {
  return (
    <>
      {currentModule && (
        <SectionList
          sectionTitle="Dashboard"
          sectionIcon={IconLayoutDashboard}
          items={dashboardItems(currentModule)}
          selectedTab={selectedTab}
          onNavigationHandler={onNavigationHandler}
        />
      )}
    </>
  );
};

export default DashboardSection;
