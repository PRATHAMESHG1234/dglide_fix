import { makeETLHttpCall } from '../axios';

export const fetchTypeOfIntegration = (name) => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/type/${name}`
  });
};

export const fetchAllPluginById = () => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/plugins`
  });
};

export const fetchAllObjectById = (id) => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/operations/plugin/${id}`
  });
};
export const fetchNeededJsonById = (id) => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/plugins/${id}/needed-json`
  });
};

export const getPluginDetailBypluginID = (id) => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/plugins/${id}`
  });
};
export const updatePluginById = (id, data) => {
  return makeETLHttpCall({
    method: 'PUT',
    url: `/plugins/${id}`,
    data: data
  });
};

export const deletePlugIn = (id) => {
  return makeETLHttpCall({
    method: 'DELETE',
    url: `/plugins/${id}`
  });
};

export const deleteObject = (id) => {
  return makeETLHttpCall({
    method: 'DELETE',
    url: `/operations/${id}`
  });
};

export const deleteEtlJobs = (id) => {
  return makeETLHttpCall({
    method: 'DELETE',
    url: `/jobs/${id}`
  });
};
export const createNewObject = (data) => {
  return makeETLHttpCall({
    method: 'POST',
    url: '/operations',
    data: data
  });
};

export const createNewEtlJobs = (data) => {
  return makeETLHttpCall({
    method: 'POST',
    url: '/jobs',
    data: data
  });
};
export const updateObject = (id, data) => {
  return makeETLHttpCall({
    method: 'PUT',
    url: `/operations/${id}`,
    data: data
  });
};

export const fetchObjectByObjectId = (id) => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/objects/${id}`
  });
};

export const fetchAllJobs = (id) => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/jobs`
  });
};

export const updateJobByJobID = (id, data) => {
  return makeETLHttpCall({
    method: 'PUT',
    url: `/jobs/${id}`,
    data: data
  });
};

export const fetchEnvByPluinId = (id) => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/environments/plugin/${id}`
  });
};
export const updateEnvironment = (id, data) => {
  return makeETLHttpCall({
    method: 'PUT',
    url: `/environments/${id}`,
    data: data
  });
};
export const createEnvironment = (data) => {
  return makeETLHttpCall({
    method: 'POST',
    url: `/environments`,
    data: data
  });
};

export const fetchAllTransformation = (id) => {
  return makeETLHttpCall({
    method: 'GET',
    url: `/transform`
  });
};
