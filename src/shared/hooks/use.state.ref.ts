import { useCallback, useRef, useState, SetStateAction, Dispatch } from 'react';
import { isFunction } from 'lodash';

type ReadOnlyRefObject<T> = {
  readonly current: T;
};

/**
 * @hook useStateRef
 *
 * const [state, setState, ref] = useStateRef(0);
 * ref.current will always have the latest state
 */
const useStateRef = <S>(initialState?: S | (() => S)) => {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);

  const dispatch: typeof setState = useCallback((setStateAction: any) => {
    ref.current = isFunction(setStateAction) ? setStateAction(ref.current) : setStateAction;
    setState(ref.current);
  }, []);

  return [state, dispatch, ref] as [S, Dispatch<SetStateAction<S>>, ReadOnlyRefObject<S>];
};

export default useStateRef;
