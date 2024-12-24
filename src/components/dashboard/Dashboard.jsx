import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SquareArrowOutUpRight } from 'lucide-react';

import { Dropdown } from '@/componentss/ui/dropdown';
import {
  CircularProgress
} from '@mui/material';

import { fetchDashboardsByModuleInfoId } from '../../redux/slices/dashboardSlice';
import DashboardPreview from './DashboardPreview';
import NoDashboard from '@/assets/nodashboard.svg';
import {
  fetchDashboardByDashboardInfoId,
  getPreviewDetail
} from '../../services/chart';
import { fetchFieldsWithValuesForReference } from '../../services/field';
import { fetchFormsByModuleId } from '../../services/form';
import DataFilterByTimeStamp from './DataFilterByTimeStamp';

const parseData = (dataArray) => {
  const uniqueValues = new Set();

  dataArray?.forEach((jsonString) => {
    try {
      const parsedData = JSON.parse(jsonString);

      if (Array.isArray(parsedData)) {
        parsedData.forEach((a) => {
          const value = a;
          if (Array.isArray(value) && false) {
            value.forEach((id) => uniqueValues.add(parseInt(id, 10)));
          } else {
            uniqueValues.add(value);
          }
        });
      } else {
        console.warn('Parsed data is not an array:', parsedData);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  return Array.from(uniqueValues);
};

const convertAndFilterArrayOfArrayOfObjects = (allFields, fieldObj) => {
  const data = allFields?.items?.map((d) => d.fields);
  const flattenedArray = data?.flatMap((innerArray) => innerArray);
  const filterIds = fieldObj?.map((item) => item.fieldInfoId);
  const uniqueArray = flattenedArray?.reduce((acc, current) => {
    const x = acc.find((item) => item.fieldInfoId === current.fieldInfoId);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const filteredArray = uniqueArray?.filter((item) =>
    filterIds?.includes(item.fieldInfoId)
  );
  return filteredArray;
};

const Dashboard = () => {
  const { currentModule } = useSelector((state) => state.current);
  const { dashboards, isLoading } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [dashboardData, setDashboardData] = useState();
  const [prevLoading, setPrevLoading] = useState(true);
  const [chartDatas, setChartDatas] = useState(null);
  const [chartDataArr, setChartDataArr] = useState(null);
  const [filterObj, setFilterObj] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [fields, setFields] = useState([]);
  const [whereDynamicValue, setWhereDynamicValue] = useState({});
  useEffect(() => {
    if (currentModule?.moduleInfoId) {
      setDashboardData(null);
      dispatch(
        fetchDashboardsByModuleInfoId({
          moduleInfoId: currentModule?.moduleInfoId
        })
      ).catch((error) => {
        console.error('API Error:', error);
      });
    }
  }, [currentModule]);

  useEffect(() => {
    const getCompiledForms = async () => {
      const res = await fetchFormsByModuleId(currentModule?.moduleInfoId);

      if (currentModule.name === 'stardesk') {
        const selectedForm = res?.result?.find((f) => f.name === 'ticket');
        const formInfoId = await selectedForm?.formInfoId;
        if (formInfoId) {
          if (formInfoId) {
            fetchFieldsWithValuesForReference(formInfoId)
              .then((data) => {
                setFields(data);
              })
              .catch((error) => {
                console.error('Error fetching form fields:', error);
              });
          }
        }
      }
    };

    if (currentModule?.moduleInfoId) {
      getCompiledForms();
    }
  }, [currentModule?.moduleInfoId]);

  useEffect(() => {
    if (currentModule && dashboards && dashboards.length > 0) {
      setSelectedDashboard(dashboards[0].displayName);
    }
  }, [dashboards]);

  useEffect(() => {
    if (selectedDashboard) {
      handleDashboardChange(selectedDashboard);
    }
  }, [selectedDashboard]);

  useEffect(() => {
    if (filterObj) {
      setWhereDynamicValue((prevData) => ({
        ...prevData,
        ...transformedObject
      }));
    }
  }, [filterObj]);

  const replaceDuplicates = (arr) => {
    const map = new Map();

    arr.forEach((item) => map.set(item.dashboardItemInfoId, item));

    return Array.from(map.values());
  };

  useEffect(() => {
    if (chartDatas) {
      setChartDataArr(replaceDuplicates(chartDatas));
    }
  }, [chartDatas]);

  const handleDashboardChange = (selectedDisplayName) => {
    setPrevLoading(true);
    const selectedDashboardObj = dashboards.find(
      (dashboard) => dashboard.displayName === selectedDisplayName
    );

    if (selectedDashboardObj) {
      fetchDashboardByDashboardInfoId({
        dashboardInfoId: selectedDashboardObj.dashboardInfoId,
        data: {
          range: null,
          where: []
        }
      })
        .then((response) => {
          setDashboardData(response);

          return;
        })
        .catch((error) => {
          console.error('Dashboard API Error:', error);
        });
    }
  };
  const previewDashboardData = async (item) => {
    const res = await getPreviewDetail(item);
    const result = res;
    setDashboardData((d) => {
      return {
        ...d,
        items: d?.items?.map((i) => {
          if (i.name === result?.name) {
            return {
              ...i,
              result: result?.result,
              chartData: result?.chartData
            };
          }

          return i;
        })
      };
    });
  };

  useEffect(() => {
    dashboardData?.items?.map((item) =>
      previewDashboardData({ ...item, whereDynamicValue })
    );
    setTimeout(() => {
      setPrevLoading(false);
    }, 500);
  }, [whereDynamicValue]);

  useEffect(() => {
    if (dashboardData) {
      const items = dashboardData?.items
        ? JSON.parse(JSON.stringify(dashboardData.items))
        : [];

      // getChartData(items, setPrevLoading, setChartDatas, true);

      setChartDatas(items);
      setPrevLoading(false);
    }
  }, [dashboardData]);

  const handleSelectChange = (event) => {
    const selectedDisplayName = event.target.value;
    setSelectedDashboard(selectedDisplayName);
  };

  const color = ['#2196F3', '#673AB7', '#00C853', '#FFC107'];

  const getColorByIndex = (index) => {
    return color[index % color.length];
  };

  function capitalizeWords(str) {
    if (!str) {
      return '';
    }

    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const onchangeFilterHandler = (e, field) => {
    const { value, name } = e.target;

    if (!value) return;

    setPrevLoading(true);

    setWhereDynamicValue((prev) => {
      return {
        ...prev,
        [field?.name]: { value }
      };
    });
  };

  const selectedValue = (fieldName) => {
    const value = whereDynamicValue[fieldName];
    if (value) {
      return value['value'];
    }
    return '';
  };
  const dashboardConditionArr = dashboardData?.items?.map((d) => d.options);
  const dynamicDashboardFields = parseData(dashboardConditionArr)?.flatMap(
    (item) =>
      item.where.filter(
        (condition) => condition.conditionId && condition.valueDynamic
      )
  );

  const fieldsArr = convertAndFilterArrayOfArrayOfObjects(
    dashboardData,
    dynamicDashboardFields
  );

  const fieldsData = dynamicDashboardFields?.map((f) => {
    const { name, label } =
      fieldsArr?.find((fld) => fld.fieldInfoId === f.fieldInfoId) || {};
    return { ...f, name, label };
  });
  const filterDuplicateFields = (fields) => {
    const uniqueFields = [];
    const seenValues = new Set();

    fields?.forEach((field) => {
      if (!seenValues.has(field.name)) {
        seenValues.add(field.name);
        uniqueFields.push(field);
      }
    });

    return uniqueFields;
  };

  const dynamicFieldsData = filterDuplicateFields(fieldsData);

  const dateTimeFieldsArr = dynamicFieldsData
    ?.filter((f) => f.category === 'Date')
    .map((field) => ({ ...field }));

  const transformedObject = dateTimeFieldsArr.reduce((acc, condition) => {
    acc[condition.name] = {
      value: filterObj?.start,
      anotherValue: filterObj?.end
    };
    return acc;
  }, {});

  return (
    <div className="flex w-full gap-3 bg-background pt-3">
      {dashboards.length !== 0 ? (
        <div className="flex flex-col" style={{ width: '100%' }}>
          <div>
            {
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ position: 'relative' }}
              >
                <div className="flex gap-3">
                  <Dropdown
                    label={'Dashboard'}
                    value={selectedDashboard}
                    onChange={handleSelectChange}
                    options={dashboards.map((dashboard) => ({
                      label: dashboard.displayName,
                      value: dashboard.displayName
                    }))}
                    placeholder="Select Dashboard"
                  />

                  {dynamicFieldsData
                    ?.filter((f) => f.category !== 'Date')
                    .map((field) => {
                      return (
                        <div>
                          <Dropdown
                            label={field?.label}
                            name={field?.name}
                            value={selectedValue(field?.name)}
                            onChange={(e) => onchangeFilterHandler(e, field)}
                            options={field?.options?.map((o) => ({
                              label: o.label,
                              value: o.value
                            }))}
                            placeholder="Select Option"
                          />
                        </div>
                      );
                    })}
                </div>
                <div style={{ width: '528px' }}>
                  {dateTimeFieldsArr?.length > 0 && (
                    <DataFilterByTimeStamp
                      filterObj={filterObj}
                      setFilterObj={setFilterObj}
                      selectedTime={selectedTime}
                      setSelectedTime={setSelectedTime}
                      selectedDashboard={selectedDashboard}
                      setWhereDynamicValue={setWhereDynamicValue}
                      handleDashboardChange={handleDashboardChange}
                    />
                  )}
                </div>
              </div>
            }
          </div>

          <div
            className="h-[calc(100vh-96px)] w-full overflow-y-auto"
            style={{ position: 'relative' }}
          >
            {prevLoading && dashboards.length !== 0 && (
              <div
                className="flex w-full items-center justify-center"
                style={{
                  position: 'absolute',
                  height: '100vh',
                  backgroundColor: '#673ab71a',
                  zIndex: 9999,
                  borderRadius: '10px'
                }}
              >
                <CircularProgress />
              </div>
            )}

            <DashboardPreview
              data={dashboardData}
              chartData={chartDataArr}
              currentModule={currentModule}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-130px)] w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <img src={NoDashboard} alt="no dashboard" className="h-56" />
            <div className="flex gap-x-2 py-2 text-sm font-normal text-black">
              No dashboards is configured! please create new using{' '}
              <span className="underline-offset-3 flex cursor-pointer font-medium text-primary underline hover:text-primary">
                <Link
                  to={`/app/${currentModule?.name}/dashboard/build-dash`}
                  className="flex items-center gap-x-1"
                >
                  build{' '}
                  <span>
                    <SquareArrowOutUpRight size={14} />
                  </span>
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
