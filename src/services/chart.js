import makeHttpCall from '../axios';

function isJSON(str) {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
}

export const fetchCharts = async (moduleInfoId) => {
  if (
    moduleInfoId !== undefined &&
    moduleInfoId !== null &&
    !moduleInfoId !== ''
  ) {
    const response = await makeHttpCall({
      method: 'GET',
      url: `/dashboard/item/module/${moduleInfoId}`
    });
    const result = response.result;
    for (let item of result) {
      if (item) {
        if (item.options) {
          item.options = isJSON(item.options) ? JSON.parse(item.options) : null;
        }
      }
    }
    return result;
  }
  return [];
};

export const fetchChartDetailByModuleInfoId = async (moduleInfoId = 23) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/dashboard/item/detail/module/${(moduleInfoId = 23)}`
  });

  return response.result;
};

export const fetchChart = async (dashboardItemInfoId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/dashboard/item/${dashboardItemInfoId}`
  });
  const result = response.result;
  const newRes = result.map((ele) => {
    return {
      ...ele,
      options: JSON.parse(ele.options)
    };
  });
  return newRes;
};

export const createChart = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/dashboard/item`,
    data
  });
};

export const updateChart = (dashboardItemInfoId, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: `/dashboard/item/${dashboardItemInfoId}`,
    data
  });
};

export const deleteChart = (dashboardItemInfoId) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/dashboard/item/${dashboardItemInfoId}`
  });
};

export const createDashboard = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/dashboard`,
    data
  });
};

export const updateDashboard = (dashboardInfoId, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: `/dashboard/${dashboardInfoId}`,
    data
  });
};

export const deleteDashboard = (dashboardInfoId) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/dashboard/${dashboardInfoId}`
  });
};

export const fetchDashboardsByModuleInfoId = async (moduleInfoId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/dashboard/module/${moduleInfoId}`
  });

  return response.result;
};

export const fetchDashboardByDashboardInfoId = async ({
  dashboardInfoId,
  data
}) => {
  if (dashboardInfoId) {
    const response = await makeHttpCall({
      method: 'POST',
      url: `/dashboard/${dashboardInfoId}/fetch`,
      data: data
    });
    return response.result;
  }
  throw new Error('Invalid dashboardInfoId');
};

// export const fetchDashboardByDashboardInfoId = async ({ dashboardInfoId }) => {
//   const response = await makeHttpCall({
//     method: 'GET',
//     url: `/dashboard/${dashboardInfoId}`
//   });

//   return response.result;
// };

export const fetchConfigDetail = async (dashboardItemInfoId) => {
  if (
    dashboardItemInfoId !== undefined &&
    dashboardItemInfoId !== null &&
    dashboardItemInfoId !== ''
  ) {
    const response = await makeHttpCall({
      method: 'GET',
      url: `/dashboard/item/${dashboardItemInfoId}`
    });
    return response.result;
  }
  return null;
};

export const getPreviewDetail = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/dashboard/item/preview`,
    data
  });

  return response.result;
};
