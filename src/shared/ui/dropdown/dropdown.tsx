import React, { ElementType, CSSProperties, ReactNode, Fragment, forwardRef, useRef, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Menu } from '@headlessui/react';
import { isFunction, isArray, assign, map } from 'lodash';
import cx from 'classnames';

import { toValidArray, convertRemToPixels } from 'shared/lib/element';
import Button from 'shared/ui/button';
import styles from './dropdown.module.css';

export interface IDropdownItemProps {
  activeClassName?: string | undefined;
  activeStyle?: CSSProperties | undefined;
  disabled?: boolean | undefined;
  onClick?: (e: React.SyntheticEvent) => void;
}

const Item: OverloadedFC<StyledComponentProps<IDropdownItemProps>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<IDropdownItemProps>, ElementType>
>(({ as, className, style, disabled, children, ...attrs }, ref) => {
  const { activeClassName, activeStyle } = attrs;
  const render = ({ active, disabled: isDisabled }) => (
    <Button
      as={as}
      ref={ref}
      role="menuitem"
      disabled={isDisabled}
      {...attrs}
      className={cx(className, styles.item, assign({}, activeClassName ? { [activeClassName]: active } : { [styles['item-active']]: active }))}
      style={assign(style, active ? activeStyle : null)}
      variant="flat"
      shape={null}
      color="gray"
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
Item.displayName = 'Dropdown.Item';

export type DropdownPlacement = 'bottom-start' | 'bottom' | 'bottom-end' | 'top-start' | 'top' | 'top-end';

export interface IDropdownProps {
  list: ReactNode[];
  unmount?: boolean;
  offset?: [number, number];
  placement?: DropdownPlacement;
}

export const DefaultPlacement: DropdownPlacement = 'bottom-end';
export const DefaultOffset: [number, number] = [0, convertRemToPixels(0.5)];

const Dropdown: OverloadedFC<IDropdownProps & StyledComponentProps> = forwardRef<
  ElementType,
  PropsWithOverload<IDropdownProps & StyledComponentProps, ElementType>
>(({ as: Component = 'div', className, style, list, unmount, placement, offset, children, ...attrs }, ref) => {
  const nodeRef = useRef(null);

  const [placementCls, placementStyle] = useMemo(() => {
    const [x, y] = offset ?? DefaultOffset;
    let klass: Nullable<string> = null;
    let stylebox = {};
    switch (placement) {
      case 'bottom-start':
        klass = 'top-full left-0 transform-gpu origin-top-right';
        stylebox = {
          '--tw-translate-x': `${x}px`,
          '--tw-translate-y': `${y}px`,
          'transform': 'var(--tw-transform)',
        };
        return [klass, stylebox];
      case 'bottom':
        klass = 'top-full right-1/2 transform-gpu origin-top-right';
        stylebox = {
          '--tw-translate-x': `calc(50% + ${x}px)`,
          '--tw-translate-y': `${y}px`,
          'transform': 'var(--tw-transform)',
        };
        return [klass, stylebox];
      case 'bottom-end':
        klass = 'top-full right-0 transform-gpu origin-top-right';
        stylebox = {
          '--tw-translate-x': `${x}px`,
          '--tw-translate-y': `${y}px`,
          'transform': 'var(--tw-transform)',
        };
        return [klass, stylebox];
      case 'top-start':
        klass = 'bottom-full left-0 transform-gpu origin-top-right';
        stylebox = {
          '--tw-translate-x': `${x}px`,
          '--tw-translate-y': `${-y}px`,
          'transform': 'var(--tw-transform)',
        };
        return [klass, stylebox];
      case 'top':
        klass = 'bottom-full right-1/2 transform-gpu origin-top-right';
        stylebox = {
          '--tw-translate-x': `calc(50% + ${x}px)`,
          '--tw-translate-y': `${-y}px`,
          'transform': 'var(--tw-transform)',
        };
        return [klass, stylebox];
      case 'top-end':
        klass = 'bottom-full right-0 transform-gpu origin-top-right';
        stylebox = {
          '--tw-translate-x': `${x}px`,
          '--tw-translate-y': `${-y}px`,
          'transform': 'var(--tw-transform)',
        };
        return [klass, stylebox];
      default:
        return [klass, stylebox];
    }
  }, [placement, offset]);

  const render = () => {
    if (isArray(list)) {
      const dim = toValidArray(list);
      return map(dim, (chunk, index) => (
        <div key={`${index.toString(36)}`} className="py-1" role="none">
          {chunk}
        </div>
      ));
    }
    return null;
  };

  return (
    <>
      <Component ref={ref} {...attrs} className={cx(className, styles.root)} style={style}>
        <div className="relative">
          <Menu as={Fragment}>
            {({ open }) => (
              <>
                <Menu.Button as={Fragment}>{children}</Menu.Button>
                <CSSTransition nodeRef={nodeRef} classNames="fx-fade" in={open} timeout={300} unmountOnExit={unmount} mountOnEnter>
                  <Menu.Items
                    as="div"
                    ref={nodeRef}
                    className={cx(
                      placementCls,
                      'absolute z-dropdown min-w-dropdown w-max rounded-sm',
                      'bg-white shadow ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none'
                    )}
                    style={placementStyle}
                    role="menu"
                    static
                  >
                    {render()}
                  </Menu.Items>
                </CSSTransition>
              </>
            )}
          </Menu>
        </div>
      </Component>
    </>
  );
});
Dropdown.displayName = 'Dropdown';
Dropdown.defaultProps = { placement: 'bottom-end', offset: DefaultOffset, unmount: true };

export default assign(Dropdown, { Item });
