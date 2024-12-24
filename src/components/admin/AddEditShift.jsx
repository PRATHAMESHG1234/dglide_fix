import {
  FormControlLabel,
  IconButton,
  Switch,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import './addEditShift.css';
import { useDispatch } from 'react-redux';
import { colors } from '../../common/constants/styles';
import { DateRangePicker } from 'rsuite';
// import 'rsuite/dist/rsuite.min.css';
import { FaClock } from 'react-icons/fa';
import TextField from '../../elements/TextField';
import moment from 'moment';
import { Plus, PlusCircle } from 'lucide-react';
import { notify } from '../../hooks/toastUtils';

const dayMapping = {
  Monday: '1',
  Tuesday: '2',
  Wednesday: '3',
  Thursday: '4',
  Friday: '5',
  Saturday: '6',
  Sunday: '7'
};

const initialShiftData = Array.from({ length: 7 }, (_, i) => ({
  name: 'null',
  slot_1_start: null,
  slot_1_end: null,
  day: Object.keys(dayMapping)[i],
  ison: '1'
}));

const daysOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const AddEditShift = ({ fieldData, onSubmit, formId, newRecord }) => {
  const [shiftData, setShiftData] = useState({});
  const [shiftArry, setShiftArry] = useState([]);

  const dispatch = useDispatch();
  const transformData = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = [];
      }
      acc[item.name].push(item);
      return acc;
    }, {});
  };
  useEffect(() => {
    let transformedData =
      fieldData?.reduce((acc, item) => {
        (acc[item.name] = acc[item.name] || []).push(item);
        return acc;
      }, {}) || transformData(initialShiftData);
    setShiftData((prevData) => {
      const updatedData = { ...transformedData };
      const key = Object.keys(updatedData)[0]; // Assuming only one key (e.g., 's1')

      const keysToCheck = [
        'slot_2_start',
        'slot_2_end',
        'slot_3_start',
        'slot_3_end'
      ];

      updatedData[key] = updatedData[key]
        .map((item) => {
          // Remove keys with null values
          keysToCheck.forEach((key) => {
            if (item[key] === null) {
              delete item[key];
            }
          });
          ///update ison value///////
          return item.ison
            ? {
                ...item,
                ison: item?.ison === 'True' || item.ison === '1' ? '1' : '2'
              }
            : item;
        })
        .sort((a, b) => {
          return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
        });
      return updatedData;
    });
  }, [fieldData]);

  const handleChangeTime = (value, field, obj) => {
    let newObj = {};
    if (field[0] === 'ison') {
      setShiftData((prevData) => {
        const updatedData = { ...prevData };
        const key = Object.keys(updatedData)[0]; // Assuming only one key (e.g., 's1')
        updatedData[key] = updatedData[key].map((item) =>
          item.day === obj.day
            ? { ...item, [field[0]]: value === true ? '1' : '2' }
            : item
        );
        return updatedData;
      });

      newObj = {
        ...obj,
        day: dayMapping[obj.day],
        uuid: obj?.uuid ? obj?.uuid : null,
        [field[0]]: value === true ? '1' : '2'
      };
    } else {
      const [startField, endField] = field;
      const startUTC = startField ? moment(value[0]).format('HH:mm') : null;
      const endUTC = endField ? moment(value[1]).format('HH:mm') : null;
      const updatedShiftData = { ...shiftData };
      const key = Object.keys(updatedShiftData)[0];

      updatedShiftData[key] = updatedShiftData[key].map((item) => {
        if (item.day === obj.day) {
          // Get existing values for comparison
          const slot1End = item.slot_1_end
            ? moment(item.slot_1_end, 'HH:mm')
            : null;
          const slot2End = item.slot_2_end
            ? moment(item.slot_2_end, 'HH:mm')
            : null;
          const newStartTime = moment(startUTC, 'HH:mm');

          // Check if updating slot_2_start and if it's less than slot_1_end
          if (
            field[0] === 'slot_2_start' &&
            slot1End &&
            newStartTime.isBefore(slot1End)
          ) {
            alert('Slot 2 start time cannot be earlier than Slot 1 end time');
            return item;
          }

          // Check if updating slot_3_start and if it's less than slot_2_end
          if (
            field[0] === 'slot_3_start' &&
            slot2End &&
            newStartTime.isBefore(slot2End)
          ) {
            alert('Slot 3 start time cannot be earlier than Slot 2 end time');
            return item;
          }

          return {
            ...item,
            [field[0]]: startUTC,
            [field[1]]: endUTC
          };
        }
        return item; // Return the unchanged item if it's not the relevant day
      });

      setShiftData(updatedShiftData);
      newObj = {
        ...obj,
        day: dayMapping[obj.day],
        [field[0]]: startUTC,
        [field[1]]: endUTC
      };
    }
    const dayExists = shiftArry.some((item) => item.day === newObj.day);
    if (dayExists) {
      const updatedArry = shiftArry.map((item) =>
        item.day === newObj.day ? newObj : item
      );

      setShiftArry(updatedArry);
    } else {
      setShiftArry([...shiftArry, newObj]);
    }
  };

  const onHandleChange = (e, data) => {
    const newKey = e.target.value;
    setShiftData((prevState) => ({
      [newKey]: data.map((item) => ({ ...item, name: newKey }))
    }));
    if (shiftArry.length > 0) {
      setShiftArry((prevState) => {
        const updatedArray = [...prevState];
        updatedArray.forEach((item) => {
          item.name = newKey;
        });
        return updatedArray;
      });
    }
  };

  const formatTimeRange = (startTime, endTime) => {
    return startTime && endTime
      ? [
          new Date(`1970-01-01T${startTime}Z`),
          new Date(`1970-01-01T${endTime}Z`)
        ]
      : null;
  };

  const subtractFixedTime = (time) => {
    if (typeof time !== 'string') return null;

    const [hours, minutes] = time.split(':').map(Number);
    const subtractHours = 5;
    const subtractMinutes = 30;

    let newHours = hours - subtractHours;
    let newMinutes = minutes - subtractMinutes;

    if (newMinutes < 0) {
      newMinutes += 60;
      newHours -= 1;
    }

    if (newHours < 0) {
      newHours += 24;
    }

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  const addSlotes = (dayObj) => {
    let newSlotStart;
    let newSlotEnd;
    if (dayObj.slot_1_start !== null && dayObj.slot_1_end !== null) {
      if (
        !dayObj.hasOwnProperty('slot_2_start') &&
        !dayObj.hasOwnProperty('slot_2_end')
      ) {
        newSlotStart = 'slot_2_start';
        newSlotEnd = 'slot_2_end';
      } else if (dayObj.slot_2_start !== null && dayObj.slot_2_end !== null) {
        newSlotStart = 'slot_3_start';
        newSlotEnd = 'slot_3_end';
      }
    }
    if (newSlotStart && newSlotEnd) {
      setShiftData((prevData) => {
        const updatedData = { ...prevData };
        const key = Object.keys(updatedData)[0]; // Assuming data structure is correct

        updatedData[key] = updatedData[key].map((item) => {
          if (item.day === dayObj.day) {
            return {
              ...item,
              [newSlotStart]: null, // Initialize the new slot's start value
              [newSlotEnd]: null // Initialize the new slot's end value
            };
          }
          return item;
        });

        return updatedData;
      });
    }
  };

  const submitHandler = (e) => {
    let submitArr = [];
    let hasErrors = false;
    e.preventDefault();
    if (shiftArry.length < 7 && newRecord) {
      notify.error('Please fill all day data');
    } else if (shiftArry.length < 1) {
      const data = Object.values(shiftData).flat();
      submitArr = data.map((elem) => {
        return {
          ...elem,
          day: dayMapping[elem.day] // Update the 'day' key using dayMapping function
        };
      });
    } else {
      shiftArry.forEach((data) => {
        if (data.ison === '1') {
          if (data.slot_1_start === null || data.slot_1_end === null) {
            hasErrors = true;
          }
        }
      });
      submitArr = [...shiftArry];
    }
    if (hasErrors) {
      notify.error(
        'All time fields are required when "Is Working Day" is true.'
      );
    } else {
      e.preventDefault();

      submitArr.forEach((data) => {
        onSubmit(data);
      });
    }
  };

  return (
    <form id={formId} onSubmit={submitHandler}>
      <div className="mt-4">
        {Object.keys(shiftData)?.map((key, index) => (
          <div key={index}>
            {newRecord ? (
              <TextField
                labelname="Shift Name"
                variant="outlined"
                name="shiftName"
                type="text"
                required
                value={key === 'null' ? '' : key}
                onChange={(e) => onHandleChange(e, shiftData[key])}
                sx={{
                  maxWidth: '550px'
                }}
              />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: '500' }}>
                {key}
              </Typography>
            )}
            <table className="flex flex-col gap-1" style={{ width: '600px' }}>
              {shiftData[key].map((dayObj, subIndex) => (
                <tr key={subIndex}>
                  {/* Working Day Switch */}
                  <td>
                    <FormControlLabel
                      name="ison"
                      control={
                        <Switch
                          checked={
                            dayObj.ison === '1' ||
                            dayObj.ison === 'Yes' ||
                            dayObj.ison === true
                          }
                          sx={{
                            color: colors.secondary.main,
                            '& .Mui-checked': {
                              color: `${colors.secondary.main} !important`
                            },
                            '& .Mui-checked+.MuiSwitch-track': {
                              bgcolor: `${colors.secondary.main} !important`
                            }
                          }}
                          size="medium"
                        />
                      }
                      onChange={(e) =>
                        handleChangeTime(
                          e.target.checked,
                          ['ison'],
                          dayObj,
                          null
                        )
                      }
                    />
                  </td>

                  {/* Day Name */}
                  <td>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '0.875rem',
                        width: '85px'
                      }}
                    >
                      {dayObj.day}
                    </Typography>
                  </td>
                  <td style={{ width: '200px', paddingRight: '10px' }}>
                    <DateRangePicker
                      format="HH:mm"
                      caretAs={FaClock}
                      value={formatTimeRange(
                        subtractFixedTime(dayObj.slot_1_start),
                        subtractFixedTime(dayObj.slot_1_end)
                      )}
                      onChange={(value) =>
                        handleChangeTime(
                          value,
                          ['slot_1_start', 'slot_1_end'],
                          dayObj
                        )
                      }
                      placeholder="Shift Time Range"
                      showMeridian={false}
                      disabled={dayObj.ison === '2' || dayObj.ison === false}
                      style={{ zIndex: 1300, position: 'relative' }}
                    />
                  </td>
                  {/* Slot 2: Only Render if slot_2_start and slot_2_end exist */}
                  {dayObj.hasOwnProperty('slot_2_start') &&
                    dayObj.hasOwnProperty('slot_2_end') && (
                      <React.Fragment>
                        <td style={{ width: '200px', paddingRight: '10px' }}>
                          <DateRangePicker
                            format="HH:mm"
                            caretAs={FaClock}
                            value={formatTimeRange(
                              subtractFixedTime(dayObj.slot_2_start),
                              subtractFixedTime(dayObj.slot_2_end)
                            )}
                            onChange={(value) =>
                              handleChangeTime(
                                value,
                                ['slot_2_start', 'slot_2_end'],
                                dayObj,
                                null
                              )
                            }
                            placeholder="Shift Time Range"
                            showMeridian={false}
                            disabled={
                              dayObj.ison === '2' || dayObj.ison === false
                            }
                            style={{ zIndex: 1300, position: 'relative' }}
                          />
                        </td>
                      </React.Fragment>
                    )}

                  {/* Slot 3: Only Render if slot_3_start and slot_3_end exist */}
                  {dayObj.hasOwnProperty('slot_3_start') &&
                    dayObj.hasOwnProperty('slot_3_end') && (
                      <React.Fragment>
                        <td style={{ width: '200px', paddingRight: '10px' }}>
                          <DateRangePicker
                            format="HH:mm"
                            caretAs={FaClock}
                            value={formatTimeRange(
                              subtractFixedTime(dayObj.slot_3_start),
                              subtractFixedTime(dayObj.slot_3_end)
                            )}
                            onChange={(value) =>
                              handleChangeTime(
                                value,
                                ['slot_3_start', 'slot_3_end'],
                                dayObj,
                                null
                              )
                            }
                            placeholder="Shift Time Range"
                            showMeridian={false}
                            disabled={
                              dayObj.ison === '2' || dayObj.ison === false
                            }
                            style={{ zIndex: 1300, position: 'relative' }}
                          />
                        </td>
                      </React.Fragment>
                    )}

                  {/* Add Slot Button */}
                  <td>
                    <IconButton
                      className="mx-1 my-2"
                      sx={{
                        padding: '0px',
                        backgroundColor: colors.primary[200],
                        '&:hover': {
                          backgroundColor: colors.primary.dark
                        }
                      }}
                      onClick={() => addSlotes(dayObj, subIndex)} // Adding a new slot
                    >
                      <PlusCircle
                        sx={{
                          fontSize: '25px',
                          color: colors.primary.main,
                          '&:hover': {
                            color: colors.white
                          }
                        }}
                      />
                    </IconButton>
                  </td>
                </tr>
              ))}

              {/* {shiftData[key].map((dayObj, subIndex) => (
                <tr key={subIndex}>
                  <td>
                    <FormControlLabel
                      name="ison"
                      control={
                        <Switch
                          checked={
                            dayObj.ison === '1' ||
                            dayObj.ison === 'Yes' ||
                            dayObj.ison === true
                          }
                          sx={{
                            color: colors.secondary.main,
                            '& .Mui-checked': {
                              color: `${colors.secondary.main} !important`
                            },
                            '& .Mui-checked+.MuiSwitch-track': {
                              bgcolor: `${colors.secondary.main} !important`
                            }
                          }}
                          size="medium"
                        />
                      }
                      onChange={(e) =>
                        handleChangeTime(
                          e.target.checked,
                          ['ison'],
                          dayObj,
                          null
                        )
                      }
                    />
                  </td>
                  <td>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '0.875rem',
                        width: '85px'
                      }}
                    >
                      {dayObj.day}
                    </Typography>
                  </td>
                 
                      <React.Fragment key={i}>
                        <td style={{ width: '200px', paddingRight: '10px' }}>
                          <DateRangePicker
                            format="HH:mm"
                            caretAs={FaClock}
                            value={
                              slot
                                ? formatTimeRange(
                                    subtractFixedTime(
                                      dayObj[`slot_${i + 1}_start`] || null
                                    ),
                                    subtractFixedTime(
                                      dayObj[`slot_${i + 1}_end`] || null
                                    )
                                  )
                                : null
                            }
                            onChange={(value) =>
                              handleChangeTime(
                                value,
                                [`slot_${i + 1}_start`, `slot_${i + 1}_end`],
                                dayObj,
                                slot
                              )
                            }
                            placeholder="Shift Time Range"
                            showMeridian={false}
                            disabled={
                              dayObj.ison === '2' ||
                              dayObj.ison === false
                            }
                            style={{ zIndex: 1300, position: 'relative' }}
                          />
                        </td>
                        <td>
                          <IconButton
                            className="my-2 mx-1"
                            sx={{
                              padding: '0px',
                              backgroundColor: colors.primary[200],
                              '&:hover': {
                                backgroundColor: colors.primary.dark
                              }
                            }}
                            onClick={() => addSlotes(dayObj, i)} // Ensure this adds one slot
                          >
                            <PlusCircle sx={{
                                fontSize: '25px',
                                color: colors.primary.main,
                                '&:hover': {
                                  color: colors.white
                                }
                              }}
                            />
                          </IconButton>
                        </td>
                      </React.Fragment>
                    
                </tr>
              ))} */}
            </table>
          </div>
        ))}
      </div>
    </form>
  );
};

export default AddEditShift;
