/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import './CreateDashboard.css';
import { CircularProgress, Grid, colors } from '@mui/material';
import TextField from '../../../elements/TextField';
import Chart from 'chart.js/auto';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { COLORS, colors as colorss } from '../../../common/constants/styles';
// import { createDashboard } from '../../../redux/slices/dashboardSlice';
import {
  fetchConfigDetail,
  fetchDashboardByDashboardInfoId
} from '../../../services/chart';
import { buildChart, buildStackChart } from '../ChartJson';
import DashboardPreview from '../DashboardPreview';
import IconButton from '@mui/material/IconButton';
import { Trash } from 'lucide-react';
import CardSection from './CardSection';
import ListSection from './ListSection';
import TableRecordSection from './TableRecordSection';
import './CreateDashboard.css';
import Loader from '../../shared/Loader';

import TableDataGrid from '../../../elements/TableDataGrid';
import ChartSection from './ChartSection';
import { Input } from '@/componentss/ui/input';
import { Button } from '@/componentss/ui/button';

import {
  createDashboard,
  updateDashboard
} from '../../../redux/slices/dashboardSlice';

const ODD_OPACITY = 0.9;

const CreateDashboard = () => {
  const { dashboards, isLoading } = useSelector((state) => state.dashboard);
  const { currentModule } = useSelector((state) => state.current);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [idForChart, setIdForChart] = useState();
  const [data, setData] = useState();
  const [dashboardName, setDashboardName] = useState('');
  const [droppedItemIds, setDroppedItemIds] = useState([]);
  const [previousDashboardItemInfoIds, setPreviousDashboardItemInfoIds] =
    useState([]);

  const [dashboardData, setDashboardData] = useState();
  const [prevLoading, setPrevLoading] = useState(true);
  const [chartDatas, setChartDatas] = useState([]);
  const [checkedDashItem, setCheckedDashItem] = useState([]);
  const [droppedItems, setDroppedItems] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  const [currentItem, setCurrentItem] = useState();
  const [loadingCard, setLoadingCard] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingTableList, setLoadingTableList] = useState(false);
  const [uncheck, setUncheck] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { charts } = useSelector((state) => state.dashboard);
  useEffect(() => {
    if (queryParams && queryParams.get('selectedId')) {
      setIdForChart(queryParams.get('selectedId'));
      getDashboardDetail();
    }
  }, []);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      items: checkedDashItem
    }));

    setDroppedItems(checkedDashItem);
  }, [checkedDashItem.length]);
  const handleDeleteChart = (index) => {
    setChartDatas((prevItems) => {
      const updatedItems = [...prevItems.items];
      updatedItems.splice(index, 1);

      return {
        ...prevItems,
        items: updatedItems
      };
    });

    setPreviousDashboardItemInfoIds((prevItemIds) => {
      const updatedItemsIds = [...prevItemIds];
      updatedItemsIds.splice(index, 1);
      return updatedItemsIds;
    });

    const canvas = document.getElementById('chartCanvas-' + index);
    const deleteButtons = document.getElementsByClassName(
      'delete-chart-btn_' + index
    );
    const deleteButton = deleteButtons[0];

    if (canvas && deleteButton) {
      canvas.remove();
      deleteButton.remove();
    }
  };
  const getDashboardDetail = async (id = null) => {
    if ((queryParams && queryParams.get('selectedId')) || id) {
      const selectedId = queryParams.get('selectedId');
      if (selectedId || id) {
        try {
          const result = await fetchDashboardByDashboardInfoId({
            dashboardInfoId: selectedId || id,
            data: {
              range: null
            }
          });

          if (!result) {
            throw new Error('No response data');
          }

          if (result) {
            setData(result);
            setLoadingCard(false);
            setLoadingChart(false);
            setLoadingTableList(false);
            setDashboardName(result.displayName);

            if (result.items && result.items.length > 0) {
              let items = result.items;
              let previousIds = [];
              for (const item of items) {
                previousIds.push(item.dashboardItemInfoId);
              }
              setPreviousDashboardItemInfoIds(previousIds);

              setChartDatas(items);

              setPrevLoading(false);
            }
          }
        } catch (error) {
          console.error('Error fetching dashboard details:', error);
          return; // Exit the function if there is an error
        }
      }
    }

    if (response) {
      setData(response);
      setDashboardName(response.displayName);

      if (response.items && response.items.length > 0) {
        let items = response.items;
        let previousIds = [];
        for (const item of items) {
          previousIds.push(item.dashboardItemInfoId);
        }
        setPreviousDashboardItemInfoIds(previousIds);

        setPrevLoading(false);
      }
    }
  };

  const handleSaveClick = () => {
    if (dashboardName) {
      const combinedDashboardItemInfoIds = [
        ...new Set([...previousDashboardItemInfoIds, ...droppedItemIds])
      ];

      const dashboardData = {
        displayName: dashboardName,
        moduleInfoId: currentModule.moduleInfoId,
        userId: null,
        dashboardItemInfoIds: combinedDashboardItemInfoIds
      };

      if (queryParams.get('selectedId')) {
        const dashboardInfoId = queryParams.get('selectedId');
        dispatch(updateDashboard({ dashboardInfoId, data: dashboardData }));
      } else {
        dispatch(createDashboard({ data: dashboardData }));
      }

      navigate(-1);
    } else {
      notify.error('Please enter a dashboard name before saving.');
    }
  };

  const handleDashboardNameChange = (event) => {
    setDashboardName(event.target.value);
  };

  const deleteChart = (index) => {
    const newCharts = chartDatas.filter((_, i) => i !== index);
    setChartDatas(newCharts);

    const newItems = data.items.filter(
      (item, i) => item.type !== 'chart' || i !== index
    );

    const dashIds = newItems.map((item) => item.dashboardItemInfoId);
    setPreviousDashboardItemInfoIds(dashIds);
  };

  return (
    <>
      {(data?.displayName && queryParams.get('selectedId')) ||
      window.location.href.endsWith('/create') ? (
        <div className=" ">
          <DndProvider backend={HTML5Backend}>
            <div className="flex h-[calc(100vh-96px)] flex-col gap-2 overflow-y-auto bg-background px-4 py-4">
              <div className="max-w-96 pr-2">
                <Input
                  label={'Dashboard Name'}
                  variant="outlined"
                  name={'Dashboard Name'}
                  required={true}
                  value={dashboardName}
                  onChange={handleDashboardNameChange}
                />
              </div>

              <div
                className="flex flex-1 flex-col gap-2"
                style={
                  {
                    // height: 'calc(100vh - 230px)'
                  }
                }
              >
                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={2}
                    display="flex"
                    flexDirection="row"
                  >
                    {' '}
                    <Grid item xs={4}>
                      <TableRecordSection
                        id="card-table"
                        charts={charts?.filter(
                          (item) => item?.type?.toLowerCase() === 'card'
                        )}
                        tableName={'Card'}
                        checkedDashItem={checkedDashItem}
                        setCheckedDashItem={setCheckedDashItem}
                        data={data}
                        currentItem={currentItem}
                        setCurrentItem={setCurrentItem}
                        setUncheck={setUncheck}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TableRecordSection
                        id="chart-table"
                        charts={charts?.filter(
                          (item) => item?.type?.toLowerCase() === 'chart'
                        )}
                        tableName={'Chart'}
                        checkedDashItem={checkedDashItem}
                        setCheckedDashItem={setCheckedDashItem}
                        previousDashboardItemInfoIds={
                          previousDashboardItemInfoIds
                        }
                        data={data}
                        chartDatas={chartDatas}
                        currentItem={currentItem}
                        setCurrentItem={setCurrentItem}
                        setUncheck={setUncheck}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TableRecordSection
                        id="list-table"
                        charts={charts?.filter(
                          (item) => item?.type?.toLowerCase() === 'table'
                        )}
                        tableName={'Table'}
                        checkedDashItem={checkedDashItem}
                        setCheckedDashItem={setCheckedDashItem}
                        data={data}
                        currentItem={currentItem}
                        setCurrentItem={setCurrentItem}
                        setUncheck={setUncheck}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <div
                  className="flex flex-col gap-2 border p-2"
                  style={{
                    width: '100%',
                    // overflowY: 'scroll',
                    borderRadius: '10px',
                    backgroundColor: COLORS.WHITE
                  }}
                >
                  <CardSection
                    data={data}
                    dashboardName={dashboardName}
                    droppedItemIds={droppedItemIds}
                    setDroppedItemIds={setDroppedItemIds}
                    isDelete={true}
                    setData={setData}
                    setPreviousDashboardItemInfoIds={
                      setPreviousDashboardItemInfoIds
                    }
                    droppedItems={droppedItems}
                    setDroppedItems={setDroppedItems}
                    previousDashboardItemInfoIds={previousDashboardItemInfoIds}
                    checkedDashItem={checkedDashItem}
                    setCheckedDashItem={setCheckedDashItem}
                    currentItem={currentItem}
                    handleSaveClick={handleSaveClick}
                    setLoadingCard={setLoadingCard}
                    loadingCard={loadingCard}
                    uncheck={uncheck}
                    setUncheck={setUncheck}
                    type="card"
                  />
                  <ChartSection
                    idForChart={idForChart}
                    data={data}
                    dashboardName={dashboardName}
                    droppedItemIds={droppedItemIds}
                    setDroppedItemIds={setDroppedItemIds}
                    isDelete={true}
                    setData={setData}
                    chartDatas={chartDatas}
                    setChartDatas={setChartDatas}
                    setPreviousDashboardItemInfoIds={
                      setPreviousDashboardItemInfoIds
                    }
                    droppedItems={droppedItems}
                    setDroppedItems={setDroppedItems}
                    previousDashboardItemInfoIds={previousDashboardItemInfoIds}
                    checkedDashItem={checkedDashItem}
                    setCheckedDashItem={setCheckedDashItem}
                    currentItem={currentItem}
                    handleSaveClick={handleSaveClick}
                    setLoadingChart={setLoadingChart}
                    loadingChart={loadingChart}
                    uncheck={uncheck}
                    setUncheck={setUncheck}
                    setPrevLoading={setPrevLoading}
                    deleteChart={deleteChart}
                  />
                  <ListSection
                    data={data}
                    dashboardName={dashboardName}
                    droppedItemIds={droppedItemIds}
                    setDroppedItemIds={setDroppedItemIds}
                    isDelete={true}
                    setData={setData}
                    setPreviousDashboardItemInfoIds={
                      setPreviousDashboardItemInfoIds
                    }
                    droppedItems={droppedItems}
                    setDroppedItems={setDroppedItems}
                    previousDashboardItemInfoIds={previousDashboardItemInfoIds}
                    checkedDashItem={checkedDashItem}
                    setCheckedDashItem={setCheckedDashItem}
                    currentItem={currentItem}
                    handleSaveClick={handleSaveClick}
                    setLoadingTableList={setLoadingTableList}
                    loadingTableList={loadingTableList}
                    uncheck={uncheck}
                    setUncheck={setUncheck}
                    type="table"
                  />
                </div>
              </div>
              <div className="flex justify-center py-2">
                <Button onClick={() => handleSaveClick()} className="font-bold">
                  Save
                </Button>
              </div>
            </div>
          </DndProvider>
        </div>
      ) : (
        <div
          className="flex items-center justify-center"
          style={{ height: '80vh' }}
        >
          <CircularProgress fontSize="large" color="inherit" />
        </div>
      )}
    </>
  );
};

export default CreateDashboard;
