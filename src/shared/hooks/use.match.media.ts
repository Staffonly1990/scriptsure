import { useState, useMemo, useCallback } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import { isNil } from 'lodash';

/**
 * @hook useMatchMedia
 */
const useMatchMedia = <T>(queries: string[], values: T[], defaultValue: T) => {
  // Array containing a media query list for each query
  const mediaQueryLists = useMemo(() => (!isNil(window) ? queries.map((q: string) => window.matchMedia(q)) : []), [queries]);

  // State update function
  const adjustMatch = useCallback(() => {
    // Get first media query that matches
    const index = mediaQueryLists.findIndex((mql: MediaQueryList) => mql.matches);
    // Return related value or defaultValue if none
    return values?.[index] ?? defaultValue;
  }, [mediaQueryLists, values, defaultValue]);

  // State and setter for current value
  const [match, setMatch] = useState(adjustMatch);

  useIsomorphicLayoutEffect(() => {
    // Event listener callback
    // Note: By defining adjustMatch outside of useEffect we ensure that it has ...
    // ... current values of hook args (as this hook callback is created once on mount).
    const handler = () => setMatch(adjustMatch);
    // Set a listener for each media query with above handler as callback.
    mediaQueryLists.forEach((mql) => mql?.addListener(handler));
    // Remove listeners on cleanup
    return () => mediaQueryLists.forEach((mql) => mql?.removeListener(handler));
  }, [adjustMatch]); // Empty array ensures effect is only run on mount and unmount

  return match;
};

export default useMatchMedia;
