import PropTypes from 'prop-types';

// material-ui
import { Grid, Typography } from '@mui/material';

// third-party
import Slider from 'react-slick';
import { colors } from '../../common/constants/styles';

const AuthSlider = ({ items }) => {
  const settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      {items.map((item, i) => (
        <Grid
          key={i}
          container
          direction="column"
          alignItems="center"
          spacing={3}
          textAlign="center"
        >
          <Grid item>
            <Typography
              sx={{
                fontSize: '2.125rem',
                color: colors.grey[900],
                fontWeight: 700
              }}
            >
              {item.title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 400,
                color: colors.grey[900]
              }}
            >
              {item.description}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Slider>
  );
};

AuthSlider.propTypes = {
  items: PropTypes.array.isRequired
};

export default AuthSlider;
