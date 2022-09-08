import React, { FC } from 'react';
import cx from 'classnames';
import { useIntl } from 'react-intl';

import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import { medicationDetailModel } from 'features/medication';

interface IRxChangeResponseItemProps {
  RxChangeResponse: any;
  messageHistory: any;
  mediumMessageDate: string;
  isMedication: boolean;
}

const RxChangeResponseItem: FC<IRxChangeResponseItemProps> = ({ RxChangeResponse, messageHistory, mediumMessageDate, isMedication }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div
        className={cx(
          'bg-blue-500',
          prescriptionDetailModel.getMessageRequestColor(RxChangeResponse.MessageRequestCode),
          'w-full flex justify-between min-h-[4rem] items-center px-[16px] text-white'
        )}
      >
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
          {(RxChangeResponse?.Response?.Approved || RxChangeResponse?.Response?.ApprovedWithChanges) && <span>Approved</span>}
          {RxChangeResponse?.Response?.Denied && <span>{formatMessage({ id: 'messages.declined' })}</span>}
          <span className="font-bold">
            {RxChangeResponse.MessageRequestCode === 'T' && `-${formatMessage({ id: 'rx.change.pharmacySuggestedAlternative' })}`}
            {RxChangeResponse.MessageRequestCode === 'P' && `-${formatMessage({ id: 'original.priorAuthorization' })}`}
            {RxChangeResponse.MessageRequestCode === 'U' && `-${formatMessage({ id: 'rx.change.prescriberAuthorization' })}`}
            {RxChangeResponse.MessageRequestCode === 'OS' && `-${formatMessage({ id: 'rx.change.outStock' })}`}
            {RxChangeResponse.MessageRequestCode === 'D' && `-${formatMessage({ id: 'rx.change.drugUseEvaluation' })}`}
            {RxChangeResponse.MessageRequestCode === 'G' && `-${formatMessage({ id: 'rx.change.genericSubstitution' })}`}
            {RxChangeResponse.MessageRequestCode === 'S' && `-${formatMessage({ id: 'rx.change.scriptClarification' })}`}
          </span>
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
            <div className="flex items-center">
              <span className="font-bold">{RxChangeResponse.MedicationPrescribed.DrugDescription} </span>
              <span className="text-red-500 opacity-40 font-bold">
                {RxChangeResponse?.MessageRequestCode === 'D' && formatMessage({ id: 'rx.change.drugUseEvaluation' })}
                {RxChangeResponse?.MessageRequestCode === 'G' && formatMessage({ id: 'rx.change.genericSubstitution' })}
                {RxChangeResponse?.MessageRequestCode === 'T' && formatMessage({ id: 'rx.change.pharmacySuggestedAlternative' })}
                {RxChangeResponse?.MessageRequestCode === 'P' && formatMessage({ id: 'original.priorAuthorization' })}
                {RxChangeResponse?.MessageRequestCode === 'U' && formatMessage({ id: 'rx.change.prescriberAuthorization' })}
                {RxChangeResponse?.MessageRequestCode === 'OS' && formatMessage({ id: 'rx.change.outStock' })}
                {RxChangeResponse?.MessageRequestCode === 'S' && formatMessage({ id: 'rx.change.scriptClarification' })}
              </span>
            </div>
            <span className="font-bold">
              #{RxChangeResponse.MedicationPrescribed.Quantity.Value}{' '}
              {prescriptionDetailModel.getQuantityQualifier(RxChangeResponse.MedicationPrescribed.Quantity.QuantityUnitOfMeasure.Code)}
            </span>
            <span>{RxChangeResponse.MedicationPrescribed.Sig.SigText}</span>
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'summary.measures.refill' })}: </span>
              <span>{RxChangeResponse.MedicationPrescribed.NumberOfRefills}</span>
            </div>
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.substitution' })}: </span>
              <span>
                {RxChangeResponse.MedicationPrescribed.Substitutions === '0' && formatMessage({ id: 'original.allowed' })}
                {RxChangeResponse.MedicationPrescribed.Substitutions === '1' && formatMessage({ id: 'original.notAllowed' })}
              </span>
            </div>
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.ndc' })}: </span>
              <span>{RxChangeResponse.MedicationPrescribed.DrugCoded.ProductCode.Code}</span>
            </div>
            {RxChangeResponse.MedicationPrescribed.PriorAuthorization && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.priorAuthorization' })}: </span>
                <span> {RxChangeResponse.MedicationPrescribed.PriorAuthorization}</span>
              </div>
            )}
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'messages.messageDate' })}: </span>
              <span>{mediumMessageDate}</span>
            </div>
            {RxChangeResponse.MedicationPrescribed?.Note && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.pharmacyNote' })}: </span>
                <span>{RxChangeResponse.MedicationPrescribed.Note}</span>
              </div>
            )}
            <div>
              {RxChangeResponse?.Response?.Approved?.Note && (
                <span>
                  {formatMessage({ id: 'rx.change.responseNote' })} {RxChangeResponse.Response.Approved?.Note}
                </span>
              )}
            </div>
            {RxChangeResponse?.Response?.ApprovedWithChanges?.Note && (
              <span>
                {formatMessage({ id: 'rx.change.responseNote' })} {RxChangeResponse.Response.ApprovedWithChanges?.Note}
              </span>
            )}
            {RxChangeResponse?.Response?.Denied?.Note && (
              <span>
                {formatMessage({ id: 'rx.change.responseNote' })} {RxChangeResponse.Response?.DenialTitle} {RxChangeResponse.Response.Denied?.Note}
              </span>
            )}
            {RxChangeResponse?.MessageRequestCode === 'U' && (
              <>
                <span>Prescriber Identification</span>
                {isMedication
                  ? medicationDetailModel?.message?.veterinarian &&
                    RxChangeResponse.Prescriber[medicationDetailModel?.message?.veterinarian].Identification.map((element) => (
                      <p>
                        <b>{element.title}</b>: {element.identification}
                      </p>
                    ))
                  : prescriptionDetailModel?.message?.veterinarian &&
                    RxChangeResponse.Prescriber[prescriptionDetailModel?.message?.veterinarian].Identification.map((element) => (
                      <p>
                        <b>{element.title}</b>: {element.identification}
                      </p>
                    ))}
              </>
            )}
          </div>
          <div>
            {messageHistory?.statusMessages?.map((status) => (
              <>
                {status.messageXml?.Message?.Body?.Status && (
                  <div className="flex flex-col m-[20px] mt-[10px] shadow">
                    <span className="font-bold bg-blue-500 p-[16px] text-white">{formatMessage({ id: 'measures.status' })}</span>
                    <span className="m-[20px] text-xs">
                      {status.messageXml.Message.Body.Status?.Code === '000' && prescriptionDetailModel.getDenialReason('000')}
                      {status.messageXml.Message.Body.Status?.Code === '010' && prescriptionDetailModel.getDenialReason('010')}
                      {status.messageXml.Message.Body.Status?.Note ?? ''}
                    </span>
                  </div>
                )}
                {status?.messageXml?.Message?.Body?.Verify && (
                  <div className="flex flex-col m-[20px] mt-[10px] shadow">
                    <span className="font-bold bg-red-500">{formatMessage({ id: 'rx.item.verify' })}</span>
                    <span>{status.messageXml.Message.Body.Verify.VerifyStatus?.Code === '010' && prescriptionDetailModel.getDenialReason('010')}</span>
                  </div>
                )}
                {status?.messageXml?.Message?.Body?.Error && (
                  <div className="flex flex-col m-[20px] mt-[10px] shadow">
                    <span className="font-bold bg-red-400 p-[16px] text-white">{formatMessage({ id: 'messages.error' })}</span>
                    <div className="flex m-[20px] items-center">
                      <span>
                        {status.messageXml.Message.Body.Error?.Code}- {status.messageXml.Message.Body.Error?.Description}
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

RxChangeResponseItem.displayName = 'RxChangeResponseItem';
export default RxChangeResponseItem;
