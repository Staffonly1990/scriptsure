import React, { FC } from 'react';
import { isArray } from 'lodash';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import { reasonCodes } from '../../config';
import { medicationDetailModel } from 'features/medication';

interface IRxRenewalResponseItemProps {
  RxRenewalResponse: any;
  messageHistory: any;
  mediumMessageDate: string;
  isMedication: boolean;
}

const RxRenewalResponseItem: FC<IRxRenewalResponseItemProps> = ({ RxRenewalResponse, messageHistory, mediumMessageDate, isMedication }) => {
  const { formatMessage } = useIntl();
  const veterinarian = (isMedication ? medicationDetailModel : prescriptionDetailModel)?.message?.veterinarian;
  return (
    <>
      <div className="w-full flex justify-between min-h-[4rem] items-center bg-blue-500 px-[16px] text-white">
        <div className="flex items-center text-xl">
          <span className="w-4">{messageHistory.order}</span>
          <span className="border-r-2 border-white h-full" />
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
          {RxRenewalResponse.Response.Approved && (
            <span className="text-xl">
              {formatMessage({ id: 'messages.approved' })} {RxRenewalResponse.Response.Approved?.Note ?? ''}
            </span>
          )}
          {RxRenewalResponse.Response.ApprovedWithChanges && <span className="text-xl">{formatMessage({ id: 'messages.approved' })}</span>}
          {RxRenewalResponse.Response.Denied && <span className="text-xl">{formatMessage({ id: 'messages.declined' })}</span>}
          {RxRenewalResponse.Response.Replace && <span className="text-xl">{formatMessage({ id: 'rx.change.replaceRefillRequestNewPrescription' })}</span>}
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
            <span className="font-bold">{RxRenewalResponse.MedicationResponse.DrugDescription} </span>
            <span className="font-bold">
              {RxRenewalResponse.MedicationResponse.Quantity.Value}{' '}
              {prescriptionDetailModel.getQuantityQualifier(RxRenewalResponse.MedicationResponse.Quantity.QuantityUnitOfMeasure.Code)}
            </span>
            <span>{RxRenewalResponse.MedicationResponse.Sig.SigText}</span>
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'summary.measures.refill' })}: </span>
              <span>{RxRenewalResponse.MedicationResponse.NumberOfRefills}</span>
            </div>
            <div className="flex">
              <span>{formatMessage({ id: 'original.substitution' })}: </span>
              <span>
                {RxRenewalResponse.MedicationResponse.Substitutions === '0' && formatMessage({ id: 'original.allowed' })}
                {RxRenewalResponse.MedicationResponse.Substitutions === '1' && formatMessage({ id: 'original.notAllowed' })}
              </span>
            </div>
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.ndc' })}: </span>
              <span>{RxRenewalResponse.MedicationResponse.DrugCoded.ProductCode.Code}</span>
            </div>
            {RxRenewalResponse.MedicationResponse.PriorAuthorization && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.priorAuthorization' })}: </span>
                <span>{RxRenewalResponse.MedicationResponse.PriorAuthorization}</span>
              </div>
            )}
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'messages.messageDate' })}: </span>
              <span>{mediumMessageDate}</span>
            </div>
            <div>
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'measures.prescriber' })}: </span>
                <span>
                  {veterinarian && RxRenewalResponse.Prescriber[veterinarian].Name?.FirstName}{' '}
                  {veterinarian && RxRenewalResponse.Prescriber[veterinarian].Name?.LastName}
                </span>
              </div>
            </div>
            {RxRenewalResponse.FollowUpPrescriber && (
              <div className="flex">
                <span>
                  <span className="xl:w-[40%]">{formatMessage({ id: 'detail.followUpPrescriber' })}: </span>
                  <span>
                    {veterinarian && RxRenewalResponse.FollowUpPrescriber[veterinarian].Name.FirstName}{' '}
                    {veterinarian && RxRenewalResponse.FollowUpPrescriber[veterinarian].Name.LastName}
                  </span>{' '}
                </span>
              </div>
            )}
            {veterinarian && RxRenewalResponse.Prescriber[veterinarian].PrescriberAgent && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'messages.prescriberAgent' })}: </span>
                <span>
                  {veterinarian && RxRenewalResponse.Prescriber[veterinarian].PrescriberAgent.Name.FirstName}{' '}
                  {veterinarian && RxRenewalResponse.Prescriber[veterinarian].PrescriberAgent.Name.LastName}
                </span>
              </div>
            )}
            {veterinarian && RxRenewalResponse.Supervisor[veterinarian] && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'detail.supervisor' })}: </span>
                <span>
                  {veterinarian && RxRenewalResponse.Supervisor[veterinarian].Name?.FirstName}{' '}
                  {veterinarian && RxRenewalResponse.Supervisor[veterinarian].Name?.LastName}
                </span>
              </div>
            )}
            {RxRenewalResponse.MedicationResponse?.Note && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.pharmacyNote' })}: </span>
                <span>{RxRenewalResponse.MedicationResponse.Note}</span>
              </div>
            )}

            {RxRenewalResponse?.Response?.Approved?.Note && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'rx.change.responseNote' })}: </span>
                <span> {RxRenewalResponse.Response.Approved?.Note}</span>
              </div>
            )}

            {RxRenewalResponse?.Response?.ApprovedWithChanges?.Note && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'rx.change.responseNote' })}: </span>
                <span> {RxRenewalResponse.Response.ApprovedWithChanges?.Note}</span>
              </div>
            )}

            {RxRenewalResponse?.Response?.Denied?.Note && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'rx.change.responseNote' })}: </span>
                <span>
                  {RxRenewalResponse.Response?.DenialTitle} {RxRenewalResponse.Response.Denied?.Note}
                </span>
              </div>
            )}
            {RxRenewalResponse?.MessageRequestCode === 'U' && (
              <>
                <span>{formatMessage({ id: 'rx.change.prescriberIdentification' })}</span>
                {veterinarian &&
                  RxRenewalResponse.Prescriber[veterinarian].Identification.map((element) => (
                    <p>
                      <b>{element.title}</b>: {element.identification}
                    </p>
                  ))}
              </>
            )}
            <div className="flex flex-col">
              {RxRenewalResponse?.Response?.Denied && (
                <>
                  {RxRenewalResponse.Response.Denied?.DenialReason && (
                    <span className="font-bold">
                      {formatMessage({ id: 'rx.change.reason' })}: {RxRenewalResponse.Response.Denied?.DenialReason}
                      <ExclamationCircleIcon className="w-6 h-6" />
                    </span>
                  )}
                  {RxRenewalResponse.Response.Denied?.ReferenceNumber && (
                    <span className="font-bold">
                      {formatMessage({ id: 'rx.change.referenceNumber' })}: {RxRenewalResponse.Response.Denied?.ReferenceNumber}
                      <ExclamationCircleIcon className="w-6 h-6" />
                    </span>
                  )}
                  {RxRenewalResponse.Response.Denied?.ReasonCode && (
                    <div className="flex items-center font-bold">
                      <span className="xl:w-[40%] mr-[5px]">{formatMessage({ id: 'rx.change.denialReason' })}:</span>
                      <div className="flex flex-col">
                        {isArray(RxRenewalResponse.Response.Denied?.ReasonCode) &&
                          RxRenewalResponse.Response.Denied.ReasonCode.map((denial) => <span>{reasonCodes[denial]}</span>)}
                      </div>
                      <div className="flex flex-col">
                        {RxRenewalResponse.Response.Denied?.ReasonCode && !isArray(RxRenewalResponse.Response.Denied?.ReasonCode) && (
                          <span>{reasonCodes[RxRenewalResponse.Response.Denied.ReasonCode]}</span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            {messageHistory?.statusMessages?.map((status) => (
              <>
                {status?.messageXml?.Message?.Body?.Status && (
                  <div className="flex flex-col m-[20px] mt-[10px] shadow">
                    <span className="font-bold bg-blue-500 p-[16px] text-white">{formatMessage({ id: 'measures.status' })}</span>
                    <span className="m-[20px] text-xs">
                      {status.messageXml.Message.Body.Status?.Code === '000' && prescriptionDetailModel.getDenialReason('000')}
                      {status.messageXml.Message.Body.Status?.Code === '010' && prescriptionDetailModel.getDenialReason('010')}
                      {status.messageXml.Message.Body.Status?.Note && `${status.messageXml.Message.Body.Status?.Note}`}
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

RxRenewalResponseItem.displayName = 'RxRenewalResponseItem';
export default RxRenewalResponseItem;
