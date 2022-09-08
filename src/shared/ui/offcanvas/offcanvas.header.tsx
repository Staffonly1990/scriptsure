import React, { ElementType, forwardRef, useRef } from 'react';
import cx from 'classnames';

import { useForkRef } from 'shared/hooks';
import styles from './offcanvas.header.module.css';

export type OffcanvasHeaderClasses = 'root';

const Header: OverloadedFC<StyledComponentProps<{}, OffcanvasHeaderClasses>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<{}, OffcanvasHeaderClasses>, ElementType>
>(({ as: Component = 'div', className, classes, style, children, ...attrs }, ref) => {
  const rootRef = useRef<ElementType>(null);
  const handleRef = useForkRef(ref, rootRef);
  return (
    <Component ref={handleRef} className={cx(className, classes?.root, styles.root)} style={style} {...attrs}>
      {children}
    </Component>
  );
});
Header.displayName = 'Offcanvas.Header';

export default Header;
