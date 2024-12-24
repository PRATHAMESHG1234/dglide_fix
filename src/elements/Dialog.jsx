import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Dialog as Dialogs,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { X } from 'lucide-react';
import { colors } from '../common/constants/styles';

// ===============================|| UI DIALOG - RESPONSIVE ||=============================== //

export default function Dialog({
  title,
  body = '',
  firstButtonText,
  secondButtonText,
  onClick = () => {},
  open,
  setOpen,
  width = 'md',
  outsideClickClose = null,
  bottonPostion = 'normal',
  variant = '',
  ...props
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const handleClick = () => {
    onClick();
    setOpen(false);
  };
  return (
    <div>
      <Dialogs
        fullScreen={fullScreen}
        maxWidth={width}
        minHeight={'730px'}
        fullWidth
        // sx={{ minWidth: '600px !important', minHeight: '130px !important' }}
        open={open}
        onClose={outsideClickClose ? () => setOpen(false) : null}
        aria-labelledby="responsive-dialog-title"
        {...props}
      >
        <>
          <DialogTitle id="responsive-dialog-title">
            {title}
            <IconButton
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{
                position: 'absolute',
                right: 10,
                top: 10,
                color: (theme) => colors.grey[500]
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="body2" component="span">
                {body}
              </Typography>
            </DialogContentText>
          </DialogContent>
          {bottonPostion === 'normal' ? (
            <DialogActions sx={{ pr: 2.5 }}>
              {firstButtonText && (
                <Button
                  sx={{
                    color: colors.error.dark,
                    textTransform: 'none',
                    fontSize: '0.875rem'
                  }}
                  autoFocus
                  onClick={() => handleClick()}
                  color="error"
                  variant={variant === 'delete' ? 'text' : 'outlined'}
                  size={variant === 'delete' ? 'small' : 'medium'}
                >
                  {firstButtonText}
                </Button>
              )}
              {secondButtonText && (
                <Button
                  variant={variant === 'delete' ? 'contained' : 'outlined'}
                  onClick={() => setOpen(false)}
                  size={variant === 'delete' ? 'small' : 'medium'}
                  sx={{ textTransform: 'none' }}
                >
                  {secondButtonText}
                </Button>
              )}
            </DialogActions>
          ) : (
            <DialogActions sx={{ pr: 2.5 }}>
              {secondButtonText && (
                <Button
                  variant={variant === 'delete' ? 'text' : 'outlined'}
                  onClick={() => setOpen(false)}
                  size={variant === 'delete' ? 'small' : 'medium'}
                  sx={{
                    color: colors.error.dark,
                    textTransform: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  {secondButtonText}
                </Button>
              )}
              {firstButtonText && (
                <Button
                  sx={{
                    textTransform: 'none',
                    bgcolor: colors.primary.main,
                    '&:hover': {
                      bgcolor: colors.primary.main
                    }
                  }}
                  autoFocus
                  onClick={() => handleClick()}
                  variant={variant === 'delete' ? 'contained' : 'outlined'}
                  size={variant === 'delete' ? 'small' : 'medium'}
                >
                  {firstButtonText}
                </Button>
              )}
            </DialogActions>
          )}
        </>
      </Dialogs>
    </div>
  );
}
