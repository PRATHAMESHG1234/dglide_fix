import { useSelector } from 'react-redux';
import './List.css';
import GridView from '../shared/GridView';
import ListView from '../shared/ListView';
import Loader from '../shared/Loader';
import { colors, COLORS } from '../../common/constants/styles';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { Input } from '@/componentss/ui/input';
import { Button } from '@/componentss/ui/button';
import { AlignJustify, Grid2x2, Plus, Search } from 'lucide-react';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/componentss/ui/menubar';
import { setCurrentView } from '../../redux/slices/currentSlice';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';
const List = ({
  actionHandler,
  goToFields,
  goToRecordPanel,
  goToFieldGroupList,
  goToSchemaList,
  onCreateNew
}) => {
  const { isLoading, forms } = useSelector((state) => state.form);
  const { currentView } = useSelector((state) => state.current);
  const { currentTheme, currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  if (isLoading) {
    return <Loader />;
  }
  const header = (type, search, handleSearch) => {
    return (
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography
            sx={{
              fontSize: '1.25rem',
              color: currentTheme === 'Dark' ? colors.white : colors.grey[900],
              fontWeight: 600
            }}
          >
            {type === 'Module' ? 'Modules' : 'Forms'}
          </Typography>
        </Grid>
        <Grid item display="flex" gap="20px">
          <Input
            type="text"
            placeholder="search"
            id="subsearch"
            value={search}
            onChange={handleSearch}
            startIcon={<Search size={16} />}
          />

          {/* <Menubar>
            <MenubarMenu>
              <Tooltip>
                <TooltipTrigger>
                  <MenubarTrigger
                    onClick={() => dispatch(setCurrentView({ view: 'List' }))}
                    className={` ${
                      currentView === 'List' ? 'bg-blue-200 text-secondary' : ''
                    } cursor-pointer dark:text-white`}
                  >
                    <AlignJustify size={16} />
                  </MenubarTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="mt-2">
                  <p>List view</p>
                </TooltipContent>
              </Tooltip>
            </MenubarMenu>
            <MenubarMenu>
              <Tooltip>
                <TooltipTrigger>
                  <MenubarTrigger
                    onClick={() => dispatch(setCurrentView({ view: 'Grid' }))}
                    className={` ${
                      currentView === 'Grid' ? 'bg-blue-200 text-secondary' : ''
                    } cursor-pointer dark:text-white`}
                  >
                    <Grid2x2 size={16} />
                  </MenubarTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="mt-2">
                  <p>Grid view</p>
                </TooltipContent>
              </Tooltip>
            </MenubarMenu>
          </Menubar> */}

          {currentUser?.roles?.some((role) => role.name === 'Super Admin') &&
          pathname !== '/portal' &&
          (currentView === 'Grid' || currentView === 'List') ? (
            <div className="flex items-center" onClick={onCreateNew}>
              <Button onClick={onCreateNew} className="font-bold">
                <Plus size={16} strokeWidth={4} />
                Add form
              </Button>
            </div>
          ) : (
            currentUser?.roles?.some((role) => role.name !== 'Super Admin') &&
            !pathname.includes('/portal') &&
            (currentView === 'Grid' || currentView === 'List') && (
              <div className="flex items-center">
                <Button onClick={onCreateNew} className="font-bold">
                  <Plus size={16} strokeWidth={4} />
                  Add form
                </Button>
              </div>
            )
          )}
        </Grid>
      </Grid>
    );
  };
  const viewStyle = {
    overflowY: currentView === 'List' ? null : 'scroll',
    backgroundColor: currentView === 'List' ? COLORS.WHITE : ''
  };
  return (
    <div
      className="main_container"
      style={{
        backgroundColor: currentTheme === 'Dark' ? colors.darkBackground : null
      }}
    >
      {/* <ViewSelector onCreateNew={onCreateNew} type="forms" /> */}
      <div className="view_container flex">
        <div
          className="current_view flex w-full flex-row flex-wrap items-start justify-start overflow-auto"
          style={viewStyle}
        >
          {currentView === 'Grid' ? (
            <GridView
              type="Form"
              items={
                forms?.length > 0 &&
                forms?.map((form) => {
                  return {
                    ...form,
                    id: form?.formInfoId
                  };
                })
              }
              goToPanel={goToRecordPanel}
              goToFieldGroupList={goToFieldGroupList}
              goToSchemaList={goToSchemaList}
              onActionClick={actionHandler}
              goToFields={goToFields}
              onCreateNew={onCreateNew}
              formDetails={'formDetails'}
              header={header}
            />
          ) : (
            <ListView
              type="Forms"
              items={
                forms.length > 0 &&
                forms?.map((form) => {
                  return {
                    ...form,
                    id: form?.formInfoId
                  };
                })
              }
              headers={[
                'Sr No',
                'Name',
                'Description',
                'No of Records',
                'Actions'
              ]}
              onRowClick={goToRecordPanel}
              onActionClick={actionHandler}
              header={header}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
