import { IntlProvider } from 'react-intl';
import { create } from '@storybook/theming';
import { useDarkMode } from 'storybook-dark-mode';

import { ThemeContext } from 'app/providers/theme.provider';
import { reactIntl } from './reactIntl';

const lightTheme = create({
  base: 'light',
  appBg: '#f7fafc',
});

const darkTheme = create({
  base: 'dark',
  appBg: '#374151',
  appContentBg: '#374151',
});

function ThemeWrapper(props) {
  const isDarkMode = useDarkMode();
  return <ThemeContext.Provider value={isDarkMode ? darkTheme : lightTheme}>{props.children}</ThemeContext.Provider>;
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    classTarget: 'html',
    dark: darkTheme,
    light: lightTheme,
    stylePreview: true,
  },
  reactIntl,
  locale: reactIntl.defaultLocale,
  locales: {
    en: 'en',
    ru: 'ru',
  },
};

// export const decorators = [
//   (Story) => (
//     <IntlProvider >
//       <Story />
//     </IntlProvider>
//   ),
// ];

export const decorators = [
  (renderStory) => (
    <IntlProvider locale={reactIntl.defaultLocale}>
      <ThemeWrapper>{renderStory()}</ThemeWrapper>
    </IntlProvider>
  ),
];
