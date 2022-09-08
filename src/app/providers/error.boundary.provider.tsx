import React, { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from 'features/error';

/**
 * @provider ErrorBoundary
 */
export const ErrorBoundaryProvider: FC = ({ children }) => {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};
ErrorBoundaryProvider.displayName = `ErrorBoundaryProvider`;
