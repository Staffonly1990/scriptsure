import React, { createContext, useState } from 'react';
import type { ThemeObject } from 'react-json-view';

type ThemeName = 'light' | 'dark' | string;
type ThemeContextType = {
  theme: ThemeName;
  styles: ThemeObject | undefined;
  setTheme: (name: ThemeName) => void;
};

export const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }

  return 'light';
};
export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [styles, setStyles] = useState<ThemeObject | undefined>(undefined);
  const rawSetTheme = (rawTheme) => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(rawTheme);

    localStorage.setItem('color-theme', rawTheme);
  };

  const setStylesReactJson = () => {
    const createElem = (id, className) => {
      const span = document.createElement('span');
      span.id = id;
      span.classList.add(className);
      document.body.append(span);
    };

    const removeElem = (id) => {
      document.body.removeChild(document.getElementById(id) as HTMLElement);
    };

    const getColor = (id) => {
      return window.getComputedStyle(document.getElementById(id) as HTMLElement).color;
    };

    createElem('spanGray50', 'text-gray-50');
    createElem('spanZinc700', 'text-zinc-700');
    createElem('spanBlue500', 'text-blue-500');
    createElem('spanGray700', 'text-gray-700');

    const spanGray50 = getColor('spanGray50');
    const spanZinc700 = getColor('spanZinc700');
    const spanBlue500 = getColor('spanBlue500');
    const spanGray700 = getColor('spanGray700');

    if (theme === 'light') {
      setStyles({
        base00: spanGray50,
        base01: spanGray50,
        base02: spanGray50,
        base03: spanZinc700,
        base04: spanGray50,
        base05: spanZinc700,
        base06: spanZinc700,
        base07: spanZinc700,
        base08: spanZinc700,
        base09: spanBlue500,
        base0A: spanBlue500,
        base0B: spanBlue500,
        base0C: spanBlue500,
        base0D: spanBlue500,
        base0E: spanBlue500,
        base0F: spanBlue500,
      });
    } else {
      setStyles({
        base00: spanGray700,
        base01: spanGray50,
        base02: spanGray50,
        base03: spanGray50,
        base04: spanGray700,
        base05: spanGray50,
        base06: spanGray50,
        base07: spanGray50,
        base08: spanGray50,
        base09: spanBlue500,
        base0A: spanBlue500,
        base0B: spanBlue500,
        base0C: spanBlue500,
        base0D: spanBlue500,
        base0E: spanBlue500,
        base0F: spanBlue500,
      });
    }

    removeElem('spanGray50');
    removeElem('spanBlue500');
    removeElem('spanGray700');
    removeElem('spanZinc700');
  };

  React.useEffect(() => {
    rawSetTheme(theme);
    setStylesReactJson();
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme, styles }}>{children}</ThemeContext.Provider>;
};
ThemeProvider.displayName = 'ThemeProvider';
