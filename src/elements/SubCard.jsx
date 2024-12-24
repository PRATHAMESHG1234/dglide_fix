import PropTypes from 'prop-types';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from '@mui/material';
import { useSelector } from 'react-redux';
import { colors } from '../common/constants/styles';

const SubCard = React.forwardRef(
  (
    {
      children,
      content,
      contentClass,
      DarkTitle,
      secondary,
      sx = {},
      contentSX = {},
      title,
      ...others
    },
    ref
  ) => {
    const { currentTheme } = useSelector((state) => state.auth);

    // Check if the card should be rendered
    if (!children) {
      return null;
    }

    return (
      <Card
        ref={ref}
        sx={{
          border: '1px solid',
          backgroundColor:
            currentTheme === 'Dark' ? colors.darkLevel2 : colors.white,
          borderColor:
            currentTheme === 'Dark' ? colors.darkLevel2 + 15 : colors.grey[200],
          boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
          ':hover': {
            boxShadow:
              currentTheme === 'Dark'
                ? 'none'
                : '0 2px 14px 0 rgb(32 40 45 / 8%)'
          },
          ...sx
        }}
        {...others}
      >
        {/* card header and action */}
        {!DarkTitle && title && (
          <CardHeader
            sx={{ p: 2.5 }}
            title={
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color:
                    currentTheme === 'Dark' ? colors.white : colors.grey[900]
                }}
              >
                {title}
              </Typography>
            }
            action={secondary}
          />
        )}
        {DarkTitle && title && (
          <CardHeader
            sx={{ p: 2.5 }}
            title={
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: colors.grey[600],
                  fontWeight: 600
                }}
              >
                {title}
              </Typography>
            }
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && (
          <Divider
            sx={{
              opacity: 1,
              borderColor:
                currentTheme === 'Dark'
                  ? colors.grey[200] + 15
                  : colors.grey[200]
            }}
          />
        )}

        {/* card content */}
        {content && children && (
          <CardContent
            sx={{
              p: 2.5,
              ...contentSX,
              background:
                currentTheme === 'Dark' ? colors.darkLevel1 : colors.white
            }}
            className={contentClass || ''}
          >
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

SubCard.propTypes = {
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  DarkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object
  ]),
  sx: PropTypes.object,
  contentSX: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object
  ])
};

SubCard.defaultProps = {
  content: true
};

export default SubCard;
