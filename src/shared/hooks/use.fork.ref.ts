import { Ref, useMemo } from 'react';
import { assign } from 'lodash';

function setRef(ref, value) {
  if (typeof ref === 'function') ref(value);
  else if (ref) assign(ref, { current: value });
}

/**
 * @hook useForkRef
 *
 * This will create a new function if the ref props change and are defined.
 * This means react will call the old forkRef with `null` and the new forkRef
 * with the ref. Cleanup naturally emerges from this behavior
 */
const useForkRef = <T>(refA: Ref<T>, refB: Ref<T>): Ref<T> => {
  return useMemo(() => {
    if (refA === null && refB === null) return null;
    return (refValue) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
};

export default useForkRef;
