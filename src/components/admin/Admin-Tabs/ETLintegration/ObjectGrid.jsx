import React, { useState } from 'react';
import GridTableSimple from '../../../../elements/GridTableSimple';

export const ObjectGrid = ({ items, headers }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [refetch, setRefetch] = useState(false);
  return (
    <>
      <GridTableSimple
        //   currentPage={currentPage}
        //   setCurrentPage={setCurrentPage}
        //   rowsPerPage={rowsPerPage}
        //   setRowsPerPage={setRowsPerPage}
        //   totalRecords={items.length}
        headers={headers}
        // refField={refField}
        //   handledRowClick={onRowSelectionModelChange}
        setSelectedRows={setSelectedRows}
        setRefetch={setRefetch}
        rows={items}
        //   handleRowsPerPageChange={handleRowsPerPageChange}
        usedElements={['table']}
        //   rowTooltip="Double click to edit record"
      />
    </>
  );
};
