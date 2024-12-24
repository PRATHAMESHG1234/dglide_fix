import makeHttpCall from '../axios';

export const createTreeNode = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: '/tree',
    data
  });
  return response;
};

export const fetchTreeByFieldId = async (fieldId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/tree/field/${fieldId}`
  });
  return response.result;
};

export const deleteTreeNode = async (nodeId) => {
  const response = await makeHttpCall({
    method: 'DELETE',
    url: `/tree/${nodeId}`
  });
  return response;
};

export const editTreeNode = async (nodeId, data) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/tree/${nodeId}`,
    data
  });
  return response;
};
