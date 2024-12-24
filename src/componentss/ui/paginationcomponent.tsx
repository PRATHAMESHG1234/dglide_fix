import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/componentss/ui/pagination';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/componentss/ui/menubar';
import { useSidebar } from '@/componentss/ui/sidebar';

interface PaginationProps {
  currentPage: number;
  rowsPerPage: number;
  totalRecords: number;
  handleChangePage: (e: React.MouseEvent, page: number) => void;
  handleRowsPerPageChange: (rows: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  rowsPerPage,
  totalRecords,
  handleChangePage,
  handleRowsPerPageChange
}) => {
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const generatePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    return pages;
  };

  const { isMobile } = useSidebar();

  return (
    <div className="flex h-10 w-full items-center justify-end gap-2">
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={`${
                  currentPage === 1
                    ? 'cursor-not-allowed text-gray-400 hover:text-gray-400'
                    : 'cursor-pointer'
                }`}
                onClick={(e) =>
                  currentPage > 1 && handleChangePage(e, currentPage - 1)
                }
              />
            </PaginationItem>

            {generatePages().map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <PaginationLink className="disabled min-w-2 cursor-default hover:bg-transparent">
                    ...
                  </PaginationLink>
                ) : (
                  <PaginationLink
                    onClick={(e) => handleChangePage(e, page)}
                    className={`${
                      currentPage === page
                        ? 'min-w-2 cursor-pointer bg-primary text-white hover:bg-gray-300 hover:text-neutral-800'
                        : 'min-w-2 cursor-pointer hover:bg-gray-300 hover:text-neutral-800'
                    }`}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                className={`${
                  currentPage === totalPages
                    ? 'cursor-not-allowed text-gray-400 hover:text-gray-400'
                    : 'cursor-pointer'
                }`}
                onClick={(e) =>
                  currentPage < totalPages &&
                  handleChangePage(e, currentPage + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {!isMobile && (
        <div>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger
                className={`flex cursor-pointer items-center gap-1 ${
                  totalPages === 1 ? 'pointer-events-none text-gray-400' : ''
                }`}
              >
                {rowsPerPage} Rows{' '}
                <ChevronDown size={16} className="text-gray-500" />
              </MenubarTrigger>
              <MenubarContent
                align="end"
                className={`min-w-20 ${
                  totalPages === 1 ? 'pointer-events-none' : ''
                }`}
              >
                {[10, 20, 30].map((rows) => (
                  <MenubarItem
                    key={rows}
                    onClick={() =>
                      totalPages > 1 && handleRowsPerPageChange(rows)
                    }
                    className={`${
                      totalPages === 1
                        ? 'pointer-events-none text-gray-400'
                        : ''
                    }`}
                  >
                    {rows} Rows
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      )}
    </div>
  );
};

export default PaginationComponent;
