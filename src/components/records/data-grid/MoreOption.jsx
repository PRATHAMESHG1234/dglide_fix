import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import MoreIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { colors, COLORS } from '../../../common/constants/styles';

const MoreOption = ({ children }) => {
  const { currentTheme } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);

  const menuOpen = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div
      style={{
        color: currentTheme === 'Light' ? COLORS.SECONDARY : COLORS.WHITESMOKE
      }}
    >
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        size="small"
        className="border"
        onClick={handleClick}
        color={currentTheme === 'Dark' ? colors.darkTab : COLORS.SECONDARY}
        sx={{
          width: '37px',
          backgroundColor:
            currentTheme === 'Light' ? COLORS.WHITE : colors.darkTab,
          color: 'inherit'
        }}
      >
        <MoreIcon fontSize="medium" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={menuOpen}
        sx={{
          top: '8px'
        }}
      >
        {children}
      </Menu>
    </div>
  );
};

export default MoreOption;
