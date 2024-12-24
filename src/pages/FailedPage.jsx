import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../common/constants/styles';
import { useSelector } from 'react-redux';

const FailedPage = () => {
  const navigate = useNavigate();
  const { currentForm, currentModule } = useSelector((state) => state.current);
  const handleGoBack = () => {
    navigate(`/app/${currentModule.name}/${currentForm.name}`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      p={3}
    >
      <Typography variant="h4" sx={{ color: colors.error.main }} gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        The {currentForm?.name} ID you provided is invalid or missing.
      </Typography>
      <Button
        variant="contained"
        onClick={handleGoBack}
        sx={{
          mt: 2,
          bgcolor: colors.primary.main,
          textTransform: 'none',
          '&:hover': {
            bgcolor: colors.primary.main
          }
        }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default FailedPage;
