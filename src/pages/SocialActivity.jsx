import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {
  CardContent,
  CircularProgress,
  Grid,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'react-quill/dist/quill.snow.css';

import { colors } from '../common/constants/styles';
import MainCard from '../elements/MainCard';
import { fetchFieldsWithValuesForReference } from '../services/field';

// ==============================|| MAIL DETAILS ||============================== //

const SocialActivity = ({ socialData, formId }) => {
  const theme = useTheme();

  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formId) {
      setLoading(true);
      fetchFieldsWithValuesForReference(formId)
        .then((data) => {
          setFields(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching form fields:', error);
        });
    }
  }, [formId]);

  const filteredFields = fields?.filter(
    (field) => field?.type === 'text' || field?.type === 'textarea'
  );
  const extractedValues = {};
  filteredFields?.forEach((field) => {
    const value = socialData[field.name];
    if (value !== undefined && value !== null) {
      extractedValues[field.name] = value;
    }
  });
  const valuesArray = Object.values(extractedValues);

  return (
    <MainCard
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
        height: '400px',
        overflowY: 'scroll'
      }}
    >
      {loading ? (
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <CircularProgress />
        </CardContent>
      ) : (
        <>
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={0}>
                      <Grid item xs zeroMinWidth />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          '& > p': {
                            ...theme.typography.body1,
                            marginBottom: 0
                          }
                        }}
                      >
                        <Typography
                          sx={{
                            letterSpacing: '0em',
                            fontWeight: 400,
                            lineHeight: '1.5em',
                            color: colors.grey[900],
                            fontSize: '0.875rem !important'
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{ __html: valuesArray[1] }}
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </>
      )}
    </MainCard>
  );
};

SocialActivity.propTypes = {
  data: PropTypes.object,
  handleUserDetails: PropTypes.func,
  handleStarredChange: PropTypes.func,
  handleImportantChange: PropTypes.func
};

export default SocialActivity;
