import SetSchedule from './setSchedule';

import React, { useEffect, useState } from 'react';
import { Input } from '@/componentss/ui/input';

interface TimeSlot {
  start: {
    value: string;
    label: string;
  };
  end: {
    value: string;
    label: string;
  };
}

interface ScheduleItem {
  isOn: boolean;
  day: string;
  name?: string;
  uuid?: string;
  slots: TimeSlot[];
}

interface TimeZone {
  value: string;
  label: string;
}

interface ApiDataItem {
  day: string;
  ison: string;
  name?: string;
  uuid?: string;
  slot_1_start?: string;
  slot_1_end?: string;
}

interface AvailabilityProps {
  apiData: ApiDataItem[];
  formId: string;
  onSubmit: (endpoint: string, data: any) => void;
  newRecord: boolean;
}

function Availability({
  apiData,
  formId,
  onSubmit,
  newRecord
}: AvailabilityProps) {
  const [scheduleInfo, setSchedule] = useState<ScheduleItem[]>([]);
  const [postData, setPostData] = useState<any[]>([]);
  const [timeZone, setTimeZone] = useState<TimeZone>({
    value: Intl.DateTimeFormat().resolvedOptions().timeZone.toString(),
    label: Intl.DateTimeFormat().resolvedOptions().timeZone.toString()
  });
  const [shiftName, setShiftName] = useState<string>(
    newRecord ? '' : scheduleInfo[0]?.name || ''
  );

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedName = e.target.value;
    setShiftName(updatedName);

    const updatedScheduleInfo = scheduleInfo.map((item) => ({
      ...item,
      name: updatedName
    }));

    setSchedule(updatedScheduleInfo);
  };

  const convertTo12HourFormat = (time24: string | undefined) => {
    if (!time24) return null;
    const [hour, minute] = time24.split(':');
    let hour12 = parseInt(hour, 10) % 12 || 12;
    const amPm = parseInt(hour, 10) >= 12 ? 'pm' : 'am';
    return `${hour12}:${minute} ${amPm}`;
  };

  const convertTo24h = (timeStr: string) => {
    timeStr = timeStr.replace('.', ':');
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const transformSchedule = (apiData: ApiDataItem[]): ScheduleItem[] => {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];

    return daysOfWeek.map((day) => {
      const apiDay = apiData.find((item) => item.day === day);

      return {
        isOn: apiDay ? apiDay.ison === 'True' : true,
        day,
        name: apiDay?.name,
        uuid: apiDay?.uuid,
        slots: [
          {
            start: {
              value: convertTo12HourFormat(apiDay?.slot_1_start) || '10:00 am',
              label: convertTo12HourFormat(apiDay?.slot_1_start) || '10:00 am'
            },
            end: {
              value: convertTo12HourFormat(apiDay?.slot_1_end) || '7:00 pm',
              label: convertTo12HourFormat(apiDay?.slot_1_end) || '7:00 pm'
            }
          }
        ]
      };
    });
  };

  const convertScheduleToOriginal = (
    originalSchedule: ScheduleItem[],
    newRecord: boolean
  ) => {
    const defaultStart = '10:00';
    const defaultEnd = '19:00';

    return originalSchedule.map((entry, index) => {
      const isOn = entry.isOn;
      const start = isOn
        ? convertTo24h(entry.slots[0].start.value)
        : defaultStart;
      const end = isOn ? convertTo24h(entry.slots[0].end.value) : defaultEnd;

      const result: any = {
        name: scheduleInfo[0]?.name,
        default_label: scheduleInfo[0]?.name,
        day: index + 1,
        slot_1_start: start,
        slot_1_end: end,
        ison: isOn ? 1 : 0
      };

      if (entry.slots?.[1]) {
        result.slot_2_start = convertTo24h(entry.slots[1].start.value);
        result.slot_2_end = convertTo24h(entry.slots[1].end.value);
      }

      if (entry.slots?.[2]) {
        result.slot_3_start = convertTo24h(entry.slots[2].start.value);
        result.slot_3_end = convertTo24h(entry.slots[2].end.value);
      }

      if (!newRecord) {
        result.uuid = entry?.uuid;
      }

      return result;
    });
  };

  const getDefaultSchedule = (): ScheduleItem[] => {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    return daysOfWeek.map((day) => ({
      isOn: true,
      day,
      slots: [
        {
          start: { value: '10.00 am', label: '10.00 am' },
          end: { value: '7.00 pm', label: '7.00 pm' }
        }
      ]
    }));
  };

  useEffect(() => {
    if (newRecord) {
      setSchedule(getDefaultSchedule());
    } else if (apiData && apiData.length > 0) {
      const transformedSchedule = transformSchedule(apiData);
      setSchedule(transformedSchedule);
      setShiftName(scheduleInfo[0]?.name || '');
    }
  }, [apiData, newRecord]);

  useEffect(() => {
    if (scheduleInfo && scheduleInfo.length > 0) {
      const convertedScheduleToOrignal = convertScheduleToOriginal(
        scheduleInfo,
        newRecord
      );
      setPostData(convertedScheduleToOrignal);
    }
  }, [scheduleInfo]);

  const submitHandler = (e: React.FormEvent) => {
    onSubmit('system_slots', postData);
    e.preventDefault();
  };

  return (
    <form id={formId} onSubmit={submitHandler}>
      <div className="flex w-full flex-col">
        <div className="w-full px-3 py-2">
          <SetSchedule
            timeZone={timeZone}
            setTimeZone={setTimeZone}
            scheduleInfo={scheduleInfo}
            setScheduleInfo={setSchedule}
            leftContent={
              <div>
                <div>
                  <Input
                    label="Shift Name"
                    name="shiftName"
                    type="text"
                    required
                    value={scheduleInfo[0]?.name || ''}
                    onChange={onHandleChange}
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </form>
  );
}

export default Availability;
