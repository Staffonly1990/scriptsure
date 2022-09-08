import React, { FC } from 'react';
import cx from 'classnames';

interface IInformationListProps {
  className?: string;
  header: string;
}

const InformationList: FC<IInformationListProps> = ({ children, className, header }) => {
  return (
    <div className={cx('flex flex-col flex-1 border border-gray-200 p-4 mx-2 shadow xl:mx-0', className)}>
      <div>
        <div className="pb-4">
          <span className="font-bold text-xl mb-4">{header}</span>
        </div>
        <div>
          <hr />
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">{children}</div>
    </div>
  );
};

InformationList.displayName = 'InformationList';
export default InformationList;
