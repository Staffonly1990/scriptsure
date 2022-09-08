import React, { AriaRole, AriaAttributes, ElementType, forwardRef } from 'react';
import cx from 'classnames';

import styles from './button.module.css';

type ButtonVariant = 'filled' | 'outlined' | 'dashed' | 'flat';
type ButtonShape = 'smooth' | 'round' | 'circle' | 'square' | null;
type ButtonSize = Extract<TailwindSize, 'xs' | 'sm' | 'lg' | 'xl'> | 'md' | null;
type ButtonColor = Exclude<TailwindColor, 'current'>;

const getShapeClasses = (shape: ButtonShape) => {
  return styles?.[`${shape}`] ?? null;
};

const getSizeClasses = (size: ButtonSize, shape?: ButtonShape) => {
  return cx(styles?.[`size-${size}`] ?? null, styles?.[`${shape}-size-${size}`] ?? null);
};

const getColorClasses = (variant: ButtonVariant, color: ButtonColor) => {
  return styles?.[`${variant}-${color}`] ?? null;
};

export interface IButtonProps extends Pick<AriaAttributes, 'aria-label'> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  size?: ButtonSize;
  color?: ButtonColor;
  disabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  role?: AriaRole;
  onClick?: (e: React.SyntheticEvent) => void;
}

export const DefaultVariant: ButtonVariant = 'filled';
export const DefaultShape: ButtonShape = null;
export const DefaultSize: ButtonSize = 'md';
export const DefaultColor: ButtonColor = 'blue';
// export const DefaultTextColor: TailwindColor = 'white';
// export const DefaultTextSize: TailwindSize = 'sm';

const Button: OverloadedFC<IButtonProps & StyledComponentProps> = forwardRef<ElementType, PropsWithOverload<IButtonProps & StyledComponentProps, ElementType>>(
  (props, ref) => {
    const { as: Component = 'button', className, style, variant, shape, size, color, disabled, tabIndex, children, onClick, ...attrs } = props;

    const cls = cx(
      getShapeClasses(shape ?? DefaultShape),
      getSizeClasses(size ?? DefaultSize, shape ?? DefaultShape),
      getColorClasses(variant ?? DefaultVariant, color ?? DefaultColor)
    );

    return (
      <Component
        ref={ref}
        {...attrs}
        tabIndex={disabled ? -1 : tabIndex}
        className={cx(className, styles.root, cls, { [styles.disabled]: disabled })}
        style={style}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
Button.defaultProps = {
  variant: DefaultVariant,
  shape: DefaultShape,
  size: DefaultSize,
  color: DefaultColor,
  disabled: false,
  autoFocus: false,
  tabIndex: 0,
};

export default Button;
