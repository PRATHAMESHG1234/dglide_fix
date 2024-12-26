import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider
} from '@mui/material';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { colors } from '../../../../../common/constants/styles';

const SectionList = ({
  sectionTitle,
  sectionIcon,
  items,
  selectedTab,
  onNavigationHandler,
  isAdmin
}) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state.sidebar);

  const [openAccordian, setOpenAccordian] = useState(false);

  const getIconColor = (path) =>
    selectedTab === path
      ? colors.primary.main
      : currentTheme === 'Dark'
        ? colors.white
        : colors.grey[900];

  useEffect(() => {
    if (!isOpen) {
      setOpenAccordian(false);
    }
  }, [!isOpen]);

  const renderListItemButton = (item) => {
    const Icon = item.icon;
    const selected = selectedTab?.includes(item.path);

    return (
      <ListItemButton
        key={item.path}
        onClick={() => onNavigationHandler(item.path)}
        style={{
          '&:hover,&:active': {
            bgcolor:
              currentTheme === 'Dark' ? colors.darkTab : colors.primary.light,
            color: colors.primary.main
          },
          minHeight: 38,
          bgcolor: selected ? colors.primary.light : 'transparent',
          color: selected
            ? colors.primary.main
            : currentTheme === 'Dark'
              ? colors.white
              : colors.grey[900],
          margin: '5px',
          borderRadius: '8px',
          paddingLeft: 1.8
        }}
      >
        <ListItemIcon>
          <Icon size="20px" color={getIconColor(item.path)} />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            style: {
              fontWeight: '500',
              color: 'inherit',
              fontSize: '0.875rem'
            }
          }}
          primary={item.name}
        />
      </ListItemButton>
    );
  };

  return (
    <>
      <List>
        <ListItemButton
          onClick={() => setOpenAccordian(!openAccordian)}
          style={{
            '&:hover,&:active': {
              bgcolor:
                currentTheme === 'Dark' ? colors.darkTab : colors.primary.light,
              color: colors.primary.main
            },
            minHeight: 38,
            margin: '5px',
            borderRadius: '8px',
            paddingLeft: 1.8,
            color: getIconColor(selectedTab)
          }}
        >
          <ListItemIcon>
            {React.createElement(sectionIcon, {
              size: '20px',
              color: getIconColor(selectedTab)
            })}
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              style: {
                fontWeight: '500',
                color: 'inherit',
                fontSize: '0.875rem'
              }
            }}
            primary={sectionTitle}
          />
          {openAccordian ? (
            <IconChevronUp size="20px" stroke={1.5} />
          ) : (
            <IconChevronDown size="20px" stroke={1.5} />
          )}
        </ListItemButton>

        <Collapse in={openAccordian} timeout="auto" unmountOnExit>
          <List component="div" disablePadding style={{ pl: 4 }}>
            {items.map(
              (item) =>
                item.path &&
                (item.condition ?? true) &&
                renderListItemButton(item)
            )}
          </List>
        </Collapse>
      </List>
      {isAdmin && (
        <Divider
          style={{ bgcolor: currentTheme === 'Dark' && colors.darkBackground }}
        />
      )}
    </>
  );
};

export default SectionList;
