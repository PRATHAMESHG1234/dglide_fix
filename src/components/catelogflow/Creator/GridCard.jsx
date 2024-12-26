import React, { useState } from 'react';
import { colors, COLORS } from '../../../common/constants/styles';
import { Button, Grid, Menu, MenuItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { Edit, Edit2 } from 'lucide-react';

import { Eye } from 'lucide-react';
import { MoreVertical } from 'lucide-react';

import { Divider, Stack, Tooltip, Typography } from '@mui/joy';

import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';

import MenuButton from '@mui/joy/MenuButton';
import Chip from '../../../elements/Chip';
import { MoreHorizontal } from 'lucide-react';
import Avatar from '../../../elements/Avatars';
import { CheckCircle } from 'lucide-react';
import ChildCard from './ChildCard';

function GridCard({
  type,
  items,
  goToPanel,
  modalActionHandler,
  goToFields,
  onCreateNew
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { currentTheme } = useSelector((state) => state.auth);
  const URL = process.env.REACT_APP_STORAGE_URL;
  const [anchorEl, setAnchorEl] = useState({});

  const color = [colors.primary.main];
  const chipColor = ['#0ba0da', '#2bb7ee', '#5ec5ed', '	#8fd4ef', '	#bee4f4'];

  function assignColorByIdChip(id) {
    const colorIndex = id % chipColor.length;
    const assignedColor = chipColor[colorIndex];

    return assignedColor;
  }
  function assignColorById(id) {
    const colorIndex = id % color.length;
    const assignedColor = color[colorIndex];

    return assignedColor;
  }

  function truncate(input, limit) {
    if (!input) return '';
    if (input.length > limit) {
      return input.slice(0, limit) + '...';
    } else {
      return input;
    }
  }

  const handleClick = (event, uuid) => {
    setAnchorEl((prev) => ({ ...prev, [uuid]: event.currentTarget }));
  };

  const handleClose = (uuid) => {
    setAnchorEl((prev) => ({ ...prev, [uuid]: null }));
  };

  const onActionClick = (filteredItem) => {
    navigate(`creatorPreview/${filteredItem.uuid}`);
  };

  const [displayedItemsPerCategory, setDisplayedItemsPerCategory] = useState(
    {}
  );
  const status = 'Active';
  const handleShowMore = (category) => {
    setDisplayedItemsPerCategory((prevState) => ({
      ...prevState,
      [category]: (prevState[category] || 0) + 100
    }));
  };

  const menuActions = [
    {
      label: 'Edit',
      action: 'edit',
      handler: (item) => modalActionHandler('edit', item.uuid)
    },
    {
      label: 'Delete',
      action: 'delete',
      handler: (item) => modalActionHandler('delete', item.uuid)
    },
    {
      label: 'Preview',
      action: 'preview',
      handler: (item) => onActionClick(item)
    }
  ];

  const handleMenuItemClick = (handler, item) => {
    handler(item);
    handleClose(item.uuid);
  };

  return (
    <>
      {items
        ?.filter(
          (item, index) =>
            items.findIndex((i) => i.category === item.category) === index
        )
        .sort((a, b) =>
          (a?.category?.toLowerCase() || '').localeCompare(
            b?.category?.toLowerCase() || ''
          )
        )
        .map((item, index) => {
          const category = item.category;
          const displayedItems = displayedItemsPerCategory[category] || 5;

          return (
            <Grid
              key={item.catelogflow_id}
              item
              style={{
                backgroundColor:
                  currentTheme === 'Dark' ? colors.darkLevel2 : colors.white,
                // margin: '0 0 10px 10px',
                paddingX: '26px',
                borderRadius: '10px',
                boxShadow: '0px 10px 50px 0px #0000000A',
                width: '100%'
              }}
            >
              <Grid container spacing={3} style={{ paddingY: 1 }}>
                <Grid item>
                  <Typography style={{ fontWeight: 600, fontSize: '16px' }}>
                    {item.category}
                  </Typography>
                </Grid>
              </Grid>
              <Grid className="flex flex-row flex-wrap">
                {items
                  .filter((o) => o.category === item.category)
                  .sort((a, b) => {
                    return (
                      a.catalog?.trim().toLowerCase() || ''
                    ).localeCompare(b.catalog?.trim().toLowerCase() || '');
                  })
                  .slice(0, displayedItems)
                  .map((filteredItem, index) => (
                    <ChildCard
                      goToPanel={goToPanel}
                      item={item}
                      filteredItem={filteredItem}
                      handleMenuItemClick={handleMenuItemClick}
                      menuActions={menuActions}
                      index={index}
                    />
                  ))}
                {items.filter((o) => o.category === category).length >
                  displayedItems && (
                  <small className="mb-3 flex flex-col justify-end">
                    <Button
                      onClick={() => handleShowMore(item.category)}
                      variant="outlined"
                      size="small"
                      style={{
                        color: assignColorById(item?.catelogflow_id),
                        border: `solid 0.5px ${assignColorById(item?.catelogflow_id)}`,
                        '&:hover': {
                          color: assignColorById(item?.catelogflow_id),
                          border: `solid 0.5px ${assignColorById(item?.catelogflow_id)}`
                        }
                      }}
                    >
                      Show more
                    </Button>
                  </small>
                )}
              </Grid>
            </Grid>
          );
        })}
    </>
  );
}

export default GridCard;
