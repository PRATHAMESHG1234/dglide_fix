import React from "react";
import moment from "moment";
import "./modify-record.css";
import CardView from "./CardView";

const Meeting = ({ rows, columns, tab, onRecordSelected }) => {
  const formatDate = (dateString) => {
    const date = moment(dateString);
    return date.format("Do MMMM YY");
  };

  const filteredColumns = columns.filter(
    (col) => col.headerName !== "created_at" && col.headerName !== "LeadID"
  );

  const groupedData = {};
  rows.forEach((item) => {
    const fromDate = item?.fromtime?.split(" ")[0];
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

export default Meeting;
