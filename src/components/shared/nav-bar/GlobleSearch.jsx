import React, { useEffect, useRef, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Card,
  Stack,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab
} from '@mui/material';
import { Label } from '@/componentss/ui/label';

import { colors, COLORS } from '../../../common/constants/styles';
import { useLocation, useNavigate } from 'react-router';
import { fetchFormByName } from '../../../services/form';
import { fetchModuleById } from '../../../services/module';
import { useSelector } from 'react-redux';
import { IconLogout, IconSettings } from '@tabler/icons-react';
import { fetchRecordsBytableName } from '../../../services/table';
import PropTypes from 'prop-types';
import { GlobalSearchCard } from './GlobalSearchCard';
import { Separator } from '@/componentss/ui/separator';

const ODD_OPACITY = 0.9;
const TENANT_ID = 'mahb1';

const headers = ['Id', 'Index', 'Score', 'Source'];

const GlobalSearch = () => {
  const location = useLocation();
  const { searchVal, tableName } = location.state || {};
  const { currentTheme } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState('');
  const [recordData, setRecordData] = useState([]);
  const allRecordData = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [value, setValue] = React.useState(tableName);

  const handleChange = (event, newValue) => {
    setSelectedTable(event.currentTarget.innerText);
    setValue(event.currentTarget.innerText);
  };

  const fetchData = async (value) => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const response = await fetch('https://devml.dglide.com/search', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-TenantID': TENANT_ID,
          'api-key':
            '27260e675a5924d01c57bcfb3140c15cbcb529a13370e97e6a5d64b0770a0aff'
        },
        body: JSON.stringify({ query: value }),
        signal: controller.signal
      });
      const responseJson = await response.json();

      setRecordData(responseJson?.hits);
      allRecordData.current = responseJson?.hits;
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Error fetching data');
      }
    } finally {
      setLoading(false);
    }
    return () => {
      controller.abort();
    };
  };

  // const onRowClick = (tableName, uuid) => {
  //   if (tableName) {
  //     fetchFormByName(tableName).then((data) => {
  //       fetchModuleDetails(data.result?.moduleInfoId);
  //     });
  //   }

  //   const fetchModuleDetails = (id) => {
  //     fetchModuleById(id).then((data) => {
  //       const moduleName = data.result?.name;
  //       if (moduleName) {
  //         navigate(`/app/${moduleName}/${tableName}/modify?id=${uuid}`);
  //       }
  //     });
  //   };
  // };
  const tableHeader = async () => {
    const data = await fetchRecordsBytableName('open_search_config');
    setTableList(data.data);
  };

  useEffect(() => {
    tableHeader();
    if (searchVal) {
      fetchData(searchVal);
      setSelectedTable(tableName);
      setValue(tableName);
    }
  }, [searchVal]);

  useEffect(() => {
    tableHeader();

    if (allRecordData.current.length > 0) {
      if (selectedTable === 'All') {
        setRecordData([...allRecordData.current]);
      } else {
        const filterdData = allRecordData.current?.filter((record) => {
          const tableName =
            record._index === TENANT_ID
              ? null
              : record._index.replace(`${TENANT_ID}_`, '');
          return tableName === selectedTable;
        });

        setRecordData(filterdData);
      }
    }
  }, [selectedTable, allRecordData.current]);

  function TabPanel({ children, value, index, ...other }) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box style={{ p: 0 }}>{children}</Box>}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  return (
    <div style={{ borderRadius: '10px' }}>
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto flex min-w-full max-w-screen-lg items-center justify-center">
            <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center">
          <Label>No data found</Label>
        </div>
      ) : recordData.hits?.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <Label>No data found</Label>
        </div>
      ) : (
        <div className="min-h-screen w-full bg-accent">
          <div className="px-4 py-1">
            <div className="flex items-center justify-between space-x-6">
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                style={{
                  mb: 3,
                  ml: 5,
                  minHeight: 'auto',
                  '& button': {
                    minWidth: 100
                  },
                  '& .MuiTab-root': {
                    minHeight: 'auto',
                    minWidth: 10,
                    py: 1.5,
                    px: 1,
                    mr: 2.25,
                    color: colors.grey[900],
                    textTransform: 'none',
                    '&:hover': {
                      color: colors.primary.main
                    }
                  },
                  '& .Mui-selected': {
                    // Ensure this applies to the selected Tab
                    color: colors.primary.main
                  }
                }}
                aria-label="simple tabs example"
                variant="scrollable"
              >
                <Tab label="All" value="All" />
                {tableList &&
                  tableList.map((item) => (
                    <Tab
                      key={item.table_name}
                      label={item.table_name}
                      value={item.table_name}
                    />
                  ))}
              </Tabs>
            </div>
          </div>
          <Separator className="mb-4 h-1" />
          <div className="">
            <TabPanel value={value} index="All">
              <GlobalSearchCard searchData={recordData} />
            </TabPanel>

            {tableList &&
              tableList.map((item) => (
                <TabPanel
                  key={item.table_name}
                  value={value}
                  index={item.table_name}
                >
                  <GlobalSearchCard searchData={recordData} />
                </TabPanel>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
