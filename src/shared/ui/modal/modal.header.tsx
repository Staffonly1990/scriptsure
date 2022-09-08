import React, { ElementType, forwardRef, useRef } from 'react';
import cx from 'classnames';

import { useForkRef } from 'shared/hooks';
import styles from './modal.header.module.css';

export type ModalHeaderClasses = 'root';

const Header: OverloadedFC<StyledComponentProps<{}, ModalHeaderClasses>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<{}, ModalHeaderClasses>, ElementType>
>(({ as: Component = 'div', className, classes, style, children, ...attrs }, ref) => {
  const rootRef = useRef<ElementType>(null);
  const handleRef = useForkRef(ref, rootRef);
  return (
    <Component ref={handleRef} className={cx(className, classes?.root, styles.root)} style={style} {...attrs}>
      {children}
    </Component>
  );
});
Header.displayName = 'Modal.Header';

export default Header;
