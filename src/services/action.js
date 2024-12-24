import makeHttpCall from '../axios';

export const fetchActions = async (formInfoId = 0) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/action/form/${formInfoId}`
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

export const fetchAction = async (actionInfoId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/action/${actionInfoId}`
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

export const fetchActionsByModuleOrFormId = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/action/search`,
    data
  });
  const result = response.result;

  const newRes = result?.data?.map((ele) => {
    return {
      ...ele,
      options: JSON.parse(ele.options)
    };
  });

  return newRes;
};

export const createAction = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/action`,
    data
  });
};

export const updateAction = (actionInfoId, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: `/action/${actionInfoId}`,
    data
  });
};

export const deleteAction = (actionInfoId) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/action/${actionInfoId}`
  });
};
