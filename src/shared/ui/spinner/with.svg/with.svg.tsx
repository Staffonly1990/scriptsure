import React, { FC, SVGProps } from 'react';
import cx from 'classnames';

import { ISpinnerElementProps } from '../spinner.types';
import styles from './with.svg.module.css';

const withSvg = (ComponentSvg: FC<SVGProps<SVGSVGElement>>): FC<ISpinnerElementProps> => {
  const WithSvg: FC<ISpinnerElementProps> = ({ className, color }) => {
    return <ComponentSvg className={cx(className, styles.root, styles?.[color])} />;
  };
  WithSvg.displayName = `WithSvg(${ComponentSvg?.displayName ?? ComponentSvg?.name})`;
  return WithSvg;
};

export default withSvg;
