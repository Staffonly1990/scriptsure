import React, { FC } from 'react';
import cx from 'classnames';

import { ISpinnerElementProps } from '../spinner.types';
import styles from './dots.module.css';

const Dots: FC<ISpinnerElementProps> = ({ className, color }) => {
  return (
    <div className={styles.root}>
      <div className={cx(className, styles.chunk, styles?.[color])} />
      <div className={cx(className, styles.chunk, styles?.[color])} />
      <div className={cx(className, styles.chunk, styles?.[color])} />
    </div>
  );
};
Dots.displayName = 'Spinner.Dots';

export default Dots;
