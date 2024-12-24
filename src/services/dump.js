import makeHttpCall from '../axios';

export const fetchDumps = async (formInfoId = 0) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/dump/form/${formInfoId}`
  });
  const result = response.result;
  return result;
};

export const deleteDump = (dumpInfoId) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/dump/${dumpInfoId}`
  });
};

export const downloadDump = (dumpInfoId) => {
  return makeHttpCall({
    method: 'GET',
    url: `/dump/${dumpInfoId}/download`,
    responseType: 'arraybuffer'
  });
};

export const createDump = (tableName) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${tableName}/schema/json/dump`
  });
};
export const createCsvDataDump = (tableName, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${tableName}/data/csv/dump`,
    data: data
  });
};

export const getDumpByFilter = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/dump/list/fetch`,
    data: data
  });
};

export const getDumpBySchema = (file, moduleInfoId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('moduleInfoId', moduleInfoId);

  return makeHttpCall({
    method: 'POST',
    url: `/dump/schema/json/import`,
    data: formData
  });
};