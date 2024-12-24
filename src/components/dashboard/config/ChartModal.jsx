import {
  Box,
  Grid,
  Typography,
  // Button as Buttons,
  Tooltip,
  IconButton
} from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { colors, COLORS } from '../../../common/constants/styles';
import { generateUId } from '../../../common/utils/helpers';
// import {Button} from '@/componentss/ui/button'
import { Button } from '@/componentss/ui/button';
import TextField from '../../../elements/TextField';
import { fetchModules } from '../../../redux/slices/moduleSlice';
import {
  fetchFieldsByFormId,
  fetchRefLookupValuesByFieldInfoId
} from '../../../services/field';
import { fetchFormsByModuleId } from '../../../services/form';
import Dialog from '../../shared/Dialog';
import { X } from 'lucide-react';
import { fetchConfigDetail, getPreviewDetail } from '../../../services/chart';
import {
  buildChart,
  buildFieldMapById,
  buildList,
  buildStackChart
} from '../ChartJson';
import Chart from 'chart.js/auto';

import { DollarSign } from 'lucide-react';
import { UserCircle } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Building2 } from 'lucide-react';
import ConfigItemDisplay from './ConfigItemDisplay';
import FormConfiguration from './FormConfiguration';
import SearchCondition from './SearchCondition';
import MainCard from '../../../elements/MainCard';
import Drawer from '../../../elements/Drawer';
import { MODAL } from '../../../common/utils/modal-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/componentss/ui/sheet';
import { Textarea } from '@/componentss/ui/textarea';
import { Modal } from '@/componentss/ui/modal';
import { notify } from '../../../hooks/toastUtils';
const ChartModal = ({ state, onCancel, onConfirm, onChartClick }) => {
  const chartInstance = useRef(null);
  const [modalContent, setModalContent] = useState(null);
  const [displayChartType, setDisplayChartType] = useState();
  const [configItem, setConfigItem] = useState();
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [cardLabel, setCardLabel] = useState('');
  const [prevLoading, setPrevLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [conditionText, setConditionText] = useState('');
  const { currentTheme } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchConfigDetail(
          state?.selected?.dashboardItemInfoId
        );

        if (
          !configItem ||
          JSON.stringify(result) !== JSON.stringify(configItem)
        ) {
          setConfigItem(result);
        }

        if (result && result['type']) {
          if (result['type'].toLowerCase() === 'chart') {
            // getChartData([result], setPrevLoading, setChartData);
            setChartData([result]);
            chartPreviewHandler(result);
          } else if (result['type'].toLowerCase() === 'list') {
            listPreviewHandler(result);
          } else if (result['type'].toLowerCase() === 'table') {
            tablePreviewHandler(result);
          } else if (result['type'].toLowerCase() === 'card') {
            cardPreviewHandler(result);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [state?.selected?.dashboardItemInfoId]);

  const chartPreviewHandler = (result) => {
    let getChartType =
      typeof result.options === 'string'
        ? JSON.parse(result?.options)
        : result.options;
    if (getChartType[0].defaultChartType === 'stack bar') {
      const chartsData = buildStackChart(result);

      setDisplayChartType(chartsData?.defaultChartType);
      setModalContent(chartsData);
    } else {
      const chartsData = buildChart(result);
      setDisplayChartType(chartsData?.defaultChartType);
      setModalContent(chartsData);
    }
  };

  const icons = [UserCircle, FileText, DollarSign, Building2];

  const color = ['#2196F3', '#673AB7', '#00C853', '#FFC107', '#F44336'];
  const getIconByIndex = (index) => {
    return icons[index % icons.length];
  };
  const getColorByIndex = (index) => {
    return color[index % color.length];
  };

  const tablePreviewHandler = (result) => {
    setSelectedItemData(result);
  };
  const listPreviewHandler = (result) => {
    let res = buildList(result);
    setSelectedItemData(res);
  };

  const cardPreviewHandler = (result) => {
    setSelectedItemData(result);

    const cardLabel = JSON.parse(result?.options)?.[0]?.cardname;
    console.log(JSON.parse(result?.options)?.[0]?.cardname, 'result');
    setCardLabel(cardLabel);

    let options = result && result['options'] ? result['options'] : [];
    let option = options && options.length > 0 ? options[0] : null;
    if (option) {
      const fieldMapById = buildFieldMapById(
        result['fields'] && result['fields'].length > 0 ? result['fields'] : []
      );
      let selectedField = fieldMapById[option['fieldInfoId']];
    }
  };
  useEffect(() => {
    if (chartInstance.current) {
      if (chartInstance.current.destroy) {
        chartInstance.current.destroy();
      }
    }
    const ctx = document.getElementById(`chart`);
    if (ctx && modalContent && modalContent.data && modalContent.name) {
      let chartConfig;
      if (displayChartType) {
        switch (
          typeof displayChartType === 'string'
            ? displayChartType.toLowerCase()
            : displayChartType
        ) {
          case 'bar':
            chartConfig = {
              type: 'bar',
              data: {
                labels: modalContent.labels,
                datasets: [
                  {
                    label: modalContent.fieldName,
                    data: modalContent.data,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 205, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(201, 203, 207, 0.2)',
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 205, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                      'rgb(255, 99, 132)',
                      'rgb(255, 159, 64)',
                      'rgb(255, 205, 86)',
                      'rgb(75, 192, 192)',
                      'rgb(54, 162, 235)',
                      'rgb(153, 102, 255)',
                      'rgb(201, 203, 207)',
                      'rgb(255, 99, 132)',
                      'rgb(255, 159, 64)',
                      'rgb(255, 205, 86)',
                      'rgb(75, 192, 192)',
                      'rgb(54, 162, 235)',
                      'rgb(153, 102, 255)',
                      'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                  }
                ]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            };
            break;
          case 'line':
            chartConfig = {
              type: 'line',
              data: {
                labels: modalContent.labels,
                datasets: [
                  {
                    label: modalContent.fieldName,
                    data: modalContent.data,
                    borderWidth: 1
                  }
                ]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            };
            break;
          case 'pie':
            chartConfig = {
              type: 'pie',
              data: {
                labels: modalContent.labels,
                datasets: [
                  {
                    label: modalContent.fieldName,
                    data: modalContent.data,
                    borderWidth: 1
                  }
                ]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            };
            break;

          case 'stack bar':
            chartConfig = {
              type: 'bar',
              data: modalContent.data,
              options: {
                plugins: {
                  legend: {
                    display: true
                  },
                  title: {
                    display: true,
                    text: modalContent.fieldName
                  }
                },
                scales: {
                  x: {
                    stacked: true
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true
                  }
                }
              }
            };
            break;
          default:
            chartConfig = {
              type: 'bar',
              data: {
                labels: modalContent.labels,
                datasets: [
                  {
                    label: modalContent.fieldName,
                    data: modalContent.data,
                    borderWidth: 1
                  }
                ]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            };
            break;
        }
      } else {
        chartConfig = {
          type: 'bar',
          data: {
            labels: modalContent.labels,
            datasets: [
              {
                label: modalContent.fieldName,
                data: modalContent.data,
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        };
      }

      chartInstance.current = new Chart(ctx, chartConfig);
    }
  }, [modalContent, displayChartType]);

  const dispatch = useDispatch();
  const { currentModule } = useSelector((state) => state.current);
  const [fieldChanged, setFieldChanged] = useState(false);
  const [categorys, setCategorys] = useState('');

  const [fields, setFields] = useState([]);
  const [compiledForms, setCompiledForms] = useState([]);
  const [conditions, setConditions] = useState([
    {
      conditionId: generateUId(),
      fieldInfoId: null,
      fieldName: '',
      operator: '',
      value: ''
    }
  ]);

  const [tableColumns, setTableColumns] = useState([]);
  const [chartType, setChartType] = useState('');

  const [chartObj, setChartObj] = useState({
    moduleInfoId: '',
    formInfoId: '',
    type: '',
    name: '',
    options: []
  });
  let refFieldDataArr = [];

  useEffect(() => {
    const list = fields?.filter(
      (field) =>
        field.category !== 'Reference' ||
        field.category !== 'Attachment' ||
        field.category !== 'TableReference' ||
        field.category !== 'TableLookup'
    );

    setTableColumns(list);
  }, [fields]);

  const limitCondition =
    conditions.filter((item) => item.hasOwnProperty('conditionId')).length >= 4;

  const addSearchCondition = (type, selectedFieldInfoId) => {
    // if (limitCondition) {
    //   notify.warning('You cannot add more than four conditions.');
    //   return;
    // }
    setConditionText((prev) => prev?.concat(` ${type}`));
    if (type === '(' || type === ')') {
      setConditions((prev) => [
        ...prev,
        {
          operator: type
        }
      ]);
      return;
    }

    setConditions((prev) => [
      ...prev,
      {
        operator: type
      },
      {
        conditionId: generateUId(),
        fieldInfoId: selectedFieldInfoId,
        fieldName: '',
        operator: '',
        value: ''
      }
    ]);
  };

  const deleteSearchCondition = (conditionId) => {
    setConditions((prev) => {
      const index = prev.findIndex((cond) => cond.conditionId === conditionId);
      if (index !== -1) {
        if (index > 0) {
          return prev.filter((_, i) => i !== index && i !== index - 1);
        } else {
          return prev.filter((_, i) => i !== index);
        }
      }
      return prev;
    });
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

  const searchCriteriaHandler = (criteria, value, currCondition) => {
    if (criteria === 'operator') {
      setCategorys(currCondition.category);
    }

    setConditionText((prev) => prev?.concat(` ${value}`));

    setConditions((prev) =>
      prev?.map((condition) => {
        if (condition.conditionId === currCondition.conditionId) {
          if (criteria === 'field') {
            const column = tableColumns?.find(
              (column) => column.fieldInfoId === value
            );

            const defaultField = tableColumns?.find(
              (fld) => fld.value === value
            );

            const selectedField = tableColumns.find(
              (f) => f.fieldInfoId === value
            );

            const isRefLookupField =
              selectedField?.category === 'Lookup' ||
              selectedField?.category === 'Reference';

            if (isRefLookupField) {
              const fetchRefLookupValue = async () => {
                try {
                  const response = await fetchRefLookupValuesByFieldInfoId(
                    value,
                    {
                      pagination: null,
                      payload: {},
                      search: null
                    }
                  );
                  const data = await response?.result?.data;

                  if (selectedField.variant === 'Grid') {
                    const parentFieldInfoId =
                      selectedField.lookup.parentFormInfoId;

                    if (parentFieldInfoId > 0) {
                      const res = await fetchFieldsByFormId(
                        selectedField.lookup.parentFormInfoId
                      );
                      const result = await res?.result;
                      const defaultParentField = await result?.find(
                        (f) => f.defaultLabel
                      );
                      const defaultFieldName =
                        await (defaultParentField?.name ||
                          selectedField.lookup.fieldName);
                      const gridData = await data.map((d) => ({
                        label: d[defaultFieldName],
                        value: d.uuid
                      }));

                      refFieldDataArr.push(...gridData);
                    } else {
                      const defaultFieldName =
                        await selectedField.lookup.fieldName;

                      const gridData = data.map((d) => ({
                        label: d[defaultFieldName],
                        value: d.uuid
                      }));

                      refFieldDataArr.push(...gridData);
                    }
                  } else {
                    for (let i = 0; i < data.length; i++) {
                      refFieldDataArr.push(data[i]);
                    }
                  }

                  const updatedFields = fields.map((field) => {
                    if (field.fieldInfoId === value) {
                      const dropdownType =
                        field.category === 'Lookup'
                          ? 'lookupDropdownData'
                          : 'referenceDropdownData';

                      return {
                        ...field,
                        [dropdownType]: refFieldDataArr
                      };
                    }

                    return field;
                  });

                  setFields(updatedFields);
                } catch (error) {
                  console.error(
                    'Error fetching reference/lookup values:',
                    error
                  );
                }
              };

              fetchRefLookupValue();
            }

            const operatorType =
              (column.category === 'Number' && 'Number') ||
              (column.category === 'Date' && 'Date') ||
              (column.category !== 'Date' &&
                column.category !== 'Number' &&
                'String');

            if (column) {
              const variant = column?.variant;
              if (
                column?.category === 'Reference' ||
                column?.category === 'Lookup'
              ) {
                const refFieldsData = async () => {
                  const data =
                    column?.category === 'Reference'
                      ? column.referenceDropdownData
                      : column?.category === 'Lookup'
                        ? column.lookupDropdownData
                        : null;

                  if (data) {
                    for (let i = 0; i < data.length; i++) {
                      refFieldDataArr.push(data[i]);
                    }
                  }
                };
                refFieldsData();
              }
              return {
                ...condition,
                fieldInfoId: value,
                operatorType: operatorType,
                options: column.options || refFieldDataArr,
                variant: variant || '',
                category: column.category
              };
            } else if (defaultField) {
              return {
                ...condition,
                defaultField: value,
                operatorType: operatorType
              };
            } else {
              return condition;
            }
          }

          if (
            criteria === 'value' &&
            condition.operator === 'IN' &&
            condition.options
          ) {
            const selectedOptions = Array.isArray(value)
              ? value.map((optionValue) => {
                  const selectedOption = condition.options.find(
                    (option) => option.value === optionValue
                  );
                  return selectedOption ? selectedOption.value : '';
                })
              : [];

            return {
              ...condition,
              [criteria]: selectedOptions.join(','),
              valueDynamic: selectedOptions.length !== 0 ? false : true
            };
          }

          const selectedDynamicValue = tableColumns?.find(
            (f) => f.fieldInfoId === condition?.fieldInfoId
          )?.name;

          if (criteria === 'operator' && value === 'BETWEEN') {
            return {
              ...condition,
              [criteria]: value,
              value: `(\${Start Date} && \${End Date})`,
              valueDynamic: true
            };
          }

          return {
            ...condition,
            [criteria]: value,
            valueDynamic: value === `\${${selectedDynamicValue}}` ? true : false
          };
        }
        return condition;
      })
    );
  };

  useEffect(() => {
    const text = conditions?.map((cond) => {
      const selectedField = tableColumns?.find((column) =>
        column.category !== 'Default'
          ? column.fieldInfoId === cond.fieldInfoId
          : column.value === cond?.defaultField
      );

      let options;
      if (selectedField?.options) {
        options = selectedField.options;
      } else if (selectedField?.category === 'Reference') {
        options = selectedField.referenceDropdownData;
      } else if (selectedField?.category === 'Lookup') {
        options = selectedField.lookupDropdownData;
      } else {
        options = selectedField?.options;
      }

      if (cond.operator === '(' || cond.operator === ')') {
        return ` ${cond.operator} `;
      } else if (cond.value !== undefined) {
        if (cond.operator === 'IN' && options) {
          const selectedValues = cond.value
            .split(',')
            .filter((val) => val)
            .map((val) => {
              const option = options.find((opt) => opt.value === val);
              return option ? option.label : val;
            })
            .join(', ');
          return ` ${selectedField?.label || ''} ${cond.operator} ${selectedValues} `;
        }

        const selectedOption = options?.find((opt) => opt.value === cond.value);
        return ` ${selectedField?.label || ''} ${cond.operator} ${
          selectedOption ? selectedOption.label : cond.value
        } `;
      } else {
        return ` ${cond.operator} `;
      }
    });

    setConditionText(text.join(''));
  }, [conditions, tableColumns]);

  const getCompiledForms = async (moduleInfoId) => {
    const moduleId = currentUser?.role?.level == 1 ? 0 : moduleInfoId;
    const res = await fetchFormsByModuleId(moduleId);
    const forms = res?.result;
    setCompiledForms(forms);
  };

  const getFieldsBySelectedForm = async (formId) => {
    const res = await fetchFieldsByFormId(formId);
    const columns = res.result;
    setFields(columns);
  };
  useEffect(() => {
    if (chartObj && chartObj.options && chartObj.options.length > 0) {
      const defaultChartType = chartObj.options[0]?.defaultChartType;
      setChartType(defaultChartType);
    }
  }, [chartObj]);

  useEffect(() => {
    let tempObj = state.selected
      ? JSON.parse(JSON.stringify(state.selected))
      : null;

    if (tempObj) {
      if (tempObj.options && tempObj.options.length > 0) {
        if (tempObj.options[0]?.where) {
          setConditions(tempObj.options[0]?.where);
        }

        if (tempObj.options[0]?.groupBy) {
          let groupBy = [];

          if (typeof tempObj.options[0].groupBy === 'string') {
            const tempGroupBy = tempObj.options[0].groupBy.split(',');
            for (const item of tempGroupBy) {
              if (item) {
                groupBy.push(Number(item));
              }
            }
          } else if (Array.isArray(tempObj.options[0].groupBy)) {
            groupBy = tempObj.options[0].groupBy.map((item) => Number(item));
          }

          tempObj.options[0].groupBy = groupBy;
        }
      }

      setChartObj({
        moduleInfoId: tempObj?.moduleInfoId,
        formInfoId: tempObj?.formInfoId,
        type: tempObj?.type,
        name: tempObj?.name,
        options: tempObj?.options
      });

      if (tempObj.formInfoId) {
        getFieldsBySelectedForm(tempObj.formInfoId);
      }

      if (tempObj.moduleInfoId) {
        getCompiledForms(tempObj.moduleInfoId);
      }
    }
  }, [state]);

  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);

  useEffect(() => {
    if (chartObj.formInfoId) {
      getFieldsBySelectedForm(chartObj.formInfoId);
    }
  }, [chartObj.formInfoId]);

  useEffect(() => {
    if (currentModule.moduleInfoId) {
      getCompiledForms(currentModule.moduleInfoId);
    }
  }, []);

  const handleChange = async (name, value, dataObj) => {
    if (name === 'fieldInfoId') {
      setFieldChanged(true);
    }
    if (name === 'defaultChartType') {
      setChartType(value);
      setDisplayChartType(value);
    }

    if (name === 'defaultChartType') {
      setChartType(value);
      setDisplayChartType(value);

      setChartObj((prev) => ({
        ...prev,
        options: prev.options.map((option) => ({
          ...option,
          defaultChartType: value
        }))
      }));
    } else if (
      name === 'name' ||
      name === 'displayName' ||
      name === 'formInfoId' ||
      name === 'moduleInfoId'
    ) {
      setChartObj((prev) => {
        return {
          ...prev,
          [name]: value
        };
      });
      return;
    }

    const updatedChartObj = JSON.parse(JSON.stringify(chartObj));
    if (state && state.selected && state.selected.dashboardItemInfoId) {
      if (!updatedChartObj || !Array.isArray(updatedChartObj.options)) {
        console.error('Invalid chart object or options not an array');
        return;
      }
      if (updatedChartObj.options && updatedChartObj.options.length > 0) {
        updatedChartObj.options = updatedChartObj.options.map((item) => {
          if (item['defaultChartType'] === 'bar' || 'pie' || 'line') {
            return {
              ...item,
              fieldInfoId: value
            };
          } else if (item['defaultChartType'] === 'stack bar') {
            return {
              ...item,
              ...value,
              fieldInfoId2: value
            };
          }
          return item;
        });
      }

      updatedChartObj.options = updatedChartObj.options.map((item) => {
        let defaultChartTypeOfOptions = item['defaultChartType'];

        let groupBy = [];
        if (
          chartObj.type.toLowerCase() === 'card' ||
          chartObj.type.toLowerCase() === 'bar' ||
          chartObj.type.toLowerCase() === 'table' ||
          chartObj.type.toLowerCase() === 'line' ||
          chartObj.type.toLowerCase() === 'pie'
        ) {
          item['cardname'] = value;
        }

        if (
          chartObj.type === 'chart' ||
          chartObj.type === 'list' ||
          chartObj.type === 'table'
        ) {
          if (item['fieldInfoId2']) {
            groupBy.push(item['fieldInfoId2'].toString());
          }
          if (item['fieldInfoId']) {
            groupBy.push(item['fieldInfoId'].toString());
          }
        }
        return {
          ...item,
          defaultChartType: defaultChartTypeOfOptions
            ? defaultChartTypeOfOptions
            : 0,
          where: item.where,
          cardname: item.cardname,
          groupBy: groupBy
        };
      });

      const obj = {
        moduleInfoId: currentModule.moduleInfoId
          ? currentModule.moduleInfoId
          : null,
        formInfoId: chartObj.formInfoId,
        type: chartObj.type,
        options: JSON.stringify(updatedChartObj.options),
        name: chartObj.name
      };

      if (name) {
        try {
          await getPreviewDetail(obj).then((previewResult) => {
            if (
              !configItem ||
              JSON.stringify(previewResult) !== JSON.stringify(configItem)
            ) {
              setConfigItem(previewResult);
            }

            if (previewResult && previewResult['type']) {
              if (previewResult['type'].toLowerCase() === 'chart') {
                chartPreviewHandler(previewResult);
              } else if (previewResult['type'].toLowerCase() === 'list') {
                listPreviewHandler(previewResult);
              } else if (previewResult['type'].toLowerCase() === 'table') {
                tablePreviewHandler(previewResult);
              } else if (previewResult['type'].toLowerCase() === 'card') {
                cardPreviewHandler(previewResult);
              }
            }
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
    if (name === 'fieldInfoId') {
      setChartObj((prev) => ({
        ...prev,
        options: prev.options.map((option) => ({
          ...option,
          fieldInfoId: value
        }))
      }));
    }
    if (name === 'cardname') {
      setChartObj((prev) => ({
        ...prev,
        options: prev.options.map((option) => ({
          ...option,
          cardname: value
        }))
      }));
    }
    if (name === 'groupBy') {
      setChartObj((prev) => ({
        ...prev,
        options: prev.options.map((option) => ({
          ...option,
          groupBy: Array.isArray(value) ? value : value.split(',')
        }))
      }));
    }

    if (name === 'defaultChartType') {
      setChartType(value);
      setDisplayChartType(value);

      setChartObj((prev) => ({
        ...prev,
        options: prev.options.map((option) => ({
          ...option,
          defaultChartType: value
        }))
      }));
    } else if (
      name === 'name' ||
      name === 'displayName' ||
      name === 'formInfoId' ||
      name === 'moduleInfoId'
    ) {
      setChartObj((prev) => {
        return {
          ...prev,
          [name]: value
        };
      });
      return;
    }

    if (name === 'type') {
      if (value === 'chart') {
        setChartObj((prev) => {
          let options = [
            {
              id: generateUId(),
              fieldInfoId: '',
              groupBy: [],
              range: '',
              where: []
            }
          ];

          if (chartType === 'stack bar') {
            options = [
              {
                id: generateUId(),
                fieldInfoId: '',
                fieldInfoId2: '',
                groupBy: [],
                range: '',
                where: []
              }
            ];
          }

          return {
            ...prev,
            [name]: value,
            options: options
          };
        });
      }

      if (value === 'list') {
        setChartObj((prev) => {
          return {
            ...prev,
            [name]: value,
            options: [
              {
                id: generateUId(),
                fieldInfoId: '',
                groupBy: [],
                range: '',
                where: []
              }
            ]
          };
        });
      }
      if (value === 'table') {
        setChartObj((prev) => {
          return {
            ...prev,
            [name]: value,
            options: [
              {
                id: generateUId(),
                fieldInfoIds: [],
                groupBy: [],
                where: []
              }
            ]
          };
        });
      }

      if (value === 'card') {
        setChartObj((prev) => {
          return {
            ...prev,
            [name]: value,
            options: [
              {
                id: generateUId(),
                fieldInfoId: '',
                cardname: '',
                groupBy: [],
                where: []
              }
            ]
          };
        });
      }

      getFieldsBySelectedForm(chartObj.formInfoId);
      return;
    }
    if (dataObj) {
      if (chartObj.type === 'chart' && chartType !== 'stack bar') {
        const operationData = chartObj?.options?.map((opr) => {
          if (
            name === 'fieldInfoId' ||
            name === 'fieldInfoId2' ||
            name === 'groupBy' ||
            name === 'range' ||
            name === 'defaultChartType'
          ) {
            if (dataObj.id === opr.id) {
              return {
                ...opr,
                [name]: value
              };
            }
          }

          return opr;
        });

        setChartObj((prev) => {
          return {
            ...prev,
            options: operationData
          };
        });
      } else {
        const operationData = chartObj?.options?.map((opr) => {
          if (
            name === 'fieldInfoId' ||
            name === 'fieldInfoId2' ||
            name === 'groupBy' ||
            name === 'range' ||
            name === 'defaultChartType'
          ) {
            if (dataObj.id === opr.id) {
              return {
                ...opr,
                [name]: value
              };
            }
          }

          return opr;
        });

        setChartObj((prev) => {
          return {
            ...prev,
            options: operationData
          };
        });
      }
      if (chartObj.type === 'list') {
        const operationData = chartObj?.options?.map((opr) => {
          if (
            name === 'fieldInfoId' ||
            name === 'groupBy' ||
            name === 'range'
          ) {
            if (dataObj.id === opr.id) {
              return {
                ...opr,
                [name]: value
              };
            }
          }

          return opr;
        });

        setChartObj((prev) => {
          return {
            ...prev,
            options: operationData
          };
        });
      }

      if (chartObj.type === 'table') {
        if (name === 'fieldInfoIds') {
          const updatedValue = Array.isArray(value)
            ? value
            : value.split(',').map((val) => val.trim());

          if (dataObj) {
            const updatedOptions = chartObj.options.map((option) => {
              if (option.id === dataObj.id) {
                return {
                  ...option,
                  fieldInfoIds: updatedValue
                };
              }
              return option;
            });

            setChartObj((prev) => ({
              ...prev,
              options: updatedOptions
            }));
          } else {
            const newOption = {
              id: generateUId(),
              fieldInfoIds: updatedValue,
              where: []
            };

            setChartObj((prev) => ({
              ...prev,
              options: [newOption, ...prev.options]
            }));
          }
        }
      }

      if (chartObj.type === 'card') {
        const operationData = chartObj?.options?.map((opr) => {
          if (
            name === 'fieldInfoId' ||
            name === 'groupBy' ||
            name === 'cardname'
          ) {
            if (dataObj.id === opr.id) {
              return {
                ...opr,
                [name]: value
              };
            }
          }

          return opr;
        });

        setChartObj((prev) => {
          return {
            ...prev,
            options: operationData
          };
        });
      }
      return;
    }
  };

  const onSubmitHandler = () => {
    if (!chartObj || !Array.isArray(chartObj.options)) {
      console.error('Invalid chart object or options not an array');
      return;
    }
    const updatedOptions = chartObj.options.map((option) => {
      if (
        option['defaultChartType'] &&
        option['defaultChartType'].toLowerCase() !== 'stack bar'
      ) {
        option['fieldInfoId2'] = null;
      }
      let groupBy = [];

      if (
        chartObj.type === 'chart' ||
        chartObj.type === 'list' ||
        chartObj.type === 'table'
      ) {
        if (option['fieldInfoId2']) {
          groupBy.push(option['fieldInfoId2'].toString());
        }
        if (option['fieldInfoId']) {
          groupBy.push(option['fieldInfoId'].toString());
        }
      }
      return {
        ...option,
        defaultChartType: chartType,
        where: conditions,
        groupBy: groupBy
        // groupBy: Array.isArray(option.groupBy)
        //   ? option.groupBy
        //   : [option.groupBy]
      };
    });
    const obj = {
      moduleInfoId: currentModule.moduleInfoId
        ? currentModule.moduleInfoId
        : null,
      formInfoId: chartObj.formInfoId,
      type: chartObj.type,
      options: JSON.stringify(updatedOptions),
      name: chartObj.name
    };

    onConfirm(obj);
  };

  return (
    <>
      <Modal
        isOpen={state.show}
        onClose={() => onCancel()}
        title="Configs"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        onConfirm={() => onSubmitHandler()}
        onCancel={(e) => {
          if (state.type === 'edit') {
            e.stopPropagation();
            onChartClick(MODAL.delete, state?.selected?.dashboardItemInfoId);
          } else {
            onCancel();
          }
        }}
        width={'75rem'}
        firstButtonText={state.type === 'edit' ? 'Delete' : 'Cancel'}
        firstButtonVariant="Delete"
        className="overflow-hidden"
      >
        {/* Custom content can go here */}
        <>
          <div>
            <Grid
              item
              sx={{ display: 'flex', columnGap: '10px', marginTop: '10px' }}
            ></Grid>

            <div className="flex gap-3">
              <div className="h-[calc(100vh-200px)] min-w-[750px] overflow-y-auto px-4">
                <FormConfiguration
                  chartObj={chartObj}
                  handleChange={handleChange}
                  compiledForms={compiledForms}
                  type={type}
                  charts={charts}
                  range={range}
                  fields={fields}
                />
                <div className="w-full">
                  {conditions
                    ?.filter((f) => f.conditionId)
                    ?.map((condition, index) => (
                      <SearchCondition
                        key={index}
                        condition={condition}
                        index={index}
                        tableColumns={tableColumns}
                        operators={operators}
                        searchCriteriaHandler={searchCriteriaHandler}
                        deleteSearchCondition={deleteSearchCondition}
                        pageView={'Dashboard'}
                      />
                    ))}

                  <div className="mb-3 mt-2 flex w-full">
                    <div
                      className="flex w-full justify-between gap-3 rounded-sm bg-background px-3 py-2"
                      style={{
                        border: `1px solid ${COLORS.GRAYSCALE}`
                      }}
                    >
                      <Button
                        onClick={() => addSearchCondition('(')}
                        variant="outline"
                      >
                        &#40;
                      </Button>
                      <Button
                        onClick={() => addSearchCondition(')')}
                        variant="outline"
                      >
                        &#41;
                      </Button>

                      <Button
                        onClick={() => addSearchCondition('OR')}
                        variant="outline"
                      >
                        OR
                      </Button>
                      <Button
                        onClick={() => addSearchCondition('AND')}
                        variant="outline"
                      >
                        AND
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    label="Selected Condition"
                    id="outlined-multiline-static"
                    multiline
                    rows={4}
                    value={conditionText}
                    focused={false}
                    readonly
                    className="w-full"
                  />
                </div>
              </div>
              <ConfigItemDisplay
                configItem={configItem}
                chartData={chartData}
                selectedItemData={selectedItemData}
                cardLabel={cardLabel}
                capitalizeWords={capitalizeWords}
                getColorByIndex={getColorByIndex}
                getIconByIndex={getIconByIndex}
              />
            </div>
          </div>
          <div className="flex space-x-2 py-2">
            {/* <Button form="normal" type="submit" onClick={onSubmitHandler}>
              Save
            </Button> */}
            {/* {state.type === 'edit' ? (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onChartClick(
                    MODAL.delete,
                    state?.selected?.dashboardItemInfoId
                  );
                }}
                className="border-destructive text-destructive outline-destructive hover:text-destructive hover:outline-destructive"
              >
                Delete
              </Button>
            ) : null} */}
          </div>
        </>
      </Modal>
    </>
  );
};

export default ChartModal;

const type = [
  // {
  //   value: 'list',
  //   label: 'List'
  // },

  {
    value: 'chart',
    label: 'Chart'
  },
  {
    value: 'table',
    label: 'Table'
  },
  {
    value: 'card',
    label: 'Card'
  }
];
const charts = [
  {
    value: 'bar',
    label: 'Bar'
  },
  {
    value: 'pie',
    label: 'Pie'
  },
  {
    value: 'line',
    label: 'Line'
  },
  {
    value: 'stack bar',
    label: 'Stack bar'
  }
];

const range = [
  {
    value: 'min',
    label: 'Min'
  },
  {
    value: 'max',
    label: 'Max'
  },
  {
    value: 'average',
    label: 'Average'
  },
  {
    value: 'count',
    label: 'Count'
  }
];

const operators = {
  String: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'like', value: 'LIKE' },
    { label: 'not like', value: 'NOT LIKE' },
    { label: 'in', value: 'IN' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ],
  Number: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'greater than or equal to', value: '>=' },
    { label: 'less than or equal to', value: '<=' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ],
  Date: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'greater than', value: '>' },
    { label: 'less than', value: '<' },
    { label: 'between', value: 'BETWEEN' },
    { label: 'greater than or equal to', value: '>=' },
    { label: 'less than or equal to', value: '<=' },
    { label: 'Is Empty', value: 'IS EMPTY' },
    { label: 'Is not empty', value: 'IS NOT EMPTY' }
  ]
};
