import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Plus, PlusCircle, Trash2 } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { Edit, Edit2 } from 'lucide-react';
import { Eye } from 'lucide-react';
import { ListItemDecorator } from '@mui/joy';
import { Box, FormLabel, Menu, MenuItem, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  gridClasses
} from '@mui/x-data-grid';
import { Calendar } from 'lucide-react';

import { colors, COLORS } from '../../../common/constants/styles';
import { MODAL } from '../../../common/utils/modal-toggle';
import { Button } from '@/componentss/ui/button';
import MoreOption from './MoreOption';

const ODD_OPACITY = 0.2;
const DataTable = styled(DataGrid)(() => ({
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY),
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY + 0.1)
    },
    '&.Mui-selected': {
      backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY)
      }
    }
  }
}));
export const MyDataTable = ({
  goToPanel,
  rows,
  columns,
  modalActionHandler,
  style,
  myRequestGrid,
  setShowColumnPreference
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { currentTheme } = useSelector((state) => state.auth);
  const [selectedRows, setSelectedRows] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [sort, setSort] = useState([]);
  const [isPreviewSelected, setIsPreviewSelected] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    page: 0
  });

  const onRowDoubleClick = (row) => {
    goToPanel(row.row);
  };

  const handleChangeAction = (value) => {
    if (value === 'preview') {
      setIsPreviewSelected(true);
      const selectedRowData = rows.filter(
        (o) => o.catalogFlowInfoId === selectedRows[0]
      );
      if (selectedRowData.length > 0) {
        navigate(`creatorPreview/${selectedRows[0]}`, {});
      }
      setAnchorEl(null);
    } else {
      modalActionHandler(value, selectedRows[0]);
      setAnchorEl(null);
    }
  };

  const hiddenFields = ['customer', 'uuid'];
  const desiredOrder = ['id', 'catalog', 'created_at', 'status'];
  const visibleColumns = columns
    .filter((column) => !hiddenFields.includes(column.field))
    .sort(
      (a, b) => desiredOrder.indexOf(a.field) - desiredOrder.indexOf(b.field)
    );

  const menuOpen = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingY: 0.5,
            width: '100%',
            paddingRight: 1,
            backgroundColor:
              currentTheme === 'Light' ? '#fafcff' : colors.darkLevel2,
            borderBottom:
              currentTheme === 'Light'
                ? '1px solid lightgray'
                : '1px solid #212330'
          }}
        >
          <FormLabel sx={{ fontSize: '18px', fontWeight: 'bold' }}>
            {pathname === '/workflow'
              ? 'Workflow'
              : pathname === '/catalogflow'
                ? 'Catalogflow'
                : pathname === '/portal'
                  ? 'Request'
                  : pathname.includes('/myRequest')
                    ? 'My Request'
                    : null}
          </FormLabel>

          <div className="mb-2 flex">
            <div className="mx-2">
              {isPreviewSelected || pathname.includes('/portal') ? null : (
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  endDecorator={<ChevronDown sx={{ color: 'inherit' }} />}
                  color={COLORS.SECONDARY}
                  sx={{
                    backgroundColor:
                      currentTheme === 'Light'
                        ? '#e0eeff'
                          ? '#e0eeff'
                          : COLORS.WHITE
                        : colors.darkTab,

                    color:
                      currentTheme === 'Light'
                        ? COLORS.SECONDARY
                        : COLORS.WHITESMOKE
                  }}
                >
                  Action
                </Button>
              )}
              <Menu
                keepMounted
                anchorEl={anchorEl}
                onClose={handleClose}
                open={menuOpen}
                sx={{
                  top: pathname === '/workflow' ? '115px' : '180px',
                  left:
                    pathname === '/workflow'
                      ? 'calc(100vw - 265px)'
                      : 'calc(100vw - 215px)'
                }}
              >
                {pathname !== '/portal' ? (
                  <MenuItem
                    variant="soft"
                    onClick={() => handleChangeAction('edit')}
                  >
                    <ListItemDecorator>
                      <Edit2 />
                    </ListItemDecorator>
                    Edit
                  </MenuItem>
                ) : null}
                <MenuItem
                  sx={{
                    color: COLORS.RED,
                    bgcolor: selectedRows[0] && COLORS.LAVENDER
                  }}
                  onClick={() => handleChangeAction('delete')}
                >
                  <ListItemDecorator sx={{ color: 'inherit' }}>
                    <Trash2 />
                  </ListItemDecorator>
                  Delete
                </MenuItem>

                {columns.some((o) => o.field === 'subCategory') && (
                  <MenuItem
                    variant="soft"
                    onClick={() => handleChangeAction('preview')}
                  >
                    <ListItemDecorator>
                      <Eye />
                    </ListItemDecorator>
                    Preview
                  </MenuItem>
                )}
              </Menu>
            </div>
            {pathname !== '/workflow' || pathname === '/catalogflow' ? (
              <Button
                onClick={() => modalActionHandler(MODAL.create)}
                sx={{
                  backgroundColor: COLORS.PRIMARY,
                  height: '35px'
                }}
              >
                <Plus />
              </Button>
            ) : null}

            <span className="px-2">
              <MoreOption>
                <span
                  className="flex w-full items-center justify-start gap-2"
                  style={{
                    color: '#1976d1'
                  }}
                  onClick={() => setShowColumnPreference(true)}
                >
                  <Calendar sx={{ fontSize: '18px' }} />
                  <Typography
                    sx={{
                      color: COLORS.PRIMARY,
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    COLUMNS
                  </Typography>
                </span>

                <GridToolbarDensitySelector />
              </MoreOption>
            </span>
          </div>
        </Box>
      </GridToolbarContainer>
    );
  };

  const handlePaginationModelChange = (paginationData) => {
    setPagination(paginationData);
    setRefetch(!refetch);
  };

  const handleSortModelChange = (sortData) => {
    if (sortData.length > 0) {
      const sorting = sortData?.map((obj) => {
        let newSortDirection = 'asc';
        const existingSort = sort.find((s) => s.columnName === obj.field);

        if (existingSort) {
          newSortDirection = existingSort.order === 'asc' ? 'desc' : 'asc';
        }
        return {
          columnName: obj.field,
          order: newSortDirection
        };
      });

      setSort(sorting);
      setRefetch(!refetch);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: style?.height,
        flexGrow: 1
      }}
    >
      <Box
        sx={{
          height: style?.height,
          backgroundColor: currentTheme === 'Light' ? COLORS.WHITE : '#2A2D3D',
          width: '100%'
        }}
      >
        <DataTable
          disableColumnResize={true}
          rows={rows}
          getRowId={(row) => row.uuid}
          columns={myRequestGrid ? visibleColumns : columns}
          slots={{
            toolbar: CustomToolbar
          }}
          pageSizeOptions={[10, 20, 30]}
          paginationModel={pagination}
          onPaginationModelChange={handlePaginationModelChange}
          onSortModelChange={handleSortModelChange}
          onRowDoubleClick={onRowDoubleClick}
          onRowSelectionModelChange={setSelectedRows}
          sx={{
            [`& .${gridClasses.row}.odd`]: {
              backgroundColor:
                currentTheme === 'Light'
                  ? alpha(COLORS.TERTIARY, 0.2)
                  : alpha(COLORS.TERTIARY, 0.05),
              '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY + 0.1)
              },
              '&.Mui-selected': {
                backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY),
                '&:hover, &.Mui-hovered': {
                  backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY)
                }
              }
            },

            '& .MuiDataGrid-columnHeader': {
              fontSize: '14px',
              backgroundColor:
                currentTheme === 'Light' ? '#e3f0ffb4' : colors.darkTab,
              color:
                currentTheme === 'Light' ? COLORS.SECONDARY : COLORS.WHITESMOKE
            },
            '& .MuiDataGrid-row': {
              borderTop:
                currentTheme === 'Light' ? 'none' : '1px solid #212330',
              backgroundColor:
                currentTheme === 'Light' ? colors.white : colors.darkLevel2
            },
            '& .MuiDataGrid-cell': {
              color:
                currentTheme === 'Light' ? COLORS.SECONDARY : COLORS.WHITESMOKE
            },
            '& .MuiDataGrid-sortIcon': {
              opacity: 1,
              color:
                currentTheme === 'Light' ? COLORS.SECONDARY : COLORS.WHITESMOKE
            },
            '& .MuiDataGrid-menuIconButton': {
              opacity: 1,
              color:
                currentTheme === 'Light' ? COLORS.SECONDARY : COLORS.WHITESMOKE
            },

            borderRadius: 3,
            border: 'none'
          }}
          getRowClassName={(params) => {
            if (params.isSelected) {
              return `selectedRow`;
            }
          }}
        />
      </Box>
    </div>
  );
};
