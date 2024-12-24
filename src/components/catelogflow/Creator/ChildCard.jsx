import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Button,
  Card,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material';

// assets
import { MoreHorizontal } from 'lucide-react';
import { UserPlus } from 'lucide-react';
import { Users } from 'lucide-react';
import { MapPin } from 'lucide-react';

import { Heart } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Users } from 'lucide-react';
import { colors } from '../../../common/constants/styles';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
// ==============================|| SOCIAL PROFILE - FOLLOWER CARD ||============================== //

const ChildCard = ({
  filteredItem,
  handleMenuItemClick,
  menuActions,
  item,
  goToPanel,
  index
}) => {
  const theme = useTheme();

  const { currentTheme } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState({});
  const [flag, setFlag] = useState(false);
  const handleClick = (event, uuid) => {
    setAnchorEl((prev) => ({ ...prev, [uuid]: event.currentTarget }));
  };

  const handleClose = (uuid) => {
    setAnchorEl((prev) => ({ ...prev, [uuid]: null }));
  };

  const location = useLocation();
  const pathname = location.pathname;

  const follower = {
    id: '#4Followers_Henderson',
    avatar: 'user-8.png',
    name: 'Henderson',
    location: 'South Antonina',
    follow: 1
  };

  function truncate(input, limit) {
    if (!input) return '';
    if (input.length > limit) {
      return input.slice(0, limit) + '...';
    } else {
      return input;
    }
  }

  const color = ['#0ba0da', '#2bb7ee', '#5ec5ed', '	#8fd4ef', '	#bee4f4'];
  const chipColor = ['primary', 'secondary', 'success', 'warning'];

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

  return (
    <Card
      sx={{
        width: '250px',
        marginRight: '10px',
        marginBottom: '10px',
        padding: '16px',
        background: currentTheme === 'Dark' ? colors.darkLevel1 : colors.white,
        border: '1px solid',
        borderColor: currentTheme === 'Dark' ? 'transparent' : colors.grey[100],
        '&:hover': {
          border: `1px solid${colors.primary.main}`
        },
        boxShadow:
          currentTheme === 'Light' && 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        cursor: 'pointer'
      }}
      key={filteredItem?.catelogflow_id}
      onClick={() => (!flag ? goToPanel(filteredItem) : null)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar
                sx={{
                  backgroundColor: assignColorById(index),
                  color: currentTheme === 'Dark' ? colors.white : colors.white
                }}
                alt="User 1"
                src={`${process.env.REACT_APP_STORAGE_URL}/${filteredItem?.logo}`}
              >
                <Typography sx={{ fontSize: '24px', color: colors.white }}>
                  {filteredItem.catalog?.trim().charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography
                component="div"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  fontSize: '0.875rem',
                  color: colors.grey[900],
                  fontWeight: 500
                }}
              >
                {truncate(
                  pathname.includes('/myRequest')
                    ? `${filteredItem.id}-(${filteredItem.catalog})`
                    : filteredItem.catalog,
                  20
                )}
                {pathname.includes('/myRequest') ? (
                  <span>{`Status: ${filteredItem.status}`}</span>
                ) : null}
              </Typography>
              <Typography
                sx={{
                  mt: 0.25,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: colors.grey[700]
                }}
              >
                {' '}
                <Tooltip
                  title={
                    filteredItem?.status === '1' ||
                    filteredItem?.status === 'Enabled'
                      ? 'Enabled'
                      : 'Disabled'
                  }
                  placement="bottom"
                >
                  {filteredItem.status === 'Enabled' ||
                  filteredItem.status === '1' ? (
                    <CheckCircleIcon
                      sx={{
                        color: colors.success.main,
                        mr: '6px',
                        fontSize: '16px'
                      }}
                    />
                  ) : (
                    <CancelIcon
                      sx={{
                        color: colors.error.main,
                        mr: '6px',
                        fontSize: '16px'
                      }}
                    />
                  )}
                </Tooltip>
                {/* <PinDropTwoToneIcon
                  sx={{
                    mr: '6px',
                    fontSize: '16px',
                    verticalAlign: 'text-top'
                  }}
                /> */}
                {filteredItem?.sub_category}
              </Typography>
            </Grid>
            {pathname === '/catalogflow' && (
              <Grid
                item
                onMouseEnter={() => setFlag(true)}
                onMouseLeave={() => setFlag(false)}
              >
                <IconButton
                  size="small"
                  sx={{ mt: -0.75, mr: -0.75 }}
                  onClick={(e) => handleClick(e, filteredItem.uuid)}
                >
                  <MoreHorizOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: colors.primary[200],
                      cursor: 'pointer'
                    }}
                    aria-controls="menu-followers-card"
                    aria-haspopup="true"
                  />
                </IconButton>
                <Menu
                  id="menu-simple-card"
                  anchorEl={anchorEl[filteredItem.uuid]}
                  keepMounted
                  open={Boolean(anchorEl[filteredItem.uuid])}
                  onClose={() => handleClose(filteredItem.uuid)}
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
                  {menuActions.map(({ label, action, handler }) => (
                    <MenuItem
                      key={action}
                      onClick={() => handleMenuItemClick(handler, filteredItem)}
                      sx={{
                        border: `solid 0.5px ${colors.grey[100]}`,
                        color: colors.primary.main
                      }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

ChildCard.propTypes = {
  avatar: PropTypes.string,
  follow: PropTypes.number,
  location: PropTypes.string,
  name: PropTypes.string
};

export default ChildCard;
