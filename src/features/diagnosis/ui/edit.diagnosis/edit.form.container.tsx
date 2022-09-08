import React, { FC } from 'react';
import cx from 'classnames';

interface IEditFormContainerProps {
  header: string;
  className?: string;
}

const EditFormContainer: FC<IEditFormContainerProps> = ({ children, header, className }) => {
  return (
    <div className="flex flex-col w-full flex-1 mt-4 gap-2">
      <div className="flex items-center justify-between h-12 px-2 text-white bg-blue-500">
        <span>{header}</span>
      </div>
      <div className={cx('w-full', className)}>{children}</div>
    </div>
  );
};

EditFormContainer.displayName = 'EditFormContainer';

export default EditFormContainer;
