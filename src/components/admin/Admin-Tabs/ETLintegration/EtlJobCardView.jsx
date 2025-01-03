import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Clock } from 'lucide-react';
import { Edit, Edit2 } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import {
  Avatar,
  Badge,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';

import { colors } from '../../../../common/constants/styles';
import { Label } from '@/componentss/ui/label';
import { Switch } from '@/componentss/ui/switch';

export const EtlJobCardView = ({
  item,
  etlTypeList,
  setEtlActionObj,
  setOpen,
  handleSwitch,
  jobClickHandler
}) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  function truncateAfterTwentyChars(input, limit) {
    if (!input) return '';
    if (input.length > limit) {
      return input.slice(0, limit) + '...';
    } else {
      return input;
    }
  }

  const color = [colors.primary.main];

  function assignColorById(id) {
    const colorIndex = id % color.length;
    const assignedColor = color[colorIndex];

    return assignedColor;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid
        item
        key={item.jobId}
        paddingBottom="16px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        width="100%"
      >
        <Card
          style={{
            p: 2,
            background:
              currentTheme === 'Dark' ? colors.darkLevel1 : colors.white,
            border:
              currentTheme === 'Dark'
                ? '1px solid transparent'
                : `1px solid${colors.grey[100]}`,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'Scale(0.98)'
            },
            borderRadius: 4,
            width: '100%',
            minHeight: '135px',
            boxShadow:
              currentTheme === 'Light' &&
              'rgba(149, 157, 165, 0.2) 0px 8px 24px',
            cursor: 'pointer'
          }}
          onDoubleClick={() => jobClickHandler(item)}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs zeroMinWidth display="flex" gap="20px">
                  {etlTypeList.find((o) => o.value === item.type)?.label ===
                  'Continuous sync' ? (
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      badgeContent={
                        <Clock
                          style={{
                            color: colors.success.main,
                            width: 19,
                            height: 19,
                            marginLeft: 0.5
                          }}
                        />
                      }
                    >
                      <Avatar
                        alt="User 1"
                        style={{
                          backgroundColor: assignColorById(item?.id),
                          color: currentTheme === 'Dark' ? colors.white : '',
                          width: '50px',
                          height: '50px'
                        }}
                        src={`${process.env.REACT_APP_STORAGE_URL}/${item?.logo}`}
                      >
                        <Typography style={{ fontSize: '24px' }}>
                          {item?.name?.charAt(0).toUpperCase()}
                        </Typography>
                      </Avatar>
                    </Badge>
                  ) : (
                    <Avatar
                      alt="User 1"
                      style={{
                        backgroundColor: assignColorById(item?.id),
                        color: currentTheme === 'Dark' ? colors.white : '',
                        width: '50px',
                        height: '50px'
                      }}
                      src={`${process.env.REACT_APP_STORAGE_URL}/${item?.logo}`}
                    >
                      <Typography style={{ fontSize: '24px' }}>
                        {item?.name?.charAt(0).toUpperCase()}
                      </Typography>
                    </Avatar>
                  )}
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontSize: '1.25rem',
                        color: colors.grey[900],
                        fontWeight: 600
                      }}
                      component="div"
                    >
                      {truncateAfterTwentyChars(item?.name, 50)}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '0.75rem',
                        color: colors.grey[500],
                        fontWeight: 500
                      }}
                    >
                      {`${etlTypeList.find((mapping) => mapping.value === item?.type)?.label || ''} ${
                        item?.type === 2 ? `(${item?.timeInterval})` : ''
                      }`}
                    </Typography>
                  </Grid>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="airplane-mode"
                      checked={Boolean(item?.isActive)}
                      onCheckedChange={(checked) => {
                        handleSwitch(checked, item);
                      }}
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  // onMouseEnter={() => setFlag(true)}
                  // onMouseLeave={() => setFlag(false)}
                >
                  <IconButton
                    size="small"
                    style={{ mt: '5px', mr: -0.75 }}
                    onClick={handleClick}
                  >
                    <MoreHorizontal
                      fontSize="small"
                      color="inherit"
                      aria-controls="menu-friend-card"
                      aria-haspopup="true"
                      style={{
                        opacity: 0.6,
                        color: currentTheme === 'Dark' ? colors.white : ''
                      }}
                    />
                  </IconButton>
                  {anchorEl && (
                    <Menu
                      id="menu-simple-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          setEtlActionObj({ type: 'edit', data: item });
                          handleClose();
                          setOpen(true);
                        }}
                        style={{
                          '&:hover': {
                            backgroundColor: item.hoverColor
                          },
                          border: `solid 0.5px ${colors.grey[100]}`
                        }}
                      >
                        <ListItemIcon>
                          <Edit fontSize="small" color="primary" />
                        </ListItemIcon>
                        <Typography
                          style={{
                            color: item.textColor,
                            fontSize: '14px'
                          }}
                        >
                          Edit
                        </Typography>
                      </MenuItem>
                      {/* <MenuItem
                        onClick={() => {
                          setEtlActionObj({ type: 'delete', data: item });
                          handleClose();
                          setOpen(true);
                        }}
                        style={{
                          '&:hover': {
                            backgroundColor: item.hoverColor
                          },
                          border: `solid 0.5px ${colors.grey[100]}`
                        }}
                      >
                        <ListItemIcon>
                          {' '}
                          <Trash2 fontSize="small"
                            color="primary"
                            style={{
                              color: colors.error.main
                            }}
                          />
                        </ListItemIcon>
                        <Typography
                          style={{
                            color: item.textColor,
                            fontSize: '14px'
                          }}
                        >
                          Delete
                        </Typography>
                      </MenuItem> */}
                    </Menu>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ height: '30px' }}>
              <Typography
                style={{
                  color: colors.grey[700],
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  width: '50%'
                }}
              >
                {truncateAfterTwentyChars(item?.description, 80)}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};
