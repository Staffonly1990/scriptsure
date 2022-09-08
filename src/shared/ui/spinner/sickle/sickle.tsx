import React, { FC } from 'react';
import cx from 'classnames';

import { ISpinnerElementProps } from '../spinner.types';
import styles from './sickle.module.css';

const Sickle: FC<ISpinnerElementProps> = ({ className, color }) => {
  return <div className={cx(className, styles.root, styles?.[color])} />;
};
Sickle.displayName = 'Spinner.Sickle';

export default Sickle;
