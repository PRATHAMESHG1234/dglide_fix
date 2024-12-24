import React, { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Calendar } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import { colors } from '../../common/constants/styles';
import CustomeDatePicker from './CustomeDatePicker';

const formatDate = (date) => {
  const pad = (number) => number.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const formatDate1 = (type) => {
  const pad = (number) => number.toString().padStart(2, '0');
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  if (type === 'date') {
    return `${year}-${month}-${day}`;
  }
  if (type === 'time') {
    return `${hours}:${minutes}:${seconds}`;
  }
};

const timeOptions = [
  { value: '1h', label: '1h' },
  { value: '3h', label: '3h' },
  { value: '12h', label: '12h' },
  { value: '1d', label: '1d' },
  { value: '1w', label: '1w' },
  {
    value: 'custom',
    label: 'Custom',
    icon: (
      <Calendar sx={{ fontSize: '17px', position: 'absolute', right: 8, top: 13 }}
      />
    )
  },
  { value: 'all', label: '', icon: <RefreshCcw /> }
];

const DataFilterByTimeStamp = ({
  filterObj,
  setFilterObj,
  selectedTime,
  setSelectedTime,
  selectedDashboard,
  handleDashboardChange,
  setWhereDynamicValue
}) => {
  const [dialogueOpen, setDialogueOpen] = useState(null);

  const [fetchData, setFetchData] = useState(false);
  const [currentSelectedTime, setCurrentSelectedTime] = useState(selectedTime);

  const [value, setValue] = useState([
    new Date('2022-02-01 00:00:00'),
    new Date('2022-03-01 23:59:59')
  ]);

  useEffect(() => {
    if (selectedTime && fetchData) {
      fetchDashboardData();
    }
    setFetchData(false);
  }, [selectedTime]);

  const handleTimeChange = (event, newTime) => {
    if (newTime === currentSelectedTime) return;

    setCurrentSelectedTime(newTime);
    setSelectedTime(newTime);
    setFetchData(true);

    if (newTime === 'custom') {
      setDialogueOpen(event.currentTarget);
    } else if (newTime === 'all') {
      handleDashboardChange(selectedDashboard);
      setFilterObj(null);
      setWhereDynamicValue({});
      setDialogueOpen(null);
    } else {
      setDialogueOpen(null);
    }
  };

  const fetchDashboardData = () => {
    if (selectedTime && selectedTime !== 'custom' && selectedTime !== 'all') {
      const endDate = formatDate(new Date());
      const timeMapping = {
        '1h': 1 * 60 * 60 * 1000,
        '3h': 3 * 60 * 60 * 1000,
        '12h': 12 * 60 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000
      };
      const startDate = formatDate(
        new Date(Date.now() - timeMapping[selectedTime])
      );

      if (filterObj?.start !== startDate || filterObj?.end !== endDate) {
        setFilterObj({
          start: startDate,
          end: endDate
        });
      }
    }
  };

  const renderToggleButton = (option) => (
    <ToggleButton
      key={option.value}
      value={option.value}
      sx={{
        minWidth: option.value === 'custom' ? '80px' : '60px',
        position: option.value === 'custom' ? 'relative' : 'initial',
        paddingRight: option.value === 'custom' ? '28px' : 'none',
        backgroundColor:
          currentSelectedTime === option.value
            ? colors.secondary.main
            : colors.secondary.light,
        color:
          currentSelectedTime === option.value ? colors.white : colors.black,
        '&.Mui-selected': {
          backgroundColor: colors.secondary.main,
          color: colors.white
        },
        '&:hover': {
          backgroundColor:
            currentSelectedTime === option.value
              ? colors.orange
              : colors.secondary.light,
          color:
            currentSelectedTime === option.value ? colors.black : colors.black
        }
      }}
    >
      {option.label}
      {option.icon}
    </ToggleButton>
  );

  const open = Boolean(dialogueOpen);

  const handleChangeCustomeDate = (value) => {
    setValue(value);
    const dateObject = {
      start: formatDate(value[0]),
      end: formatDate(value[1])
    };
    setDialogueOpen(null);
    setFilterObj(dateObject);
  };

  return (
    <div
      className="flex flex-col"
      style={{
        height: '50px'
      }}
    >
      <div className="flex justify-end">
        <ToggleButtonGroup
          color="primary"
          value={currentSelectedTime}
          exclusive
          onChange={handleTimeChange}
          aria-label="Time Filter"
        >
          {timeOptions.map(renderToggleButton)}
        </ToggleButtonGroup>
      </div>
      <div
        className="pt-4"
        style={{
          zIndex: 9999,
          width: '100%',
          position: 'absolute',
          top: '0px',
          maxHeight: '1px'
        }}
      >
        {open && (
          <CustomeDatePicker
            value={value}
            handleChangeCustomeDate={handleChangeCustomeDate}
          />
        )}
      </div>
    </div>
  );
};

export default DataFilterByTimeStamp;
