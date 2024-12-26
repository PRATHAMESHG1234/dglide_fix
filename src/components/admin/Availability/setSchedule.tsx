import moment from 'moment';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/componentss/ui/popover';
import CheckIcon from './CheckIcon.svg';
import { Button } from '@/componentss/ui/button';
import { Label } from '@/componentss/ui/label';
import { Checkbox } from '@/componentss/ui/checkbox';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';
import { Copy, Plus, Trash2 } from 'lucide-react';

type ScheduleType = {
  isOn: boolean;
  day: string;
  slots: {
    start: {
      value: string;
      label: string;
    };
    end: {
      value: string;
      label: string;
    };
  }[];
};

interface ISetScheduleProps {
  scheduleInfo?: any;
  setScheduleInfo?: any;
  setTimeZone?: any;
  timeZone?: any;
  leftContent?: ReactElement;
}

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const defaultSchedule = days.map((day) => {
  return {
    isOn: true,
    day: day,
    slots: [
      {
        start: { value: '9.00 am', label: '9.00 am' },
        end: { value: '5.00 pm', label: '5.00 pm' }
      }
    ]
  };
});

const defaultDaysOfWeek = [
  {
    isOn: false,
    day: 'Select All'
  }
].concat(
  days.map((day) => {
    return {
      isOn: false,
      day: day
    };
  })
);

function SetSchedule({
  scheduleInfo,
  setScheduleInfo,
  setTimeZone,
  timeZone,
  leftContent
}: ISetScheduleProps) {
  const [daysOfWeek, setDaysOfWeek] = useState(defaultDaysOfWeek);
  const [copyData, setCopyData] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(true);
  const [copyDropdownOpen, setCopyDropdownOpen] = useState(
    Array(daysOfWeek.length).fill(false)
  );
  const [openCopyDropdownIndex, setOpenCopyDropdownIndex] = useState(-1);
  const [flag, setFlag] = useState(false);
  const [fields, setFields] = useState<ScheduleType[]>(scheduleInfo);

  const modalRefs = useRef<Array<React.RefObject<any>>>([]);
  useEffect(() => {
    modalRefs.current = Array(7)
      .fill(null)
      .map(() => React.createRef());
  }, []);

  const handleCloseModal = (index: number, e: any) => {
    let copyButtonModal = document.getElementsByClassName('copy-modal');
    if (
      modalRefs[index].current &&
      !modalRefs[index].current.contains(e.target)
    ) {
      setCopyDropdownOpen((prevOpenState) => {
        const newState = [...prevOpenState];
        newState[index] = !newState[index];
        return newState;
      });

      setDaysOfWeek(defaultDaysOfWeek);

      setOpenCopyDropdownIndex((prevIndex) =>
        prevIndex === index ? -1 : index
      );
    }
  };

  useEffect(() => {
    const handleGlobalClick = (e: any) => {
      for (let i = 0; i < modalRefs.current.length; i++) {
        handleCloseModal(i, e);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [modalRefs]);

  const handleSelect = (e: any, option: any) => {
    e.preventDefault();
    setTimeZone(option);
    setDropdownOpen(false);
  };

  const ClearIndicator = (props: any) => {
    const {
      innerProps,
      innerProps: { ref, ...rest }
    } = props;
    return null;
  };

  const handleChangeStart = (e: any, slotIndex: number, index: number) => {
    setFields((prevInfo) => {
      const update = [...prevInfo];
      update[index].slots[slotIndex].start = e;
      return update;
    });
  };

  const handleChangeEnd = (e: any, slotIndex: number, index: number) => {
    setFields((prevInfo) => {
      const update = [...prevInfo];
      update[index].slots[slotIndex].end = e;
      return update;
    });
  };

  const handleAddSlot = (index: number, slotIndex: number) => {
    if (slotIndex > 1) {
      return;
    }

    setFields((prevInfo) => {
      const update = [...prevInfo];
      const prevSlot: any = update[index].slots[slotIndex];
      if (moment(prevSlot.end.value, 'h:mm a').format('HH') === '23') {
        return prevInfo; // If the time is 11 PM, return the previous info without adding a new slot
      }
      const start = moment(prevSlot.end.value, 'h:mm a')
        .add(30, 'minutes')
        .format('h:mm a');
      const end = moment(prevSlot.end.value, 'h:mm a')
        .add(1, 'hour')
        .format('h:mm a');
      const newSlot = {
        start: { value: start, label: start },
        end: { value: end, label: end }
      };
      update[index].slots = [...update[index].slots, newSlot];
      return update;
    });
  };

  const handleDeleteSlot = (index: number, slotIndex: number) => {
    setFields((prevInfo) => {
      const update = [...prevInfo];
      update[index].slots = update[index].slots.filter(
        (_item, slotIndexInside) => slotIndex !== slotIndexInside
      );
      return update;
    });
  };

  const generateTimeSlotsForStart = (
    slotValueStart: any,
    slotValueEnd: any
  ) => {
    const slots = [];
    const slotDurationMinutes = 30; // Duration of each time slot in minutes

    const start = moment(slotValueStart, 'h:mm a');
    const end = moment(slotValueEnd, 'h:mm a');

    while (start.isBefore(end)) {
      const slot = start.format('h:mm a');
      slots.push({ value: slot, label: slot });
      start.add(slotDurationMinutes, 'minutes');
    }

    return slots;
  };

  const generateTimeSlotsForEnd = (slotValueStart: any, slotValueEnd: any) => {
    const slots = [];
    const slotDurationMinutes = 30; // Duration of each time slot in minutes

    const start = moment(slotValueStart, 'h:mm a');
    const end = moment(slotValueEnd, 'h:mm a');

    while (start.isBefore(end)) {
      const slot = start.format('h:mm a');
      slots.push({ value: slot, label: slot });
      start.add(slotDurationMinutes, 'minutes');
    }

    return slots;
  };

  useEffect(() => {
    setScheduleInfo(fields);
  }, [fields]);
  useEffect(() => {
    if (scheduleInfo) {
      setFields(scheduleInfo);
    }
  }, [scheduleInfo]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleToggle = (index: number, ckecked: any) => {
    setFields((prevInfo) => {
      const update = [...prevInfo];
      update[index].isOn = ckecked;
      update[index].slots =
        update[index].slots.length === 0
          ? [
              {
                start: { value: '9.00 am', label: '9.00 am' },
                end: { value: '5.00 pm', label: '5.00 pm' }
              }
            ]
          : update[index].slots;
      return update;
    });
  };

  const copyDropDownToggle = (e: any, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    setCopyDropdownOpen((prevOpenState) => {
      const newState = [...prevOpenState];
      newState[index] = !newState[index];
      return newState;
    });

    if (openCopyDropdownIndex !== -1 && openCopyDropdownIndex !== index) {
      setCopyDropdownOpen((prevOpenState) => {
        const newState = [...prevOpenState];
        newState[openCopyDropdownIndex] = false;
        return newState;
      });
    }

    setDaysOfWeek(defaultDaysOfWeek);

    setOpenCopyDropdownIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  function getDayOfWeek(index: number) {
    return days[index] || 'Invalid index';
  }

  const reflectCopyData = (e: any, index: any) => {
    e.preventDefault();

    const copiedFields = JSON.parse(JSON.stringify(fields));

    const dayToBeCopied = getDayOfWeek(index);
    const finalCopyArray = [];

    if (index >= 0 && index < copiedFields.length) {
      copyData[index].slots = copiedFields[index].slots;

      if (copiedFields[index].isOn) {
        copyData[index] = { ...copiedFields[index] };
      }
    }

    copyData.forEach((item2) => {
      if (!copiedFields.some((item1: any) => item1.day === item2.day)) {
        finalCopyArray.push(item2);
      }
    });

    const trueObject = copyData.find(
      (obj: any) => obj.isOn && obj.day !== dayToBeCopied
    );
    const copyObject = copyData.find((obj) => obj.day === dayToBeCopied);

    if (trueObject && copyObject) {
      trueObject.slots = JSON.parse(JSON.stringify(copyObject.slots));
    }

    copiedFields.forEach((item1: any) => {
      const existingItem = copyData.find(
        (item2) => item1.day === item2.day && item2.isOn
      );
      finalCopyArray.push(
        existingItem
          ? { ...item1, isOn: existingItem.isOn, slots: existingItem.slots }
          : item1
      );
    });

    setFields(finalCopyArray);
    setDaysOfWeek(defaultDaysOfWeek);
  };

  function copySlotsToTarget(clickedDay: any, dataArray: any) {
    const index = dataArray.findIndex(
      (dayObj: any) => dayObj?.day === clickedDay
    );

    if (index !== -1) {
      const { slots } = dataArray[index];

      dataArray.forEach((dayObj: any, targetIndex: any) => {
        if (dayObj.isOn || dayObj.day === clickedDay) {
          dataArray[targetIndex].slots = JSON.parse(JSON.stringify(slots));
          dataArray[targetIndex].isOn = true;
        }
      });
      setCopyData(dataArray);
    }
  }

  const handleCheckboxChange = (
    subIndex: number,
    clickIndex: number,
    e: any
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const clickedDay = getDayOfWeek(clickIndex);
    let scheduledata = [...fields];
    setDaysOfWeek((prevDaysOfWeek) => {
      const selectAllValue = subIndex === 0 ? !prevDaysOfWeek[0].isOn : null;
      const updatedDaysOfWeek = prevDaysOfWeek.map((day, index) => ({
        ...day,
        isOn: index === subIndex ? !day.isOn : (selectAllValue ?? day.isOn)
      }));

      updatedDaysOfWeek[0].isOn = !updatedDaysOfWeek
        .slice(1)
        .some((day) => !day.isOn);

      const originalArray = scheduledata?.map((item) => ({
        ...item,
        isOn:
          updatedDaysOfWeek?.find((obj) => obj.day === item.day)?.isOn ??
          item.isOn
      }));

      copySlotsToTarget(clickedDay, originalArray);

      return updatedDaysOfWeek;
    });
  };

  const timezoneOptions = [
    { value: 'Asia/Calcutta', label: 'Asia/Calcutta' },
    { value: 'America/New_York', label: 'America/New York' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney' },
    { value: 'America/Los_Angeles', label: 'America/Los Angeles' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    { value: 'Europe/Paris', label: 'Europe/Paris' },
    { value: 'America/Chicago', label: 'America/Chicago' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin' },
    { value: 'America/Toronto', label: 'America/Toronto' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai' },
    { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu' },
    { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg' },
    { value: 'Australia/Melbourne', label: 'Australia/Melbourne' },
    { value: 'Europe/Madrid', label: 'Europe/Madrid' },
    { value: 'America/Mexico_City', label: 'America/Mexico City' },
    { value: 'Asia/Hong_Kong', label: 'Asia/Hong Kong' },
    { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam' },
    { value: 'America/Phoenix', label: 'America/Phoenix' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore' },
    { value: 'Europe/Rome', label: 'Europe/Rome' },
    { value: 'America/Denver', label: 'America/Denver' }
  ];

  const customStyles = {
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#8C9196'
    }),
    control: (base: any, state: any) => ({
      ...base,
      border: `0px solid ${state.isFocused ? '#D2D5D8' : '#ced4da'}`,
      boxShadow: 'none',
      paddingTop: '2px',
      paddingBottom: '2px',
      paddingLeft: '25px',
      borderRadius: '10.5px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#8C9196',
      cursor: 'pointer',
      backgroundColor: state.menuIsOpen ? '#F7F7F7' : 'inherit', // Change background color when the menu is open
      ':hover': {
        backgroundColor: '#F7F7F7',
        borderRadius: '12px'
      },
      ':focus': {
        outline: 'none',
        boxShadow: 'none'
      }
    }),
    menu: (base: any) => ({
      ...base,
      border: '1px solid #F7F7F7', // Add border to the menu
      boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)', // Increase box shadow
      '::-webkit-scrollbar': {
        display: 'none' // Hide the scrollbar in WebKit browsers
      },
      scrollbarWidth: 'none', // Hide the scrollbar in Firefox
      msOverflowStyle: 'none' // Hide the scrollbar in IE/Edge
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: '316px',
      overflowY: 'auto',
      '::-webkit-scrollbar': {
        display: 'none' // Hide the scrollbar in WebKit browsers
      },
      scrollbarWidth: 'none', // Hide the scrollbar in Firefox
      msOverflowStyle: 'none', // Hide the scrollbar in IE/Edge
      cursor: 'pointer'
    }),
    option: (styles: any, { isFocused, isSelected }: any) => ({
      ...styles,
      backgroundColor: isSelected ? 'white' : isFocused ? 'black' : 'white',
      color: isFocused || isSelected ? 'white' : 'black',
      ':hover': {
        backgroundColor: '#2096f3',
        color: 'white'
      },
      display: isSelected ? 'none' : 'block',
      fontWeight: '500',
      fontSize: '14px'
    }),
    singleValue: (styles: any) => ({
      ...styles,
      color: '#8C9196'
    })
  };

  // const OptionWithIcon = ({ innerProps, label, isSelected }) => (
  //   <div
  //     {...innerProps}
  //     className="flex mx-[4px]  overflow-x-auto flex-row gap-x-[4px] px-[2px] py-[6px] hover:bg-[#DCDFF7] text-[#636060] hover:text-[#252525] hover:rounded-[4px]"
  //   >
  //     {isSelected ? (
  //       <>
  //         <span className="font-InstrumentMedium text-[14px] leading-[20px]">
  //           {' '}
  //           {label}
  //         </span>
  //         {/* <img className="w-[20px] h-[20px] ml-auto" src={greenRightTick} /> */}
  //       </>
  //     ) : (
  //       <>
  //         <span className="font-InstrumentMedium text-[14px] leading-[20px]">
  //           {' '}
  //           {label}
  //         </span>
  //       </>
  //     )}
  //   </div>
  // );
  // const handleChange = (selectedOptions: any) => {
  //   console.log({ selectedOptions });
  //   setTimeZone(selectedOptions);
  // };

  function position(index: Number) {
    switch (index) {
      case 0:
        return '-10px';
      case 1:
        return '-10px';
      case 2:
        return '-10px';
      case 3:
        return '-64px';
      case 4:
        return '-292px';
      case 5:
        return '-292px';
      case 6:
        return '-292px';
      default:
        return '-10px';
    }
  }
  return (
    <div className="w-full">
      <div className="align-center flex justify-between">
        {leftContent && leftContent}
      </div>

      <div className="mb-3 mt-4 h-px w-full bg-gray-300" />

      <div className="h-[calc(100vh-200px)] overflow-y-auto pb-4">
        {fields?.map((scheduleItem: ScheduleType, index) => {
          const isLastIndex = index === fields.length - 1;
          return (
            <div
              className="mt-5 flex h-auto w-full justify-between gap-10"
              key={index}
            >
              <div className="flex items-center">
                <Checkbox
                  checked={scheduleItem.isOn}
                  onCheckedChange={(checked) => handleToggle(index, checked)}
                />
                <Label className="ml-2 flex cursor-pointer items-center space-x-2">
                  <span className="text-[16px] font-medium text-[#202223]">
                    {scheduleItem.day}
                  </span>
                </Label>
              </div>
              {scheduleItem.isOn ? (
                <div className="flex flex-col justify-center">
                  {scheduleItem.slots.map((slot, slotIndex) => (
                    <>
                      <div className="flex flex-row gap-6">
                        <div className="my-2 flex items-center justify-center gap-8">
                          <div>
                            <Select
                              value={slot.start}
                              onChange={(value) =>
                                handleChangeStart(value, slotIndex, index)
                              }
                              options={generateTimeSlotsForStart(
                                slotIndex > 0
                                  ? scheduleItem.slots[slotIndex - 1].end.value
                                  : '12:00 am',
                                slot.end.value
                              )}
                              isSearchable
                              placeholder="9:00 am"
                              components={{
                                DropdownIndicator: null,
                                ClearIndicator
                              }}
                              // className="w-[108px] h-[36px] text-[14px] font-InstrumentMedium font-medium text-[#202223]"
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  width: '108px',
                                  height: '36px',
                                  fontSize: '14px',
                                  fontFamily: 'InstrumentMedium, sans-serif',
                                  fontWeight: 500,
                                  color: '#2096f3',
                                  boxShadow: state.isFocused
                                    ? 'none'
                                    : provided.boxShadow,
                                  outline: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  borderColor: state.isFocused
                                    ? '#2096f3'
                                    : provided.borderColor,
                                  '&:hover': {
                                    borderColor: '#2096f3'
                                  }
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  backgroundColor: state.isFocused
                                    ? '#2096f3'
                                    : state.isSelected
                                      ? '#fff'
                                      : provided.backgroundColor,
                                  color: state.isFocused
                                    ? '#fff'
                                    : state.isSelected
                                      ? '#2096f3'
                                      : provided.color,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: '#2096f3',
                                    color: '#fff'
                                  }
                                })
                              }}
                            />
                          </div>
                          {/* <div className=''> - </div> */}
                          <div>
                            <Select
                              value={slot.end}
                              onChange={(value) =>
                                handleChangeEnd(value, slotIndex, index)
                              }
                              // options={generateTimeSlotsForEnd(slotIndex > 0 ? item.slots[slotIndex - 1].end.value : slot.start.value, slotIndex > 0 && item.slots.length >= slotIndex + 1 ? item.slots[slotIndex + 1].start : '11:30pm')}
                              options={generateTimeSlotsForEnd(
                                slot.start.value,
                                scheduleItem.slots.length > slotIndex + 1
                                  ? scheduleItem.slots[slotIndex + 1].start
                                      .value
                                  : '11:30 pm'
                              )}
                              isSearchable
                              placeholder="5:00 pm"
                              components={{
                                DropdownIndicator: null,
                                ClearIndicator
                              }}
                              // className="w-[108px] h-[36px] text-[14px] font-InstrumentMedium font-medium text-[#202223]"
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  width: '108px',
                                  height: '36px',
                                  fontSize: '14px',
                                  fontFamily: 'InstrumentMedium, sans-serif',
                                  fontWeight: 500,
                                  color: '#2096f3',
                                  boxShadow: state.isFocused
                                    ? 'none'
                                    : provided.boxShadow,
                                  outline: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  borderColor: state.isFocused
                                    ? '#2096f3'
                                    : provided.borderColor,
                                  '&:hover': {
                                    borderColor: '#2096f3'
                                  }
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  backgroundColor: state.isFocused
                                    ? '#2096f3'
                                    : state.isSelected
                                      ? '#fff'
                                      : provided.backgroundColor,
                                  color: state.isFocused
                                    ? '#fff'
                                    : state.isSelected
                                      ? '#2096f3'
                                      : provided.color,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: '#2096f3',
                                    color: '#fff'
                                  }
                                })
                              }}
                            />
                          </div>
                        </div>
                        {slotIndex === 0 ? (
                          <>
                            <div className="flex cursor-pointer items-center justify-center gap-6">
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddSlot(
                                    index,
                                    scheduleItem.slots.length - 1
                                  );
                                }}
                              >
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Plus className="h-5 w-5" />
                                  </TooltipTrigger>
                                  <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
                                    Add
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              {/* Copy items */}
                              <Popover>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <PopoverTrigger asChild>
                                      <div
                                        className={`mt-[2px] cursor-pointer px-2 py-2 ${
                                          copyDropdownOpen[index]
                                            ? 'rounded-[8px] bg-[#E6E8EA]'
                                            : 'bg-transparent'
                                        } hover:rounded-[8px] hover:bg-[#E6E8EA]`}
                                      >
                                        <Copy className="h-5 w-5" />
                                      </div>
                                    </PopoverTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
                                    Copy
                                  </TooltipContent>
                                </Tooltip>
                                <PopoverContent className="w-56">
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Copy times to</Label>
                                      <div className="mt-2 flex flex-col space-y-2">
                                        {daysOfWeek.map(
                                          (data: any, subIndex: any) => (
                                            <div
                                              className={`${
                                                getDayOfWeek(index) === data.day
                                                  ? 'hidden'
                                                  : 'flex'
                                              } items-center space-x-2`}
                                              key={subIndex}
                                            >
                                              <div
                                                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded"
                                                style={{
                                                  backgroundColor: data.isOn
                                                    ? '#2096f3'
                                                    : '#fff',
                                                  border: data.isOn
                                                    ? 'none'
                                                    : '2px solid #8C9196'
                                                }}
                                                onClick={(e) => {
                                                  handleCheckboxChange(
                                                    subIndex,
                                                    index,
                                                    e
                                                  );
                                                }}
                                              >
                                                {data.isOn && (
                                                  <img
                                                    src={CheckIcon}
                                                    alt="Check Icon"
                                                  />
                                                )}
                                              </div>
                                              <Label className="text-sm font-normal">
                                                {data.day}
                                              </Label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <Button
                                      className="w-full"
                                      onClick={(e) => {
                                        copyDropDownToggle(e, index);
                                        reflectCopyData(e, index);
                                      }}
                                    >
                                      Apply
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </>
                        ) : (
                          <div className="mt-4">
                            <Tooltip>
                              <TooltipTrigger>
                                <Trash2
                                  size={16}
                                  style={{ color: 'red' }}
                                  onClick={() =>
                                    handleDeleteSlot(index, slotIndex)
                                  }
                                />
                              </TooltipTrigger>
                              <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
                                Delete
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SetSchedule;
