import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/componentss/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';
import { colors } from '../../../../common/constants/styles';
import { EtlJobs } from './EtlJobs';
import { Plugin } from './Plugin';
// import { ObjectLanding } from './ObjectLanding';
import { fetchAllPluginById } from '../../../../services/integration';
import { ArrowLeft, Plus } from 'lucide-react';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomTabs } from '@/componentss/ui/custom-tabs';
import '../../admin.css';

export const EtlLanding = () => {
  const [refetch, setRefetch] = useState(false);
  const { currentTheme } = useSelector((state) => state.auth);
  const [subTabvalue, setSubTabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const [allPluginList, setAllPluginList] = useState([]);
  const [pluginEdit, setpluginEdit] = useState({
    type: '',
    data: ''
  });

  const navigate = useNavigate();

  const handleChange = useCallback(
    (event, newValue) => {
      setSubTabvalue(newValue);
    },
    [navigate]
  );

  const getAllPlugin = async () => {
    try {
      const getPlugin = await fetchAllPluginById();
      setAllPluginList(
        getPlugin.result.map((obj) => ({
          ...obj,
          label: obj.name,
          value: obj.pluginId
        }))
      );
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    getAllPlugin();
  }, [refetch]);

  const jobClickHandler = (job) => {
    // setSubTabvalue(3);
    navigate(`/admin/integration/job/${job.jobId}`, {
      state: {
        type: 'edit',
        Job: job
      }
    });
  };
  const tabItems = [
    {
      label: 'Plugin',
      value: 'plugin',
      content: (
        <div className="rounded-lg bg-gray-100 py-4">
          <Plugin
            open={open}
            refetch={refetch}
            setRefetch={setRefetch}
            setOpen={setOpen}
            allPluginList={allPluginList}
            setpluginEdit={setpluginEdit}
            pluginEdit={pluginEdit}
          />
        </div>
      )
    },
    {
      label: 'Jobs',
      value: 'Jobs',
      content: (
        <div className="rounded-lg bg-gray-100 py-4">
          <EtlJobs
            open={open}
            setOpen={setOpen}
            jobClickHandler={jobClickHandler}
          />
        </div>
      )
    }
  ];
  return (
    <div className="min-h-screen w-full bg-accent">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between space-x-6">
          <div className="flex items-center">
            {subTabvalue === 0 && pluginEdit.type === 'edit' && (
              <div
                className={`hover:bg-primary-dark z-10 mx-2 mb-2 flex cursor-pointer items-center justify-center rounded-md bg-accent p-2 hover:text-primary`}
              >
                <ArrowLeft
                  size={16}
                  className="cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    setpluginEdit({ type: '' });
                  }}
                />
              </div>
            )}
            <div className="flex items-center">
              {subTabvalue !== 0 ? (
                <Tooltip>
                  <TooltipTrigger onClick={() => setOpen(true)}>
                    <Plus />
                  </TooltipTrigger>
                  <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
                    Create New Jobs
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>

            {/* <Tabs
              value={subTabvalue}
              indicatorColor="primary"
              onChange={handleChange}
              style={{
                mb: 3,
                minHeight: 'auto',
                '& button': {
                  minWidth: 100
                },
                '& a': {
                  minHeight: 'auto',
                  minWidth: 10,
                  py: 1,
                  px: 1,
                  mr: 2.25,
                  color: colors.grey[900],
                  textTransform: 'none',
                  '&:hover': {
                    color: colors.primary.main
                  },
                  textDecoration: 'none !important'
                },
                marginBottom: '12px',

                '& a.Mui-selected': {
                  color: colors.primary.main
                }
              }}
              aria-label="simple tabs example"
              variant="scrollable"
            >
              <Tab component={Link} to="#" label="Plugin" {...a11yProps(0)} />

              <Tab component={Link} to="#" label="Jobs" {...a11yProps(2)} />
            </Tabs> */}
          </div>
        </div>
        <CustomTabs items={tabItems} />
      </div>

      <div className=""></div>
    </div>
  );
};
