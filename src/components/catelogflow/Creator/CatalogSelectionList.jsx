import { useSelector } from 'react-redux';
import './CatalogList.css';
import ListView from '../../shared/ListView';
import Loader from '../../shared/Loader';
import ViewSelector from '../../shared/ViewSelector';
import { COLORS } from '../../../common/constants/styles';
import { MyDataTable } from '../../records/data-grid/DataTable';
import GridView from './GridView';
import MyRequestGridView from './MyRequestGridView ';
import { useLocation } from 'react-router-dom';

const List = ({
  actionHandler,
  rows,
  columns,
  onCreateNew,
  goToRecordPanel,
  gridViewFlag,
  setShowColumnPreference
}) => {
  const { isLoading, forms } = useSelector((state) => state.form);
  const { currentView } = useSelector((state) => state.current);
  const { currentTheme } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Loader />;
  }

  const viewStyle = {
    overflowY: currentView === 'List' ? null : 'scroll',
    backgroundColor: currentView === 'List' ? COLORS.WHITE : ''
  };
  return (
    <div className="main_catalog_container" style={{ paddingTop: '12px' }}>
      <ViewSelector onCreateNew={onCreateNew} type="forms" />
      <div className="flex">
        <div
          className="current_view mt-3 flex w-full flex-row flex-wrap items-start justify-start overflow-auto"
          style={viewStyle}
        >
          {currentView === 'Grid' ? (
            gridViewFlag === 'myRequest' ? (
              <MyRequestGridView
                type="Form"
                items={rows}
                goToPanel={goToRecordPanel}
                onActionClick={actionHandler}
                // goToFields={goToFields}
                onCreateNew={onCreateNew}
                modalActionHandler={actionHandler}
              />
            ) : (
              <GridView
                type="Form"
                items={rows}
                goToPanel={goToRecordPanel}
                onActionClick={actionHandler}
                // goToFields={goToFields}
                onCreateNew={onCreateNew}
                modalActionHandler={actionHandler}
              />
            )
          ) : (
            <MyDataTable
              // onRowDoubleClick={handleRowDoubleClick}
              fullWidth
              myRequestGrid={gridViewFlag}
              rows={rows}
              columns={columns}
              density="compact"
              disableColumnMenu
              goToPanel={goToRecordPanel}
              modalActionHandler={actionHandler}
              setShowColumnPreference={setShowColumnPreference}
              style={{ height: 'calc(100vh - 220px)' }}
            ></MyDataTable>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
