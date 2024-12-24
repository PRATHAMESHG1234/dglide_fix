import makeHttpCall from '../axios';

export const fetchFieldPreference = (formInfoId) => {
  return makeHttpCall({
    method: 'GET',
    url: `/form/${formInfoId}/field/preference`
  });
};

export const createFieldPreference = (formInfoId, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/form/${formInfoId}/field/preference`,
    data
  });
};

export const fetchFilterPreference = (formInfoId) => {
  return makeHttpCall({
    method: 'GET',
    url: `/form/${formInfoId}/search/preference`
  });
};

export const createFilterPreference = (formInfoId, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/form/${formInfoId}/search/preference`,
    data
  });
};

export const updateFilterPreference = (formInfoId, preferenceId, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: `/form/${formInfoId}/search/preference/${preferenceId}`,
    data
  });
};

export const deleteFilterPreference = (formInfoId, preferenceId) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/form/${formInfoId}/search/preference/${preferenceId}`
  });
};

export const fetchGridFieldPreference = (fieldInfoId) => {
  return makeHttpCall({
    method: 'GET',
    url: `/field/${fieldInfoId}/grid/field/preference`
  });
};

export const createGridFieldPreference = (fieldInfoId, data) => {
  return makeHttpCall({
    method: 'Post',
    url: `/field/${fieldInfoId}/grid/field/preference`,
    data
  });
};
