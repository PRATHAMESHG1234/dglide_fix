import React, { useState, useEffect } from 'react';
import { colors } from '../../../common/constants/styles';
import { fetchAuditDataByFormName } from '../../../services/table';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';

const getTimeDifference = (dateString, originalTimezone = 'UTC') => {
  const targetTimezone = moment.tz?.guess();
  if (!moment(dateString, moment.ISO_8601, true).isValid()) return null;

  const givenTimeInTarget = moment
    .tz(dateString, originalTimezone)
    .clone()
    .tz(targetTimezone);
  const now = moment.tz(targetTimezone);

  const diffInMinutes = now.diff(givenTimeInTarget, 'minutes');
  const diffInHours = now.diff(givenTimeInTarget, 'hours');
  const diffInDays = now.diff(givenTimeInTarget, 'days');
  const diffInMonths = now.diff(givenTimeInTarget, 'months');
  const diffInYears = now.diff(givenTimeInTarget, 'years');

  if (diffInMinutes < 60)
    return diffInMinutes ? `${diffInMinutes} mins ago` : 'just now';
  if (diffInHours < 24)
    return diffInHours === 1
      ? `${diffInHours} hour ago`
      : `${diffInHours} hours ago`;
  if (diffInDays < 31) return `${diffInDays} days ago`;
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  return `${diffInYears} years ago`;
};

const formatDate = (date) =>
  moment(date, 'YYYY-MM-DD HH:mm:ss').format('ddd, DD MMM YYYY [at] h:mm A');

const renderLabelWithTooltip = (label) => (
  <Tooltip title={label?.length > 30 ? label : ''}>
    <span
      className={`font-semibold ${label?.length > 30 ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {label?.length > 30 ? `${label.slice(0, 30)}...` : label}
    </span>
  </Tooltip>
);

const AuditList = ({ currentForm, selectedRecordId }) => {
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      if (currentForm) {
        const res = await fetchAuditDataByFormName(currentForm.name, {
          pagination: null,
          recordId: selectedRecordId,
          sort: [],
          where: []
        });
        setAuditData(res?.result?.data || []);
      }
    };
    fetchRecords();
  }, [currentForm, selectedRecordId]);

  const parsedJSON = (json) => {
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error('Invalid JSON payload:', json);
      return null;
    }
  };

  const renderChanges = (parsedPayload) =>
    parsedPayload
      ? Object.entries(parsedPayload).map(([key, value]) => (
          <li key={key} className="mt-1 cursor-default text-xs">
            {`${key.charAt(0).toUpperCase() + key.slice(1)} changed `}
            {value.previousLabel && 'from '}
            {renderLabelWithTooltip(value.previousLabel)} to{' '}
            {renderLabelWithTooltip(value.currentLabel)}
          </li>
        ))
      : null;

  return (
    <div className="h-[calc(100vh-150px)] w-full overflow-y-auto pr-3 text-xs">
      {auditData?.map((log, index) => {
        const {
          created_by_display = 'System',
          form_display,
          action = 'inserted',
          payload,
          created_at,
          created_at_display
        } = log;
        const timeDifference = getTimeDifference(created_at);
        const formattedDate = formatDate(created_at_display);
        const parsedPayload = parsedJSON(payload);

        return (
          <div
            key={index}
            className="my-4 rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex cursor-default items-center justify-between font-semibold">
              <div className="flex gap-1 text-sm font-semibold">
                <span>{created_by_display}</span>
                <span>
                  {action.toLowerCase() === 'update' ? 'updated' : 'inserted'}{' '}
                  the{' '}
                </span>
                <span>{form_display}</span>
              </div>
              <span
                className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                style={{
                  color: colors.primary.main,
                  backgroundColor: colors.primary.light
                }}
              >
                {action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()}
              </span>
            </div>
            {action && (
              <div className="mb-0">
                {renderChanges(parsedPayload)}
                <div className="my-1 flex cursor-pointer justify-end gap-1 text-xs font-medium text-gray-500">
                  <span>{timeDifference} </span>
                  <span> {formattedDate}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AuditList;
