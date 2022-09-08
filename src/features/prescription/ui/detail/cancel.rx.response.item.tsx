import React, { FC } from 'react';
import { isArray } from 'lodash';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import { ExclamationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import { reasonCodes } from '../../config';

interface ICancelRxResponseItemProps {
  CancelRxResponse: any;
  messageHistory: any;
}

const CancelRxResponseItem: FC<ICancelRxResponseItemProps> = ({ CancelRxResponse, messageHistory }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div className="w-full flex justify-between min-h-[4rem] items-center bg-red-500 px-[16px] text-white">
        <div className="flex items-center text-xl">
          <span className="w-4">{messageHistory.order}</span>
          <span>{messageHistory.messageType}-</span>
          {CancelRxResponse?.Response?.Approved && <span>{formatMessage({ id: 'messages.approved' })}</span>}
          {CancelRxResponse?.Response?.ApprovedWithChanges && <span>{formatMessage({ id: 'messages.approved' })}</span>}
          {CancelRxResponse?.Response?.Denied && <span>{formatMessage({ id: 'messages.declined' })}</span>}
        </div>
        <Button
          color="transparent"
          variant="filled"
          onClick={() =>
            prescriptionDetailModel.showDetail(true, {
              writtenDate: messageHistory.messageXml.Message.Header.SentTime,
              messageId: messageHistory.messageXml.Message.Header.MessageID,
            })
          }
        >
          <MenuIcon className="w-5 h-5 mr-1" />
          <span className="uppercase">{formatMessage({ id: 'detail.showDetail' })}</span>
        </Button>
      </div>
      {prescriptionDetailModel.showMoreDetail && (
        <div className="m-[20px] flex flex-col min-h-[4rem]">
          {CancelRxResponse?.Response?.Approved && (
            <span>
              {formatMessage({ id: 'original.pharmacyNote' })}: {CancelRxResponse.Response.Approved?.Note}
            </span>
          )}
          {CancelRxResponse?.Response?.ApprovedWithChanges && (
            <span>
              {formatMessage({ id: 'original.pharmacyNote' })}: {CancelRxResponse.Response.ApprovedWithChanges?.Note}
            </span>
          )}
          {CancelRxResponse?.Response?.Denied && (
            <span>
              {formatMessage({ id: 'rx.change.reason' })}: {CancelRxResponse.Response.Denied.DenialReason}
              <ExclamationCircleIcon className="w-6 h-6" />
            </span>
          )}
          {CancelRxResponse.Response.Denied.ReferenceNumber && (
            <span>
              {formatMessage({ id: 'rx.change.referenceNumber' })}: {CancelRxResponse.Response.Denied.ReferenceNumber}
            </span>
          )}
          {CancelRxResponse.Response.Denied.ReasonCode && (
            <div className="flex items-center">
              <span className="xl:w-[40%]">{formatMessage({ id: 'rx.change.denialReason' })}: </span>
              <div className="flex flex-col">
                {isArray(CancelRxResponse.Response.Denied.ReasonCode) &&
                  CancelRxResponse.Response.Denied.ReasonCode.map((denial) => <span>{reasonCodes[denial]}</span>)}
              </div>
              <div className="flex flex-col">
                {CancelRxResponse.Response.Denied.ReasonCode && !isArray(CancelRxResponse.Response.Denied.ReasonCode) && (
                  <span>{reasonCodes[CancelRxResponse.Response.Denied.ReasonCode]}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

CancelRxResponseItem.displayName = 'CancelRxResponseItem';
export default CancelRxResponseItem;
