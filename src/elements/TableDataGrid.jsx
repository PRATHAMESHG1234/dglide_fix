import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { colors } from '../common/constants/styles';

const TableDataGrid = ({ Selected, rows, columns }) => {
  const handleSelectionModelChange = (newSelectionModel) => {
    if (Selected) {
      const selectedIDs = new Set(newSelectionModel);
      const selectedRowData = rows.filter((row) => selectedIDs.has(row.id));
      Selected(selectedRowData);
    }
  };

  return (
    <Box
      style={{
        height: 400,
        width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderColor: colors.grey[200]
          },
          '& .MuiDataGrid-columnsContainer': {
            color: colors.grey[900],
            borderColor: colors.grey[200]
          },
          '& .MuiDataGrid-columnSeparator': {
            color: colors.grey[200]
          }
        }
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={'id'}
        onRowSelectionModelChange={handleSelectionModelChange} // Correct prop for selection model change
        checkboxSelection
      />
    </Box>
  );
};

TableDataGrid.propTypes = {
  Selected: PropTypes.func,
  rows: PropTypes.array.isRequired, // Rows prop validation
  columns: PropTypes.array.isRequired // Columns prop validation
};

export default TableDataGrid;
