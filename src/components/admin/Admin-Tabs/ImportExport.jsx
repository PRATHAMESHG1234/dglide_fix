import { Box, div } from '@mui/material';
import React from 'react';
import ImportExportData from '../../import-Export/ImportExportData';
import SubCard from '../../../elements/SubCard';
import { colors } from '../../../common/constants/styles';
import { useSelector } from 'react-redux';

export const ImportExport = () => {
  const { currentTheme } = useSelector((state) => state.auth);

  return (
    <div>
      <div className="w-full">
        <div className="rounded-xl">
          <div
            className=""
            style={{
              borderRadius: '8px',
              backgroundColor:
                currentTheme === 'Dark' ? colors.darkLevel2 : colors.white
              // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
            }}
          >
            <ImportExportData />
          </div>
        </div>
      </div>
    </div>
  );
};
