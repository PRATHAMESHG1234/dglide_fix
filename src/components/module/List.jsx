import { useSelector } from 'react-redux';
import './List.css';
import GridView from '../shared/GridView';
import ListView from '../shared/ListView';
import { colors, COLORS } from '../../common/constants/styles';
import { Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Input } from '@/componentss/ui/input';
import { Button } from '@/componentss/ui/button';
import { AlignJustify, Grid2x2, Plus, Search } from 'lucide-react';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/componentss/ui/menubar';
import { setCurrentView } from '../../redux/slices/currentSlice';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/componentss/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

const List = ({ actionHandler, goToModulePanel, goToFields, onCreateNew }) => {
  const { modules } = useSelector((state) => state.module);
  const { currentView } = useSelector((state) => state.current);
  const { currentTheme, currentUser } = useSelector((state) => state.auth);
  const { isMobile } = useSidebar();

  const viewStyle = {
    overflowY: currentView === 'List' ? null : 'scroll',
    backgroundColor: currentView === 'List' ? COLORS.WHITE : ''
  };
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  const header = (type, search, handleSearch) => {
    return (
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-semibold text-black dark:text-white">
            {type === 'Module' ? 'Modules' : 'Forms'}
          </span>
        </div>
        <div className="flex gap-5">
          <Input
            type="text"
            placeholder="search"
            id="subsearch"
            value={search}
            onChange={handleSearch}
            startIcon={<Search size={16} />}
          />

          {currentUser?.roles?.some((role) => role.name === 'Super Admin') &&
          pathname !== '/portal' &&
          (currentView === 'Grid' || currentView === 'List') ? (
            <div className="flex items-center" onClick={onCreateNew}>
              <Button
                onClick={onCreateNew}
                className="bg-primary font-bold dark:bg-primary"
              >
                <Plus size={16} strokeWidth={4} />
                Add module
              </Button>
            </div>
          ) : (
            currentUser?.roles?.some((role) => role.name !== 'Super Admin') &&
            !pathname.includes('/portal') &&
            (currentView === 'Grid' || currentView === 'List') && (
              <div className="flex items-center">
                <Button
                  onClick={onCreateNew}
                  className="bg-primary font-bold dark:bg-primary"
                >
                  <Plus size={16} strokeWidth={4} />
                  Add module
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    );
  };
  return (
    <div
      className="main_container"
      style={{
        backgroundColor: currentTheme === 'Dark' ? colors.darkBackground : null
      }}
    >
      {/* <ViewSelector onCreateNew={onCreateNew} type="module" /> */}
      <div className="view_container flex">
        <div
          className="current_view flex w-full flex-row flex-wrap items-start justify-start overflow-auto"
          style={viewStyle}
        >
          {currentView === 'Grid' ? (
            <GridView
              type="Module"
              items={modules?.map((module) => {
                return {
                  ...module,
                  id: module?.moduleInfoId
                };
              })}
              goToPanel={goToModulePanel}
              goToFields={goToFields}
              onActionClick={actionHandler}
              onCreateNew={onCreateNew}
              header={header}
            />
          ) : (
            <ListView
              type="Module"
              items={modules?.map((module) => {
                return {
                  ...module,
                  id: module?.moduleInfoId
                };
              })}
              headers={[
                'Sr No',
                'Name',
                'Description',
                'No of Forms',
                'Actions'
              ]}
              onRowClick={goToModulePanel}
              onActionClick={actionHandler}
              onCreateNew={onCreateNew}
              header={header}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
