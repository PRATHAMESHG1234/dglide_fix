import makeHttpCall from '../axios';

export const fetchRecords = async (tableName, data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/table/${tableName}/data/search`,
    data
  });

  if (response?.result === '') {
    return [];
  }

  return {
    totalRecords: response.result.totalRecords,
    data: response?.result?.data
  };
};

export const fetchRecordsBytableName = async (tableName, pageSize = 20) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/table/${tableName}/data/search`,
    data: {
      pagination: {
        pageSize: pageSize,
        page: 0
      },
      where: [],
      sort: []
    }
  });

  if (response?.result === '') {
    return [];
  }

  return {
    totalRecords: response.result.totalRecords,
    data: response?.result?.data
  };
};

export const fetchRecordById = async (tableName, UUID) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/table/${tableName}/data/${UUID}`
  });
  return response.result;
};

export const createCompileTable = (tableName) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${tableName}/save`
  });
};

export const createTable = (formName, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${formName}/fields/save`,
    data
  });
};

export const createTableRecord = (tableName, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${tableName}/data/save`,
    data
  });
};

export const updateTableRecord = (formname, recordid, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: `/table/${formname}/data/update/${recordid}`,
    data
  });
};

export const updateMultipleTableRecord = async (
  tableName,
  selectedRows,
  options
) => {
  const ops = selectedRows.map((ele) => {
    const payload = {};
    options?.forEach((opn) => {
      payload[opn.fieldName] = opn.value;
    });
    return updateTableRecord(tableName, ele, { uuid: ele, ...payload });
  });

  return Promise.all(ops);
};

export const uploadTableData = (tableName, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return makeHttpCall({
    method: 'POST',
    url: `/table/${tableName}/data/upload`,
    data: formData
  });
};

export const importTableData = (formInfoId, file, mappedFields) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mappedFields', mappedFields);
  formData.append('formInfoId', formInfoId);

  return makeHttpCall({
    method: 'POST',
    url: `/dump/data/csv/import`,
    data: formData
  });
};

export const deleteTableRecord = (tableName, UUID) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/table/${tableName}/data/${UUID}`
  });
};

export const deleteTableRecords = (tableName, UUIDs) => {
  return makeHttpCall({
    method: 'DELETE',
    url: `/table/${tableName}/data`,
    data: UUIDs
  });
};

export const fetchTableReferenceDataByUUID = async (fieldInfoId, uuid) => {
  if (!fieldInfoId) {
    return null;
  }
  const refURL = `/field/${fieldInfoId}/table/data/${uuid}`;
  return makeHttpCall({
    method: 'GET',
    url: refURL
  });
};

export const fetchTableReferenceData = async (
  fieldInfoId,
  type,
  recordId,
  pagination,
  sort,
  where = [],
  whereDynamicValue = {}
) => {
  if (!fieldInfoId) {
    return null;
  }
  const refURL = `/field/${fieldInfoId}/table/data`;

  const response = await makeHttpCall({
    method: 'POST',
    url: refURL,
    data: {
      type,
      recordId,
      pagination,
      where,
      sort,
      whereDynamicValue
    }
  });

  if (!response.result.data) {
    return { data: [], totalRecords: 0 };
  }
  return {
    data: response.result.data,

    totalRecords: response.result.totalRecords
  };
};
export const fetchOptionByfieldName = (formName, fieldName) =>
  makeHttpCall({
    method: 'GET',
    url: `/option/${formName}/${fieldName}/data`
  });

export const fetchCountByFilter = (tableName, fieldName, data) =>
  makeHttpCall({
    method: 'POST',
    url: `/table/${tableName}/${fieldName}/option/count`,
    data
  });

export const fetchBatchTableCountValues = (data) =>
  makeHttpCall({
    method: 'POST',
    url: `/field/table/count`,
    data
  });

export const fetchIndivualTableCountValues = (fieldInfoId, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/field/${fieldInfoId}/table/count`,
    data
  });
};
export const fetchReferenceFieldRecordById = async (
  formName,
  fieldName,
  id
) => {
  const refURL = `/table/${formName}/${fieldName}/data?recordId=${id}`;
  return makeHttpCall({
    method: 'GET',
    url: refURL
  });
};
export const fetchRecordbyFormName = (formName, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${formName}/data/fetch`,
    data
  });
};

export const fetchAuditDataByFormName = (formName, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${formName}/audit/data/search`,
    data
  });
};

export const updateBulkRecord = (formName, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${formName}/bulk/data/save`,
    data
  });
};

export const saveTreeData = (formName, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/table/${formName}/tree/data/save`,
    data
  });
};
