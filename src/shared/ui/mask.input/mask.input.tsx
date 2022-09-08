/** @external https://github.com/RobinHerbots/Inputmask */
import React, { InputHTMLAttributes, forwardRef, useRef, useEffect } from 'react';
import { useUpdate } from 'react-use';
import Inputmask from 'inputmask';

import { useForkRef, useInputmask } from 'shared/hooks';

export interface IMaskInputProps extends InputHTMLAttributes<HTMLInputElement> {
  options?: Inputmask.Options;
  dismount?: boolean;
}

const MaskInput = forwardRef<HTMLInputElement, IMaskInputProps>(({ options, dismount, ...props }, ref) => {
  const forceUpdate = useUpdate();

  const rootRef = useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(rootRef, ref);

  useInputmask(rootRef.current, options, dismount);

  useEffect(() => {
    // force apply mask
    forceUpdate();
  }, [rootRef]);

  return <input ref={handleRef} {...props} />;
});
MaskInput.displayName = 'MaskInput';

export default MaskInput;
