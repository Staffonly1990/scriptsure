/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

const createColor = (rgb) => {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) return `rgba(${rgb}, ${opacityValue})`;
    if (opacityVariable !== undefined) return `rgba(${rgb}, var(${opacityVariable}, 1))`;
    return `rgb(${rgb}))`;
  };
};

module.exports = {
  // eslint-disable-next-line max-len
  mode: 'jit', // preview features are not covered by semver, may introduce breaking changes, and can change at any time.
  purge: {
    // enabled: true, // -> debug <-
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{ts,tsx,js,jsx}', './public/**/*.html'],
  },
  experimental: { darkModeVariant: true },
  darkMode: 'class',
  darkSelector: '.dark',
  theme: {
    screens: {
      xs: '425px',
      ...defaultTheme.screens,
    },
    colors: {
      sky: colors.sky,
      ...defaultTheme.colors,
    },
    extend: {
      zIndex: {
        dropdown: 1000,
        sticky: 1010,
        fixed: 1020,
        offcanvasBackdrop: 1030,
        offcanvas: 1040,
        tooltip: 1090,
        snackbar: 1100,
        popoverBackdrop: 1050,
        popover: 1060,
        modalBackdrop: 1070,
        modalForefront: 1080,
        modal: 1080,
      },
      minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        'dropdown': '8rem',
      },
      maxWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      transitionDuration: {
        '30-fps': `${1000 / 30}ms`,
        '60-fps': `${1000 / 60}ms`,
      },
      animation: {},
      borderStyles: { styles: true, colors: false },
      outline: {
        'access': [`1px solid rgb(var(--color-accent-border-value))`, `0px`],
        'access-offset-1': [`1px solid rgb(var(--color-accent-border-value))`, `1px`],
        '-access-offset-1': [`1px solid rgb(var(--color-accent-border-value))`, `-1px`],
      },
      backgroundColor: {
        primary: createColor('var(--color-primary-bg-value)'),
        secondary: createColor('var(--color-secondary-bg-value)'),
        lightgray: createColor('var(--color-lightgray-bg-value)'),
      },
      borderColor: {
        primary: createColor('var(--color-primary-border-value)'),
        secondary: createColor('var(--color-secondary-border-value)'),
        accent: createColor('var(--color-accent-border-value)'),
      },
      ringColor: {
        primary: createColor('var(--color-primary-border-value)'),
        secondary: createColor('var(--color-secondary-border-value)'),
        accent: createColor('var(--color-accent-border-value)'),
      },
      textColor: {
        primary: createColor('var(--color-primary-text-value)'),
        secondary: createColor('var(--color-secondary-text-value)'),
        accent: createColor('var(--color-accent-text-value)'),
      },
    },
  },
  variants: {
    // backgroundColor: ['dark', 'dark-hover', 'dark-group-hover', 'dark-even', 'dark-odd'],
    // borderColor: ['dark', 'dark-disabled', 'dark-focus', 'dark-focus-within'],
    // textColor: ['dark', 'dark-hover', 'dark-active', 'dark-placeholder'],
    extend: {
      backgroundColor: ['dark', 'dark-hover', 'dark-group-hover', 'dark-even', 'dark-odd'],
      borderColor: ['dark', 'dark-disabled', 'dark-focus', 'dark-focus-within'],
      textColor: ['dark', 'dark-hover', 'dark-active', 'dark-placeholder'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-border-styles')(),
    require('tailwindcss-dark-mode')(),
  ],
  important: false,
};
