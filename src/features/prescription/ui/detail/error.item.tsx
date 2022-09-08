import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import { ExclamationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';

interface IErrorItemProps {
  Error: any;
  messageHistory: any;
}

const ErrorItem: FC<IErrorItemProps> = ({ Error, messageHistory }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div className="w-full flex justify-between min-h-[4rem] items-center bg-red-500 px-[16px] text-white">
        <div className="text-xl flex items-center">
          <span className="w-4">{messageHistory.order}</span>
          <Tooltip content="Pharmacy has sent back an error message">
            <Button variant="filled" shape="circle" color="transparent">
              <ExclamationCircleIcon className="w-6 h-6" />
            </Button>
          </Tooltip>
          <div className="flex items-center ">
            <span>{messageHistory.messageType}</span>
            <span className="hidden xl:block whitespace-nowrap text-ellipsis overflow-hidden">-{Error?.Description?.substring(0, 75)}</span>
          </div>
        </div>
        <Button color="transparent" variant="filled" onClick={() => prescriptionDetailModel.showMore()}>
          <MenuIcon className="w-5 h-5 mr-1" />
          <span className="uppercase">
            {prescriptionDetailModel.showMoreDetail ? formatMessage({ id: 'prescription.showLess' }) : formatMessage({ id: 'prescription.showMore' })}
          </span>
        </Button>
      </div>
      {prescriptionDetailModel.showMoreDetail && (
        <div className="flex items-center m-[20px]">
          <span>
            {Error?.Code} - {Error?.Description}
          </span>
          <Button variant="filled" shape="circle" color="transparent">
            <ExclamationCircleIcon className="w-6 h-6" />
          </Button>
        </div>
      )}
    </>
  );
};

ErrorItem.displayName = 'ErrorItem';
export default ErrorItem;
