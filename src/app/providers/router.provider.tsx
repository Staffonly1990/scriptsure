import React, { FC, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Spinner from 'shared/ui/spinner';

/**
 * @provider Router
 */
export const RouterProvider: FC = ({ children }) => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner className="w-24 h-24" size={null} beyond />}>{children}</Suspense>
    </BrowserRouter>
  );
};
RouterProvider.displayName = `RouterProvider`;
