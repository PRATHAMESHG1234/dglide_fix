import makeHttpCall from '../axios';

export const fetchFieldGroups = async (formInfoId = 0) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/field/group/form/${formInfoId}`
  });
  const result = response.result;
  return result;
};

export const fetchFieldGroup = async (fieldGroupInfoId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/field/group/${fieldGroupInfoId}`
  });
  const result = response.result;
  return result;
};

export const createFieldGroup = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/field/group`,
    data
  });
};

export const updateFieldGroup = (fieldGroupInfoId, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: `/field/group/${fieldGroupInfoId}`,
    data
  });
};

export const deleteFieldGroup = (fieldGroupInfoId) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/field/group/${fieldGroupInfoId}`
  });
};

export const deleteAllFieldGroup = (formInfoId) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/field/group/form/${formInfoId}`
  });
};
