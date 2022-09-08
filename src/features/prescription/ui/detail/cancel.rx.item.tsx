import React, { FC } from 'react';

import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import { useIntl } from 'react-intl';

interface ICancelRxResponseItemProps {
  CancelRx: any;
  messageHistory: any;
  mediumMessageDate: string;
}

const CancelRxItem: FC<ICancelRxResponseItemProps> = ({ CancelRx, messageHistory, mediumMessageDate }) => {
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
          <span>{messageHistory.messageType}</span>
          <span>-{formatMessage({ id: 'rx.change.Pending' })}</span>
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
        <>
          <div className="m-[20px] flex flex-col min-h-[4rem]">
            <span className="font-bold">{CancelRx.MedicationPrescribed.DrugDescription}</span>
            <span className="font-bold">
              {CancelRx.MedicationPrescribed.Quantity.Value}{' '}
              {prescriptionDetailModel.getQuantityQualifier(CancelRx.MedicationPrescribed.Quantity.QuantityUnitOfMeasure.Code)}
            </span>
            <span>{CancelRx.MedicationPrescribed.Sig.SigText}</span>
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'summary.measures.refill' })}:</span>
              <span>{CancelRx.MedicationPrescribed.NumberOfRefills}</span>
            </div>
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.substitution' })}: </span>
              <span>
                {CancelRx.MedicationPrescribed.Substitutions === '0' && formatMessage({ id: 'original.allowed' })}
                {CancelRx.MedicationPrescribed.Substitutions === '1' && formatMessage({ id: 'original.notAllowed' })}
              </span>
            </div>
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.ndc' })}: </span>
              <span>{CancelRx.MedicationPrescribed.DrugCoded.ProductCode.Code}</span>
            </div>
            {CancelRx.MedicationPrescribed.PriorAuthorization && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.priorAuthorization' })}: </span>
                <span>{CancelRx.MedicationPrescribed.PriorAuthorization}</span>
              </div>
            )}
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'messages.messageDate' })}: </span>
              <span>{mediumMessageDate}</span>
            </div>
            {CancelRx.MedicationPrescribed?.Note && (
              <div className="flex">
                <span>{formatMessage({ id: 'original.pharmacyNote' })}: </span>
                <span>{CancelRx.MedicationPrescribed.Note}</span>
              </div>
            )}
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

CancelRxItem.displayName = 'CancelRxItem';
export default CancelRxItem;
