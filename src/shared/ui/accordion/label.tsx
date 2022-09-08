import React, { FC } from 'react';
import cx from 'classnames';

import styles from './label.module.css';

type LabelColor = Exclude<TailwindColor, 'transparent' | 'current'>;

interface ILabel {
  color?: LabelColor;
  text?: string;
}

const DefaultColor = 'blue';

const getActiveLabelColor = (color: LabelColor) => {
  return styles?.[`rectangle-${color}`] ?? null;
};

const Label: FC<StyledComponentProps<ILabel>> = ({ color, text }) => {
  return (
    <div className="absolute top-[-4px] right-[-4px] h-full w-[85px] h-[88px] overflow-hidden text-white">
      <div className={cx(styles.root, getActiveLabelColor(color || DefaultColor))}>{text ?? 'current'}</div>
    </div>
  );
};

Label.displayName = 'Label';

export default Label;
