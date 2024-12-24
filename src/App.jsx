import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Routers from './Routers';
import { colors } from './common/constants/styles';

import { getLoggedInUser } from './redux/slices/authSlice';
import { ToastProvider } from './hooks/toastUtils';
import './App.css';
import { SidebarProvider, SidebarTrigger } from '@/componentss/ui/sidebar';
import { AppSidebar } from '@/pages/sidebar/sidebar';

const App = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.auth);
  const { currentTheme } = useSelector((state) => state.auth);
  const { currentModule } = useSelector((state) => state.current);
  const [theme, setTheme] = useState('');
  const location = useLocation();
  const excludedUrls = ['/login', '/website', '/forgot-password'];
  const isExcluded = excludedUrls.includes(location.pathname);

  useEffect(() => {
    if (isLogin) {
      dispatch(getLoggedInUser());
    }
  }, [isLogin]);

  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, [currentTheme]);

  useEffect(() => {
    const selectedTheme =
      localStorage.getItem('theme') !== 'undefined'
        ? localStorage.getItem('theme')
        : 'Light';

    if (selectedTheme) {
      setTheme(selectedTheme);
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <div>
          {!isExcluded && (
            <AppSidebar
              style={{ width: '250px', zIndex: 30 }}
              currentModule={currentModule}
            />
          )}
        </div>

        <div
          className={` ${isExcluded ? 'w-full' : 'mt-[4.1rem] w-full overflow-hidden'}`}
        >
          <Routers />
          <ToastProvider />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default App;
