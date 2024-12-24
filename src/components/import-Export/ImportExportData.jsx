import React, { useEffect, useCallback, useState } from 'react';
import './importExport.css';
import { colors } from '../../common/constants/styles';
import { fetchModules } from '../../redux/slices/moduleSlice';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { ExportDetail } from './ExportDetail';
import { ImportDetail } from './ImportDetail';
import { DumpList } from './DumpList';
import { useSelector } from 'react-redux';
import { Separator } from '@/componentss/ui/separator';
import { CustomTabs } from '@/componentss/ui/custom-tabs';

const ImportExportData = () => {
  const { currentTheme } = useSelector((state) => state.auth);
  const [subTabvalue, setSubTabvalue] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);

  const handleChange = useCallback(
    (event, newValue) => {
      setSubTabvalue(newValue);
    },
    [navigate]
  );

  const tabItems = [
    {
      label: 'Import',
      value: 'Import',
      content: (
        <div className="rounded-lg bg-gray-100 py-4">
          <ImportDetail />
        </div>
      )
    },
    {
      label: 'Export',
      value: 'Export',
      content: (
        <div className="rounded-lg bg-gray-100 py-4">
          <ExportDetail />
        </div>
      )
    },
    {
      label: 'Jobs',
      value: 'Jobs',
      content: (
        <div className="rounded-lg bg-gray-100 py-4">
          <DumpList />
        </div>
      )
    }
  ];

  return (
    <>
      <div className="min-h-screen w-full bg-accent">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between space-x-6">
            <div className="flex items-center">
              <CustomTabs items={tabItems} />
            </div>
          </div>
        </div>

        <div className="flex"></div>
      </div>
    </>
  );
};
export default ImportExportData;
