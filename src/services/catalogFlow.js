import makeHttpCall from '../axios';
import { fetchModules } from './module';

export const fetchFieldLookupValues = async (data, record) => {
  const fields = [];
  if (data) {
    await Promise.all(
      data?.map(async (element) => {
        let referenceDropdownData = [];
        let lookupDropdownData = [];
        let moduleData = [];
        let payload = {};
        if (element.category === 'ModuleForm') {
          if (element.variant === 'Module') {
            const response = await fetchModules();
            const data = response?.result;
            if (data) {
              moduleData = data.map((d) => {
                return {
                  value: d.moduleInfoId,
                  label: d.displayName
                };
              });
            }
          }
        } else if (element.lookup) {
          payload = {};
          payload['filter'] = null;
          payload['conditions'] = [];
          payload['fieldInfoId'] = element.lookup['fieldInfoId'];
          payload['formInfoId'] = element.lookup['formInfoId'];
          payload['grid'] =
            element['variant'] && element['variant'] === 'Grid' ? true : false;
          payload['dependent'] = false;
          if (
            element.lookup.conditions &&
            element.lookup.conditions.length > 0
          ) {
            for (const item of element.lookup.conditions) {
              if (item) {
                payload['conditions'].push({
                  dependent: item?.dependent ? item?.dependent : false,
                  fieldInfoId: item?.fieldInfoId ? item?.fieldInfoId : 0,
                  operator: item?.operator ? item?.operator : null,
                  value: item?.value ? item?.value : null
                });
              }
            }
            for (const item of payload['conditions']) {
              if (item?.dependent) {
                payload['dependent'] = true;
              }
            }
          }
          payload['requestFieldType'] = element['category'];
          if (!payload.dependent) {
            payload['responseFieldType'] = element['category'];
          } else if (payload.dependent) {
            payload['responseFieldType'] = element['category'];
          }

          if (payload['fieldInfoId']) {
            if (payload['dependent'] === false) {
              const response = await fetchCreatorLookupValues(payload);
              if (response.result) {
                const dropdownData = response.result ? response.result : [];

                if (element.category === 'Reference') {
                  referenceDropdownData = dropdownData;
                }
                if (element.category === 'Lookup') {
                  lookupDropdownData = dropdownData;
                }
              }
            }
          }
        }
        const obj = {
          ...element,
          referenceDropdownData,
          lookupDropdownData,
          moduleData
        };
        fields.push(obj);
      })
    );

    const sortedByColumnIndex = fields?.sort(
      (a, b) => a.columnIndex - b.columnIndex
    );

    return sortedByColumnIndex;
  }
};

export const fetchCreatorLookupValues = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/lookup/data',
    data: data
  });
};

export const fetchCatalogFlows = () => {
  return makeHttpCall({
    method: 'GET',
    url: '/catalogflow'
  });
};

export const fetchCatalogFlow = (catalogflowId) => {
  return makeHttpCall({
    method: 'GET',
    url: '/catalogflow/' + catalogflowId
  });
};

export const createCatalogFlow = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/catalogflow',
    data: data
  });
};

export const deleteCatalogFlow = (catalogflowId) => {
  return makeHttpCall({
    method: 'DELETE',
    url: '/catalogflow/' + catalogflowId
  });
};

export const updateCatalogFlow = (catalogflowId, data) => {
  return makeHttpCall({
    method: 'PUT',
    url: '/catalogflow/' + catalogflowId,
    data: data
  });
};

export const getCatagoryList = () => {
  return makeHttpCall({
    method: 'POST',
    url: '/catalogflow/category/lookup/data',
    data: {}
  });
};

export const getSubCatagoryList = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/catalogflow/sub-category/lookup/data',
    data: data
  });
};
export const doUpdateRequest = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/catalogflow/requests',
    data: data
  });
};
export const getAllStatusList = () => {
  return makeHttpCall({
    method: 'POST',
    url: '/catalogflow/requests/status/option/data',
    data: {}
  });
};

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return makeHttpCall({
    method: 'POST',
    url: '/option/s3/upload',
    data: formData
  });
};
