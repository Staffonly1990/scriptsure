import React, { FC } from 'react';
import cx from 'classnames';

import { ISpinnerElementProps } from '../spinner.types';
import styles from './loader.module.css';

const Loader: FC<ISpinnerElementProps> = ({ className, color }) => {
  return <div className={cx(className, styles.root, styles?.[color])} />;
};
Loader.displayName = 'Spinner.Loader';

export default Loader;
