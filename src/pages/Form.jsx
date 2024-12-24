import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Home from '../components/form/Home';
import { fetchFormsByModuleId } from '../redux/slices/formSlice';
import { fetchModules } from '../redux/slices/moduleSlice';

const Form = () => {
  const dispatch = useDispatch();
  const { currentModule } = useSelector((state) => state.current);

  useEffect(() => {
    if (currentModule) {
      dispatch(fetchFormsByModuleId({ moduleId: currentModule?.moduleInfoId }));
      dispatch(fetchModules());
    }
  }, [currentModule]);

  return <Home />;
};

export default Form;
