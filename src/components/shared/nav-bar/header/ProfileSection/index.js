/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.899Z
 */

// import { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// material-ui
// import { useTheme } from '@mui/material/styles';
// import {
  // Avatar,
  // Box,
  // Card,
  // CardContent,
  // Chip,
  // ClickAwayListener,
  // Divider,
  // Grid,
  // InputAdornment,
  // Link,
  // List,
  // ListItemButton,
  // ListItemIcon,
  // ListItemText,
  // OutlinedInput,
  // Paper,
  // Popper,
  // Stack,
  // Switch,
  // Typography,
  // Button
// } from '@mui/material';
// import Dialog from '../../../Dialog';
// third-party
// import { FormattedMessage } from 'react-intl';
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import { FormattedMessage } from 'react-intl';
// project imports

// import useAuth from 'hooks/useAuth';
// import User1 from '../../../../../assets/users/user-round.svg';

// assets
// import {
  // IconLogout,
  // IconSearch,
  // IconSettings,
  // IconUser
// } from '@tabler/icons-react';

// import MainCard from '../../../../../elements/MainCard';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../../../../../redux/slices/authSlice';
// import { colors } from '../../../../../common/constants/styles';
// import Transitions from '../../../../../elements/Transitions';
// import { color } from 'framer-motion';
// import { fetchRecordbyFormName } from '../../../../../redux/slices/tableSlice';
// import {
  // fetchRecordbyFormName,
  // fetchRecordById
// } from '../../../../../services/table';
// import { ApprovalDetail } from './ApprovalDetail';
// import { CheckCircle } from 'lucide-react';
// import { XCircle } from 'lucide-react';
// import { updateFormData } from '../../../../../redux/slices/formSlice';
// import { FaLink } from 'react-icons/fa';
// import { MdWeb } from 'react-icons/md';
// ==============================|| PROFILE MENU ||============================== //

// const ProfileSection = () => {
  // const theme = useTheme();

  // const navigate = useNavigate();

  // const [sdm, setSdm] = useState(true);
  // const [value, setValue] = useState('');
  // const [notification, setNotification] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState(-1);
  // const [approvalData, setApprovalData] = useState([]);
  // const [selectedIdData, setSelectedIdData] = useState('');
  //   const { logout, user } = useAuth();
  // const [open, setOpen] = useState(false);
  // const [requestData, setRequestData] = useState([]);
  // const [requestDetail, setRequestDetail] = useState({});
  // const [openDetailPanel, setOpenDetailPanel] = useState(false);
  // const { currentUser, currentTheme } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();
  // const anchorRef = useRef(null);
  // const handleLogout = () => {
    // try {
      // dispatch(logout());
    // } catch (err) {
      // console.error(err);
    // }
  // };
  // const fetchData = async () => {
    // const payload = {
      // sort: null,
      // where: [
        // {
          // fieldName: 'approver',
          // operator: '=',
          // value: currentUser?.userUUID
        // },
        // {
          // fieldName: 'state',
          // operator: '!=',
          // value: '2'
        // }
      // ]
    // };
    // const result = await fetchRecordbyFormName('approval', payload);
    // setApprovalData(result?.result);
  // };
  // useEffect(() => {
    // if (currentUser) {
      // fetchData();
    // }
  // }, [currentUser]);

  // const handleClose = (event) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
      // return;
    // }
    // setOpen(false);
  // };
  // const handleListItemClick = (event, index, route = '') => {
    // setSelectedIndex(index);
    // handleClose(event);

    // if (route && route !== '') {
      // navigate(route);
    // }
  // };
  // const handleToggle = () => {
    // setOpen((prevOpen) => !prevOpen);
  // };

  // const prevOpen = useRef(open);
  // useEffect(() => {
    // if (prevOpen.current === true && open === false) {
      // anchorRef.current.focus();
    // }

    // prevOpen.current = open;
  // }, [open]);

  // function greetBasedOnTime() {
    // const now = new Date();
    // const hours = now.getHours();

    // if (hours >= 0 && hours < 12) {
      // return 'Good Morning,';
    // } else if (hours >= 12 && hours < 17) {
      // return 'Good Afternoon,';
    // } else {
      // return 'Good Evening,';
    // }
  // }
  // const getMoreDetail = async (payload) => {
    // setSelectedIdData(payload);
    // setOpenDetailPanel(true);
    // const response = await fetchRecordById('requests', payload?.request_id);
    // if (response) {
      // setRequestData(JSON.parse(response?.details));
    // }
  // };

  // const handleApprove = async (approval) => {
    // const newObj = {
      // uuid: approval?.uuid,
      // state: '2'
    // };
    // const response = await dispatch(
      // updateFormData({ formname: 'approval', data: newObj })
    // );
    // if (response?.payload.statusCode === 200) {
      // fetchData();
    // }
  // };

  // const handleReject = (approval) => {
    // const newObj = {
      // uuid: approval?.uuid,
      // state: '3'
    // };
    // dispatch(updateFormData({ formname: 'approval', data: newObj }));
  // };
  // return (
    // <>
      // <Chip
        // sx={{
          // height: '48px',
          // alignItems: 'center',
          // borderRadius: '27px',
          // transition: 'all .2s ease-in-out',
          // borderColor:
            // currentTheme === 'Dark'
              // ? colors.darkBackground
              // : colors.primary.light,
          // backgroundColor:
            // currentTheme === 'Dark'
              // ? colors.darkBackground
              // : colors.primary.light,
          // '&[aria-controls="menu-list-grow"], &:hover': {
            // borderColor:
              // currentTheme === 'Dark'
                // ? colors.darkBackground
                // : colors.primary.main,
            // background: `${colors.primary.main}!important`,
            // color: colors.primary.light,
            // '& svg': {
              // stroke: colors.primary.light
            // }
          // },
          // '& .MuiChip-label': {
            // lineHeight: 0
          // }
        // }}
        // icon={
          // <Avatar
            // src={User1}
            // sx={{
              // width: '34px',
              // height: '34px',
              // fontSize: '1.2rem',
              // margin: '8px 0 8px 8px !important',
              // cursor: 'pointer'
            // }}
            // ref={anchorRef}
            // aria-controls={open ? 'menu-list-grow' : undefined}
            // aria-haspopup="true"
            // color="inherit"
          // />
        // }
        // label={
          // <IconSettings stroke={1.5} size="24px" color={colors.primary.main} />
        // }
        // variant="outlined"
        // ref={anchorRef}
        // aria-controls={open ? 'menu-list-grow' : undefined}
        // aria-haspopup="true"
        // onClick={handleToggle}
        // color="primary"
      // />

      // <Popper
        // placement="bottom"
        // open={open}
        // anchorEl={anchorRef.current}
        // role={undefined}
        // transition
        // disablePortal
        // modifiers={[
          // {
            // name: 'offset',
            // options: {
              // offset: [0, 14]
            // }
          // }
        // ]}
      // >
        // {({ TransitionProps }) => (
          // <ClickAwayListener onClickAway={handleClose}>
            // <Transitions in={open} {...TransitionProps}>
              // <Paper>
                // {open && (
                  // <MainCard
                    // border={false}
                    // elevation={16}
                    // content={false}
                    // boxShadow
                    // shadow={theme.shadows[16]}
                    // sx={{
                      // maxHeight: '250px',
                      // backgroundColor:
                        // currentTheme === 'Dark'
                          // ? colors.darkLevel2
                          // : colors.white
                    // }}
                  // >
                    // <Box sx={{ p: 2, pb: 0, zIndex: 3000 }}>
                      // <Stack>
                        // <Stack
                          // direction="row"
                          // spacing={0.5}
                          // alignItems="center"
                        // >
                          // <Typography
                            // sx={{
                              // fontSize: '1rem',
                              // color:
                                // currentTheme === 'Dark'
                                  // ? colors.white
                                  // : colors.grey[900],
                              // fontWeight: 600
                            // }}
                          // >
                            // {greetBasedOnTime()}
                          // </Typography>
                          // <Typography
                            // component="span"
                            // sx={{
                              // fontSize: '1rem',
                              // color:
                                // currentTheme === 'Dark'
                                  // ? colors.white
                                  // : colors.grey[700],
                              // fontWeight: 400
                            // }}
                          // >
                            // {(currentUser?.username?.split('@')[0] || '')
                              // .charAt(0)
                              // .toUpperCase() +
                              // (
                                // currentUser?.username?.split('@')[0] || ''
                              // ).slice(1)}
                          // </Typography>
                        // </Stack>
                        // {currentUser?.roles?.some(
                          // (role) => role.level === '1'
                        // ) && (
                          // <Typography
                            // sx={{
                              // fontSize: '0.75rem',
                              // fontWeight: 400,
                              // color:
                                // currentTheme === 'Dark'
                                  // ? colors.grey[500]
                                  // : colors.primary.main
                            // }}
                          // >
                            // Project Admin
                          // </Typography>
                        // )}
                      // </Stack>
                      // {/* <OutlinedInput
                        // sx={{
                          // width: '100%',
                          // pr: 1,
                          // pl: 2,
                          // my: 2,
                          // color:
                            // currentTheme === 'Dark'
                              // ? colors.white
                              // : colors.grey[500]
                        // }}
                        // id="input-search-profile"
                        // value={value}
                        // onChange={(e) => setValue(e.target.value)}
                        // placeholder="Search profile options"
                        // startAdornment={
                          // <InputAdornment position="start">
                            // <IconSearch
                              // stroke={1.5}
                              // size="16px"
                              // color={colors.grey[500]}
                            // />
                          // </InputAdornment>
                        // }
                        // aria-describedby="search-helper-text"
                        // inputProps={{
                          // 'aria-label': 'weight'
                        // }}
                      // /> */}
                      // <Divider />
                    // </Box>
                    // <PerfectScrollbar
                      // style={{
                        // height: '100%',
                        // maxHeight: 'calc(100vh - 250px)',
                        // overflowX: 'hidden'
                      // }}
                    // >
                      // <Box sx={{ p: 2, pt: 1 }}>
                        // {/* <UpgradePlanCard /> */}
                        // <Divider />
                        // {/* <Card
                          // sx={{
                            // bgcolor:
                              // currentTheme === 'Dark'
                                // ? colors.darkBackground
                                // : colors.primary.light,
                            // my: 2
                          // }}
                        // >
                          // <CardContent>
                            // <Grid container spacing={3} direction="column">
                              // <Grid item>
                                // <Grid
                                  // item
                                  // container
                                  // alignItems="center"
                                  // justifyContent="space-between"
                                // >
                                  // <Grid item>
                                    // <Typography
                                      // sx={{
                                        // fontSize: '0.875rem',
                                        // fontWeight: 500,
                                        // color:
                                          // currentTheme === 'Dark'
                                            // ? colors.white
                                            // : colors.grey[900]
                                      // }}
                                    // >
                                      // Start DND Mode
                                    // </Typography>
                                  // </Grid>
                                  // <Grid item>
                                    // <Switch
                                      // color="primary"
                                      // checked={sdm}
                                      // onChange={(e) => setSdm(e.target.checked)}
                                      // name="sdm"
                                      // size="small"
                                    // />
                                  // </Grid>
                                // </Grid>
                              // </Grid>
                              // <Grid item>
                                // <Grid
                                  // item
                                  // container
                                  // alignItems="center"
                                  // justifyContent="space-between"
                                // >
                                  // <Grid item>
                                    // <Typography
                                      // sx={{
                                        // fontSize: '0.875rem',
                                        // fontWeight: 500,
                                        // color:
                                          // currentTheme === 'Dark'
                                            // ? colors.white
                                            // : colors.grey[900]
                                      // }}
                                    // >
                                      // Allow Notifications
                                    // </Typography>
                                  // </Grid>
                                  // <Grid item>
                                    // <Switch
                                      // checked={notification}
                                      // onChange={(e) =>
                                        // setNotification(e.target.checked)
                                      // }
                                      // name="sdm"
                                      // size="small"
                                    // />
                                  // </Grid>
                                // </Grid>
                              // </Grid>
                            // </Grid>
                          // </CardContent>
                        // </Card> */}
                        // {approvalData &&
                          // approvalData.map((approval) => (
                            // <Card
                              // sx={{
                                // bgcolor:
                                  // currentTheme === 'Dark'
                                    // ? colors.darkBackground
                                    // : 'rgb(238, 242, 246)',
                                // my: 2
                              // }}
                            // >
                              // <CardContent>
                                // <Grid container spacing={3} direction="column">
                                  // <Grid item>
                                    // <Grid
                                      // item
                                      // container
                                      // alignItems="center"
                                      // justifyContent="space-between"
                                    // >
                                      // <Grid item>
                                        // <div className="flex flex-row">
                                          // <Typography
                                            // sx={{
                                              // fontSize: '0.875rem',
                                              // fontWeight: 500,
                                              // color:
                                                // currentTheme === 'Dark'
                                                  // ? colors.white
                                                  // : colors.grey[900]
                                            // }}
                                          // >
                                            // Approval Id
                                          // </Typography>
                                          // <Typography
                                            // sx={{
                                              // marginLeft: '20px',
                                              // fontSize: '0.875rem',
                                              // color:
                                                // currentTheme === 'Dark'
                                                  // ? colors.white
                                                  // : colors.grey[900]
                                            // }}
                                          // >
                                            // {approval?.approval_id}
                                          // </Typography>
                                        // </div>
                                        // <div className="flex flex-row">
                                          // <Typography
                                            // sx={{
                                              // fontSize: '0.875rem',
                                              // fontWeight: 500,
                                              // color:
                                                // currentTheme === 'Dark'
                                                  // ? colors.white
                                                  // : colors.grey[900]
                                            // }}
                                          // >
                                            // Request Id
                                          // </Typography>
                                          // <Typography
                                            // sx={{
                                              // fontSize: '0.875rem',
                                              // marginLeft: '20px',
                                              // color:
                                                // currentTheme === 'Dark'
                                                  // ? colors.white
                                                  // : colors.grey[900]
                                            // }}
                                          // >
                                            // {approval?.request_id}
                                          // </Typography>
                                        // </div>
                                        // <div className="flex flex-row">
                                          // <Typography
                                            // sx={{
                                              // fontSize: '0.875rem',
                                              // fontWeight: 500,
                                              // color:
                                                // currentTheme === 'Dark'
                                                  // ? colors.white
                                                  // : colors.grey[900]
                                            // }}
                                          // >
                                            // Requester
                                          // </Typography>
                                          // <Typography
                                            // sx={{
                                              // fontSize: '0.875rem',
                                              // marginLeft: '20px',
                                              // color:
                                                // currentTheme === 'Dark'
                                                  // ? colors.white
                                                  // : colors.grey[900]
                                            // }}
                                          // >
                                            // {approval?.requester_display}
                                          // </Typography>
                                        // </div>
                                      // </Grid>
                                    // </Grid>
                                  // </Grid>
                                  // <div className="flex justify-center">
                                    // <Typography
                                      // sx={{
                                        // fontSize: '0.875rem',
                                        // fontWeight: 400,
                                        // color:
                                          // currentTheme === 'Dark'
                                            // ? colors.white
                                            // : colors.grey[900]
                                      // }}
                                      // onClick={() => getMoreDetail(approval)}
                                    // >
                                      // <Link>More Detail</Link>
                                    // </Typography>
                                  // </div>

                                  // <div className="mt-2 flex justify-around">
                                    // <Button
                                      // onClick={() => handleReject(approval)}
                                      // variant="outlined"
                                      // color="error"
                                    // >
                                      // {' '}
                                      // <XCircle sx={{
                                          // color: colors.error.main,
                                          // width: 16,
                                          // height: 16,
                                          // marginRight: 0.5
                                        // }}
                                      // />
                                      // Reject
                                    // </Button>
                                    // <Button
                                      // variant="outlined"
                                      // color="success"
                                      // onClick={() => handleApprove(approval)}
                                    // >
                                      // <CheckCircle sx={{
                                          // color: colors.success.main,
                                          // width: 16,
                                          // height: 16,
                                          // marginRight: 0.5
                                        // }}
                                      // />
                                      // Approve
                                    // </Button>
                                  // </div>
                                // </Grid>
                              // </CardContent>
                            // </Card>
                          // ))}
                        // <Divider />

                        // <List
                          // component="nav"
                          // sx={{
                            // width: '100%',
                            // maxWidth: 350,
                            // minWidth: 300,
                            // backgroundColor:
                              // currentTheme === 'Dark'
                                // ? colors.darkBackground
                                // : colors.white,
                            // borderRadius: '10px',
                            // [theme.breakpoints.down('md')]: {
                              // minWidth: '100%'
                            // },
                            // '& .MuiListItemButton-root': {
                              // mt: 0.5
                            // }
                          // }}
                        // >
                          // <ListItemButton
                            // sx={{
                              // borderRadius: `${8}px`,
                              // '&:hover': {
                                // backgroundColor:
                                  // currentTheme === 'Dark'
                                    // ? colors.darkTab
                                    // : colors.secondary.light,
                                // color:
                                  // currentTheme === 'Dark'
                                    // ? colors.white
                                    // : colors.secondary.dark
                              // }
                            // }}
                            // selected={selectedIndex === 0}
                            // onClick={(event) =>
                              // handleListItemClick(event, 0, '/account-settings')
                            // }
                          // >
                            // <ListItemIcon>
                              // <IconSettings
                                // stroke={1.5}
                                // size="20px"
                                // style={{
                                  // color:
                                    // currentTheme === 'Dark'
                                      // ? colors.secondary.main
                                      // : colors.grey[900]
                                // }}
                              // />
                            // </ListItemIcon>
                            // <ListItemText
                              // primary={
                                // <Typography
                                  // sx={{
                                    // letterSpacing: '0em',
                                    // fontWeight: 400,
                                    // lineHeight: '1.5em',
                                    // color:
                                      // currentTheme === 'Dark'
                                        // ? colors.white
                                        // : colors.grey[900],
                                    // fontSize: '16px'
                                  // }}
                                // >
                                  // Account settings
                                // </Typography>
                              // }
                            // />
                          // </ListItemButton>{' '}
                          // <ListItemButton
                            // sx={{
                              // borderRadius: `${8}px`,
                              // '&:hover': {
                                // backgroundColor:
                                  // currentTheme === 'Dark'
                                    // ? colors.darkTab
                                    // : colors.secondary.light,
                                // color:
                                  // currentTheme === 'Dark'
                                    // ? colors.white
                                    // : colors.secondary.dark
                              // }
                            // }}
                            // selected={selectedIndex === 0}
                            // onClick={(event) =>
                              // handleListItemClick(event, 0, '/website')
                            // }
                          // >
                            // <ListItemIcon>
                              // <MdWeb
                                // size={20}
                                // style={{
                                  // color:
                                    // currentTheme === 'Dark'
                                      // ? colors.secondary.main
                                      // : colors.grey[900]
                                // }}
                              // />
                            // </ListItemIcon>
                            // <ListItemText
                              // primary={
                                // <Typography
                                  // sx={{
                                    // letterSpacing: '0em',
                                    // fontWeight: 400,
                                    // lineHeight: '1.5em',
                                    // color:
                                      // currentTheme === 'Dark'
                                        // ? colors.white
                                        // : colors.grey[900],
                                    // fontSize: '16px'
                                  // }}
                                // >
                                  // Website
                                // </Typography>
                              // }
                            // />
                          // </ListItemButton>
                          // {/* <ListItemButton
                            // sx={{
                              // borderRadius: `${8}px`,
                              // '&:hover': {
                                // backgroundColor:
                                  // currentTheme === 'Dark'
                                    // ? colors.darkTab
                                    // : colors.secondary.light,
                                // color:
                                  // currentTheme === 'Dark'
                                    // ? colors.white
                                    // : colors.secondary.dark
                              // }
                            // }}
                            // selected={selectedIndex === 1}
                            // onClick={(event) =>
                              // handleListItemClick(event, 1, '#')
                            // }
                          // >
                            // <ListItemIcon>
                              // <IconUser
                                // stroke={1.5}
                                // size="20px"
                                // style={{
                                  // color:
                                    // currentTheme === 'Dark'
                                      // ? colors.secondary.main
                                      // : colors.grey[900]
                                // }}
                              // />
                            // </ListItemIcon>
                            // <ListItemText
                              // primary={
                                // <Grid
                                  // container
                                  // spacing={1}
                                  // justifyContent="space-between"
                                // >
                                  // <Grid item>
                                    // <Typography
                                      // sx={{
                                        // letterSpacing: '0em',
                                        // fontWeight: 400,
                                        // lineHeight: '1.5em',
                                        // color:
                                          // currentTheme === 'Dark'
                                            // ? colors.white
                                            // : colors.grey[900],
                                        // fontSize: '16px'
                                      // }}
                                    // >
                                      // social profile
                                    // </Typography>
                                  // </Grid>
                                  // <Grid item>
                                    // <Chip
                                      // label="02"
                                      // size="small"
                                      // sx={{
                                        // bgcolor: colors.warning.dark,
                                        // color: colors.grey[900]
                                      // }}
                                    // />
                                  // </Grid>
                                // </Grid>
                              // }
                            // />
                          // </ListItemButton> */}
                          // <ListItemButton
                            // sx={{
                              // borderRadius: `${8}px`,
                              // backgroundColor:
                                // currentTheme === 'Dark'
                                  // ? colors.darkTab
                                  // : colors.secondary.light,
                              // '&:hover': {
                                // backgroundColor:
                                  // currentTheme === 'Dark'
                                    // ? colors.darkTab
                                    // : colors.secondary.light,
                                // color:
                                  // currentTheme === 'Dark'
                                    // ? colors.white
                                    // : colors.secondary.dark
                              // }
                            // }}
                            // selected={selectedIndex === 4}
                            // onClick={handleLogout}
                          // >
                            // <ListItemIcon>
                              // <IconLogout
                                // stroke={1.5}
                                // size="20px"
                                // sx={{
                                  // color:
                                    // currentTheme === 'Dark'
                                      // ? colors.secondary.main
                                      // : colors.secondary.main,
                                  // backgroundColor: colors.secondary.main
                                // }}
                              // />
                            // </ListItemIcon>
                            // <ListItemText
                              // primary={
                                // <Typography
                                  // sx={{
                                    // letterSpacing: '0em',
                                    // fontWeight: 400,
                                    // lineHeight: '1.5em',
                                    // color:
                                      // currentTheme === 'Dark'
                                        // ? colors.white
                                        // : colors.secondary.dark,
                                    // fontSize: '16px'
                                  // }}
                                // >
                                  // logout
                                // </Typography>
                              // }
                            // />
                          // </ListItemButton>
                        // </List>
                      // </Box>
                    // </PerfectScrollbar>
                  // </MainCard>
                // )}
              // </Paper>
            // </Transitions>
          // </ClickAwayListener>
        // )}
      // </Popper>
      // {
        // <ApprovalDetail
          // openDetailPanel={openDetailPanel}
          // setOpenDetailPanel={setOpenDetailPanel}
          // requestData={requestData}
          // selectedIdData={selectedIdData}
          // handleReject={handleReject}
          // handleApprove={handleApprove}
        // />
      // }
    // </>
  // );
// };

// export default ProfileSection;
