/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { COLORS } from '../../../common/constants/styles';
import { fetchConfigDetail } from '../../../services/chart';
import { buildList } from '../ChartJson';
import TableCard from '../TableCard';

const ListSection = ({
  droppedItemIds,
  setDroppedItemIds,
  data,
  isDelete,
  setData,
  setPreviousDashboardItemInfoIds,
  droppedItems,
  setDroppedItems,
  previousDashboardItemInfoIds,
  checkedDashItem,
  setCheckedDashItem,
  currentItem,
  handleSaveClick,
  loadingTableList,
  setLoadingTableList,
  uncheck,
  setUncheck,
  type
}) => {
  const [listData, setListData] = useState();

  useEffect(() => {
    if (data?.items?.length > 0) {
      const filteredListItems = data?.items.filter(
        (item) => item.type === 'list'
      );
      if (filteredListItems?.length > 0) {
        let readyData = { ...filteredListItems[0] };
        readyData['options'] =
          typeof readyData['options'] === 'string'
            ? JSON.parse(readyData['options'])
            : readyData['options'];
        let selectedItemChartJson = buildList(readyData);
        setListData(selectedItemChartJson);
      }
    }
  }, [data]);

  useEffect(() => {
    if (currentItem || uncheck) {
      if (
        currentItem &&
        (currentItem.type.toLowerCase() === 'table' ||
          currentItem.type.toLowerCase() === 'list')
      ) {
        setLoadingTableList(true);
        getTableListData(currentItem?.dashboardItemInfoId);
      }
      if (uncheck && type === 'table') {
        setPreviousDashboardItemInfoIds(
          checkedDashItem.map((item) => item?.dashboardItemInfoId)
        );
        setUncheck(false);
      }
    }
  }, [currentItem, uncheck]);

  // const [droppedItems, setDroppedItems] = useState([]);
  const dispatch = useDispatch();

  const removeChart = (indexToRemove) => {
    setData((prevData) => ({
      ...prevData,
      items: prevData.items.filter(
        (_, i) => _.dashboardItemInfoId !== indexToRemove
      )
    }));
    setPreviousDashboardItemInfoIds((prevItemIds) =>
      prevItemIds.filter((id) => id !== indexToRemove)
    );
  };

  async function getTableListData(ids) {
    const result = await fetchConfigDetail(ids);

    const id = new Date().getTime();
    let data;
    if (result.type === 'table') {
      data = result;
    } else if (result.type === 'list') {
      data = buildList(result);
    }

    if (data) {
      if (!previousDashboardItemInfoIds.includes(result.dashboardItemInfoId)) {
        setData((prevItems) => ({
          ...prevItems,
          items: [
            ...prevItems.items,
            {
              dashboardItemInfoId: result?.dashboardItemInfoId,
              formDisplayName: result?.formDisplayName,
              id: id,
              type: result?.type,
              data: result?.result,
              result: result?.result,
              name: result?.name
            }
          ]
        }));
        setPreviousDashboardItemInfoIds((prevIds) => [
          ...prevIds,
          result.dashboardItemInfoId
        ]);
      } else {
      }
    }
  }

  return (
    <div>
      <div
        // ref={drop}
        className="flex flex-col items-center justify-center gap-2"
        style={{
          height: 'auto',
          minHeight: '300px',
          border: `2px dashed ${COLORS.GRAYSCALE}`,
          padding: '10px',
          borderRadius: '10px'
        }}
      >
        {' '}
        <TableCard data={data} isDelete={isDelete} removeChart={removeChart} />
      </div>
    </div>
  );
};

export default ListSection;
