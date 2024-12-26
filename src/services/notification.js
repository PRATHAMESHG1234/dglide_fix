import makeHttpCall from '../axios';

export const fetchMsgTemplateByPagination = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/notification/msg/template/search',
    data: data
  });
};
