import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports

import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons-react';
import MainCard from '../../../../../elements/MainCard';
import Transitions from '../../../../../elements/Transitions';
import { colors } from '../../../../../common/constants/styles';
import { useSelector } from 'react-redux';

// notification status options
const status = [
  {
    value: 'all',
    label: 'All Notification'
  },
  {
    value: 'new',
    label: 'New'
  },
  {
    value: 'unread',
    label: 'Unread'
  },
  {
    value: 'other',
    label: 'Other'
  }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const { currentTheme } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (event) => setValue(event?.target.value);

  return (
    <>
      <Box
        style={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          },
          width: '30px',
          height: '30px'
        }}
      >
        <Badge
          badgeContent={'0'}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          color={currentTheme === 'Dark' ? 'warning' : 'secondary'}
          style={{
            fontSize: '10px'
          }}
        >
          <Avatar
            variant="rounded"
            style={{
              cursor: 'pointer',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              fontSize: '1.2rem',
              transition: 'all .2s ease-in-out',
              background:
                currentTheme === 'Dark'
                  ? colors.darkBackground
                  : colors.secondary.light,
              color: colors.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background:
                  currentTheme === 'Dark'
                    ? colors.warning.dark
                    : colors.secondary.dark,
                color:
                  currentTheme === 'Dark'
                    ? colors.darkBackground
                    : colors.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {' '}
            <IconBell
              stroke={1.5}
              size="20px"
              color={
                currentTheme === 'Dark' && !isHovered
                  ? colors.warning.main
                  : isHovered && currentTheme === 'Dark'
                    ? colors.grey[900]
                    : isHovered && currentTheme === 'Light'
                      ? colors.white
                      : colors.secondary.main
              }
            />
          </Avatar>
        </Badge>
      </Box>

      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [matchesXs ? 5 : 0, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions
              position={matchesXs ? 'top' : 'top-right'}
              in={open}
              {...TransitionProps}
            >
              <Paper>
                {open && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                  >
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12}>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                          style={{ pt: 2, px: 2 }}
                        >
                          <Grid item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">
                                All Notification
                              </Typography>
                              <Chip
                                size="small"
                                label="01"
                                style={{
                                  color: colors.grey[900],
                                  bgcolor: colors.warning.dark
                                }}
                              />
                            </Stack>
                          </Grid>
                          <Grid item>
                            <Typography
                              component={Link}
                              to="#"
                              variant="subtitle2"
                              color="primary"
                            >
                              Mark as all read
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <PerfectScrollbar
                          style={{
                            height: '100%',
                            maxHeight: 'calc(100vh - 205px)',
                            overflowX: 'hidden'
                          }}
                        >
                          <Grid container direction="column" spacing={2}>
                            <Grid item xs={12}>
                              <Box style={{ px: 2, pt: 0.25 }}>
                                <TextField
                                  id="outlined-select-currency-native"
                                  select
                                  fullWidth
                                  value={value}
                                  onChange={handleChange}
                                  SelectProps={{
                                    native: true
                                  }}
                                >
                                  {status.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </TextField>
                              </Box>
                            </Grid>
                            <Grid item xs={12} p={0}>
                              <Divider style={{ my: 0 }} />
                            </Grid>
                          </Grid>
                          <NotificationList />
                        </PerfectScrollbar>
                      </Grid>
                    </Grid>
                    <Divider />
                    <CardActions style={{ p: 1.25, justifyContent: 'center' }}>
                      <Button size="small" disableElevation>
                        View All
                      </Button>
                    </CardActions>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
