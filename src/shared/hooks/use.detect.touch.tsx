import { useEffect, useState } from 'react';

/**
 * @hook useDetectTouch
 */
function useDetectTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleTouch = () => {
      setIsTouch(true);
      document.removeEventListener('touchstart', handleTouch);
    };

    document.addEventListener('touchstart', handleTouch);
    return () => {
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return isTouch;
}

export default useDetectTouch;
