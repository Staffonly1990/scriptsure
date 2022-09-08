import React, { useContext, memo, FC } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';
import { ThemeContext } from 'app/providers/theme.provider';

const ThemeSwitcher: FC = memo(() => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className="transition duration-500 ease-in-out rounded-full p-2">
      {theme === 'dark' ? (
        <SunIcon onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-4 h-4 text-gray-500 dark:text-white text-xl cursor-pointer" />
      ) : (
        <MoonIcon onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-4 h-4 text-gray-500 dark:text-gray-400 text-xl cursor-pointer" />
      )}
    </div>
  );
});
ThemeSwitcher.displayName = 'ThemeSwitcher';

export default ThemeSwitcher;
