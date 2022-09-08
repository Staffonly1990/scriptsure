import React, { ElementType, forwardRef } from 'react';
import { Switch } from '@headlessui/react';
import { assign, noop } from 'lodash';
import cx from 'classnames';

import styles from './toggle.module.css';

type ToggleSize = Extract<TailwindSize, 'xs' | 'sm' | 'lg' | 'xl'> | 'md' | null;
type ToggleColor = Exclude<TailwindColor, 'transparent' | 'current'>;

export interface IToggleProps {
  name?: string;
  size?: ToggleSize;
  color?: ToggleColor;
  checked?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  onChange?: (value: boolean) => void;
}

export type ToggleClasses = 'root' | 'handle' | 'checked' | 'disabled';

export const DefaultSize: ToggleSize = 'md';
export const DefaultColor: ToggleColor = 'blue';

const Toggle = forwardRef<ElementType, StyledComponentProps<IToggleProps, ToggleClasses>>(
  ({ className, style, classes, size, color, checked, disabled, placeholder, onChange, ...attrs }, ref) => {
    return (
      <Switch
        as={'button' as unknown as ElementType}
        ref={ref}
        {...attrs}
        className={cx(className, classes?.root, classes?.checked, classes?.disabled, styles.root, {
          [styles?.[`size-${size}`]]: size,
          [styles?.[`color-${color}`]]: color,
          [styles.checked]: checked,
          [styles.disabled]: disabled,
        })}
        style={style}
        checked={checked ?? false}
        onChange={onChange ?? noop}
      >
        {placeholder && <span className="sr-only">{placeholder}</span>}
        <span className={cx(styles.handle, classes?.handle)} aria-hidden="true" />
      </Switch>
    );
  }
);
Toggle.displayName = 'Toggle';
Toggle.defaultProps = {
  size: DefaultSize,
  color: DefaultColor,
  checked: false,
  disabled: false,
  autoFocus: false,
};

export default assign(Toggle, { Group: Switch.Group, Label: Switch.Label, Description: Switch.Description });
