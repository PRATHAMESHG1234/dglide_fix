import React, { useState } from 'react';
import { DateRangePicker } from 'rsuite';
// import 'rsuite/dist/rsuite.min.css';
// import './CustomeDatePicker.css';
const CustomeDatePicker = ({ value, handleChangeCustomeDate }) => {
  return (
    <div style={{ position: 'absolute', top: '20px' }}>
      <DateRangePicker
        className="date-range-picker"
        open
        value={value}
        onChange={(newValue) => handleChangeCustomeDate(newValue)}
        showMeridian
        format="yyyy-MM-dd HH:mm"
        defaultCalendarValue={[
          new Date('2024-08-01 00:00:00'),
          new Date('2024-08-01 23:59:59')
        ]}
      />
    </div>
  );
};

export default CustomeDatePicker;
