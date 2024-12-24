import React, { useRef, useState } from 'react';

import { Mail } from 'lucide-react';
import { FileText } from 'lucide-react';

import { Compass } from 'lucide-react';
import { Hourglass } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { CalendarEdit } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { colors } from '../../../common/constants/styles';
import { Grid } from '@mui/material';
import SideIconCard from '../SideIconCard';
import DataTable from '../DataTable';
import SubCard from '../../../elements/SubCard';
import {
  Calendar1,
  CircleCheckBig,
  Handshake,
  LayoutPanelTop,
  MonitorCog,
  SearchCheck,
  Vote
} from 'lucide-react';

const colorsMapping = ['#0ba0da', '#2bb7ee', '#5ec5ed', '	#8fd4ef', '	#bee4f4'];

const userOperationData = [
  {
    icon: <LayoutPanelTop size={30} />,
    title: 'Template',
    url: '/app/metadata/system_form_template',
    bg: colors.warning.main,
    description: 'create template',
    form_name: 'system_form_template'
  },
  {
    icon: <CircleCheckBig size={30} />,
    title: 'Approval',
    url: '/app/metadata/system_group',
    bg: colors.secondary.main,
    description: 'Manage approvals',
    form_name: 'approval'
  },
  {
    icon: <SearchCheck size={30} />,
    title: 'Open search co..',
    url: '/app/metadata/system_role',
    bg: colors.success.main,
    description: 'Open search config',
    form_name: 'open_search_config'
  },
  {
    icon: <Handshake size={30} />,
    title: 'Business Shift..',
    url: '/app/metadata/system_slots',
    bg: colors.primary.main,
    description: 'Business Shift mana...',
    form_name: 'system_slots'
  },
  {
    icon: <Calendar1 size={30} />,
    title: 'Business Holiday..',
    url: '/app/metadata/system_holidays',
    bg: colors.orange.main,
    description: 'Business Holiday mana...',
    form_name: 'system_holidays'
  },
  {
    icon: <MonitorCog size={30} />,
    title: 'System Inbound ..',
    url: '/app/metadata/system_email_inbound_rules',
    bg: colors.success.main,
    description: 'System Email Inbound rules...',
    form_name: 'system_email_inbound_rules'
  },
  {
    icon: <Vote size={30} />,
    title: 'SLA Policies',
    url: '/app/metadata/system_sla_policies',
    bg: colors.secondary.main,
    description: 'System SLA policies...',
    form_name: 'system_sla_policies'
  }
];
export const Operation = () => {
  return (
    <div className="flex w-full flex-wrap py-4">
      <div className="flex flex-wrap gap-y-4">
        {userOperationData?.map((card, index) => (
          <SideIconCard
            iconPrimary={card?.icon}
            primary={card?.title}
            secondary={card?.description}
            secondarySub={card?.count}
            url={card.url}
            color={colorsMapping[index % colorsMapping.length]}
            formName={card?.form_name}
            tab="user-profile"
          />
        ))}
      </div>
    </div>
  );
};
