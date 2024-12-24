import React, { useEffect, useState } from 'react';
import './DashboardPreview.css';

import { buildList } from './ChartJson';
import { colors } from '../../common/constants/styles';
import { useDispatch, useSelector } from 'react-redux';
import UserCountCard from '../../elements/UserCountCard';
import { DollarSign } from 'lucide-react';
import { UserCircle } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Bank } from 'lucide-react';
import { useSidebar } from '@/componentss/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import ChartCard from './ChartCard';
import TableCard from './TableCard';

const DashboardPreview = ({
  data,
  isDelete,
  setData,
  setPreviousDashboardItemInfoIds,
  setDroppedItemId,
  chartData
}) => {
  const [listData, setListData] = useState();
  const chartConfig = {
    value: {
      label: 'Value',
      color: 'hsl(var(--chart-1))'
    },
    label: {
      color: 'hsl(var(--background))'
    }
  };
  console.log(chartData, 'chart data');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentModule, selectedRecordId } = useSelector(
    (state) => state.current
  );

  const [currentCondition, setCurrentCondition] = useState([]);
  const [sort, setSort] = useState([]);

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

  const removeChart = (itemId, type, index) => {
    let indexOfItemToRemove;

    setData((prevItems) => {
      if (!prevItems || !prevItems.items || !Array.isArray(prevItems.items)) {
        return prevItems;
      }
      const updatedItems = prevItems.items.filter((item) => item.type === type);
      let updatedItemsAfterRemoval = prevItems.items;

      if (updatedItems.length > 1) {
        const itemToRemove = updatedItems[index];
        indexOfItemToRemove = prevItems.items.indexOf(itemToRemove);
        updatedItemsAfterRemoval = prevItems.items.filter(
          (item) => item !== itemToRemove
        );
      } else {
        updatedItemsAfterRemoval = prevItems.items.filter(
          (item) => item.dashboardItemInfoId !== itemId
        );
      }
      return {
        ...prevItems,
        items: updatedItemsAfterRemoval
      };
    });

    setPreviousDashboardItemInfoIds((prevItemIds) => {
      if (indexOfItemToRemove) {
        const updatedItemIds = [...prevItemIds];
        updatedItemIds.splice(indexOfItemToRemove, 1);
        return updatedItemIds;
      } else {
        const updatedItemIds = prevItemIds.filter((id) => id !== itemId);
        return updatedItemIds;
      }
    });
  };
  const icons = [
    AccountCircleTwoTone,
    DescriptionTwoToneIcon,
    MonetizationOnTwoToneIcon,
    AccountBalanceRoundedIcon
  ];

  const color = [colors.primary.main];
  const getIconByIndex = (index) => {
    return icons[index % icons.length];
  };
  const getColorByIndex = (index) => {
    return color[index % color.length];
  };
  const currentForm = data?.items?.[0]?.formName;
  useEffect(() => {
    if (currentCondition.length > 0) {
      navigate(`/app/${currentModule?.name}/${currentForm}`, {
        state: { data: currentCondition?.[0]?.where }
      });
    }
  }, [currentCondition]);
  const redirect = (item) => {
    setCurrentCondition(JSON.parse(item?.options));
  };

  const isDesktop = window.innerWidth > 1440;
  const isLaptop = window.innerWidth >= 1024 && window.innerWidth <= 1440;
  const { open } = useSidebar();
  return (
    <div className="flex w-full flex-col">
      <div className={`flex w-full flex-col justify-between gap-3 py-2 pl-4`}>
        <div className="flex w-full flex-wrap gap-2">
          {data?.items?.length > 0 &&
            data?.items
              .filter((item) => item.type === 'card')
              ?.map((item, index) => (
                <span
                  key={index}
                  className={`relative ${isLaptop && open ? 'max-w-[23.5rem]' : isLaptop && !open ? 'max-w-[28rem]' : 'max-w-[25rem]'} `}
                >
                  <div>
                    {item.result &&
                      item.result.map((resultItem, resultIndex) => (
                        <div
                          key={resultIndex}
                          className="relative flex-grow cursor-pointer rounded-lg border bg-white"
                        >
                          <UserCountCard
                            primary={
                              item.options
                                ? JSON?.parse(item?.options)?.[0]?.cardname
                                : item?.formName
                            }
                            secondary={resultItem?.totalCount}
                            iconPrimary={getIconByIndex(
                              item?.dashboardItemInfoId
                            )}
                            color={getColorByIndex(item?.dashboardItemInfoId)}
                            sx={{}}
                            onClick={() => redirect(item)}
                            index={item?.dashboardItemInfoId}
                          />
                        </div>
                      ))}
                  </div>
                </span>
              ))}
        </div>

        <div className="flex w-full justify-start gap-x-2">
          {console.log(
            chartData?.filter(
              (item) =>
                item?.type.toLowerCase() !== 'card' &&
                item.type.toLowerCase() !== 'list' &&
                item.type.toLowerCase() !== 'table'
            ),
            'chartdata'
          )}
          {chartData
            ?.filter(
              (item) =>
                item?.type.toLowerCase() !== 'card' &&
                item.type.toLowerCase() !== 'list' &&
                item.type.toLowerCase() !== 'table'
            )
            ?.map((item, index) => {
              console.log(JSON.parse(item?.options), 'type');
              return (
                // <></>
                <ChartCard
                  type={JSON.parse(item?.options)?.[0]?.defaultChartType}
                  config={item?.chartConfig}
                  data={item?.chartData}
                  title={JSON.parse(item?.options)?.[0]?.cardname || ''}
                  description={`${JSON.parse(item?.options)?.[0]?.defaultChartType} chart`}
                  footerText="Trending up by 5.2% this month"
                  footerSubText="Showing total visitors for the last 6 months"
                  totalVisitors={
                    item?.chartData?.reduce(
                      (total, val) => total + parseInt(val.value, 10),
                      0
                    ) || 1234
                  }
                  formName={'ticket'}
                  key={index}
                />
              );
            })}
        </div>

        <TableCard data={data} isDelete={isDelete} removeChart={removeChart} />
      </div>
    </div>
  );
};

export default DashboardPreview;
