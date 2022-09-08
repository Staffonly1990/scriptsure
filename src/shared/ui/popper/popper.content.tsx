import React, { ElementType, forwardRef, useRef } from 'react';
import cx from 'classnames';

import { useForkRef } from 'shared/hooks';
import styles from './popper.content.module.css';

export type PopperContentClasses = 'root';

const Content: OverloadedFC<StyledComponentProps<{}, PopperContentClasses>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<{}, PopperContentClasses>, ElementType>
>(({ as: Component = 'div', className, classes, style, children, ...attrs }, ref) => {
  const rootRef = useRef<ElementType>(null);
  const handleRef = useForkRef(ref, rootRef);
  return (
    <Component ref={handleRef} className={cx(className, classes?.root, styles.root)} style={style} {...attrs}>
      {children}
    </Component>
  );
});
Content.displayName = 'Popper.Content';

export default Content;
