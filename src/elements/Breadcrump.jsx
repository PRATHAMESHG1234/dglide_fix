import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Card, Divider, Grid, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import { IconTallymark1 } from '@tabler/icons-react';
import { colors } from '../common/constants/styles';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';

const linkSX = {
  display: 'flex',
  color: colors.grey[900],
  textDecoration: 'none',
  alignContent: 'center',
  alignItems: 'center',
  fontSize: '0.875rem',
  fontWeight: 500
};

const Breadcrumbs = ({
  card,
  divider,
  icon,
  icons,
  maxItems,
  navigation,
  rightAlign,
  separator,
  title,
  titleBottom,
  ...others
}) => {
  const theme = useTheme();

  const iconStyle = {
    marginRight: theme.spacing(0.75),
    marginTop: `-${theme.spacing(0.25)}`,
    width: '16px',
    height: '16px',
    color: colors.secondary.main
  };

  // item separator
  const SeparatorIcon = separator;
  const separatorIcon = separator ? (
    <SeparatorIcon stroke={1.5} size="16px" />
  ) : (
    <IconTallymark1 stroke={1.5} size="16px" />
  );

  const breadcrumbItems = navigation.map((navItem, index) => {
    const ItemIcon = navItem.icon ? navItem.icon : AccountTreeTwoToneIcon;

    return (
      <Typography
        key={index}
        component={Link}
        to={navItem.url || '#'}
        color={index === navigation.length - 1 ? colors.grey[900] : 'inherit'}
        sx={linkSX}
      >
        {icons && <ItemIcon style={iconStyle} />}
        {navItem.title}
      </Typography>
    );
  });
  let path = window.location.pathname.slice(1);
  let capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);
  return (
    <Card
      sx={{
        marginBottom: card === false ? 0 : theme.spacing(3),
        background:
          card === false ? 'transparent' : theme.palette.background.default,
        boxShadow: 'none'
      }}
      {...others}
    >
      <Box sx={{ p: 2, pl: card === false ? 0 : 2, mt: '20px' }}>
        <Grid
          container
          direction={rightAlign ? 'row' : 'column'}
          justifyContent={rightAlign ? 'space-between' : 'flex-start'}
          alignItems={rightAlign ? 'center' : 'flex-start'}
          spacing={1}
        >
          {title && !titleBottom && (
            <Grid item>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  color: colors.grey[900],
                  fontWeight: 600
                }}
              >
                {capitalizedPath}
              </Typography>
            </Grid>
          )}
          <Grid item mr="20px">
            <MuiBreadcrumbs
              sx={{
                '& .MuiBreadcrumbs-separator': {
                  width: 16,
                  ml: 1.25,
                  mr: 1.25
                }
              }}
              aria-label="breadcrumb"
              maxItems={maxItems || 8}
              separator={separatorIcon}
            >
              <Typography component={Link} to="#" color="inherit" sx={linkSX}>
                {icons && <HomeTwoToneIcon sx={iconStyle} />}
                {icon && <HomeIcon sx={{ ...iconStyle, mr: 0 }} />}
                {!icon && 'Dashboard'}
              </Typography>
              {breadcrumbItems}
            </MuiBreadcrumbs>
          </Grid>
          {title && titleBottom && (
            <Grid item>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  color: colors.grey[600],
                  fontWeight: 600
                }}
              >
                {navigation[navigation.length - 1]?.title}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
      {card === false && divider !== false && (
        <Divider sx={{ borderColor: colors.primary.main, mb: 3 }} />
      )}
    </Card>
  );
};

Breadcrumbs.propTypes = {
  card: PropTypes.bool,
  divider: PropTypes.bool,
  icon: PropTypes.bool,
  icons: PropTypes.bool,
  maxItems: PropTypes.number,
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string,
      icon: PropTypes.elementType
    })
  ).isRequired,
  rightAlign: PropTypes.bool,
  separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  title: PropTypes.bool,
  titleBottom: PropTypes.bool
};

export default Breadcrumbs;
