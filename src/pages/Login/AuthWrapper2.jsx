// material-ui
import { styled } from '@mui/material/styles';
import { colors } from '../../common/constants/styles';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper2 = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : theme.palette.background.paper,
  minHeight: '100vh',
  [theme.breakpoints.down('lg')]: {
    backgroundColor: colors.grey[100]
  }
}));

export default AuthWrapper2;
