import React, { useEffect, useState } from 'react';

import PaginationComponent from '@/componentss/ui/paginationcomponent';

import WorkflowCard from './WorkflowCard';

const WorkflowGridView = ({
  type,
  items,
  goToRecordPanel,
  modalActionHandler,
  updateStatus,
  setCurrentPage,
  setRefetch,
  currentPage,
  totalRecords,
  rowsPerPage,
  setRowsPerPage
}) => {
  // const { isOpen } = useSelector((state) => state.sidebar);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    const result = items?.filter((item) =>
      item?.name?.toLowerCase()?.includes(search.toLowerCase())
    );
    setFilteredItems(result);
  }, [search, items]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    setRefetch((prev) => !prev);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
    setRefetch((prev) => !prev);
    handleClose();
  };

  const paginatedItems = filteredItems?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div className="flex w-full flex-col">
        {paginatedItems.length > 0 &&
          paginatedItems?.map((item) => (
            <div
              className="flex w-full flex-col flex-wrap items-center justify-center py-2"
              key={item.id}
            >
              <WorkflowCard
                goToRecordPanel={goToRecordPanel}
                items={item}
                modalActionHandler={modalActionHandler}
                updateStatus={updateStatus}
              />
            </div>
          ))}
        <div className="my-2">
          <div className="flex justify-between">
            <div className="w-full">
              <PaginationComponent
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRecords={totalRecords}
                handleChangePage={handleChangePage}
                handleRowsPerPageChange={handleRowsPerPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowGridView;
