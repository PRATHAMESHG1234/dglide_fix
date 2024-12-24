import React from 'react';
import { Box } from '@mui/material';
import UserCountCard from '../../../elements/UserCountCard';
import ChartCard from '../ChartCard';
import TableCard from '../TableCard';

const ConfigItemDisplay = ({
  configItem,
  chartData,
  selectedItemData,
  cardLabel,
  capitalizeWords,
  getColorByIndex,
  getIconByIndex
}) => {
  return (
    <Box>
      {configItem && configItem?.type?.toLowerCase() === 'chart' && (
        <div
          className=""
          style={{
            height: '392px',

            position: 'relative',
            padding: '15px',
            borderLeft: '1px solid lightgray'
          }}
        >
          <h2 id="modal-modal-title"></h2>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {console.log(chartData, 'chartData')}
            {chartData
              ?.filter(
                (item) =>
                  item?.type !== 'card' &&
                  item.type !== 'List' &&
                  item.type != 'Table'
              )
              ?.map((item, index) => {
                return (
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
        </div>
      )}

      {configItem && configItem?.type?.toLowerCase() === 'card' && (
        <div
          className=""
          style={{
            height: '392px',
            width: '600px',
            position: 'relative',
            padding: '15px',
            borderLeft: '1px solid lightgray'
          }}
        >
          <h2 id="modal-modal-title"></h2>

          <div className="flex items-center justify-start">
            <div className="w-96">
              <div>
                <div className="relative mx-2 flex-grow cursor-pointer rounded-lg border bg-white">
                  <UserCountCard
                    primary={cardLabel}
                    secondary={configItem?.result?.[0]?.totalCount}
                    iconPrimary={getIconByIndex(
                      configItem?.dashboardItemInfoId
                    )}
                    color={getColorByIndex(configItem?.dashboardItemInfoId)}
                    index={configItem?.dashboardItemInfoId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {configItem && configItem?.type?.toLowerCase() === 'table' && (
        <TableCard data={[configItem]} isDelete={false} />
      )}
    </Box>
  );
};

export default ConfigItemDisplay;
