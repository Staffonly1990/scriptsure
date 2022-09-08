import React, { ElementType, MouseEvent, CSSProperties, AriaRole, forwardRef, useMemo } from 'react';
import { LinkProps, useRouteMatch } from 'react-router-dom';
import { isFunction, assign } from 'lodash';
import cx from 'classnames';

import Button from 'shared/ui/button';
import { normalizeToLocation, resolveToLocation } from 'shared/lib/location';
import { isModifiedEvent } from 'shared/lib/event';
import { useRouter } from 'shared/hooks';

interface ILinkButtonProps {
  activeClassName?: string;
  activeStyle?: CSSProperties;
  exact?: boolean;
  role?: AriaRole | undefined;
  to: LinkProps['to'];
  replace?: LinkProps['replace'];
  target?: LinkProps['target'];
  tabIndex?: number | undefined;
  onClick?: (e: React.SyntheticEvent) => void;
}

const LinkButton: OverloadedFC<StyledComponentProps<ILinkButtonProps>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<ILinkButtonProps>, ElementType>
>((props, ref) => {
  const { as = 'button', activeClassName, activeStyle, to, replace, target, exact, children, onClick, ...attrs } = props;
  const { className, style } = attrs;

  const match = useRouteMatch({ path: to as any, exact });
  const router = useRouter();

  const href = useMemo(() => {
    const location = normalizeToLocation(resolveToLocation(to, router.location), router.location);
    return location ? router.history.createHref(location) : '';
  }, [to, router]);

  const handleClick = (e) => {
    const event = e as MouseEvent;
    try {
      if (isFunction(onClick)) onClick(event);
    } catch (ex) {
      event.preventDefault();
      throw ex;
    }

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      (!target || target === '_self') && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();
      const location = resolveToLocation(to, router.location);
      if (replace) router.replace(location);
      else router.push(location);
    }
  };

  return (
    <Button
      as={as}
      ref={ref}
      {...attrs}
      className={cx(className, assign({}, activeClassName ? { [activeClassName]: match } : null))}
      style={assign(style, match ? activeStyle : null)}
      data-href={href}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
});
LinkButton.displayName = 'LinkButton';
LinkButton.defaultProps = { role: 'link', tabIndex: 0 };

export default LinkButton;
