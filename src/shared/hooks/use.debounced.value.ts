import { useState, useEffect } from 'react';

/**
 * @hook useDebouncedValue
 */
function useDebouncedValue<V = any>(value: V, wait: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), wait);
    return () => clearTimeout(id);
  }, [value]);

  return debouncedValue;
}

export default useDebouncedValue;
