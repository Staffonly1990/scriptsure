import React, { ElementType, VFC, ComponentProps, CSSProperties, Fragment, createContext, forwardRef, useState, useContext } from 'react';
import { toValidArray, convertRemToPixels } from 'shared/lib/element';
import { Menu } from '@headlessui/react';
import { isArray, assign, map } from 'lodash';
import cx from 'classnames';

import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import styles from './collapsed.menu.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

const CollapsedMenuContext = createContext({ collapsed: false });

export interface ICollapsedMenuItemProps {
  text?: string;
  icon?: ((props: ComponentProps<'svg'>) => JSX.Element) | VFC<ComponentProps<'svg'>>;
  // activeClassName?: string | undefined;
  // activeStyle?: CSSProperties | undefined;
  disabled?: boolean | undefined;
  onClick?: (e: React.SyntheticEvent) => void;
}

const Item: OverloadedFC<StyledComponentProps<ICollapsedMenuItemProps>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<ICollapsedMenuItemProps>, ElementType>
>(({ as = 'li', className, text, icon: Icon, disabled, ...attrs }, ref) => {
  const { collapsed } = useContext(CollapsedMenuContext);

  const render = () => {
    return (
      <>
        {Icon && (
          <span className={styles.li_svg}>
            {collapsed && (
              <Tooltip content={text} placement="bottom">
                <i>
                  <Icon />
                </i>
              </Tooltip>
            )}
            {!collapsed && <Icon />}
          </span>
        )}
        {text && <span className={styles.li_text}>{text}</span>}
      </>
    );
  };

  return (
    <Button as={as} ref={ref} {...attrs} className={cx(className, styles.li)} disabled={disabled} color="transparent">
      {render()}
    </Button>
  );
});
Item.displayName = 'CollapsedMenu.Item';

export interface ICollapsedMenuProps {
  title: string;
  unmount?: boolean;
  offset?: [number, number];
  isDisabled?: boolean;
}
export const DefaultOffset: [number, number] = [0, convertRemToPixels(0.5)];

const CollapsedMenu: OverloadedFC<StyledComponentProps<ICollapsedMenuProps, 'root' | 'title' | 'menu'>> = forwardRef<
  ElementType,
  PropsWithOverload<ICollapsedMenuProps & StyledComponentProps, ElementType>
>(({ as: Component = 'ul', className, classes, style, title, unmount, offset, isDisabled, children, ...attrs }, ref) => {
  const [collapsed, setCollapsed] = useState(false);

  const render = () => {
    if (isArray(children)) {
      const dim = toValidArray(children);
      return map(dim, (chunk, index) => <Fragment key={index.toString(36)}>{chunk}</Fragment>);
    }
    return children;
  };

  return (
    <div className={cx(className, classes?.root, styles.nav, { [styles.nav_collaps]: collapsed })}>
      <div
        className={cx(classes?.title, styles.title)}
        role="presentation"
        onKeyDown={() => {
          setCollapsed(!collapsed);
        }}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <div className={styles.title_block}>
          <span className={styles.title_svg}>{collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}</span>
          <span className={styles.title_text}>{title}</span>
        </div>
      </div>

      <Menu as={Fragment}>
        <Menu.Items className={cx(classes?.menu, styles.menu)} {...attrs} as={Component} ref={ref} style={style} role="menu" static>
          <CollapsedMenuContext.Provider value={{ collapsed }}>{render()}</CollapsedMenuContext.Provider>
        </Menu.Items>
      </Menu>
    </div>
  );
});

CollapsedMenu.displayName = 'CollapsedMenu';

export default assign(CollapsedMenu, { Item });
