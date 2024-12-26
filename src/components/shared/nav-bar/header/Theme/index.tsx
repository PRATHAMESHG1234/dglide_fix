/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.894Z
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from '../../../../../redux/slices/authSlice';
import { useTheme } from 'next-themes';
import { Button } from '@/componentss/ui/button';
import { Moon, Sun } from 'lucide-react';

const icons: Record<string, JSX.Element> = {
  Dark: <Moon size={16} />,
  Light: <Sun size={16} />
};

interface RootState {
  auth: {
    currentTheme: string;
    themeLabel: string;
  };
}

const ThemeSection: React.FC = () => {
  const { themeLabel, currentTheme } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const { theme, setTheme } = useTheme();

  const themes = [
    { value: '2', label: 'Light', icon: icons.Light },
    { value: '3', label: 'Dark', icon: icons.Dark }
  ];

  const toggleTheme = () => {
    const nextTheme =
      themes[
        (themes.findIndex((t) => t.label === themeLabel) + 1) % themes.length
      ];
    dispatch(updateTheme({ theme: nextTheme.value }));
    setTheme(theme?.toLowerCase() === 'light' ? 'dark' : 'Light');
  };
  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme?.toLowerCase() === 'light' ? 'Light' : 'dark');
    }
  }, [currentTheme]);

  return (
    <Button
      variant="ghost"
      className="bg-accent p-2 text-primary transition-all duration-200 hover:bg-gray-200 hover:text-primary"
      onClick={toggleTheme}
    >
      {icons[themeLabel] || icons.Light}
    </Button>
  );
};

export default ThemeSection;
