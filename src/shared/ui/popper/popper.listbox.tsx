import React, { ElementType, CSSProperties, Fragment, forwardRef, useRef, useContext, useCallback } from 'react';
import { Menu } from '@headlessui/react';
import { isFunction, isArray, assign, map } from 'lodash';
import cx from 'classnames';

import { toValidArray } from 'shared/lib/element';
import { useForkRef } from 'shared/hooks';
import Button from 'shared/ui/button';
import PopperContext from './popper.context';
import styles from './popper.listbox.module.css';

export interface IListboxItemProps {
  activeClassName?: string | undefined;
  activeStyle?: CSSProperties | undefined;
  disabled?: boolean | undefined;
  dismissed?: boolean | undefined;
  onClick?: (e: React.SyntheticEvent) => void;
}

export type PopperListboxItemClasses = 'root';

const ListboxItem: OverloadedFC<StyledComponentProps<IListboxItemProps, PopperListboxItemClasses>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<IListboxItemProps, PopperListboxItemClasses>, ElementType>
>(({ as, className, classes, style, activeClassName, activeStyle, disabled, dismissed, children, onClick, ...attrs }, ref) => {
  const { dismiss } = useContext(PopperContext);

  const handleMenuItemClick = useCallback(
    (e) => {
      if (dismissed) dismiss();
      if (onClick) onClick(e);
    },
    [dismissed, dismiss]
  );

  const render = ({ active, disabled: isDisabled }) => (
    <Button
      as={as}
      ref={ref}
      role="menuitem"
      disabled={isDisabled}
      {...attrs}
      className={cx(className, classes?.root, styles.item, assign({}, activeClassName ? { [activeClassName]: active } : { [styles['item-active']]: active }))}
      style={assign(style, active ? activeStyle : null)}
      variant="flat"
      shape={null}
      color="gray"
      onClick={handleMenuItemClick}
    >
      {isFunction(children) ? children({ active, disabled: isDisabled }) : children}
    </Button>
  );
  return (
    <div role="none">
      <Menu.Item as={Fragment} disabled={disabled}>
        {render}
      </Menu.Item>
    </div>
  );
});
ListboxItem.displayName = 'Popper.ListboxItem';

export type PopperListboxClasses = 'root';

const Listbox: OverloadedFC<PropsWithChildren<StyledComponentProps<{}, PopperListboxClasses>>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<{}, PopperListboxClasses>, ElementType>
>(({ as: Component = 'div', className, classes, style, children, ...attrs }, ref) => {
  const rootRef = useRef<ElementType>(null);
  const handleRef = useForkRef(ref, rootRef);

  const render = () => {
    if (isArray(children)) {
      const dim = toValidArray(children);
      return map(dim, (chunk, index) => (
        <div key={`${index.toString(36)}`} className="py-1" role="none">
          {chunk}
        </div>
      ));
    }
    return children;
  };

  return (
    <Menu as={Fragment}>
      <Menu.Items {...attrs} as={Component} ref={handleRef} className={cx(className, classes?.root, styles.root)} style={style} role="menu" static>
        {render()}
      </Menu.Items>
    </Menu>
  );
});
Listbox.displayName = 'Popper.Listbox';

export { Listbox, ListboxItem };
