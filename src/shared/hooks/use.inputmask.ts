/** @external https://github.com/RobinHerbots/Inputmask */
import { useEffect } from 'react';
import { isElement as isHtmlElement, isNull, isNil } from 'lodash';
import Inputmask from 'inputmask';

export interface MaskElement extends HTMLElement {
  inputmask?: Inputmask.Instance | undefined;
}

const defaultOptions: Inputmask.Options = { autoUnmask: true, showMaskOnFocus: false, showMaskOnHover: false };

/**
 * @hook useInputmask
 */
const useInputmask = (el: Nullable<MaskElement>, options?: Inputmask.Options, dismount?: boolean) => {
  useEffect(() => {
    // eslint-disable-next-line no-useless-return
    if (!isHtmlElement(el) || isNull(el)) return;

    if (dismount || isNil(el?.inputmask)) {
      Inputmask({
        ...defaultOptions,
        ...options,
      }).mask(el);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      if (!dismount) return;
      if (isHtmlElement(el) && el?.inputmask) el.inputmask?.remove();
    };
  }, [el, options, dismount]);
};

export default useInputmask;
