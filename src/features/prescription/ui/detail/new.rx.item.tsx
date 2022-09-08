import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import { isArray } from 'lodash';

interface INewRxItemProps {
  NewRx: any;
  messageHistory: any;
  mediumMessageDate: string;
}

const NewRxItem: FC<INewRxItemProps> = ({ NewRx, messageHistory, mediumMessageDate }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div className="w-full flex justify-between min-h-[4rem] items-center bg-blue-500 px-[16px] text-white">
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
          <span>
            {messageHistory.messageType} {NewRx.MedicationPrescribed.CompoundInformation && `' - ${formatMessage({ id: 'rx.item.compound' })}'`}
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
          <div className="flex flex-col">
            <span className="font-bold">{NewRx.MedicationPrescribed.DrugDescription} </span>
            {NewRx.MedicationPrescribed.CompoundInformation && (
              <div className="flex flex-col ml-[10px] mb-[10px] text-xs">
                <span className="italic underline">{formatMessage({ id: 'original.ingredientList' })}</span>
                {isArray(NewRx.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                  <>
                    {NewRx.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.map((compound) => (
                      <span>
                        {compound.CompoundIngredient.CompoundIngredientItemDescription} - {compound.Quantity.Value}{' '}
                        {prescriptionDetailModel.getQuantityQualifier(compound.Quantity.QuantityUnitOfMeasure.Code)}
                      </span>
                    ))}
                  </>
                )}
                {NewRx.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed &&
                  !isArray(NewRx.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                    <span>
                      {NewRx.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.CompoundIngredient.CompoundIngredientItemDescription}
                      {' - '}
                      {NewRx.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.Value}{' '}
                      {prescriptionDetailModel.getQuantityQualifier(
                        NewRx.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed?.Quantity?.QuantityUnitOfMeasure?.Code
                      )}
                    </span>
                  )}
              </div>
            )}
          </div>
          <span className="font-bold">
            {NewRx.MedicationPrescribed.Quantity.Value}{' '}
            {prescriptionDetailModel.getQuantityQualifier(NewRx.MedicationPrescribed.Quantity.QuantityUnitOfMeasure.Code)}
          </span>
          <span>{NewRx.MedicationPrescribed.Sig.SigText}</span>
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'summary.measures.refill' })}: </span>
            <span>{NewRx.MedicationPrescribed.NumberOfRefills}</span>
          </div>
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.substitution' })}: </span>
            <span>
              {NewRx.MedicationPrescribed.Substitutions === '0' && formatMessage({ id: 'original.allowed' })}
              {NewRx.MedicationPrescribed.Substitutions === '1' && formatMessage({ id: 'original.notAllowed' })}
            </span>
          </div>
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.ndc' })}: </span>
            <span>{NewRx.MedicationPrescribed.DrugCoded?.ProductCode?.Code}</span>
          </div>
          {NewRx.MedicationPrescribed.PriorAuthorization && (
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.priorAuthorization' })}: </span>
              <span>{NewRx.MedicationPrescribed.PriorAuthorization}</span>
            </div>
          )}
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'messages.messageDate' })}: </span>
            <span>{mediumMessageDate}</span>
          </div>
          {NewRx.MedicationPrescribed?.Note && (
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.pharmacyNote' })}: </span>
              <span>{NewRx.MedicationPrescribed.Note}</span>
            </div>
          )}
          <div>
            {messageHistory?.statusMessages?.map((status) => (
              <>
                {status?.messageXml?.Message?.Body?.Status && (
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
                    <span>{status.messageXml.Message.Body.Verify?.VerifyStatus?.Code === '010' && prescriptionDetailModel.getDenialReason('010')}</span>
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
        </div>
      )}
    </>
  );
};

NewRxItem.displayName = 'NewRxItem';
export default NewRxItem;
