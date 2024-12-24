import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import {
  fetchFormByName,
  fetchModuleByName,
  setCurrentModule
} from '../../../redux/slices/currentSlice';

import TopBar from './TopBar';
import { openSidebar, toggleSidebar } from '../../../redux/slices/sidebarSlice';
import { fetchFormsByModuleId } from '../../../redux/slices/formSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { moduleName, formName } = useParams();
  const { isLogin } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state.sidebar);
  //const [expand, setExpand] = useState(false);
  const [flag, setFlag] = useState(false);
  const { currentModule } = useSelector((state) => state.current);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (moduleName) dispatch(fetchModuleByName({ name: moduleName }));
    else dispatch(setCurrentModule({ module: null }));
  }, [dispatch, moduleName]);

  useEffect(() => {
    if (currentUser && currentUser?.role?.name !== 'Super Admin' && isLogin) {
      dispatch(
        setCurrentModule({
          module: {
            ...currentUser?.modules[0],
            moduleInfoId: currentUser?.modules[0]?.moduleId
          }
        })
      );
    }
  }, [currentUser, isLogin]);

  useEffect(() => {
    if (currentModule) {
      dispatch(fetchFormsByModuleId({ moduleId: currentModule?.moduleInfoId }));
    }
  }, [currentModule]);

  useEffect(() => {
    dispatch(fetchFormByName({ name: formName }));
  }, [dispatch, formName]);
  const appBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (appBarRef.current && !appBarRef.current.contains(event.target)) {
        // setExpand(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isLogin) return null;

  const goToRecordPanel = (form) => {
    navigate(`/app/${currentModule?.name}/${form?.name}`);
  };

  return (
    <Box>
      <CssBaseline />

      <TopBar
        goToRecordPanel={goToRecordPanel}
        onDrawerToggle={() => {
          dispatch(toggleSidebar());
        }}
        appBarRef={appBarRef}
        expand={isOpen}
        flag={flag}
        setFlag={setFlag}
      />
    </Box>
  );
};

export default NavBar;
