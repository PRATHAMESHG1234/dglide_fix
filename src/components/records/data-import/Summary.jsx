import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha
} from '@mui/material';
import React from 'react';
import { COLORS } from '../../../common/constants/styles';

const Summary = ({ summaryData }) => {
  const header = summaryData?.header;
  const data = summaryData?.data;
  const summary = summaryData?.summary;
  const departmentData = data?.map((item) => {
    const obj = {};
    header?.forEach((key, index) => {
      obj[key] = item[index];
    });
    return obj;
  });

  const summaryObj = summary;
  const updatedSummaryObj = {
    [summaryObj?.totalRecordLabel]: summaryObj?.totalRecordCount,
    [summaryObj?.totalFailureLabel]: summaryObj?.totalFailureCount,
    [summaryObj?.totalSuccessLabel]: summaryObj?.totalSuccessCount,
    [summaryObj?.totalUpdatedLabel]: summaryObj?.totalUpdatedCount,
    [summaryObj?.totalCreatedLabel]: summaryObj?.totalCreatedCount
  };

  const tableData = Object.entries(updatedSummaryObj);
  const convertArrayToCSV = () => {
    const allRows = [header, ...data];
    const csvContent = allRows.map((e) => e.join(',')).join('\n');
    return csvContent;
  };

  const downloadCsvFile = () => {
    const csvContent = convertArrayToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'failed_Records.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      style={{
        height: 'calc(100vh - 275px)',
        width: '100%'
      }}
      className="p-1"
    >
      <TableContainer
        sx={{
          cursor: 'default',
          maxHeight: 'calc(100vh - 275px)',
          border: '1px solid lightgrey',
          borderRadius: '3px'
        }}
      >
        <Typography variant="h6" component="div" style={{ padding: '8px' }}>
          Summary
        </Typography>
        <Table
          aria-label="simple table"
          stickyHeader
          padding="40px"
          sx={{
            m: 0,
            '& .MuiTableRow-root:hover': {
              backgroundColor: alpha(COLORS.TERTIARY, 0.08)
            }
          }}
        >
          <TableHead sx={{ padding: 1 }}>
            <TableRow
              sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: COLORS.TERTIARY,
                  m: 1
                }
              }}
            >
              <TableCell>
                <strong>Label</strong>
              </TableCell>
              <TableCell>
                <strong>Count</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ bgcolor: COLORS.WHITE }}>
            {tableData.map(([key, value], index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td , &:last-child th': { border: 0 },
                  color: COLORS.SECONDARY
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: '500'
                  }}
                >
                  {key}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: '500'
                  }}
                >
                  {value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex items-center justify-end">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            downloadCsvFile();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            textDecoration: 'none',
            color: 'blue',
            cursor: 'pointer',
            padding: '3px',
            fontSize: '12px',
            fontWeight: 500
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          Download all Failed Records CSV
        </a>
      </div>
    </div>
  );
};

export default Summary;
