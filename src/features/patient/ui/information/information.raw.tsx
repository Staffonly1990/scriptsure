import React, { FC } from 'react';
import MaskInput from 'shared/ui/mask.input';
import cx from 'classnames';

interface IInformationRaw {
  label: string;
  contentFirstLine?: string | number;
  contentSecondLine?: string;
  mask?: string;
  className?: string;
  condition: boolean | number | string | undefined;
  isImg?: boolean;
}

const InformationRaw: FC<IInformationRaw> = ({ condition, label, contentFirstLine, contentSecondLine, mask, className }) => {
  const rawRender = () => {
    return condition ? (
      <div className={cx(className, 'flex flex-col gap-0.5')}>
        <span className="uppercase">{label}:</span>
        <div className="flex flex-col">
          {mask ? (
            <MaskInput
              className={cx('border-0 bg-transparent shadow-none font-bold')}
              type="text"
              autoComplete="on"
              options={{ mask }}
              value={contentFirstLine}
              disabled
            />
          ) : (
            <span className="font-bold">{contentFirstLine}</span>
          )}

          <span className="font-bold ">{contentSecondLine}</span>
        </div>
      </div>
    ) : null;
  };

  return rawRender();
};

InformationRaw.displayName = 'InformationRaw';

export default InformationRaw;
