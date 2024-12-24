import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// import 'rsuite/dist/rsuite.min.css';
import { fetchRecordsBytableName } from '../../services/table';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parse, format } from 'date-fns';
import { notify } from '../../hooks/toastUtils';
import { Input } from '@/componentss/ui/input';
import { MultiSelect } from '@/componentss/ui/multi-select';

export const AddEditHolidays = ({ fieldData, onSubmit, formId, newRecord }) => {
  const [shiftList, setShiftList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [shiftHolidatArr, setShiftHolidatArr] = useState([]);
  const [holidayList, setHolidayList] = useState({
    uuid: null,
    shift_name: '',
    holiday_name: '',
    date: null
  });

  const dispatch = useDispatch();

  useEffect(() => {
    fetchRecordsBytableName('system_shift').then((data) => {
      let fetchedFormData = data?.data;
      let shiftArr = [];

      fetchedFormData.forEach((elem) => {
        if (!shiftArr.some((item) => item.name === elem.name)) {
          shiftArr.push(elem);
        }
        setShiftList(shiftArr);
      });
    });
  }, []);

  useEffect(() => {
    if (fieldData) {
      const newObj = {
        uuid: fieldData.uuid,
        shift_name: fieldData.shift_name,
        holiday_name: fieldData.holiday_name,
        date: fieldData.date
      };
      setHolidayList(newObj);
    }
  }, [fieldData]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedItems(value);
    value.forEach((o) => {
      if (!shiftHolidatArr.some((ele) => ele.shift_name === o)) {
        const obj = {
          shift_name: o,
          holiday_name: holidayList?.holiday_name,
          date: holidayList?.date
        };
        setShiftHolidatArr((prevHolidayList) => [...prevHolidayList, obj]);
      }
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!newRecord) {
      const HolidayArr = [holidayList];
      setShiftHolidatArr((prevHolidayList) => [
        ...prevHolidayList,
        holidayList
      ]);
      HolidayArr.forEach((data) => {
        onSubmit(data);
      });
    } else {
      if (!holidayList.holiday_name || !holidayList.date) {
        notify.success('All fields are required .');
      } else if (newRecord && shiftHolidatArr.length < 1) {
        notify.error('All fields are required .');
      } else {
        shiftHolidatArr.forEach((data) => {
          onSubmit(data);
        });
      }
    }
  };
  const onHandleChange = (value, field, obj) => {
    const copyOfObj = { ...obj };
    copyOfObj[field] = value;
    setHolidayList(copyOfObj);
  };

  return (
    <form id={formId} onSubmit={submitHandler} style={{ marginTop: '40px' }}>
      <div className="my-3">
        <div className="">
          <div className="">
            <Input
              label="Holiday Name"
              variant="outlined"
              name="holiday_name"
              type="text"
              className="mb-4"
              value={holidayList.holiday_name}
              onChange={(e) =>
                onHandleChange(e.target.value, 'holiday_name', holidayList)
              }
            />

            <Input
              label="Date"
              id="date"
              type="date"
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={
                holidayList.date
                  ? format(
                      parse(holidayList.date, 'dd-MM-yyyy', new Date()),
                      'yyyy-MM-dd'
                    )
                  : ''
              }
              onChange={(e) => {
                const newValue = e.target.value; // ISO date format (YYYY-MM-DD)
                const formattedDate = format(new Date(newValue), 'dd-MM-yyyy'); // Reformat to "dd-MM-yyyy"
                onHandleChange(formattedDate, 'date', holidayList);
              }}
            />
            {newRecord ? (
              <MultiSelect
                id={`multiSelect-shift"`}
                label="Select shift"
                name="shift_name"
                selectedValues={selectedItems}
                onChange={handleChange}
                options={shiftList.map((shift) => ({
                  label: shift.name,
                  value: shift.uuid
                }))}
              />
            ) : (
              <Input
                label="Shift Name"
                variant="outlined"
                name="shift_name"
                disabled
                type="text"
                value={holidayList.shift_name}
                sx={{
                  maxWidth: '550px',
                  marginX: '12px'
                }}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddEditHolidays;
