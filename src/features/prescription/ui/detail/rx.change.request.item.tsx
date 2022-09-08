import React, { FC } from 'react';
import cx from 'classnames';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import { MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import { medicationDetailModel } from 'features/medication';

interface IRxChangeRequestItemProps {
  RxChangeRequest: any;
  messageHistory: any;
  mediumMessageDate: string;
  isMedication: boolean;
}

const RxChangeRequestItem: FC<IRxChangeRequestItemProps> = ({ RxChangeRequest, messageHistory, mediumMessageDate, isMedication }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div
        className={cx(
          'bg-blue-500',
          prescriptionDetailModel.getMessageRequestColor(RxChangeRequest.MessageRequestCode),
          'w-full flex justify-between min-h-[4rem] items-center px-[16px] text-white'
        )}
      >
        <div className="flex items-center text-xl">
          <span className="w-4">{messageHistory.order}</span>
          <span>{messageHistory.messageType}</span>
          <span>-{formatMessage({ id: 'rx.change.Pending' })}</span>
          <span className="font-bold">
            {RxChangeRequest?.MessageRequestCode === 'T' && `-${formatMessage({ id: 'rx.change.pharmacySuggestedAlternative' })}`}
            {RxChangeRequest?.MessageRequestCode === 'P' && `-${formatMessage({ id: 'original.priorAuthorization' })}`}
            {RxChangeRequest?.MessageRequestCode === 'U' && `-${formatMessage({ id: 'rx.change.prescriberAuthorization' })}`}
            {RxChangeRequest?.MessageRequestCode === 'OS' && `-${formatMessage({ id: 'rx.change.outStock' })}`}
            {RxChangeRequest?.MessageRequestCode === 'D' && `-${formatMessage({ id: 'rx.change.drugUseEvaluation' })}`}
            {RxChangeRequest?.MessageRequestCode === 'G' && `-${formatMessage({ id: 'rx.change.genericSubstitution' })}`}
            {RxChangeRequest?.MessageRequestCode === 'S' && `-${formatMessage({ id: 'rx.change.scriptClarification' })}`}
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
        <div className="m-[20px] flex flex-col min-h-[4rem]">
          <div className="flex items-center">
            <span className="font-bold">{RxChangeRequest.MedicationPrescribed.DrugDescription} </span>
            <span className="text-red-500 opacity-40 font-bold">
              {RxChangeRequest.MessageRequestCode === 'D' && formatMessage({ id: 'rx.change.drugUseEvaluation' })}
              {RxChangeRequest.MessageRequestCode === 'G' && formatMessage({ id: 'rx.change.genericSubstitution' })}
              {RxChangeRequest.MessageRequestCode === 'T' && formatMessage({ id: 'rx.change.pharmacySuggestedAlternative' })}
              {RxChangeRequest.MessageRequestCode === 'P' && formatMessage({ id: 'original.priorAuthorization' })}
              {RxChangeRequest.MessageRequestCode === 'U' && formatMessage({ id: 'rx.change.prescriberAuthorization' })}
              {RxChangeRequest.MessageRequestCode === 'OS' && formatMessage({ id: 'rx.change.outStock' })}
              {RxChangeRequest.MessageRequestCode === 'S' && formatMessage({ id: 'rx.change.scriptClarification' })}
            </span>
          </div>
          <span className="font-bold">
            #{RxChangeRequest.MedicationPrescribed.Quantity.Value}{' '}
            {prescriptionDetailModel.getQuantityQualifier(RxChangeRequest.MedicationPrescribed.Quantity.QuantityUnitOfMeasure.Code)}
          </span>
          <span>{RxChangeRequest.MedicationPrescribed.Sig.SigText}</span>
          <div className="flex items-center">
            <span className="xl:w-[40%]">{formatMessage({ id: 'summary.measures.refill' })}: </span>
            <span>{RxChangeRequest.MedicationPrescribed.NumberOfRefills}</span>
          </div>
          <div className="flex items-center">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.substitution' })}: </span>
            <span>
              {RxChangeRequest.MedicationPrescribed.Substitutions === '0' && ` ${formatMessage({ id: 'original.allowed' })}`}
              {RxChangeRequest.MedicationPrescribed.Substitutions === '1' && ` ${formatMessage({ id: 'original.notAllowed' })}`}
            </span>
          </div>
          <div className="flex items-center">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.ndc' })}: </span>
            <span>{RxChangeRequest.MedicationPrescribed.DrugCoded.ProductCode.Code}</span>
          </div>
          {RxChangeRequest.MedicationPrescribed.PriorAuthorization && (
            <div className="flex items-center">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.priorAuthorization' })}:</span>
              <span>{RxChangeRequest.MedicationPrescribed.PriorAuthorization}</span>
            </div>
          )}
          <div className="flex items-center">
            <span className="xl:w-[40%]">{formatMessage({ id: 'messages.messageDate' })}: </span>
            <span>{mediumMessageDate}</span>
          </div>
          {RxChangeRequest.MedicationPrescribed?.Note && (
            <div className="flex items-center">
              <span>{formatMessage({ id: 'original.pharmacyNote' })} </span>
              <span>{RxChangeRequest.MedicationPrescribed.Note}</span>
            </div>
          )}
          {RxChangeRequest?.Response?.Approved?.Note && (
            <span>
              {formatMessage({ id: 'rx.change.responseNote' })} {RxChangeRequest.Response.Approved.Note}
            </span>
          )}
          {RxChangeRequest?.Response?.ApprovedWithChanges?.Note && (
            <span>
              {formatMessage({ id: 'rx.change.responseNote' })} {RxChangeRequest.Response.ApprovedWithChanges.Note}
            </span>
          )}
          {RxChangeRequest?.Response?.Denied?.Note && (
            <span>
              {formatMessage({ id: 'rx.change.responseNote' })} {RxChangeRequest.Response?.DenialTitle} {RxChangeRequest.Response.Denied.Note}
            </span>
          )}
          {RxChangeRequest.MessageRequestCode === 'U' && (
            <>
              <span>{formatMessage({ id: 'rx.change.prescriberIdentification' })}</span>
              {isMedication
                ? medicationDetailModel?.message?.veterinarian &&
                  RxChangeRequest.Prescriber[medicationDetailModel?.message?.veterinarian].Identification.map((element) => (
                    <span>
                      <b>{element.title}</b>: {element.identification}
                    </span>
                  ))
                : prescriptionDetailModel?.message?.veterinarian &&
                  RxChangeRequest.Prescriber[prescriptionDetailModel?.message?.veterinarian].Identification.map((element) => (
                    <span>
                      <b>{element.title}</b>: {element.identification}
                    </span>
                  ))}
            </>
          )}
        </div>
      )}
    </>
  );
};

RxChangeRequestItem.displayName = 'RxChangeRequestItem';
export default RxChangeRequestItem;
