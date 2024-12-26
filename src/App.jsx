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

  const location = useLocation();
  const excludedUrls = ['/login', '/website', '/forgot-password'];
  const isExcluded = excludedUrls.includes(location.pathname);
  const [theme, setTheme] = useState(() => {
    // Load initial value from local storage
    return localStorage.getItem('mode') || '';
  });

  useEffect(() => {
    if (isLogin) {
      dispatch(getLoggedInUser()).then((res) => {
        const mode = res?.payload?.theme;
        localStorage.setItem('mode', mode);
      });
    }
  }, [isLogin]);

  useEffect(() => {
    if (theme) {
      const themeMode = localStorage.getItem('mode') || theme;
      const themes = ['default', 'forest', 'ruby', 'solar', 'ocean'];
      document.documentElement.className = themes[themeMode - 1] || 'default';
    }
  }, [theme]);

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
