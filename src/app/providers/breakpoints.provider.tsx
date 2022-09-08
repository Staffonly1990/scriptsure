import React, { FC } from 'react';
import { useMediaPredicate } from 'react-media-hook';

import { OBreakpoints } from 'shared/config';
import { BreakpointsContext, Breakpoints } from 'shared/lib/media.breakpoints';

/**
 * @provider Breakpoints
 */
export const BreakpointsProvider: FC = ({ children }) => {
  const breakpoints: Breakpoints = {
    'xs': useMediaPredicate(OBreakpoints.xs),
    'sm': useMediaPredicate(OBreakpoints.sm),
    'md': useMediaPredicate(OBreakpoints.md),
    'lg': useMediaPredicate(OBreakpoints.lg),
    'xl': useMediaPredicate(OBreakpoints.xl),
    '2xl': useMediaPredicate(OBreakpoints['2xl']),
  };
  return <BreakpointsContext.Provider value={breakpoints}>{children}</BreakpointsContext.Provider>;
};
BreakpointsProvider.displayName = 'BreakpointsProvider';
