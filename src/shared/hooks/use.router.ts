import { useMemo } from 'react';
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import queryString from 'query-string';

/**
 * @hook useRouter
 */
const useRouter = <Params = {}, State = unknown>() => {
  const params = useParams<Params>();
  const location = useLocation<State>();
  const history = useHistory<State>();
  const match = useRouteMatch<Params>();
  // Return our custom router object
  // Memoize so that a new object is only returned if something changes
  return useMemo(() => {
    const router = {
      // For convenience add push(), replace(), pathname at top level
      // eslint-disable-next-line @typescript-eslint/unbound-method
      push: history.push,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      replace: history.replace,
      pathname: location.pathname,
      // Merge params and parsed query string into single "query" object
      // so that they can be used interchangeably.
      // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params,
      },
      // Include match, location, history objects so we have
      // access to extra React Router functionality if needed.
      match,
      location,
      history,
    } as const;
    return router;
  }, [params, match, location, history]);
};

export default useRouter;
