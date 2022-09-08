import React, { FC } from 'react';
import { isArray } from 'lodash';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import { MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import { medicationDetailModel } from 'features/medication';

interface IRxRenewalRequestItemProps {
  RxRenewalRequest: any;
  messageHistory: any;
  mediumMessageDate: string;
  isMedication: boolean;
}

const RxRenewalRequestItem: FC<IRxRenewalRequestItemProps> = ({ RxRenewalRequest, messageHistory, mediumMessageDate, isMedication }) => {
  const { formatMessage } = useIntl();
  const veterinarian = (isMedication ? medicationDetailModel : prescriptionDetailModel)?.message?.veterinarian;
  return (
    <>
      <div className="w-full flex justify-between min-h-[4rem] items-center bg-blue-500 px-[16px] text-white">
        <div className="flex items-center text-xl">
          <span className="w-4">{messageHistory.order}</span>
          <span>
            {messageHistory.messageType}-{formatMessage({ id: 'rx.change.Pending' })}
            {RxRenewalRequest.MedicationDispensed.CompoundInformation && ` - ${formatMessage({ id: 'rx.item.compound' })}`}
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
            <span className="font-bold">{RxRenewalRequest.MedicationPrescribed.DrugDescription} </span>
            {RxRenewalRequest.MedicationPrescribed.CompoundInformation && (
              <div className="flex flex-col ml-[10px] mb-[10px] text-xs">
                <span className="italic underline">{formatMessage({ id: 'original.ingredientList' })}</span>
                {isArray(RxRenewalRequest.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                  <>
                    {RxRenewalRequest.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.map((compound) => (
                      <div className="flex">
                        <span>{compound.CompoundIngredient.CompoundIngredientItemDescription} -</span>
                        <span>{compound.Quantity.Value}</span>
                        <span>{prescriptionDetailModel.getQuantityQualifier(compound.Quantity.QuantityUnitOfMeasure.Code)}</span>
                      </div>
                    ))}
                  </>
                )}
                {RxRenewalRequest.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed &&
                  !isArray(RxRenewalRequest.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                    <span>
                      {
                        RxRenewalRequest.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.CompoundIngredient
                          .CompoundIngredientItemDescription
                      }{' '}
                      - {RxRenewalRequest.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.Value}{' '}
                      {prescriptionDetailModel.getQuantityQualifier(
                        RxRenewalRequest.MedicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.QuantityUnitOfMeasure.Code
                      )}
                    </span>
                  )}
              </div>
            )}
          </div>
          <span className="font-bold">
            {RxRenewalRequest.MedicationDispensed.Quantity.Value}{' '}
            {prescriptionDetailModel.getQuantityQualifier(RxRenewalRequest.MedicationDispensed.Quantity.QuantityUnitOfMeasure.Code)}
          </span>
          <span>{RxRenewalRequest.MedicationDispensed.Sig.SigText}</span>
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'summary.measures.refill' })}: </span>
            <span>{RxRenewalRequest.MedicationDispensed.PharmacyRequestedRefills}</span>
          </div>
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.substitution' })}: </span>
            <span>
              {RxRenewalRequest.MedicationDispensed.Substitutions === '0' && formatMessage({ id: 'original.allowed' })}
              {RxRenewalRequest.MedicationDispensed.Substitutions === '1' && formatMessage({ id: 'original.notAllowed' })}
            </span>
          </div>
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.ndc' })}: </span>
            <span>{RxRenewalRequest.MedicationDispensed.DrugCoded.ProductCode.Code}</span>
          </div>
          {RxRenewalRequest.MedicationDispensed.PriorAuthorization && (
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.priorAuthorization' })}: </span>
              <span>{RxRenewalRequest.MedicationDispensed.PriorAuthorization}</span>
            </div>
          )}
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'messages.messageDate' })}: </span>
            <span>{mediumMessageDate}</span>
          </div>
          {veterinarian && (
            <>
              {RxRenewalRequest.Prescriber?.[veterinarian]?.Name && (
                <div className="flex">
                  <span className="xl:w-[40%]">{formatMessage({ id: 'measures.prescriber' })}: </span>
                  <span>
                    {veterinarian && RxRenewalRequest.Prescriber[veterinarian].Name?.FirstName}{' '}
                    {veterinarian && RxRenewalRequest.Prescriber[veterinarian].Name?.LastName}
                  </span>
                </div>
              )}
              {RxRenewalRequest?.FollowUpPrescriber?.[veterinarian]?.Name && (
                <div className="flex">
                  <span className="xl:w-[40%]">{formatMessage({ id: 'detail.followUpPrescriber' })}: </span>
                  <span>
                    {veterinarian && RxRenewalRequest.FollowUpPrescriber[veterinarian].Name?.FirstName}{' '}
                    {veterinarian && RxRenewalRequest.FollowUpPrescriber[veterinarian].Name?.LastName}
                  </span>
                </div>
              )}
              {RxRenewalRequest?.Prescriber?.[veterinarian]?.PrescriberAgent?.Name && (
                <div className="flex">
                  <span className="xl:w-[40%]">{formatMessage({ id: 'messages.prescriberAgent' })}: </span>
                  <span>
                    {veterinarian && RxRenewalRequest.Prescriber[veterinarian]?.Name?.FirstName}{' '}
                    {veterinarian && RxRenewalRequest.Prescriber[veterinarian]?.Name?.LastName}
                  </span>
                </div>
              )}
              {RxRenewalRequest?.Supervisor?.[veterinarian]?.Name && (
                <div className="flex">
                  <span className="xl:w-[40%]">{formatMessage({ id: 'detail.supervisor' })}: </span>
                  <span>
                    {veterinarian && RxRenewalRequest.Supervisor[veterinarian].Name?.FirstName}{' '}
                    {veterinarian && RxRenewalRequest.Supervisor[veterinarian].Name?.LastName}
                  </span>
                </div>
              )}
            </>
          )}
          {RxRenewalRequest.MedicationDispensed?.Note && (
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.pharmacyNote' })}: </span>
              <span>{RxRenewalRequest.MedicationDispensed.Note}</span>
            </div>
          )}
          {RxRenewalRequest?.Response?.Approved?.Note && (
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'rx.change.responseNote' })}: </span>
              <span>{RxRenewalRequest.Response.Approved.Note}</span>
            </div>
          )}
          {RxRenewalRequest?.Response?.ApprovedWithChanges?.Note && (
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'rx.change.responseNote' })}: </span>
              <span>{RxRenewalRequest.Response.ApprovedWithChanges.Note}</span>
            </div>
          )}
          {RxRenewalRequest?.Response?.Denied?.Note && (
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'rx.change.responseNote' })}: </span>
              <span>{RxRenewalRequest.Response.Denied.Note}</span>
            </div>
          )}
          {RxRenewalRequest?.MessageRequestCode === 'U' && (
            <>
              <span>{formatMessage({ id: 'rx.change.prescriberIdentification' })}</span>
              {veterinarian &&
                RxRenewalRequest?.Prescriber?.[veterinarian]?.Identification.map((element) => (
                  <p>
                    <b>{element.title}</b>: {element.identification}
                  </p>
                ))}
            </>
          )}
        </div>
      )}
    </>
  );
};

RxRenewalRequestItem.displayName = 'RxRenewalRequestItem';
export default RxRenewalRequestItem;
