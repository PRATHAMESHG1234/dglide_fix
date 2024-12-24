import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Home from '../components/field/Home';
import { fetchModules } from '../redux/slices/moduleSlice';

const Field = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchModules());
  }, []);

  return <Home />;
};

export default Field;
