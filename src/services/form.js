import makeHttpCall from '../axios';

export const fetchForms = () => {
  return makeHttpCall({
    method: 'GET',
    url: '/form'
  });
};

export const fetchFormById = (id) => {
  return makeHttpCall({
    method: 'GET',
    url: '/form/' + id
  });
};

export const fetchFormByName = (name) => {
  return makeHttpCall({
    method: 'GET',
    url: '/form/name/' + name
  });
};

export const fetchFormsByModuleId = (id) => {
  return makeHttpCall({
    method: 'GET',
    url: '/form/module/' + id
  });
};

export const fetchCompliedFormsByModuleId = (id) => {
  return makeHttpCall({
    method: 'GET',
    url: '/form/compiled/module/' + id
  });
};

export const createForm = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/form',
    data
  });
};

export const editForm = (id, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: '/form/' + id,
    data
  });
};

export const deleteForm = (id) => {
  return makeHttpCall({
    method: 'DELETE',
    url: '/form/' + id
  });
};

export const uploadFormLogo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const data = await makeHttpCall({
    method: 'POST',
    url: '/form/upload',
    data: formData
  });
  return data;
};

export const moveToAnotherModule = (formInfoId, moduleInfoId) => {
  return makeHttpCall({
    method: 'POST',
    url: `/form/${formInfoId}/move/module/${moduleInfoId}`
  });
};

export const renameForm = (formInfoId, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/form/${formInfoId}/rename`,
    data
  });
};
export const sliceFieldlist = (formId) => {
  try {
    const response = makeHttpCall({
      method: 'GET',
      url: `/api/v1/dump/form/${formId}`
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFormData = (formname, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: `/table/${formname}/data/update/${data.uuid}`,
    data
  });
};

export const fetchTreeListByFormName = (formName) => {
  return makeHttpCall({
    method: 'GET',
    url: `/form/name/${formName}/tree/list`
  });
};

export const fetchTreeListByFormId = (formId) => {
  return makeHttpCall({
    method: 'GET',
    url: `/form/${formId}/tree/list`
  });
};

export const fetchTreeStructureByFormName = (formName) => {
  return makeHttpCall({
    method: 'GET',
    url: `/form/name/${formName}/tree/structure`
  });
};

export const fetchTreeStructureByFormId = (formId) => {
  return makeHttpCall({
    method: 'GET',
    url: `/form/${formId}/tree/structure`
  });
};

export const fetchParentTreeListByChildFormId = (formId) => {
  return makeHttpCall({
    method: 'GET',
    url: `/form/${formId}/with/parent/list`
  });
};

export const sendMail = async (payload) => {
  try {
    const response = await makeHttpCall({
      method: 'POST',
      url: `/notification`,
      data: payload
    });
    return response;
  } catch (error) {
    throw error;
  }
};
