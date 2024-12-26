import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  alpha
} from '@mui/material';
import DialogModal from '@mui/material/Dialog';
import React from 'react';
import { colors, COLORS } from '../../common/constants/styles';
import CloseIcon from '@mui/icons-material/Close';

import Add from '@mui/icons-material/AddCircleOutline';
import { useSelector } from 'react-redux';
import { BorderColor } from '@mui/icons-material';
import Chip from '../../elements/Chip';
import { color } from 'framer-motion';
const ODD_OPACITY = 0.1;

const Dialog = ({ Header, children, Footer, style, footerNone }) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const { open, close, maxWidth } = Header;
  const {
    clear,
    confirm,
    cancelBtnLabel,
    saveBtnLabel,
    actionButton,
    actionButtonLabel
  } = Footer;
  const footerLength = Object.entries(Footer).length;
  return (
    <DialogModal
      open={open}
      maxWidth={maxWidth}
      fullWidth
      sx={style}
      PaperProps={{ sx: { borderRadius: '15px' } }}
    >
      <span
        style={{
          backgroundColor:
            currentTheme === 'Light'
              ? colors.secondary.light
              : colors.darkBackground
        }}
      >
        <DialogTitle
          id="customized-dialog-title"
          sx={{
            color: colors.secondary.main,
            fontWeight: '500',
            fontSize: '16px',
            cursor: 'default'
          }}
        >
          {Header.dialogTitle}
        </DialogTitle>
        <Box
          sx={{
            position: 'absolute',
            right: 50,
            top: 8
          }}
        >
          {Header.addButton}
        </Box>
        <Tooltip title="Close" placement="bottom">
          <IconButton
            aria-label="close"
            onClick={close}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color:
                currentTheme === 'Light'
                  ? alpha(COLORS.SECONDARY, 0.7)
                  : COLORS.WHITESMOKE
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </span>

      <Divider color={colors.grey[100]} />
      <DialogContent
        style={{
          backgroundColor:
            currentTheme === 'Light' ? COLORS.WHITE : colors.darkLevel2
        }}
      >
        {children}
      </DialogContent>
      <Divider color={colors.grey[100]} />

      {footerLength !== 0 && !footerNone && (
        <DialogActions
          style={{
            justifyContent: 'center',
            backgroundColor:
              currentTheme === 'Light'
                ? colors.secondary.light
                : colors.darkBackground
          }}
        >
          {actionButton && (
            <div
              className="flex cursor-pointer absolute"
              onClick={actionButton}
              style={{
                left: 18,
                bottom: 10
              }}
            >
              <Chip
                size="medium"
                variant="outlined"
                chipcolor="secondary"
                label={
                  <>
                    <Add
                      sx={{
                        fontSize: '22px',
                        marginRight: '5px'
                      }}
                    />

                    {actionButtonLabel ? actionButtonLabel : 'Add Record'}
                  </>
                }
              />
            </div>
          )}

          <Button
            variant="outlined"
            onClick={clear}
            sx={{
              color: colors.secondary.main,
              border: `solid 0.5px ${colors.secondary.main}`,
              BorderColor: colors.secondary.main,
              '&:hover': {
                color: colors.secondary.main,
                border: `solid 0.5px ${colors.secondary.main}`,
                BorderColor: colors.secondary.main
              },
              textTransform: 'none'
            }}
          >
            {cancelBtnLabel}
          </Button>

          <Button
            type="submit"
            variant="solid"
            sx={{
              background: colors.secondary.main,
              color: colors.white,
              '&:hover': {
                background: colors.secondary.main,
                color: colors.white
              },
              textTransform: 'none'
            }}
            onClick={confirm}
          >
            {saveBtnLabel}
          </Button>
        </DialogActions>
      )}
    </DialogModal>
  );
};

export default Dialog;
