import makeHttpCall from '../axios';

export const createTemplate = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: '/form/template',
    data
  });
  return response;
};

export const fetchAllTemplates = async () => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/form/template`
  });
  return response;
};

export const fetchTemplateByRecordId = async (tempId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/form/template/${tempId}`
  });
  return response;
};

export const deleteTemplate = async (tempId) => {
  const response = await makeHttpCall({
    method: 'DELETE',
    url: `/form/template/${tempId}`
  });
  return response;
};

export const editTemplate = async (data, tempId) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/form/template/${tempId}`,
    data
  });
  return response;
};

export const fetchAllTemplateByFormInfoId = async (formId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/form/template/form/${formId}`
  });
  return response;
};

export const fetchTemplateDetailsByRecordId = async (recordId) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/form/template/${recordId}/record/insert`
  });
  return response;
};
