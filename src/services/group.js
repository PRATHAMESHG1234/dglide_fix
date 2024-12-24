import makeHttpCall from '../axios';

export const fetchGroups = () => {
  return makeHttpCall({
    method: 'GET',
    url: '/group'
  });
};

export const fetchGroup = (id) => {
  return makeHttpCall({
    method: 'GET',
    url: '/group/' + id
  });
};

export const createGroup = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/group',
    data: data
  });
};

export const updateGroup = (id, data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/group/' + id,
    data: data
  });
};

export const deleteGroup = (id) => {
  return makeHttpCall({
    method: 'DELETE',
    url: '/group/' + id
  });
};
