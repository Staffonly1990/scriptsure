import React, { ElementType, forwardRef, useRef } from 'react';
import cx from 'classnames';

import { useForkRef } from 'shared/hooks';
import styles from './modal.body.module.css';

export type ModalBodyClasses = 'root';

const Body: OverloadedFC<StyledComponentProps<{}, ModalBodyClasses>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<{}, ModalBodyClasses>, ElementType>
>(({ as: Component = 'div', className, classes, style, children, ...attrs }, ref) => {
  const rootRef = useRef<ElementType>(null);
  const handleRef = useForkRef(ref, rootRef);
  return (
    <Component ref={handleRef} className={cx(className, classes?.root, styles.root)} style={style} {...attrs}>
      {children}
    </Component>
  );
});
Body.displayName = 'Modal.Body';

export default Body;
