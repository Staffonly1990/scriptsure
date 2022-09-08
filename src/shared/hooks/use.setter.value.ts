import { useCallback } from 'react';

/**
 * @hook useSetterValue
 */
const useSetterValue = (prop = 'value') => {
  const setter = useCallback(
    (element, value) => {
      const valueSetter = Object.getOwnPropertyDescriptor(element, prop)?.set;
      const prototype = Object.getPrototypeOf(element);
      const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, prop)?.set;

      if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter?.call(element, value);
      } else {
        valueSetter?.call(element, value);
      }
    },
    [prop]
  );
  return setter;
};

export default useSetterValue;
