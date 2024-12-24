import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Home from '../components/module/Home';
import { fetchModules } from '../redux/slices/moduleSlice';

const Module = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchModules());
  }, []);

  return <Home />;
};

export default Module;
