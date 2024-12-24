export const useLocalStorage = () => {
  const get = (key) => {
    return JSON.parse(window.localStorage.getItem(key)) || null;
  };
  const set = (keyName, newValue) => {
    window.localStorage.setItem(keyName, JSON.stringify(newValue));
  };
  const remove = (keyName) => {
    window.localStorage.removeItem(keyName);
  };
  return { get, set, remove };
};
