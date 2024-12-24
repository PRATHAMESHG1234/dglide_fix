import makeHttpCall from "../axios";

export const fetchWorkflowByPagination = (data) => {
  return makeHttpCall({
    method: "POST",
    url: "/workflow/search",
    data: data,
  });
};

export const fetchWorkFlows = () => {
  return makeHttpCall({
    method: "GET",
    url: "/workflow",
  });
};

export const fetchWorkFlow = (workflowId) => {
  return makeHttpCall({
    method: "GET",
    url: "/workflow/" + workflowId,
  });
};

export const fetchUpdatedDiagram = (data) => {
  return makeHttpCall({
    method: "POST",
    url: "/workflow/save",
    data: data,
  });
};
export const createWorkFlow = (data) => {
  return makeHttpCall({
    method: "POST",
    url: "/workflow",
    data: data,
  });
};

export const updateWorkFlow = (workflowId, data) => {
  return makeHttpCall({
    method: "PUT",
    url: "/workflow/" + workflowId,
    data: data,
  });
};

export const deleteWorkFlow = (workflowId) => {
  return makeHttpCall({
    method: "DELETE",
    url: "/workflow/" + workflowId,
  });
};
export const getOptions = (formName, fieldName) => {
  return makeHttpCall({
    method: "GET",
    url: `/table/${formName}/${fieldName}/option`,
  });
};
// export const workFlowStatusOPn = (data) => {
//   return makeHttpCall({
//     method: 'POST',
//     url: '/workflow/status/option/data',
//     data: data
//   });
// };
export const uploadWorkflowData = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return makeHttpCall({
    method: "POST",
    url: `/workflow/import`,
    data: formData,
  });
};

export const workFlowExportData = (data) => {
  return makeHttpCall({
    method: "POST",
    url: "/workflow/export",
    data: data,
  });
};
