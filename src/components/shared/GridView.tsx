import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './GridView.css';
import LightCard from './Card';
import {
  setCurrentFormPage,
  setCurrentModulePage,
  setCurrentRows
} from '../../redux/slices/currentSlice';
import PaginationComponent from '@/componentss/ui/paginationcomponent';
import { Separator } from '@/componentss/ui/separator';
interface GridViewProps {
  type: 'Module' | 'Form';
  items: { id: string; name?: string }[];
  goToPanel: (item: any) => void;
  goToSchemaList: (item: any) => void;
  goToFields: (item: any) => void;
  onActionClick: (item: any) => void;
  onCreateNew: () => void;
  header: (
    type: string,
    search: string,
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => React.ReactNode;
}
const GridView: React.FC<GridViewProps> = ({
  type,
  items,
  goToPanel,
  goToSchemaList,
  goToFields,
  onActionClick,
  onCreateNew,
  header
}) => {
  const { currentModulePage, currentFormPage, currentRows } = useSelector(
    (state: any) => state.current
  );
  const currentPage = type === 'Module' ? currentModulePage : currentFormPage;
  const [rowsPerPage, setRowsPerPage] = useState<number>(currentRows);
  const [search, setSearch] = useState<string>('');
  const dispatch = useDispatch();
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    const trimmedSearch = search.trim();
    const searchWords = trimmedSearch.split(/\s+/);
    return items.filter((item) =>
      searchWords.every((word) =>
        item?.name?.toLowerCase()?.includes(word.toLowerCase())
      )
    );
  }, [items, search]);
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    if (type === 'Module') {
      dispatch(setCurrentModulePage({ page: newPage }));
    } else if (type === 'Form') {
      dispatch(setCurrentFormPage({ page: newPage }));
    }
  };
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / rows);
    const newPage = Math.min(currentPage, totalPages);
    if (type === 'Module') {
      dispatch(setCurrentModulePage({ page: newPage }));
    } else if (type === 'Form') {
      dispatch(setCurrentFormPage({ page: newPage }));
    }
    dispatch(setCurrentRows({ rows }));
  };
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="px-4 py-6">
        {header(type, search, (e) => setSearch(e.target.value))}
      </div>
      <Separator className="mb-4 h-1" />
      <div className="flex h-[calc(100vh-180px)] flex-wrap justify-start gap-3 overflow-auto px-4">
        <div className="flex min-h-[calc(100vh-240px)] flex-wrap justify-start gap-3 overflow-auto bg-transparent">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="flex h-56 flex-wrap items-center justify-center pb-2"
            >
              <LightCard
                isLoading={false}
                Item={item}
                goToPanel={goToPanel}
                onActionClick={onActionClick}
                type={type}
                goToSchemaList={goToSchemaList}
                goToFields={goToFields}
              />
            </div>
          ))}
        </div>

        <PaginationComponent
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={filteredItems.length}
          handleChangePage={handleChangePage}
          handleRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};
export default GridView;
