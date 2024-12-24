import React, { useState } from 'react';
import {
  Divider,
  Stack,
  Tooltip,
  Typography,
  Button,
  Grid,
  InputAdornment,
  OutlinedInput,
  Pagination,
  Menu,
  MenuItem
} from '@mui/material';
import MainCard from '../../../elements/MainCard';
import { IconSearch } from '@tabler/icons-react';
import { ChevronDown } from 'lucide-react';
import GridCard from './GridCard';
import { colors } from '../../../common/constants/styles';
import { ResizeVertical } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GridView = ({
  type,
  items,
  goToPanel,
  modalActionHandler,
  goToFields,
  onCreateNew
}) => {
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const location = useLocation();
  const { currentTheme } = useSelector((state) => state.auth);
  const pathname = location.pathname;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const filteredItems = items.filter((item) =>
    item.catalog?.toLowerCase().includes(search?.toLowerCase())
  );

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to the first page on items per page change
    handleClose();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <MainCard
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          background: currentTheme === 'Dark' ? colors.darkLevel2 : colors.white
        }}
        title={
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                sx={{
                  fontSize: '1.25rem',
                  color:
                    currentTheme === 'Dark' ? colors.white : colors.grey[600],
                  fontWeight: 600,
                  padding: 1
                }}
              >
                {pathname === '/portal' ? 'Request' : 'Catalog Flow'}
              </Typography>
            </Grid>
            <Grid item>
              <OutlinedInput
                id="input-search-card-style2"
                placeholder="Search"
                value={search}
                onChange={handleSearch}
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch
                      stroke={1.5}
                      size="16px"
                      color={
                        currentTheme === 'Dark'
                          ? colors.white
                          : colors.grey[900]
                      }
                    />
                  </InputAdornment>
                }
                size="small"
                sx={{
                  color:
                    currentTheme === 'Dark' ? colors.white : colors.grey[900]
                }}
              />
            </Grid>
          </Grid>
        }
      >
        <Grid container direction="row" columnSpacing={3} rowSpacing={2}>
          <GridCard
            items={currentItems}
            type={type}
            goToPanel={goToPanel}
            modalActionHandler={modalActionHandler}
            goToFields={goToFields}
            onCreateNew={onCreateNew}
          />
          <Grid item xs={12} marginTop="2%">
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Pagination
                  count={Math.ceil(filteredItems.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handleChangePage}
                  color="primary"
                />
              </Grid>
              <Grid item>
                <Button
                  variant="text"
                  size="large"
                  sx={{ color: colors.grey[900] }}
                  color="secondary"
                  endIcon={<ChevronDown />}
                  onClick={handleClick}
                >
                  {itemsPerPage} Rows
                </Button>
                <Menu
                  id="menu-user-card-style2"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  variant="selectedMenu"
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                >
                  {[10, 20, 30].map((rows) => (
                    <MenuItem
                      key={rows}
                      onClick={() => handleItemsPerPageChange(rows)}
                    >
                      {rows} Rows
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default GridView;
