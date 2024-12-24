import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Add } from '@mui/icons-material';
import { FormLabel, Grid, Typography } from '@mui/material';

import { colors, COLORS } from '../../../common/constants/styles';
import {
  MODAL,
  initialState,
  reducer
} from '../../../common/utils/modal-toggle';
import { Button } from '@/componentss/ui/button';
import {
  createChart,
  deleteChart,
  fetchCharts,
  updateChart
} from '../../../redux/slices/dashboardSlice';
import ConfirmationModal from '../../shared/ConfirmationModal';
import ChartList from '../ChartList';
import ChartModal from './ChartModal';
import ListView from '../../shared/ListView';
import ListTable from './ConfigListTable';
import MainCard from '../../../elements/MainCard';
import { Plus } from 'lucide-react';
import { Separator } from '@/componentss/ui/separator';

const Config = () => {
  const dispatch = useDispatch();
  const { charts } = useSelector((state) => state.dashboard);
  const [state, emit] = useReducer(reducer, initialState);
  const [selectedChartId, setSelectedChartId] = useState();
  const { currentModule } = useSelector((state) => state.current);
  const { currentTheme } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentModule && currentModule?.moduleInfoId) {
      dispatch(fetchCharts({ moduleInfoId: currentModule?.moduleInfoId }));
    }
  }, [currentModule]);

  const chartSubmitHandler = async (chart) => {
    if (!chart) return;
    if (state.type === MODAL.create) {
      dispatch(createChart({ data: chart }));
    } else if (state.type === MODAL.edit) {
      try {
        await dispatch(
          updateChart({
            dashboardItemInfoId: selectedChartId,
            data: chart
          })
        ).unwrap();
        dispatch(fetchCharts({ moduleInfoId: currentModule.moduleInfoId }));
      } catch (error) {
        console.error('Error updating chart:', error);
      }
    }
    chartModalChartHandler(MODAL.cancel);
  };

  const deleteChartHandler = () => {
    dispatch(deleteChart({ dashboardItemInfoId: selectedChartId }));
    chartModalChartHandler(MODAL.cancel);
  };

  const chartModalChartHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;
      case MODAL.edit:
        let chartEdit = charts?.find((c) => c.dashboardItemInfoId === id);
        let newJson = { ...chartEdit };
        if (typeof newJson.options === 'string') {
          newJson.options = JSON.parse(newJson.options);
        }
        emit({ type: MODAL.edit, data: newJson });
        setSelectedChartId(id);
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedChartId(id);
        break;
      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      default:
        console.log('chartModalChartHandler');
    }
  };
  const headers = [
    { headerName: 'Sr no', field: 'srNo', sortable: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'FormName', field: 'formName', sortable: true, filter: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true }
  ];
  return (
    <>
      <div
        className={`w-full p-4 ${
          currentTheme === 'Dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Card Header */}
        <div className="mb-4 flex items-center justify-between">
          {/* Title */}
          <h2
            className={`text-lg font-semibold ${
              currentTheme === 'Dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Dashboard Items
          </h2>
          {/* Add Chart Button */}
          <Button
            onClick={() => chartModalChartHandler(MODAL.create)}
            className="font-bold"
          >
            <Plus size={16} strokeWidth={3} />
            Add Config
          </Button>
        </div>
        <Separator className="h-1" />
        {/* Chart List */}
        <ChartList
          items={charts?.map((chart, index) => ({
            ...chart,
            srNo: index + 1,
            id: chart.dashboardItemInfoId
          }))}
          headers={headers}
          onChartClick={chartModalChartHandler}
        />
      </div>

      {state.show &&
        (state.type === MODAL.create || state.type === MODAL.edit) && (
          <ChartModal
            items={charts?.map((chart) => {
              return {
                ...chart,
                id: chart.dashboardItemInfoId
              };
            })}
            state={state}
            onChartClick={chartModalChartHandler}
            onConfirm={chartSubmitHandler}
            onCancel={() => chartModalChartHandler(MODAL.cancel)}
          />
        )}
      {state.show && state.type === MODAL.delete && (
        <ConfirmationModal
          open={state.show}
          heading={`Are you sure you want to delete this chart?`}
          onConfirm={deleteChartHandler}
          onCancel={() => chartModalChartHandler(MODAL.cancel)}
          firstButtonText="Delete"
        />
      )}
    </>
  );
};

export default Config;
