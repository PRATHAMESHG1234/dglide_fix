// import React, { useEffect, useRef, useState } from 'react';
// import SearchIcon from '@mui/icons-material/Search';
// import './admin-home.css';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VerticalTabs from './VerticallPanel';
// import { Grid } from '@mui/material';
// import SubCard from '../../elements/SubCard';
// import Breadcrumbs from '../../elements/Breadcrump';
// import { IconChevronRight } from '@tabler/icons-react';
// import User from '../security/user/User';

// const Home = () => {
//   const navigate = useNavigate();
//   function useQuery() {
//     return new URLSearchParams(useLocation().search);
//   }
//   const query = useQuery();
//   const formFromParams = query.get('form');
//   const tabFromParams = query.get('tab');
//   const [currentForm, setCurrentForm] = useState(null);
//   const valueRef = useRef(0)
//   const [value, setValue] = React.useState(valueRef.current);
//   const [nav, setNav] = useState([
//     { title: 'Admin', url: '#', icon: IconChevronRight },
//     {
//       title: '',
//       url: '/admin',
//       icon: IconChevronRight
//     }
//   ]);

//   useEffect(() => {
//     if (formFromParams) {
//       setCurrentForm(formFromParams);
//     }
//   }, [formFromParams]);
//   useEffect(() => {
//     if (tabFromParams) {
//       const parsedTab = parseInt(tabFromParams, 10); // Ensure it's a number
//       setValue(parsedTab);
//       valueRef.current = parsedTab;
//     }
//   }, [tabFromParams]);

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
//                  : value === 3
//                 ? 'Import/Export'
//                 : null
//       }
//     ]);
//   }, [value]);

//   return (
//     <>
//       <Grid container spacing={3} >
//         <Grid item xs={12}>
//           <SubCard
//             title={
//               <Breadcrumbs
//                 separator={IconChevronRight}
//                 navigation={
//                   nav
//                   // { title: 'Dashboard', url: '/dashboard' },
//                   // { title: 'Analyticsss', url: '/dashboard/analytics' }
//                 }
//                 icon
//                 title
//                 rightAlign
//               />
//             }
//             sx={{
//               minHeight: 'calc(100vh - 90px)',
//               borderRadius: '8px',
//               '& .MuiCardHeader-root': {
//                 p: '5px',
//                 height: '60px',
//               },
//               py: 2
//               // '& .MuiGrid-root ': { pt: '20px' }
//             }}
//           >
//             <VerticalTabs
//               value={value}
//               currentForm={currentForm}
//               valueRef={valueRef}
//               setValue={setValue}
//               nav={nav}
//               setNav={setNav}
//               setCurrentForm={setCurrentForm}
//             />
//           </SubCard>
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default Home;
