import makeHttpCall from '../axios';

const isValidId = (id) => id !== undefined && id !== null && id !== '';

export const fetchUIRulesByFormId = (formInfoId) => {
  if (isValidId(formInfoId)) {
    return makeHttpCall({
      method: 'GET',
      url: '/rule-validation/form/' + formInfoId
    });
  }
};

export const fetchUIRuleByRuleId = async (ruleId) => {
  if (isValidId(ruleId)) {
    return makeHttpCall({
      method: 'GET',
      url: '/rule-validation/' + ruleId
    });
  }
};

export const fetchUIRulesByModuleOrFormId = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/rule-validation/search`,
    data
  });
  const result = response?.result;

  return result;
};

export const createUIRule = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: `/rule-validation`,
    data
  });
};

export const updateUIRule = (ruleId, data) => {
  if (isValidId(ruleId)) {
    return makeHttpCall({
      method: 'PUT',
      url: `/rule-validation/${ruleId}`,
      data
    });
  }
};

export const deleteUIRuleByRuleId = (ruleId) => {
  if (isValidId(ruleId)) {
    return makeHttpCall({
      method: 'DELETE',
      url: `/rule-validation/${ruleId}`
    });
  }
};

export const deleteUIRuleByFormId = (formId) => {
  if (isValidId(formId)) {
    return makeHttpCall({
      method: 'DELETE',
      url: `/rule-validation/form/${formId}`
    });
  }
};
