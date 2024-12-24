// import PropTypes from 'prop-types';
// import React, { useEffect, useState } from 'react';

// // material-ui

// import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';

// // project imports

// // assets
// import { User } from 'lucide-react';
// import { FileText } from 'lucide-react';
// import { CreditCard } from 'lucide-react';
// import { UserCircle } from 'lucide-react';
// import { Key } from 'lucide-react';
// import { UserPlus } from 'lucide-react';
// import { List } from 'lucide-react';
// import { Users } from 'lucide-react';
// import { Tv } from 'lucide-react';
// import { Award } from 'lucide-react';
// import { Mail } from 'lucide-react';
// import { Settings } from 'lucide-react';
// import { colors } from '../../common/constants/styles';

// import { useSelector } from 'react-redux';
// import SubCard from '../../elements/SubCard';
// import SideIconCard from './SideIconCard';
// import { Accessibility } from 'lucide-react';
// import { FileText } from 'lucide-react';
// import { Users } from 'lucide-react';
// import DataTable from './DataTable';
// import { Facebook } from 'lucide-react';
// import { MailCheck } from 'lucide-react';
// import { Lock } from 'lucide-react';
// import { Compass } from 'lucide-react';
// import { Hourglass } from 'lucide-react';
// import { CheckCircle } from 'lucide-react';
// import { IconChevronRight } from '@tabler/icons-react';
// import Breadcrumbs from '../../elements/Breadcrump';
// import { replaceUnderscore } from '../../common/constants/helperFunction';
// import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
// import { CalendarEdit } from 'lucide-react';
// import ImportExportData from '../import-Export/ImportExportData';
// import { Shield } from 'lucide-react';
// // tab content
// function TabPanel({ children, value, index, ...other }) {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`vertical-tabpanel-${index}`}
//       aria-labelledby={`vertical-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box
//           sx={{
//             p: 0
//           }}
//         >
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired
// };

// function a11yProps(index) {
//   return {
//     id: `vertical-tab-${index}`,
//     'aria-controls': `vertical-tabpanel-${index}`
//   };
// }
// const userProfileData = [
//   {
//     icon: AccountCircleTwoTone,
//     title: 'User',
//     url: 'user/datatable',
//     bg: colors.primary.main,
//     description: 'Brief user overview.',
//     form_name: 'system_user',
//     tab: 0
//   },
//   {
//     icon: GroupAddOutlinedIcon,
//     title: 'Groups',
//     url: '/app/metadata/system_group',
//     bg: colors.secondary.main,
//     description: 'create groups.',
//     form_name: 'system_group',
//     tab: 0
//   },
//   {
//     icon: BadgeOutlinedIcon,
//     title: 'Roles',
//     url: '/app/metadata/system_role',
//     bg: colors.success.main,
//     description: 'Add user roles',
//     form_name: 'system_role',
//     tab: 0
//   },
//   {
//     icon: GroupsOutlinedIcon,
//     title: 'System gro...',
//     url: '/app/metadata/system_group_modules',
//     bg: colors.warning.main,
//     description: 'Add group modules',
//     form_name: 'system_group_modules',
//     tab: 0
//   }
// ];
// const userChannelData = [
//   {
//     icon: FacebookOutlinedIcon,
//     title: 'Facebook config',
//     url: 'user/datatable',
//     bg: colors.primary.main,
//     description: 'Manage fb config',
//     form_name: 'facebook_configuration',
//     tab: 1
//   },
//   // {
//   //   icon: MarkEmailReadOutlinedIcon,
//   //   title: 'Email',
//   //   url: '#',
//   //   bg: colors.secondary.main,
//   //   description: 'All emails here',
//   //   form_name: 'system_email',
//   //   tab: 1
//   // },
//   {
//     icon: MailLockOutlinedIcon,
//     title: 'Email settings',
//     url: '#',
//     bg: colors.success.main,
//     description: 'Manage email settings',
//     form_name: 'system_email_setting',
//     tab: 1
//   }
// ];
// const userOperationData = [
//   {
//     icon: ArticleIcon,
//     title: 'Template',
//     url: '/app/metadata/system_form_template',
//     bg: colors.warning.main,
//     description: 'create template',
//     form_name: 'system_form_template',
//     tab: 2
//   },
//   {
//     icon: HowToRegOutlinedIcon,
//     title: 'Approval',
//     url: '/app/metadata/system_group',
//     bg: colors.secondary.main,
//     description: 'Manage approvals',
//     form_name: 'approval',
//     tab: 2
//   },
//   {
//     icon: TravelExploreOutlinedIcon,
//     title: 'Open search co..',
//     url: '/app/metadata/system_role',
//     bg: colors.success.main,
//     description: 'Open search config',
//     form_name: 'open_search_config',
//     tab: 2
//   },
//   {
//     icon: HourglassBottomOutlinedIcon,
//     title: 'Business Shift..',
//     url: '/app/metadata/system_slots',
//     bg: colors.primary.main,
//     description: 'Business Shift mana...',
//     form_name: 'system_slots',
//     tab: 2
//   },
//   {
//     icon: EditCalendarIcon,
//     title: 'Business Holiday..',
//     url: '/app/metadata/system_holidays',
//     bg: colors.orange.main,
//     description: 'Business Holiday mana...',
//     form_name: 'system_holidays',
//     tab: 2
//   },
//   {
//     icon: EmailIcon,
//     title: 'System Inbound ..',
//     url: '/app/metadata/system_email_inbound_rules',
//     bg: colors.success.main,
//     description: 'System Email Inbound rules...',
//     form_name: 'system_email_inbound_rules',
//     tab: 2
//   },
//   {
//     icon: PolicyIcon,
//     title: 'SLA Policies',
//     url: '/app/metadata/system_sla_policies',
//     bg: colors.secondary.main,
//     description: 'System SLA policies...',
//     form_name: 'system_sla_policies',
//     tab: 2
//   },
// ];
// // ================================|| UI TABS - VERTICAL ||================================ //

// export default function VerticalTabs({ nav, setNav, value, setValue,valueRef,currentForm ,setCurrentForm}) {
//   const { currentTheme } = useSelector((state) => state.auth);
//   const { isOpen } = useSelector((state) => state.sidebar);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   useEffect(() => {
//     if (currentForm) {
//       setNav((prev) => [
//         ...prev,
//         {
//           title: replaceUnderscore(currentForm),
//           url: `#`,
//           icon: IconChevronRight
//         }
//       ]);
//     }
//   }, [currentForm]);

//   const formMapping = {
//     user: 'system_user',
//     groups: 'system_group',
//     roles: 'system_role',
//     'system gro...': 'system_group_modules',
//     'facebook config': 'facebook_configuration',
//     email: 'system_email',
//     'email settings': 'system_email_setting',
//     template: 'system_template_access',
//     approval: 'approval',
//     'open search co..': 'open_search_config'
//   };

//   const formNameKey = currentForm?.toLowerCase();
//   const formName = formMapping[formNameKey];
//   const navigate = useNavigate();

//   useEffect(() => {
//     setNav((prevNav) => [
//       prevNav[0],
//       {
//         ...prevNav[1],
//         title:
//           value === 0
//             ? 'User Profile'
//             : value === 1
//               ? 'Channels'
//               : value === 2
//                 ? 'Operations'
//                 : null
//       }
//     ]);
//     const currentUrl = new URL(window.location);

//     currentUrl.searchParams.set('tab', value);
//   }, [value]);

//   return (
//     <div>
//       <Grid container spacing={0}>
//         <Grid item xs={2} sm={2} md={1.75} mr="0px">
//           <Tabs
//             value={value}
//             onChange={handleChange}
//             onClick={() => {
//               setCurrentForm(null);
//               navigate('/admin');
//               setNav([
//                 { title: 'Admin', url: '#', icon: IconChevronRight },
//                 {
//                   title: nav[1].title,
//                   url: '/admin',
//                   icon: IconChevronRight
//                 }
//               ]);
//             }}
//             orientation="vertical"
//             variant="scrollable"
//             sx={{
//               boxShadow: 'none',
//               '& .MuiTabs-flexContainer': {
//                 borderBottom: 'none'
//               },
//               width: '200px',
//               '& button': {
//                 8: `${8}px`,
//                 color:
//                   currentTheme === 'dark' ? colors.grey[600] : colors.grey[900],
//                 minHeight: 'auto',
//                 minWidth: '100%',
//                 py: 1.5,
//                 px: 2,
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'flex-start',
//                 textAlign: 'left',
//                 justifyContent: 'flex-start'
//               },
//               '& button.Mui-selected': {
//                 color: colors.primary.main,
//                 background:
//                   currentTheme === 'dark'
//                     ? colors.dark.main
//                     : colors.primary.light,
//                 borderRadius: '8px'
//               },
//               '& button > svg': {
//                 marginBottom: '0px !important',
//                 marginRight: 1.25,
//                 marginTop: 1.25,
//                 height: 20,
//                 width: 20
//               },
//               '& button > div > span': {
//                 display: 'block'
//               },
//               '& > div > span': {
//                 display: 'none'
//               }
//             }}
//           >
//             <Tab
//               sx={{ boxShadow: 'none' }}
//               icon={<User />}
//               label={
//                 <Grid container direction="column">
//                   <Typography
//                     sx={{
//                       fontSize: '0.875rem',
//                       fontWeight: 500,

//                       textTransform: 'none'
//                     }}
//                     color="inherit"
//                   >
//                     User Profile
//                   </Typography>
//                   <Typography
//                     component="div"
//                     sx={{
//                       fontSize: '0.75rem',
//                       color: colors.grey[700],
//                       fontWeight: 400,
//                       textTransform: 'none'
//                     }}
//                   >
//                     Profile Settings
//                   </Typography>
//                 </Grid>
//               }
//               {...a11yProps(0)}
//             />
//             <Tab
//               icon={<Tv />}
//               label={
//                 <Grid container direction="column">
//                   <Typography
//                     sx={{
//                       fontSize: '0.875rem',
//                       fontWeight: 500,

//                       textTransform: 'none'
//                     }}
//                     color="inherit"
//                   >
//                     Channels
//                   </Typography>
//                   <Typography
//                     component="div"
//                     sx={{
//                       fontSize: '0.75rem',
//                       color: colors.grey[700],
//                       fontWeight: 400,
//                       textTransform: 'none'
//                     }}
//                   >
//                     social config
//                   </Typography>
//                 </Grid>
//               }
//               {...a11yProps(1)}
//             />
//             <Tab
//               icon={<Settings />}
//               label={
//                 <Grid container direction="column">
//                   <Typography
//                     sx={{
//                       fontSize: '0.875rem',
//                       fontWeight: 500,

//                       textTransform: 'none'
//                     }}
//                     color="inherit"
//                   >
//                     Operations
//                   </Typography>
//                   <Typography
//                     component="div"
//                     sx={{
//                       fontSize: '0.75rem',
//                       color: colors.grey[700],
//                       fontWeight: 400,
//                       textTransform: 'none'
//                     }}
//                   >
//                     update approval rules
//                   </Typography>
//                 </Grid>
//               }
//               {...a11yProps(2)}
//             />
//              <Tab
//               icon={<Settings />}
//               label={
//                 <Grid container direction="column">
//                   <Typography
//                     sx={{
//                       fontSize: '0.875rem',
//                       fontWeight: 500,

//                       textTransform: 'none'
//                     }}
//                     color="inherit"
//                   >
//                    Import/Export
//                   </Typography>
//                   <Typography
//                     component="div"
//                     sx={{
//                       fontSize: '0.75rem',
//                       color: colors.grey[700],
//                       fontWeight: 400,
//                       textTransform: 'none'
//                     }}
//                   >
//                    import/export Data/CSV
//                   </Typography>
//                 </Grid>
//               }
//               {...a11yProps(3)}
//             />
//           </Tabs>
//         </Grid>

//         <Grid item xs={12} sm={12} md={9.3}>
//           {currentForm ? (
//             <SubCard
//               sx={{
//                 // width: `calc(100vw - ${isOpen ? '610' : '440'}px)`,
//                 width: '110%',
//                 border: 'none',
//                 borderRadius: '8px',
//                 '& .MuiCardContent-root': {
//                   p: 0
//                 }
//               }}
//             >
//               <DataTable FormName={currentForm} />
//             </SubCard>
//           ) : (
//             <>
//               <TabPanel value={value} index={0}>
//                 <Grid container spacing={3} display="flex" flexWrap="wrap">
//                   {userProfileData.map((card, index) => (
//                     <Grid item width="293px" height="120px">
//                       <SideIconCard
//                         iconPrimary={card?.icon}
//                         primary={card?.title}
//                         secondary={card?.description}
//                         secondarySub={card?.count}
//                         url={card.url}
//                         color={card?.bg}
//                         setCurrentForm={setCurrentForm}
//                         formName={card?.form_name}
//                         tab={card?.tab}
//                       />
//                     </Grid>
//                   ))}
//                 </Grid>
//               </TabPanel>
//               <TabPanel value={value} index={1}>
//                 <Grid container spacing={3} display="flex" flexWrap="wrap">
//                   {userChannelData.map((card, index) => (
//                     <Grid item width="293px" height="120px">
//                       <SideIconCard
//                         iconPrimary={card?.icon}
//                         primary={card?.title}
//                         secondary={card?.description}
//                         secondarySub={card?.count}
//                         url={card.url}
//                         color={card?.bg}
//                         setCurrentForm={setCurrentForm}
//                         formName={card?.form_name}
//                         tab={card?.tab}
//                       />
//                     </Grid>
//                   ))}
//                 </Grid>
//               </TabPanel>
//               <TabPanel value={value} index={2}>
//                 <Grid container spacing={3} display="flex" flexWrap="wrap">
//                   {userOperationData.map((card, index) => (
//                     <Grid item width="293px" height="120px">
//                       <SideIconCard
//                         iconPrimary={card?.icon}
//                         primary={card?.title}
//                         secondary={card?.description}
//                         secondarySub={card?.count}
//                         url={card.url}
//                         color={card?.bg}
//                         setCurrentForm={setCurrentForm}
//                         formName={card?.form_name}
//                         tab={card?.tab}
//                       />
//                     </Grid>
//                   ))}
//                 </Grid>
//               </TabPanel>
//               <TabPanel value={value} index={3} >
//                 <Box sx={{ width: '110%' }}>
//                 <ImportExportData/>
//                 </Box>

//                 </TabPanel>
//             </>
//           )}
//         </Grid>
//       </Grid>
//     </div>
//   );
// }
