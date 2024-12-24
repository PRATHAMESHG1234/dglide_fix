import React, { useRef, useState } from 'react';
import { colors } from '../../../common/constants/styles';

import SideIconCard from '../SideIconCard';
import { Facebook, MailCheck } from 'lucide-react';

const colorsMapping = ['#0ba0da', '#2bb7ee', '#5ec5ed', '	#8fd4ef', '	#bee4f4'];

const userChannelData = [
  {
    icon: <Facebook size={30} />,
    title: 'Facebook config',
    url: 'user/datatable',
    bg: colors.primary.main,
    description: 'Manage fb config',
    form_name: 'facebook_configuration'
  },
  {
    icon: <MailCheck size={30} />,
    title: 'Email settings',
    url: '#',
    bg: colors.success.main,
    description: 'Manage email settings',
    form_name: 'system_email_setting'
  }
];
export const Channels = () => {
  return (
    <div className="flex w-full flex-wrap py-4">
      <div className="flex flex-wrap">
        {userChannelData?.map((card, index) => (
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
