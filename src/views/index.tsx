import React, { FC, ComponentType, lazy, memo } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';

import { routes } from 'shared/config';
import { userModel } from 'features/user';
import { LoginModal } from 'features/login';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { PrivateRoute, PublicRoute } from './route';

const RootView = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return import('./root');
}); /* webpackChunkName: "views.root" */
const LoginView = lazy(() => import('./login'));
const ChartView = lazy(() => import('./chart'));
const ReportView = lazy(() => import('./report'));
const NotFoundView = lazy(() => import('./404'));
const MessagesView = lazy(() => import('./messages'));
const SettingsView = lazy(() => import('./settings'));
const StubView = () => null;

interface IWithLayout {
  (component: ComponentType<any>): ComponentType<any>;
}

const withPureLayout: IWithLayout = (Component) => {
  const WithPureLayout: FC = (props) => (
    <div className="flex flex-col min-h-screen">
      <Component {...props} />
    </div>
  );
  WithPureLayout.displayName = `WithPureLayout(${Component?.displayName ?? Component?.name})`;
  return WithPureLayout;
};

const withLayout: IWithLayout = (Component) => {
  const WithLayout: FC = (props) => (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-col flex-auto min-h-full">
          <Component {...props} />
        </main>
        <Footer />
      </div>
      <Observer>
        {() => <LoginModal open={userModel.isUserLock || userModel.isSessionExpired} onLogin={() => userModel.isUserLock && userModel.unlock()} />}
      </Observer>
    </>
  );
  WithLayout.displayName = `WithLayout(${Component?.displayName ?? Component?.name})`;
  return WithLayout;
};

export const Routing: FC = memo(() => {
  return (
    <Switch>
      <PublicRoute path={routes.login.path()} component={withPureLayout(LoginView)} restricted exact />
      <PrivateRoute path={routes.root.path()} component={withLayout(RootView)} exact />
      <PrivateRoute path={routes.report.path()} component={withLayout(ReportView)} />
      <PrivateRoute path={routes.message.path()} component={withLayout(MessagesView)} />
      <PrivateRoute path={routes.setting.path()} component={withLayout(SettingsView)} />
      <PrivateRoute path={routes.profile.path()} component={withLayout(StubView)} />
      <PrivateRoute path={routes.chart.path()} component={withLayout(ChartView)} />
      <PublicRoute path={routes.notFound.path()} component={withLayout(NotFoundView)} />
      {/* <PrivateRoute path={routes.practiceSetting.path()}  */}
      <Redirect
        to={{
          pathname: routes.notFound.path(),
          state: { preventLastLocation: true },
        }}
      />
    </Switch>
  );
});
Routing.displayName = 'Routing';
