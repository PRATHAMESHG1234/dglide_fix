import React from 'react';
import SectionList from './SectionList';
import {
  IconSettings,
  IconLocationBolt,
  IconAlignJustified,
  IconListTree,
  IconPokeball,
  IconSitemap,
  IconBrandGithubCopilot,
  IconMessage2Exclamation,
  IconAi
} from '@tabler/icons-react';
const settingsItems = (currentModule) => [
  {
    path: currentModule ? `app/${currentModule.name}/actions` : null,
    name: 'Actions',
    icon: IconLocationBolt,
    condition: !!currentModule
  },
  {
    path: '/fields',
    name: 'Fields',
    icon: IconAlignJustified
  },
  {
    path: '/catalogflow',
    name: 'Catalogs',
    icon: IconListTree
  },
  {
    path: '/portal',
    name: 'Portal',
    icon: IconPokeball
  },
  {
    path: '/workflow',
    name: 'Workflow',
    icon: IconSitemap
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    icon: IconBrandGithubCopilot
  },
  {
    path: currentModule ? `app/${currentModule.name}/ui-rules` : null,
    name: 'UI-Rules',
    icon: IconMessage2Exclamation,
    condition: !!currentModule
  },
  {
    path: '/ai',
    name: 'AI',
    icon: IconAi
  }
];

const SettingsSection = ({
  onNavigationHandler,
  selectedTab,
  currentModule,
  currentUser
}) => {
  return currentUser?.roles?.some((role) => role.level === '1') ? (
    <SectionList
      sectionTitle="Settings"
      sectionIcon={IconSettings}
      items={settingsItems(currentModule)}
      selectedTab={selectedTab}
      onNavigationHandler={onNavigationHandler}
      isAdmin
    />
  ) : null;
};

export default SettingsSection;
