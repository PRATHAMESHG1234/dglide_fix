import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import DataTable from '../admin/DataTable';
import SubCard from '../../elements/SubCard';

export const DataGridNotification = () => {
  const { formname } = useParams();
  const [searchParams] = useSearchParams();

  let title =
    searchParams && searchParams.get('title')
      ? searchParams.get('title')
      : null;
  return (
    <>
      {formname && (
        <SubCard
          style={{
            width: '100%',
            border: 'none',
            borderRadius: '8px',
            '& .MuiCardContent-root': {
              p: 0
            }
          }}
        >
          <DataTable
            FormName={formname}
            title={title}
            isBackArrowEnabled={false}
          />
        </SubCard>
      )}
    </>
  );
};
