import { Link } from 'react-router-dom';

import { Grid, Stack, Typography } from '@mui/material';

import Logo from '../../assets/auth/logo.svg';

import AuthResetPassword from './AuthResetPassword';
import AuthCardWrapper from '../Login/AuthCardWrapper';
import { colors } from '../../common/constants/styles';
import AuthFooter from '../Login/AuthFooter';

// ============================|| AUTH - RESET PASSWORD ||============================ //

const ResetPassword = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={12}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: 'calc(100vh - 68px)' }}
        >
          <Grid item style={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
            <AuthCardWrapper>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid
                  item
                  style={{
                    mb: 3,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    columnGap: '10px'
                  }}
                >
                  <img src={Logo} height={26} alt="logo" />
                  <Typography
                    style={{
                      fontFamily: 'Playwrite PE , cursive',
                      fontSize: '16px',
                      color: colors.secondary.main,
                      textDecoration: 'none',
                      fontWeight: '600',
                      background: `linear-gradient(to right,${colors.primary.main} , ${colors.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      lineHeight: 2.5
                    }}
                  >
                    Dglide
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    direction={'row'}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                      >
                        <Typography
                          color={colors.secondary.main}
                          gutterBottom
                          style={{
                            fontSize: '1.5rem',
                            color: colors.secondary.main,
                            fontWeight: 700
                          }}
                        >
                          Reset Password
                        </Typography>
                        <Typography
                          style={{
                            color: colors.grey[600],
                            fontWeight: 400
                          }}
                          fontSize="16px"
                          textAlign={'inherit'}
                        >
                          Please choose your new password
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <AuthResetPassword />
                </Grid>
              </Grid>
            </AuthCardWrapper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
