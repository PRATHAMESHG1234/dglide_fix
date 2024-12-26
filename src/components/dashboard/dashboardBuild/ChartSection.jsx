import { useEffect, useState } from 'react';
import { fetchConfigDetail } from '../../../services/chart';

import { Grid, Typography } from '@mui/material';
import { CheckSquare } from 'lucide-react';

import { COLORS, colors } from '../../../common/constants/styles';
import ChartCard from '../ChartCard';

const ChartSection = ({
  idForChart,
  droppedItemIds,
  setDroppedItemIds,
  chartDatas,
  data,
  setChartDatas,
  isDelete,
  setData,
  setPreviousDashboardItemInfoIds,
  droppedItems,
  setDroppedItems,
  previousDashboardItemInfoIds,
  currentItem,
  handleSaveClick,
  setLoadingChart,
  loadingChart,
  uncheck,
  setUncheck,
  checkedDashItem,
  setPrevLoading,
  setCheckedDashItem
}) => {
  const [chartDataList, setChartDataList] = useState([]);
  const [chartInstances, setChartInstances] = useState([]);
  const [chartTypesList, setChartTypesList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (currentItem) {
      if (currentItem?.type.toLowerCase() === 'chart') {
        setLoadingChart(true);
        getChartApi(currentItem.dashboardItemInfoId);
      }
    }

    if (uncheck) {
      const FilterIds = checkedDashItem?.map(
        (item) => item.dashboardItemInfoId
      );

      // Remove items that are in FilterIds
      const ChartRemove = chartDatas.filter((item) =>
        FilterIds.includes(item.dashboardItemInfoId)
      );
      setChartDatas(ChartRemove);

      setUncheck(false);
    }
  }, [currentItem, uncheck]);

  async function getChartApi(id) {
    const result = await fetchConfigDetail(id);
    if (result?.type === 'chart') {
      setChartDatas((prev) => {
        // Ensure no duplicate entries in chartDatas
        const isDuplicate = prev.some(
          (item) => item.dashboardItemInfoId === result.dashboardItemInfoId
        );
        return isDuplicate ? prev : [...prev, result];
      });

      if (!previousDashboardItemInfoIds.includes(result.dashboardItemInfoId)) {
        setPreviousDashboardItemInfoIds((prevIds) => [
          ...prevIds,
          result.dashboardItemInfoId
        ]);
      }
    }
  }
  console.log(checkedDashItem, 'dashitem');

  const deleteChart = (dashboardItemInfoId) => {
    console.log(dashboardItemInfoId, 'called');

    // Filter out the chart from chartDatas based on dashboardItemInfoId
    const newCharts = chartDatas.filter(
      (chart) => chart.dashboardItemInfoId !== dashboardItemInfoId
    );
    setChartDatas(newCharts);
    setCheckedDashItem(newCharts);

    // Remove the corresponding chart from data.items
    const remainingItems = data.items.filter(
      (item) =>
        item.type !== 'chart' ||
        item.dashboardItemInfoId !== dashboardItemInfoId
    );

    // Update previousDashboardItemInfoIds by excluding the deleted chart's ID
    const updatedIds = previousDashboardItemInfoIds?.filter(
      (id) => id !== dashboardItemInfoId
    );
    setPreviousDashboardItemInfoIds(updatedIds);

    // setCheckedDashItem([updatedIds]);

    console.log('Updated chartDatas:', newCharts);
    console.log('Updated items:', remainingItems);
    console.log('Updated IDs:', updatedIds);
  };

  function capitalizeWords(str) {
    if (!str) {
      return '';
    }

    return str
      .split(' ') // Split the string into an array of words
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the array back into a string
  }

  return (
    <div
      className="flex w-full flex-col justify-between gap-3 px-2 py-2"
      style={{
        height: 'auto',
        minHeight: '200px',
        border: `2px dashed ${COLORS.GRAYSCALE}`,
        borderRadius: '10px',
        background: '#eef2f6'
      }}
    >
      <div className="flex w-full justify-start gap-x-2">
        {' '}
        {chartDatas?.length === 0 ? (
          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Typography style={{ color: colors.grey[500], fontSize: '16px' }}>
              Select charts using the{' '}
              <CheckSquare style={{ fontSize: 'inherit' }} /> checkbox.
            </Typography>
          </Grid>
        ) : (
          chartDatas?.length > 0 &&
          chartDatas
            ?.filter(
              (item) =>
                item?.type.toLowerCase() != 'card' &&
                item.type.toLowerCase() != 'list' &&
                item.type.toLowerCase() != 'table'
            )
            ?.map((item, index) => {
              return (
                <ChartCard
                  type={
                    (typeof item?.options === 'string'
                      ? JSON.parse(item?.options)
                      : item?.options)?.[0]?.defaultChartType
                  }
                  onCrossClick={deleteChart}
                  isDelete={true}
                  config={item?.chartConfig}
                  data={item?.chartData}
                  chartData={item}
                  title={
                    (typeof item?.options === 'string'
                      ? JSON.parse(item?.options)
                      : item?.options)?.[0]?.cardname || ''
                  }
                  description={`${(typeof item?.options === 'string' ? JSON.parse(item?.options) : item?.options)?.[0]?.defaultChartType} chart`}
                  footerText="Trending up by 5.2% this month"
                  footerSubText="Showing total visitors for the last 6 months"
                  totalVisitors={
                    item?.chartData?.reduce(
                      (total, val) => total + parseInt(val.value, 10),
                      0
                    ) || 1234
                  }
                  formName="ticket"
                  index={index}
                />
              );
            })
        )}
      </div>
    </div>
  );
};
export default ChartSection;
