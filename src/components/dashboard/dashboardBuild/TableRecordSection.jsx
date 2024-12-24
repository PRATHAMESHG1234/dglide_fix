import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCharts } from '../../../redux/slices/dashboardSlice';
import { useDrag } from 'react-dnd';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/componentss/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';
import { Checkbox } from '@/componentss/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';
import { COLORS, colors } from '../../../common/constants/styles';
import { CircularProgress } from '@mui/material';
import { ScrollArea } from '@/componentss/ui/scroll-area';

const ODD_OPACITY = 0.9;

function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ChartItem = ({ chart }) => {
  const chartType = chart?.options[0]?.defaultChartType
    ? capitalizeFirstLetter(chart.options[0].defaultChartType) + ' Chart'
    : capitalizeFirstLetter(chart.type);

  const [{ isDragging }, drag] = useDrag({
    type: 'CHART',
    item: { chart },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      {chartType}
    </div>
  );
};

const TableRecordSection = ({
  id,
  charts,
  tableName,
  checkedDashItem,
  setCheckedDashItem,
  data,
  currentItem,
  setCurrentItem,
  chartDatas = [],
  setUncheck
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { currentModule } = useSelector((state) => state.current);
  const [checkedItemsSet, setCheckedItemsSet] = useState(new Set());

  console.log(chartDatas, 'tablename');
  const count =
    tableName === 'Card'
      ? data?.items?.filter(
          (item) => item.type.toLowerCase() === 'card' && item.result !== null
        ).length
      : tableName?.toLowerCase() === 'chart'
        ? chartDatas?.filter((item) => item.type === 'chart')?.length
        : tableName === 'Table'
          ? data?.items?.filter(
              (item) =>
                item.type.toLowerCase() === 'table' && item.result !== null
            ).length +
            data?.items?.filter(
              (item) =>
                item.type.toLowerCase() === 'list' && item.result !== null
            ).length
          : 0;

  useEffect(() => {
    if (currentModule?.moduleInfoId) {
      dispatch(fetchCharts({ moduleInfoId: currentModule.moduleInfoId }));
    }
  }, [currentModule, dispatch]);

  useEffect(() => {
    if (data?.items?.length > 0) {
      setCheckedDashItem(data.items);
      const makeCheckedItemsSet = new Set(
        data.items.map((item) => item.dashboardItemInfoId)
      );
      setCheckedItemsSet(makeCheckedItemsSet);
    }
    setLoading(false);
  }, [data?.items, setCheckedDashItem]);

  const handleCheckboxChange = (tableName, item, index) => () => {
    setCheckedDashItem((prev) => {
      const itemAlreadyChecked = prev.some((checkedItem) => {
        return checkedItem.dashboardItemInfoId === item.dashboardItemInfoId;
      });

      const newCheckedDashItem = itemAlreadyChecked
        ? prev.filter(
            (checkedItem) =>
              checkedItem.dashboardItemInfoId !== item.dashboardItemInfoId
          )
        : [...prev, { ...item, tableName, index }];

      const newCheckedItemsSet = new Set(
        newCheckedDashItem.map((checkedItem) => checkedItem.dashboardItemInfoId)
      );
      setCheckedItemsSet(newCheckedItemsSet);

      // Set currentItem if item is checked, else clear it
      if (!itemAlreadyChecked) {
        setCurrentItem(item);
        setUncheck(false);
      } else {
        setCurrentItem(null);
        if (currentItem && currentItem.type === 'chart') {
          setCurrentItem(null);
        }
        setUncheck(true);
      }

      return newCheckedDashItem;
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}
      >
        <CircularProgress color="secondary" />
      </div>
    );
  }

  const headers = ['Status', 'Sr No', 'Name', 'Type'];

  const filteredCharts = charts?.filter((item) => {
    const optionsArray = item?.options;

    if (Array.isArray(optionsArray)) {
      return optionsArray.some(
        (option) => option?.defaultChartType !== 'stack bar'
      );
    }

    return false;
  });

  return (
    <div className="rounded-lg bg-white py-2 shadow-lg">
      <div className="flex h-10 items-center justify-between border-b px-2">
        <div className="flex items-center text-base font-medium text-gray-900">
          {tableName}{' '}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-2 inline-flex items-center rounded-sm bg-blue-100 px-2 py-1 text-xs font-medium text-secondary">
                  {count}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>selected {count}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Table>
        <TableHeader className="w-full">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className="bg-chart-3 text-white">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <ScrollArea className="h-[calc(100vh-700px)] overflow-auto">
          <TableBody>
            {filteredCharts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} className="text-center">
                  No {tableName} config available
                </TableCell>
              </TableRow>
            ) : (
              filteredCharts?.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="p-2">
                    <Checkbox
                      checked={checkedItemsSet.has(item.dashboardItemInfoId)}
                      onCheckedChange={handleCheckboxChange(
                        tableName,
                        item,
                        index
                      )}
                    />
                  </TableCell>
                  <TableCell className="p-2 text-sm font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-2 text-sm font-medium">
                    {item.name ? item.name : item.formDisplayName}
                  </TableCell>
                  <TableCell className="p-2 text-sm font-medium">
                    <ChartItem chart={item} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
};

export default TableRecordSection;
