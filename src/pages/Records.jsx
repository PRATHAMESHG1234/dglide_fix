import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchFieldPreference,
  fetchFieldsByFormId
} from '../redux/slices/fieldSlice';
import DataGridTableX from '../components/records/data-grid/DataGridTableX';

const Records = () => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state) => state.current);

  useEffect(() => {
    if (currentForm) {
      dispatch(fetchFieldsByFormId({ formInfoId: currentForm.formInfoId }));
      dispatch(fetchFieldPreference({ formInfoId: currentForm.formInfoId }));
    }
  }, [currentForm, dispatch]);

  return <DataGridTableX />;
};

export default Records;
