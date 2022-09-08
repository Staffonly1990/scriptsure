import React, { ElementType, forwardRef, useRef } from 'react';
import cx from 'classnames';

import { useForkRef } from 'shared/hooks';
import styles from './popper.title.module.css';

export type PopperTitleClasses = 'root';

const Title: OverloadedFC<StyledComponentProps<{}, PopperTitleClasses>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<{}, PopperTitleClasses>, ElementType>
>(({ as: Component = 'div', className, classes, style, children, ...attrs }, ref) => {
  const rootRef = useRef<ElementType>(null);
  const handleRef = useForkRef(ref, rootRef);
  return (
    <Component ref={handleRef} className={cx(className, classes?.root, styles.root)} style={style} {...attrs}>
      {children}
    </Component>
  );
});
Title.displayName = 'Popper.Title';

export default Title;
