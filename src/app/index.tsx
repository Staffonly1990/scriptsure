import React, { FC } from 'react';
import { LastLocationProvider } from 'react-router-last-location';
import './styles/index.css';
import { ErrorBoundaryProvider, RouterProvider, NotifierProvider, BreakpointsProvider, ThemeProvider, LangProvider } from './providers';

import { Routing } from 'views';

const App: FC = () => {
  return (
    <BreakpointsProvider>
      <ErrorBoundaryProvider>
        <LangProvider>
          <ThemeProvider>
            <NotifierProvider>
              <RouterProvider>
                <LastLocationProvider>
                  <Routing />
                </LastLocationProvider>
              </RouterProvider>
            </NotifierProvider>
          </ThemeProvider>
        </LangProvider>
      </ErrorBoundaryProvider>
    </BreakpointsProvider>
  );
};
App.displayName = 'App';

export default App;
