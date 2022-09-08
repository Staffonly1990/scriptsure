import React, { FC } from 'react';

const LineContent: FC = ({ children }) => {
  return <div className="flex gap-1 items-start w-full">{children}</div>;
};

LineContent.displayName = 'LineContent';

export default LineContent;
