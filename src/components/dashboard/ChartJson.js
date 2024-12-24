export const buildFieldMapByName = (fields) => {
  let map = {};
  for (const item of fields) {
    if (item) {
      map[item['name']] = item;
    }
  }
  return map;
};

export const buildFieldMapById = (fields) => {
  let map = {};
  for (const item of fields) {
    if (item) {
      map[item['fieldInfoId']] = item;
    }
  }
  return map;
};

export const buildField2MapById = (fields) => {
  let map = {};
  for (const item of fields) {
    if (item) {
      map[item['fieldInfoId2']] = item;
    }
  }
  return map;
};

export const buildChart = (item) => {
  let fieldName = '';
  const fieldMapById = buildFieldMapById(
    item && item['fields'] && item['fields'].length > 0 ? item['fields'] : []
  );

  const fields =
    item && item['fields'] && item['fields'].length > 0 ? item['fields'] : [];

  let options =
    item && item['options']
      ? typeof item['options'] === 'string'
        ? JSON.parse(item['options'])
        : item['options']
      : [];

  let defaultChartType = options[0]?.defaultChartType
    ? options[0]?.defaultChartType
    : 'bar';

  const result =
    item && item['result'] && item['result'].length > 0 ? item['result'] : [];
  let alias = '';
  if (options) {
    let aggregateField = fieldMapById[options[0]['fieldInfoId']];
    if (aggregateField) {
      alias = aggregateField['name'] + '_' + options[0]['range'];
    }
  }
  let yData = [];
  let xData = [];
  let xField = null;
  if (result.length > 0) {
    const groupBy = options[0]['groupBy'];
    xField = fieldMapById[options[0]['fieldInfoId']];
    if (xField) {
      if (xField['options'] && xField['options'].length > 0) {
        fieldName = xField['label'] ? xField['label'] : '';
        for (const optionItem of xField['options']) {
          if (optionItem) {
            xData.push(optionItem['label']);
          }
        }
      } else {
        for (const group of groupBy) {
          xField = fieldMapById[group];
          if (xField) {
            if (xField['options'] && xField['options'].length > 0) {
              fieldName = xField['label'] ? xField['label'] : '';
              for (const optionItem of xField['options']) {
                if (optionItem) {
                  xData.push(optionItem['label']);
                }
              }
              break;
            }
          }
        }
      }
    }
    if (groupBy && groupBy.length > 0) {
      let firstGroupBy = groupBy[0];
      let firstGroupByField = fieldMapById[Number(firstGroupBy)];
      for (const x of xData) {
        let yValue = 0;
        if (x) {
          yValue = getUniqueValue(result, x, firstGroupByField, alias);
        }
        yData.push(yValue ? Number(yValue) : 0);
      }
    }
  }

  let chartsData = {
    name: item?.formDisplayName ? item?.formDisplayName : 'N/A',
    fieldName,
    data: yData,
    labels: xData,
    field: xField,
    defaultChartType
  };
  return chartsData;
};

export const buildStackChart = (item) => {
  let fieldName = '';
  const fieldMapById = buildFieldMapById(
    item && item['fields'] && item['fields'].length > 0 ? item['fields'] : []
  );
  let options =
    item && item['options']
      ? typeof item['options'] === 'string'
        ? JSON.parse(item['options'])
        : item['options']
      : [];

  let defaultChartType = options[0]?.defaultChartType
    ? options[0]?.defaultChartType
    : 'bar';

  const result =
    item && item['result'] && item['result'].length > 0 ? item['result'] : [];

  let alias = '';
  let data = {};
  if (options && options.length > 0) {
    let option = options[0];

    let aggregateField = fieldMapById[option['fieldInfoId']]
      ? fieldMapById[option['fieldInfoId']]
      : null;
    if (aggregateField) {
      alias = aggregateField['name'] + '_' + option['range'];
    }

    let labelField = fieldMapById[option['fieldInfoId2']]
      ? fieldMapById[option['fieldInfoId2']]
      : null;
    let labels = [];
    let datasets = [];
    if (labelField) {
      let labelOptions = labelField['options'] ? labelField['options'] : [];
      if (labelOptions && labelOptions.length > 0) {
        for (const labelItem of labelOptions) {
          if (labelItem) {
            labels.push(labelItem['label']);
          }
        }
      }
      if (aggregateField) {
        let aggregateOptions = aggregateField['options']
          ? aggregateField['options']
          : [];
        if (aggregateOptions && aggregateOptions.length > 0) {
          for (const aggregateItem of aggregateOptions) {
            if (aggregateItem) {
              let obj = {
                label: aggregateItem['label'],
                data: []
                // backgroundColor: 'rgba(255, 99, 132, 0.5)',
                // borderColor: 'rgba(255, 99, 132, 1)',
                // borderWidth: 1
              };
              let objData = [];
              if (labelOptions && labelOptions.length > 0) {
                for (const labelItem of labelOptions) {
                  let count = 0;
                  if (labelItem) {
                    if (result && result.length > 0) {
                      for (const resultItem of result) {
                        if (resultItem) {
                          let aggregateFieldName = aggregateField['name'];
                          let labelFieldName = labelField['name'];
                          if (
                            resultItem[aggregateFieldName]?.toString() ===
                              aggregateItem['value']?.toString() &&
                            resultItem[labelFieldName]?.toString() ===
                              labelItem['value']?.toString()
                          ) {
                            count = resultItem[alias] ? resultItem[alias] : 0;
                          }
                        }
                      }
                    }
                  }
                  objData.push(count);
                }
              }
              obj['data'] = objData;
              datasets.push(obj);
            }
          }
        }
      }
    }
    data['labels'] = labels;
    data['datasets'] = datasets;
  }
  let chartsData = {
    name: item?.formDisplayName ? item?.formDisplayName : 'N/A',
    fieldName,
    defaultChartType,
    data
  };

  return chartsData;
};

export const buildList = (item) => {
  const fieldMapById = buildFieldMapById(
    item['fields'] && item['fields'].length > 0 ? item['fields'] : []
  );
  const fields =
    item['fields'] && item['fields'].length > 0 ? item['fields'] : [];
  let options = item['options']
    ? typeof item['options'] === 'string'
      ? JSON.parse(item['options'])
      : item['options']
    : [];
  if (options && options.length > 0) {
    options = options[0];
  }

  const result =
    item['result'] && item['result'].length > 0 ? item['result'] : [];
  let alias = '';
  let fieldName = '';
  if (options) {
    let aggregateField = fieldMapById[options['fieldInfoId']];
    if (aggregateField) {
      alias = aggregateField['name'] + '_' + options['range'];
    }
  }
  let xData = [];
  let yData = [];
  let xField = null;
  if (result.length > 0) {
    const groupBy = options['groupBy'];
    xField = fieldMapById[options['fieldInfoId']];
    if (xField) {
      if (xField['options'] && xField['options'].length > 0) {
        fieldName = xField['label'] ? xField['label'] : '';
        for (const optionItem of xField['options']) {
          if (optionItem) {
            xData.push(optionItem['label']);
          }
        }
      } else {
        for (const group of groupBy) {
          xField = fieldMapById[group];
          if (xField) {
            if (xField['options'] && xField['options'].length > 0) {
              fieldName = xField['label'] ? xField['label'] : '';
              for (const optionItem of xField['options']) {
                if (optionItem) {
                  xData.push(optionItem['label']);
                }
              }
              break;
            }
          }
        }
      }
    }

    if (groupBy && groupBy.length > 0) {
      let firstGroupBy = groupBy[0];
      let firstGroupByField = fieldMapById[Number(firstGroupBy)];
      for (const x of xData) {
        let yValue = 0;
        if (x) {
          yValue = getUniqueValue(result, x, firstGroupByField, alias);
        }
        yData.push(yValue ? Number(yValue) : 0);
      }
    }
  }
  let chartsData = {
    formDisplayName: item?.formDisplayName
      ? item?.formDisplayName
      : 'Loading...',
    fieldName,
    data: yData,
    labels: xData,
    field: xField
  };

  return chartsData;
};

const getUniqueValue = (result, x, firstGroupByField, alias) => {
  let yValue = 0;
  for (const resItem of result) {
    if (resItem) {
      if (resItem[firstGroupByField.name + '_obj']) {
        let yD = resItem[firstGroupByField.name + '_obj'];
        if (yD && yD['label'] === x) {
          return resItem[alias] ? resItem[alias] : 0;
        }
      } else if (resItem[firstGroupByField.name + '_label']) {
        if (resItem[firstGroupByField.name + '_label'] === x) {
          return resItem[alias] ? resItem[alias] : 0;
        }
      }
      // else {
      //   return 0;
      // }
    }
  }
  return yValue;
};
