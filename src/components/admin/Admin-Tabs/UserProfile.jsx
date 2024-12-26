import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { colors } from '../../../common/constants/styles';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

import { useLocation } from 'react-router-dom';
import SubCard from '../../../elements/SubCard';
import DataTable from '../DataTable';
import {
  Boxes,
  CircleUser,
  IdCard,
  UserRoundCog,
  UsersRound
} from 'lucide-react';
import SideIconCard from '../SideIconCard';

const colorsMapping = ['#0ba0da', '#2bb7ee', '#5ec5ed', '	#8fd4ef', '	#bee4f4'];

const userProfileData = [
  {
    icon: <CircleUser size={30} />,
    title: 'User',
    url: 'user/datatable',
    description: 'Brief user overview.',
    form_name: 'system_user'
  },
  {
    icon: <UsersRound size={30} />,
    title: 'Groups',
    url: '/app/metadata/system_group',
    description: 'create groups.',
    form_name: 'system_group'
  },
  {
    icon: <IdCard size={30} />,
    title: 'Roles',
    url: '/app/metadata/system_role',
    description: 'Add user roles',
    form_name: 'system_role'
  },
  {
    icon: <Boxes size={30} />,
    title: 'System gro...',
    url: '/app/metadata/system_group_modules',
    description: 'Add group modules',
    form_name: 'system_group_modules'
  }
];
export const UserProfile = () => {
  return (
    <div className="flex w-full flex-wrap py-4">
      <div className="flex flex-wrap">
        {userProfileData.map((card, index) => (
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
