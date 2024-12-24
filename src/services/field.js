import { FIELD } from '../common/constants/fields';
import makeHttpCall from '../axios';
import { fetchModules } from './module';

export const fetchFieldsByFormId = (formInfoId) => {
  const formId = parseInt(formInfoId, 10);

  if (!isNaN(formId)) {
    return makeHttpCall({
      method: 'GET',
      url: '/field/form/' + formId
    });
  } else {
    console.error('Invalid formInfoId: Must be a valid integer.');
    return null;
  }
};

export const fetchFieldObjectByFormId = async (formInfoId) => {
  const formId = parseInt(formInfoId, 10);

  if (!isNaN(formId)) {
    const response = await makeHttpCall({
      method: 'GET',
      url: '/field/form/' + formId
    });
    const result = response.result;
    const fieldArr = result?.map((field) => {
      return {
        [field.name]: field.label
      };
    });
    const transformedObject = {};

    fieldArr.forEach((obj) => {
      for (const key in obj) {
        transformedObject[key] = obj[key];
      }
    });
    return transformedObject;
  } else {
    console.error('Invalid formInfoId: Must be a valid integer.');
    return null;
  }
};

export const fetchFieldsWithValues = async (fieldsData, tableRecord) => {
  try {
    const modifiedFieldsData = [];
    const lookupPayload = {};

    for (const field of fieldsData) {
      if (field) {
        if (field.lookup) {
          if (field.dependent && tableRecord?.uuid) {
            if (
              (field.category === 'Reference' &&
                field.variant === 'Dropdown') ||
              field.category === 'Lookup'
            ) {
              const payload = {};
              for (const condition of field.lookup.conditions) {
                if (condition.dependent) {
                  payload[condition.value] = tableRecord[condition.value];
                }
              }
              lookupPayload[field.fieldInfoId] = {
                ...payload
              };
            }
          } else if (!field.dependent) {
            if (
              (field.category === 'Reference' &&
                field.variant === 'Dropdown' &&
                !field.systemDefaultField) ||
              field.category === 'Lookup'
            ) {
              lookupPayload[field.fieldInfoId] = {};
            }
          }
        }
      }
    }

    const lookupRes = await fetchBatchLookupValues(lookupPayload);

    await Promise.all(
      fieldsData?.map(async (field) => {
        let referenceDropdownData = [];
        let lookupDropdownData = [];
        let moduleData = [];

        if (field.category === 'ModuleForm' && field.variant === 'Module') {
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

        if (field.lookup) {
          const dropdownData =
            lookupRes.result[field.fieldInfoId] &&
            lookupRes.result[field.fieldInfoId].length > 0
              ? lookupRes.result[field.fieldInfoId]
              : [];

          if (field.category === 'Reference') {
            if (field.variant === 'Grid' && tableRecord?.uuid) {
              const key = `${field.name}_obj`;
              const refData = tableRecord[key];
              if (refData) referenceDropdownData = [refData];
            } else if (field.variant === 'Dropdown') {
              referenceDropdownData = dropdownData;
            }
          }
          if (field.category === 'Lookup') {
            lookupDropdownData = dropdownData;
          }
        }

        const obj = {
          ...field,
          referenceDropdownData,
          lookupDropdownData,
          moduleData
        };
        modifiedFieldsData.push(obj);
      })
    );

    const sortedByColumnIndex = modifiedFieldsData?.sort(
      (a, b) => a.columnIndex - b.columnIndex
    );

    return sortedByColumnIndex;
  } catch (e) {
    console.error('fetchFieldsWithValues => ', e);
    return null;
  }
};

export const fetchFieldsWithValuesForReference = async (formInfoId) => {
  const formId = parseInt(formInfoId, 10);

  if (!isNaN(formId)) {
    try {
      const response = await makeHttpCall({
        method: 'GET',
        url: '/field/form/' + formId
      });
      const fieldsData = response?.result;

      const modifiedFieldsData = [];

      await Promise.all(
        fieldsData?.map(async (element) => {
          let referenceDropdownData;
          let lookupDropdownData;
          if (!element.dependent && element.lookup) {
            if (element.category === 'Reference') {
              const response = await fetchRefLookupValuesByFieldInfoId(
                element.fieldInfoId,
                {
                  pagination: null,
                  payload: {},
                  search: null
                }
              );
              referenceDropdownData = response?.result;
            }
            if (element.category === 'Lookup') {
              const response = await fetchRefLookupValuesByFieldInfoId(
                element.fieldInfoId,
                {
                  pagination: null,
                  payload: {},
                  search: null
                }
              );
              lookupDropdownData = response?.result;
            }
          }

          const obj = {
            ...element,
            referenceDropdownData,
            lookupDropdownData
          };
          modifiedFieldsData.push(obj);
        })
      );

      const sortedByColumnIndex = modifiedFieldsData?.sort(
        (a, b) => a.columnIndex - b.columnIndex
      );

      return sortedByColumnIndex;
    } catch (e) {
      console.error('fetchFieldsWithValues => ', e);
      return null;
    }
  } else {
    console.error('Invalid formInfoId: Must be a valid integer.');
    return null;
  }
};
export const fetchFieldsWithValuesForSearchFilter = async (formInfoId) => {
  const formId = parseInt(formInfoId, 10);

  if (!isNaN(formId)) {
    try {
      const response = await makeHttpCall({
        method: 'GET',
        url: '/field/form/' + formId
      });
      const fieldsData = response?.result;

      const modifiedFieldsData = [];

      await Promise.all(
        fieldsData?.map(async (element) => {
          let referenceDropdownData;
          let lookupDropdownData;
          if (element.category === 'Reference') {
            const response = await fetchRefLookupValuesByFieldInfoId(
              element.fieldInfoId,
              {
                pagination: null,
                payload: {},
                search: null
              }
            );
            referenceDropdownData = response?.result;
          }
          if (element.category === 'Lookup') {
            const response = await fetchRefLookupValuesByFieldInfoId(
              element.fieldInfoId,
              {
                pagination: null,
                payload: {},
                search: null
              }
            );
            lookupDropdownData = response?.result;
          }
          const obj = {
            ...element,
            referenceDropdownData,
            lookupDropdownData
          };
          modifiedFieldsData.push(obj);
        })
      );

      const sortedByColumnIndex = modifiedFieldsData?.sort(
        (a, b) => a.columnIndex - b.columnIndex
      );

      return sortedByColumnIndex;
    } catch (e) {
      console.error('fetchFieldsWithValues => ', e);
      return null;
    }
  } else {
    console.error('Invalid formInfoId: Must be a valid integer.');
    return null;
  }
};

export const fetchParentFormByFieldInfoId = (fieldInfoId) => {
  return makeHttpCall({
    method: 'GET',
    url: `/field/${fieldInfoId}/parent/form`
  });
};

export const fetchBatchLookupValues = (data) =>
  makeHttpCall({
    method: 'POST',
    url: `/field/lookup/data`,
    data
  });

export const fetchRefLookupValuesByFieldInfoId = (fieldInfoId, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/field/${fieldInfoId}/lookup/data`,
    data
  });
};
//
export const fetchIndivualReferenceGridValues = (fieldInfoId, data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/field/${fieldInfoId}/lookup/grid/data`,
    data
  });
};

export const fetchLookupValues = (fieldInfoId, data) => {
  makeHttpCall({
    method: 'POST',
    url: `/lookup/distinct/data/${fieldInfoId}`,
    data
  });
};

export const fetchReferenceValues = (fieldInfoId, data) => {
  makeHttpCall({
    method: 'POST',
    url: `/lookup/data/${fieldInfoId}`,
    data
  });
};

export const fetchReferenceGridTableData = (fieldInfoId, data) => {
  makeHttpCall({
    method: 'POST',
    url: `/lookup/grid/data/${fieldInfoId}`,
    data
  });
};
