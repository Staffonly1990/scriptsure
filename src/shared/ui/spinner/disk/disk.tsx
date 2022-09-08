import React, { FC } from 'react';
import cx from 'classnames';

import { ISpinnerElementProps } from '../spinner.types';
import styles from './disk.module.css';

const Disk: FC<ISpinnerElementProps> = ({ className, color }) => {
  return <div className={cx(className, styles.root, styles?.[color])} />;
};
Disk.displayName = 'Spinner.Disk';

export default Disk;
