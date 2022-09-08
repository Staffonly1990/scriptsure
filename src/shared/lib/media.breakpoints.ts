import { createContext, useContext } from 'react';

import { OBreakpoints } from 'shared/config';

export type Breakpoints = { [K in keyof typeof OBreakpoints]: boolean };

export const BreakpointsContext = createContext<Breakpoints>({
  'xs': false,
  'sm': false,
  'md': false,
  'lg': false,
  'xl': false,
  '2xl': false,
});

export const useBreakpoints = () => useContext(BreakpointsContext);
