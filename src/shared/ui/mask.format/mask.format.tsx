/** @external https://github.com/RobinHerbots/Inputmask */
import React, { VFC, ReactText, memo, useMemo } from 'react';
import { isNil, toString } from 'lodash';
import Inputmask from 'inputmask';

export interface IMaskFormatProps {
  textContent?: ReactText;
  options?: Inputmask.Options;
  unmasked?: boolean;
}

const MaskFormat: VFC<IMaskFormatProps> = memo(({ textContent, options, unmasked }) => {
  const output = useMemo(() => {
    if (isNil(textContent)) return textContent;
    const safeTextContent = toString(textContent);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return unmasked ? Inputmask.unmask(safeTextContent, { ...options }) : Inputmask.format(safeTextContent, { ...options });
  }, [options, textContent, unmasked]);
  return <>{output}</>;
});
MaskFormat.displayName = 'MaskFormat';

export default MaskFormat;
