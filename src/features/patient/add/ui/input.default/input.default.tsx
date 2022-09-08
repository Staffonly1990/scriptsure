import React, { FC } from 'react';
import cx from 'classnames';

import styles from './styles.module.css';

interface IInputDefaultProps {
  label?: string;
  className?: string;
  required?: boolean;
  condition?: string;
  error?: string;
}

/** @deprecated */
const InputDefault: FC<IInputDefaultProps> = ({ error, condition, required, className, label, children }) => {
  return (
    <div className={cx(className, 'flex-1 h-full')}>
      <div className={cx(required && styles.required)}>{!!label && <span>{label}</span>}</div>
      <div>{children}</div>
      <div className="flex justify-between">
        {error ? <span className={styles.requiredText}>{error}</span> : required && <span className={styles.requiredText}>Required</span>}
        {condition && <span>{condition}</span>}
      </div>
    </div>
  );
};
InputDefault.displayName = 'InputDefault';

export default InputDefault;
