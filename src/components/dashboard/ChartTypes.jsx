import React, { useEffect, useState } from 'react';

import { BarChart } from 'lucide-react';
import { PieChart } from 'lucide-react';
import { LineChart } from 'lucide-react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

import MultipleSelect from '../../elements/MultipleSelect';
import SelectField from '../../elements/SelectField';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ChartTypes = ({ defaultSelectedRecords, chartData }) => {
  const [selectedChart, setSelectedChart] = useState('');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [recordData, setRecordData] = useState([]);

  const [value, setValue] = useState([]);

  function findObjectByName(fields, name) {
    return fields.find((obj) => obj.name === name);
  }

  function findObjectById(fields, id) {
    return fields.find((obj) => obj.fieldInfoId.toString() === id.toString());
  }

  useEffect(() => {
    let tempChartData = chartData
      ? JSON.parse(JSON.stringify(chartData))
      : null;

    let labels = [];
    let datasets = [];
    let obj = {
      labels,
      datasets: []
    };
    if (tempChartData) {
      let options = null;
      if (tempChartData?.options) {
        tempChartData['options'] = JSON.parse(tempChartData?.options);
        options =
          tempChartData['options'] && tempChartData['options'].length > 0
            ? tempChartData['options'][0]
            : null;
      }
      if (options) {
        let groupByField = findObjectById(
          tempChartData?.fields,
          options?.groupBy
        );

        if (
          groupByField?.category === 'DropDown' ||
          groupByField?.category === 'Checkbox' ||
          groupByField?.category === 'Radio'
        ) {
          if (groupByField?.options) {
            for (const item of groupByField?.options) {
              if (item) {
                labels.push(item?.label);
              }
            }
          }
          if (tempChartData?.result) {
            let data = [];
            for (const label of labels) {
              let pData = 0;

              for (const item of tempChartData?.result) {
                let fieldData = item[groupByField?.name + '_obj'];
                if (label.toString() === fieldData?.label?.toString()) {
                  pData = fieldData?.value ? fieldData?.value : 0;
                }
              }
              data.push(pData);
            }
            datasets.data = data;
            datasets.label = labels;
          }
        }
        obj.labels = labels;
        obj.datasets.push(datasets);
        console.log('obj', obj);
        setValue(obj);
      }
    }
    setSelectedRecords(defaultSelectedRecords);
  }, [chartData]);

  //   if (chartData?.chartInfoId == 16) {
  //     console.log("chartData", chartData);
  //     const labels = [];

  //     let obj = {
  //       labels,
  //       datasets: [],
  //     };

  //     const RecordData1 = {
  //       label: "TKT10033",
  //       data: [],
  //       backgroundColor:
  //         selectedChart === "Pie"
  //           ? [
  //               "rgba(255, 99, 132, 0.2)",
  //               "rgba(54, 162, 235, 0.2)",
  //               "rgba(255, 206, 86, 0.2)",
  //               "rgba(75, 192, 192, 0.2)",
  //               "rgba(153, 102, 255, 0.2)",
  //               "rgba(255, 159, 64, 0.2)",
  //               "rgba(54, 162, 235, 0.2)",
  //             ]
  //           : "rgba(88, 150, 233, 0.69)",
  //       borderColor:
  //         selectedChart === "Pie"
  //           ? [
  //               "rgba(255, 99, 132, 1)",
  //               "rgba(54, 162, 235, 1)",
  //               "rgba(255, 206, 86, 1)",
  //               "rgba(75, 192, 192, 1)",
  //               "rgba(153, 102, 255, 1)",
  //               "rgba(255, 159, 64, 1)",
  //               "rgba(54, 162, 235, 1)",
  //             ]
  //           : "rgba(155, 199, 132, 1)",
  //     };

  //     if (chartData?.result?.length > 0) {
  //       console.log("chartData.result[0]", chartData.result[0]);
  //       const firstResult = chartData.result[0];
  //       const dynamicKey = Object.keys(firstResult)[0] + "_obj";

  //       for (let item of chartData?.result) {
  //         if (item[dynamicKey] && item[dynamicKey].label) {
  //           labels.push(item[dynamicKey].label);
  //         }
  //         if (item[dynamicKey] && item[dynamicKey].value) {
  //           RecordData1.data.push(item[dynamicKey].value);
  //         }
  //       }
  //     }

  //     obj.datasets.push(RecordData1);
  //     console.log("object", obj);
  //     setValue(obj);
  //   }

  //   // setRecordData([data1 && RecordData1]);

  //   setSelectedRecords(defaultSelectedRecords);
  // }, [chartData]);

  // useEffect(() => {
  //   const data1 =
  //     selectedRecords &&
  //     selectedRecords
  //       ?.toString()
  //       .split(",")
  //       .some((str) => str.includes("Record 1"));

  //   const data2 =
  //     selectedRecords &&
  //     selectedRecords
  //       ?.toString()
  //       .split(",")
  //       .some((str) => str.includes("Record 2"));

  //   setRecordData([data1 && RecordData1, data2 && RecordData2]);
  // }, [selectedRecords]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Ticket status'
      }
    }
  };

  const labels = ['New', 'Assi', 'Pend', 'Prog', 'Comp', 'Clos'];

  const RecordData1 = {
    label: 'TKT10033',
    data: [30, 44, 10, 24, 43, 34],
    backgroundColor:
      selectedChart === 'Pie'
        ? [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ]
        : 'rgba(88, 150, 233, 0.69)',
    borderColor:
      selectedChart === 'Pie'
        ? [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)'
          ]
        : 'rgba(155, 199, 132, 1)'
  };

  const RecordData2 = {
    label: 'TKT10029',
    data: [7, 33, 20, 34, 10, 22],
    backgroundColor:
      selectedChart === 'Pie'
        ? [
            'rgba(215, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ]
        : 'rgba(188, 150, 233, 0.69)',
    borderColor:
      selectedChart === 'Pie'
        ? [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)'
          ]
        : 'rgba(195, 99, 132, 1)'
  };

  const data = {
    labels,
    datasets: recordData
  };

  const chartTypes = [
    {
      label: <BarChart sx={{ color: 'rgba(88, 150, 233, 0.69)' }} />,
      value: 'Bar'
    },
    {
      label: <LineChart sx={{ color: 'rgba(155, 199, 132, 1)' }} />,
      value: 'Line'
    },
    {
      label: <PieChart sx={{ color: 'rgba(255, 159, 64, 0.79)' }} />,
      value: 'Pie'
    }
  ];

  const Records = [
    {
      label: 'Record 1',
      value: 'Record 1'
    },
    {
      label: 'Record 2',
      value: 'Record 2'
    }
  ];

  const onChangeRecords = (records) => {
    setSelectedRecords([records]);
  };

  return (
    <div>
      <div className="flex w-full justify-end gap-2">
        <MultipleSelect
          value={
            (selectedRecords && selectedRecords?.toString().split(',')) || []
          }
          onChange={(e) => onChangeRecords(e.target.value)}
          options={Records}
          fieldstyle={{
            minWidth: '100px',
            maxWidth: '100px'
          }}
        />
        <SelectField
          value={selectedChart || ''}
          onChange={(e) => setSelectedChart(e.target.value)}
          options={chartTypes}
          sx={{ bgcolor: 'rgba(0,0,0,0)' }}
        />
      </div>
      {(selectedChart === 'Bar' && <Bar options={options} data={value} />) ||
        (selectedChart === 'Pie' && <Pie options={options} data={value} />) ||
        (selectedChart === 'Line' && <Line options={options} data={value} />)}
    </div>
  );
};

export default ChartTypes;
