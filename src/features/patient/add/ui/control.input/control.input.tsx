import React, { FC, memo } from 'react';
import type { UseControllerProps, UseControllerReturn } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import cx from 'classnames';

import { IPatient } from 'shared/api/patient';
import styles from './control.input.module.css';

interface IControlInputProps<F = any> extends UseControllerProps<F> {
  label?: Nullable<string>;
  required?: boolean;
  condition?: string;
  // validateFirst?: boolean;
}

type IControlInputChildrenProps = UseControllerReturn;

const ControlInput: FC<PropsWithFunctionChild<StyledComponentProps<IControlInputProps<IPatient>, never>, IControlInputChildrenProps>> = ({
  className,
  label,
  required,
  condition,
  children,
  ...props
}) => {
  const { name, control, rules, defaultValue, shouldUnregister } = props;
  const { field, fieldState, formState } = useController({ name, control, rules, defaultValue, shouldUnregister });
  const { invalid, error } = fieldState;

  const displayError = () => {
    if (invalid && error) {
      if (error.message?.length) return <span className={styles.error}>{error.message}</span>;
      return <span className={styles.error}>{error.type} error</span>;
    }
    return null;
  };
  // console.log(`DEBUG:${name}`, required, field, fieldState);
  return (
    <div className={cx(className, 'flex-1 h-full')}>
      <div className={cx({ [styles.required]: required, [styles.invalid]: invalid })}>
        {label !== null && <span className={styles.label}>{label ?? name}</span>}
      </div>
      <div>{children && children({ field, fieldState, formState })}</div>
      <div className="flex justify-between">
        {displayError()}
        {condition && <span>{condition}</span>}
      </div>
    </div>
  );
};
ControlInput.displayName = 'ControlInput';

export default ControlInput;
