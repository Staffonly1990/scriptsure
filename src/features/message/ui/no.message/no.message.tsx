import React from 'react';
import { useIntl } from 'react-intl';

import { InboxIcon } from '@heroicons/react/outline';
import Button from 'shared/ui/button';

interface INoMessageProps {
  clearSearch: () => void;
}

const NoMessage = ({ clearSearch }: INoMessageProps) => {
  const { formatMessage } = useIntl();
  return (
    <div className="flex justify-start w-full shadow bg-primary self-center p-10">
      <InboxIcon className="hidden w-20 h-20 !text-gray-300 xl:block" />
      <div className="flex flex-col self-center">
        <Button className="!text-xl !text-gray-400" variant="flat" color="gray">
          {formatMessage({ id: 'messages.noMessageFound' })}
        </Button>
        <Button className="max-w-min whitespace-nowrap ml-5 uppercase" variant="filled" color="blue" onClick={clearSearch}>
          {formatMessage({ id: 'messages.clearSearch' })}
        </Button>
      </div>
    </div>
  );
};

NoMessage.displayName = 'NoMessage';
export default NoMessage;
