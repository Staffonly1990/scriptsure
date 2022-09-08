import React, { SVGAttributes, ElementType, forwardRef } from 'react';

export type IIconProps<T> = SVGAttributes<T>;

const Icon: OverloadedFC<StyledComponentProps<IIconProps<ElementType>>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<IIconProps<ElementType>>, ElementType>
>((props, ref) => {
  const { as: Component = 'svg', ...attrs } = props;

  return <Component ref={ref} {...attrs} />;
});

Icon.displayName = 'Icon';
Icon.defaultProps = {
  'aria-hidden': true,
  'focusable': false,
};

export default Icon;
