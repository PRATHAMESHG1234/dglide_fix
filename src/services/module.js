import makeHttpCall from '../axios';

export const fetchModules = () => {
  return makeHttpCall({
    method: 'GET',
    url: '/module'
  });
};

export const fetchModuleById = (id) => {
  return makeHttpCall({
    method: 'GET',
    url: '/module/' + id
  });
};

export const fetchModuleByName = (name) => {
  return makeHttpCall({
    method: 'GET',
    url: '/module/name/' + name
  });
};

export const createModule = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/module',
    data
  });
};

export const editModule = (id, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: '/module/' + id,
    data
  });
};

export const deleteModule = (id) => {
  return makeHttpCall({
    method: 'DELETE',
    url: '/module/' + id
  });
};

export const uploadModuleLogo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const data = await makeHttpCall({
    method: 'POST',
    url: '/module/upload',
    data: formData
  });
  return data;
};

export const ImportSchema = async (file, id) => {
  const fromData = new FormData();
  fromData.append('file', file);
  fromData.append('moduleInfoId', id);

  const data = await makeHttpCall({
    method: 'POST',
    url: '/dump/read/json',
    data: fromData
  });
  return data;
};

export const fetchModuleFormNestedTree = () => {
  return makeHttpCall({
    method: 'GET',
    url: '/module/form/all'
  });
};
