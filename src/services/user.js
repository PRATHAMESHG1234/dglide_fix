import makeHttpCall from '../axios';

export const fetchUsers = () => {
  return makeHttpCall({
    method: 'GET',
    url: '/user'
  });
};

export const fetchUser = (id) => {
  return makeHttpCall({
    method: 'GET',
    url: '/user/' + id
  });
};

export const createUser = (data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/user',
    data: data
  });
};

export const updateUser = (id, data) => {
  return makeHttpCall({
    method: 'POST',
    url: '/user/' + id,
    data: data
  });
};

export const deleteUser = (id) => {
  return makeHttpCall({
    method: 'DELETE',
    url: '/user/' + id
  });
};
