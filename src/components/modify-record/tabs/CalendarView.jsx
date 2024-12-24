import React from 'react';
import moment from 'moment';

import '../modify-record.css';
import CardView from '../CardView';

const CalendarView = ({ rows, columns, tab, onRecordSelected }) => {
  const formatDate = (dateString) => {
    const date = moment(dateString);
    return date.format('Do MMMM YY');
  };

  const filteredColumns = columns?.filter((col) => col.headerName !== 'LeadID');

  const sortByField = tab?.field?.sortBy || 'created_at';

  const groupedData = {};

  const sortedRows = rows?.sort((a, b) => {
    const dateA = new Date(a[sortByField]?.split(' ')[0]);
    const dateB = new Date(b[sortByField]?.split(' ')[0]);
    return dateB - dateA;
  });

  sortedRows?.forEach((item) => {
    const fromDate = item?.[sortByField]?.split(' ')[0];
    if (!groupedData[fromDate]) {
      groupedData[fromDate] = [];
    }
    groupedData[fromDate].push(item);
  });

  return (
    <>
      <CardView
        groupedData={groupedData}
        formatDate={formatDate}
        filteredColumns={filteredColumns}
        tab={tab}
        onRecordSelected={onRecordSelected}
      />
    </>
  );
};

export default CalendarView;
