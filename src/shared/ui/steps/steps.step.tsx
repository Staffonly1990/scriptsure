import React, { FC, useContext } from 'react';
import cx from 'classnames';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { isFunction } from 'lodash';

import { StepsColor, DefaultColor } from './steps.types';
import { StepsContext, IStepsContextProps } from './steps.context';

import styles from './steps.step.module.css';

const getColorBg = (color: StepsColor) => {
  return styles?.[`activeButton-${color}`] ?? null;
};

const Step: FC = ({ children }) => {
  const { first, last, active, completed, valid, onSelect, index, column, color } = useContext<IStepsContextProps>(StepsContext);
  const activeCls = getColorBg(color ?? DefaultColor);

  const handleChange = () => {
    if (!active && isFunction(onSelect)) onSelect(index);
  };

  return (
    <li className={styles.root}>
      {valid ? (
        <button className={cx(column ? styles.colBox : styles.rowBox)} tabIndex={0} onClick={handleChange}>
          <span className={cx(styles.round, { [activeCls]: active || completed })} aria-hidden="true">
            {completed ? (
              <CheckIcon className="w-6 h-6 text-white absolute" aria-hidden="true" focusable="false" />
            ) : (
              <span className="text-white" aria-hidden="true">
                {index + 1}
              </span>
            )}
          </span>
          <span className="block w-max" aria-hidden="true">
            {children}
          </span>
        </button>
      ) : (
        <ExclamationCircleIcon className={first || last ? styles.errorImage : styles.errorImageCustom} aria-hidden="true" focusable="false" />
      )}
    </li>
  );
};
Step.displayName = 'Step';

export default Step;
