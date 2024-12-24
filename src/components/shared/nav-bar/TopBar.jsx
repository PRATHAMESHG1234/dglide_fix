/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import Logo from '../../../assets/auth/logo.svg';
import { colors } from '../../../common/constants/styles';
import Avatar from '../../../elements/Avatars';
import PrimaryForms from './PrimaryForms';
import NotificationSection from './header/Notifications';
import ProfileSection from './header/ProfileSection';
import SeachSection from './header/SearchSection';
import './nav-bar.css';
import ThemeSection from './header/Theme';
import { NavUser } from '@/pages/sidebar/nav-user';
import { useSidebar } from '@/componentss/ui/sidebar';
const drawerWidth = 240;

const color = [colors.primary.main];

function assignColorById(id) {
  const colorIndex = id % color.length;
  const assignedColor = color[colorIndex];
  return assignedColor;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: 10,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const NavBar = ({ goToRecordPanel }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const { isMobile } = useSidebar();

  function getFirstNameFromEmail(email) {
    const username = email?.split('@')[0];
    const firstName = username?.split('.')[0];
    return (
      firstName?.charAt(0).toUpperCase() + firstName?.slice(1).toLowerCase()
    );
  }

  const user = {
    name: getFirstNameFromEmail(currentUser?.username),
    email: currentUser?.email,
    avatar: 'https://ui.shadcn.com/avatars/shadcn.jpg'
  };

  return (
    <AppBar position="fixed" className="bg-accent" elevation={0}>
      <div className="topbar-toolbar flex items-center justify-between bg-secondary p-0">
        <div className="flex w-full items-center justify-end space-x-3 pr-3">
          {!isMobile && <SeachSection />}

          {/* <ThemeSection /> */}
          {!isMobile && (
            <div>
              <NavUser user={user} />
            </div>
          )}
        </div>
      </div>
    </AppBar>
  );
};

export default NavBar;
