import React, { FC } from 'react';
import { assign } from 'lodash';
import cx from 'classnames';

import { ReactComponent as ReactSvg } from 'shared/assets/images/react.svg';
import withSvg from './with.svg';
import Loader from './loader';
import Sickle from './sickle';
import Disk from './disk';
import Dots from './dots';
import { ISpinnerProps, DefaultSize, DefaultColor } from './spinner.types';
import styles from './spinner.module.css';

const ReactLoader = withSvg(ReactSvg);
ReactLoader.displayName = 'Spinner.ReactLoader';

const Spinner: FC<ISpinnerProps> = ({ wrapperClassName, className, component: Component, size, color, beyond, block }) => {
  return (
    <div className={cx(wrapperClassName, styles.root, { [styles.block]: block, [styles.beyond]: beyond })}>
      {Component && <Component className={cx(className, styles.element, styles?.[`element-size-${size}`] ?? null)} color={color ?? DefaultColor} />}
    </div>
  );
};
Spinner.displayName = 'Spinner';
Spinner.defaultProps = {
  component: Loader,
  size: DefaultSize,
  color: DefaultColor,
  beyond: false,
  block: false,
};

export default assign(Spinner, { Sickle, Disk, Dots, Loader, ReactLoader });
