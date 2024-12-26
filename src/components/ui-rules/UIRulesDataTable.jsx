import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import UIRuleCard from './UIRuleCard';
import { Plus } from 'lucide-react';
import { Button } from '@/componentss/ui/button';
import { Separator } from '@/componentss/ui/separator';
import PaginationComponent from '@/componentss/ui/paginationcomponent';

const UIRulesDataTable = ({
  rowsPerPage,
  currentPage,
  setRefetch,
  setCurrentPage,
  setRowsPerPage,
  totalRecords,
  setPreview,
  rows,
  onActionDelete,
  onActionEdit,
  onSubmitHandler
}) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
    handleClose();
    setRefetch((prev) => !prev);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="min-h-screen w-full bg-accent">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between space-x-6">
          <div>
            <p
              className={`text-lg font-semibold ${currentTheme === 'Dark' ? 'text-white' : 'text-gray-900'}`}
            >
              Rules
            </p>
          </div>

          <div>
            <Button
              onClick={() => setPreview(true)}
              className="bg-primary font-bold dark:bg-primary"
            >
              <Plus size={16} strokeWidth={3} />
              Add rule
            </Button>
          </div>
        </div>
      </div>
      <Separator className="mb-4 h-1" />
      <div className="flex min-h-[calc(100vh-220px)] flex-wrap justify-start gap-3 overflow-auto">
        <div className="flex w-full flex-row flex-wrap gap-2 pt-1">
          {rows?.length > 0 &&
            rows?.map((item) => (
              <div
                key={item.id}
                className="flex w-full flex-col flex-wrap items-center justify-start pb-4"
              >
                <UIRuleCard
                  items={item}
                  onActionEdit={onActionEdit}
                  onActionDelete={onActionDelete}
                  onSubmitHandler={onSubmitHandler}
                />
              </div>
            ))}
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
  );
};

export default UIRulesDataTable;
