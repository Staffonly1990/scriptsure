import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';

interface IRxFillIndicatorChangeItemProps {
  RxFillIndicatorChange: any;
  messageHistory: any;
}

const RxFillIndicatorChangeItem: FC<IRxFillIndicatorChangeItemProps> = ({ RxFillIndicatorChange, messageHistory }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div className="w-full flex justify-between min-h-[4rem] items-center bg-red-500 px-[16px] text-white">
        <div className="flex items-center text-xl">
          <span className="w-4">{messageHistory.order}</span>
          {(messageHistory.messageStatus === 'Status' || messageHistory.messageStatus === 'Verify') && (
            <Tooltip content={formatMessage({ id: 'rx.item.messageReceived' })}>
              <Button variant="filled" shape="circle" color="transparent">
                <CheckCircleIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          )}
          {messageHistory.messageStatus === 'Error' && (
            <Tooltip content={formatMessage({ id: 'rx.item.pharmacySentErrorMessage' })}>
              <Button variant="filled" shape="circle" color="transparent">
                <ExclamationCircleIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          )}
          {messageHistory.messageStatus === null && (
            <Tooltip content={formatMessage({ id: 'rx.item.messageStillInPending' })}>
              <Button variant="filled" shape="circle" color="transparent">
                <ClockIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          )}
          <span>{messageHistory.messageType}-</span>
          <span>{RxFillIndicatorChange.RxFillIndicator}</span>
        </div>
        <Button color="transparent" variant="filled" onClick={() => prescriptionDetailModel.showMore()}>
          <MenuIcon className="w-5 h-5 mr-1" />
          <span className="uppercase">
            {' '}
            {prescriptionDetailModel.showMoreDetail ? formatMessage({ id: 'prescription.showLess' }) : formatMessage({ id: 'prescription.showMore' })}
          </span>
        </Button>
      </div>
      {prescriptionDetailModel.showMoreDetail && (
        <>
          <div className="m-[20px] flex flex-col min-h-[4rem]">
            <span className="font-bold">
              {formatMessage({ id: 'rx.change.rxFillNotifications' })}: {RxFillIndicatorChange.RxFillIndicator}
            </span>
          </div>
          <div>
            {messageHistory?.statusMessages?.map((status) => (
              <>
                {status?.messageXml?.Message?.Body?.Status && (
                  <div className="flex flex-col m-[20px] mt-[10px] shadow">
                    <span className="font-bold bg-blue-500 p-[16px] text-white">{formatMessage({ id: 'measures.status' })}</span>
                    <span className="m-[20px] text-xs">
                      {status.messageXml.Message.Body.Status.Code === '000' && prescriptionDetailModel.getDenialReason('000')}
                      {status.messageXml.Message.Body.Status.Code === '010' && prescriptionDetailModel.getDenialReason('010')}
                      {status.messageXml.Message.Body.Status?.Note ?? ''}
                    </span>
                  </div>
                )}
                {status?.messageXml?.Message?.Body?.Verify && (
                  <div className="flex flex-col m-[20px] mt-[10px] shadow">
                    <span className="font-bold bg-red-500">{formatMessage({ id: 'rx.item.verify' })}</span>
                    <span>{status.messageXml.Message.Body.Verify.VerifyStatus.Code === '010' && prescriptionDetailModel.getDenialReason('010')}</span>
                  </div>
                )}
                {status?.messageXml?.Message?.Body?.Error && (
                  <div className="flex flex-col m-[20px] mt-[10px] shadow">
                    <span className="font-bold bg-red-400 p-[16px] text-white">{formatMessage({ id: 'messages.error' })}</span>
                    <div className="flex m-[20px] items-center">
                      <span>
                        {status.messageXml.Message.Body.Error?.Code} -{status.messageXml.Message.Body.Error?.Description}
                      </span>
                      <ExclamationCircleIcon className="w-6 h-6" />
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      )}
    </>
  );
};

RxFillIndicatorChangeItem.displayName = 'RxFillIndicatorChangeItem';
export default RxFillIndicatorChangeItem;
