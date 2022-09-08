import React, { FC, ComponentType, LazyExoticComponent } from 'react';
import { RouteProps, RouteComponentProps, Route, Redirect } from 'react-router-dom';
import type { Location } from 'history';
import { observer, Observer } from 'mobx-react-lite';
import { isFunction } from 'lodash';

import { routes } from 'shared/config';
import { userModel } from 'features/user';

interface IPrivateRouteProps extends Omit<RouteProps, 'component'> {
  component?: ComponentType<RouteComponentProps<any>> | ComponentType<any> | LazyExoticComponent<ComponentType<RouteComponentProps<any>>>;
}

export const PrivateRoute: FC<IPrivateRouteProps> = observer(({ render, component: Component, ...routeProps }) => {
  const display = (props) => {
    if (isFunction(render)) return render(props);
    if (Component) return <Component {...props} />;
    return null;
  };
  return (
    <Route
      {...routeProps}
      render={(props) => (
        <Observer>
          {() =>
            userModel.isSessionExpired && !userModel.isUserExists ? (
              <Redirect
                to={{
                  pathname: routes.login.path(),
                  state: { referer: props.location },
                }}
              />
            ) : (
              <>{display(props)}</>
            )
          }
        </Observer>
      )}
    />
  );
});
PrivateRoute.displayName = 'PrivateRoute';

interface IPublicRouteProps extends Omit<RouteProps, 'component'> {
  component?: ComponentType<RouteComponentProps<any>> | ComponentType<any> | LazyExoticComponent<ComponentType<RouteComponentProps<any>>>;
  restricted?: boolean;
}

export const PublicRoute: FC<IPublicRouteProps> = observer(({ render, component: Component, restricted, ...routeProps }) => {
  // restricted = false meaning public route
  // restricted = true meaning restricted route
  const { location } = routeProps;
  const { referer } = (location as Location<{ referer?: Location }>)?.state ?? {};
  const display = (props) => {
    if (isFunction(render)) return render(props);
    if (Component) return <Component {...props} />;
    return null;
  };
  return (
    <Route
      {...routeProps}
      render={(props) => (
        <Observer>
          {() =>
            userModel.isLoggedIn && restricted ? (
              <Redirect
                to={
                  referer ?? {
                    pathname: routes.root.path(),
                    state: { referer: props.location },
                  }
                }
              />
            ) : (
              <>{display(props)}</>
            )
          }
        </Observer>
      )}
    />
  );
});
PublicRoute.displayName = 'PublicRoute';
