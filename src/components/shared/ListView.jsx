import {
  Box,
  Button,
  Fab,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material';

import { colors } from '../../common/constants/styles';

// assets
import { IconSearch } from '@tabler/icons-react';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import MainCard from '../../elements/MainCard';
import ListTable from './ListTable';
import { useDispatch, useSelector } from 'react-redux';
import AnimateButton from '../../pages/Login/AnimateButton';
import { setCurrentView } from '../../redux/slices/currentSlice';
import { useLocation } from 'react-router-dom';
import { List } from 'lucide-react';
import { Grid } from 'lucide-react';
import { Plus, PlusCircle } from 'lucide-react';
import { Separator } from '@/componentss/ui/separator';
import PaginationComponent from '@/componentss/ui/paginationcomponent';
const ListView = ({
  type,
  items,
  headers,
  onRowClick,
  onActionClick,
  onCreateNew,
  header
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [alignment, setAlignment] = React.useState('left');
  const { currentTheme, currentUser } = useSelector((state) => state.auth);
  const { currentView } = useSelector((state) => state.current);
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
    handleClose();
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const filteredItems = items?.filter((item) =>
    item?.displayName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const paginatedItems = filteredItems?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="px-4 py-6">
        {header(type, searchQuery, handleSearchChange)}
      </div>
      <Separator className="mb-4 h-1" />
      <div className="flex h-[calc(100vh-185px)] flex-wrap justify-start gap-3 overflow-auto px-4">
        <div className="min-h-[calc(100vh-240px)] w-full">
          <ListTable
            headers={headers}
            rows={paginatedItems}
            onActionClick={onActionClick}
            onRowClick={onRowClick}
            type={type}
          />
        </div>
        <PaginationComponent
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={filteredItems.length}
          handleChangePage={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};

export default ListView;
