import React, { FC } from 'react';
import { isArray } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { ExclamationCircleIcon } from '@heroicons/react/solid';
import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import { phoneToMask } from 'shared/lib/mask.phone';
import { prescriptionDetailModel } from '../../model';
import { denialReasonTranslates } from '../../config';
import { medicationDetailModel } from 'features/medication';

interface IDetailHistoryPrescriberCardProps {
  isMedication: boolean;
}

const DetailHistoryPrescriberCard: FC<IDetailHistoryPrescriberCardProps> = observer(({ isMedication }) => {
  const { formatMessage } = useIntl();
  const message = isMedication ? medicationDetailModel?.message : prescriptionDetailModel?.message;
  const showPhysician = isMedication ? medicationDetailModel.showPhysician : prescriptionDetailModel.showPhysician;
  const veterinarian = message?.veterinarian;
  const prescriber = message?.messageXml?.Prescriber;
  const supervisor = message?.messageXml?.Supervisor;
  const followUpPrescriber = message?.messageXml?.FollowUpPrescriber;

  return (
    <div className="shadow w-full p-[16px]">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          {veterinarian && prescriber?.[veterinarian] && (
            <div className="flex flex-col">
              <span className="text-xs opacity-50 italic">{formatMessage({ id: 'measures.prescriber' })}</span>
              <Tooltip content={`${prescriber[veterinarian]?.Name.FirstName ?? ''} ${prescriber[veterinarian]?.Name.LastName ?? ''}`}>
                <span className="flex font-medium xl:text-sm xl:opacity-50">
                  {prescriber[veterinarian]?.Name.FirstName ?? ''} {prescriber[veterinarian].Name.LastName ?? ''}
                </span>
              </Tooltip>
            </div>
          )}
          <Tooltip content={formatMessage({ id: 'detail.showDetail' })}>
            <Button
              variant="filled"
              shape="circle"
              color="transparent"
              onClick={() => (isMedication ? medicationDetailModel.expandPhysician() : prescriptionDetailModel.expandPhysician())}
            >
              <ExclamationCircleIcon className="w-6 h-6" />
            </Button>
          </Tooltip>
        </div>
        {veterinarian && prescriber?.[veterinarian] && (
          <div className="flex xl:opacity-50">
            <span className="text-xs w-[40%]">{formatMessage({ id: 'detail.dea' })}: </span>
            <span className="text-xs">{prescriber?.[veterinarian]?.Identification?.DEANumber}</span>
          </div>
        )}
        {veterinarian && followUpPrescriber?.Name && (
          <div className="flex xl:opacity-50">
            <span className="text-xs w-[40%]">{formatMessage({ id: 'detail.followUpPrescriber' })}: </span>
            <span className="text-xs">
              {followUpPrescriber[veterinarian].Name?.FirstName ?? ''}
              {followUpPrescriber[veterinarian].Name?.LastName ?? ''}
            </span>
          </div>
        )}
        {veterinarian && prescriber?.[veterinarian]?.PrescriberAgent && (
          <div className="flex xl:opacity-50">
            <span className="text-xs w-[40%]">{formatMessage({ id: 'messages.prescriberAgent' })}: </span>
            <span className="text-xs">
              {prescriber?.[veterinarian].PrescriberAgent?.Name?.FirstName ?? ''}
              {prescriber[veterinarian].PrescriberAgent?.Name?.LastName ?? ''}
            </span>
          </div>
        )}
        {veterinarian && supervisor?.[veterinarian] && (
          <div className="flex xl:opacity-50">
            <span className="text-xs w-[40%]">{formatMessage({ id: 'detail.supervisor' })}: </span>
            <span className="text-xs">
              {supervisor[veterinarian]?.Name?.FirstName ?? ''} {supervisor[veterinarian]?.Name?.LastName ?? ''}
            </span>
          </div>
        )}
      </div>
      {showPhysician && (
        <div className="border-t-2 flex flex-col mt-[16px] pt-[16px]">
          {veterinarian && prescriber?.[veterinarian] && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'detail.dea' })}: </span>
              <span className="text-xs">{prescriber[veterinarian]?.Identification.DEANumber}</span>
            </div>
          )}
          {veterinarian && prescriber?.[veterinarian] && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'npi' })}: </span>
              <span className="text-xs">{prescriber[veterinarian]?.Identification?.NPI}</span>
            </div>
          )}
          {veterinarian && prescriber?.[veterinarian]?.Identification?.Data2000WaiverID && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'detail.detox' })}: </span>
              <span className="text-xs">{prescriber[veterinarian].Identification.Data2000WaiverID}</span>
            </div>
          )}
          {veterinarian && prescriber?.[veterinarian]?.Identification?.StateLicenseNumber && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'detail.stateLicense' })}: </span>
              <span className="text-xs">{prescriber[veterinarian].Identification.StateLicenseNumber}</span>
            </div>
          )}
          {veterinarian && prescriber?.[veterinarian]?.Identification?.StateControlSubstanceNumber && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'detail.stateControlledLicense' })}: </span>
              <span className="text-xs">{prescriber[veterinarian].Identification.StateControlSubstanceNumber}</span>
            </div>
          )}
          {veterinarian && prescriber?.[veterinarian] && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'reports.measures.practice' })}: </span>
              <span className="text-xs">{prescriber[veterinarian]?.PracticeLocation.BusinessName}</span>
            </div>
          )}
          {veterinarian && prescriber?.[veterinarian] && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'demographics.measures.address' })}: </span>
              <div className="flex whitespace-pre-line">
                <span className="text-xs">
                  {`${prescriber[veterinarian]?.Address?.AddressLine1 ?? ''} ${prescriber[veterinarian]?.Address?.AddressLine2 ?? ''}
                  ${prescriber[veterinarian]?.Address?.City ?? ''}, ${prescriber[veterinarian]?.Address?.State ?? ''}
                  ${prescriber[veterinarian]?.Address?.ZipCode ?? ''} ${prescriber[veterinarian]?.Address?.StateProvince ?? ''}
                  ${prescriber[veterinarian]?.Address?.PostalCode ?? ''}`}
                </span>
              </div>
            </div>
          )}
          {veterinarian &&
            !message.isOldScript &&
            Object.keys(prescriber[veterinarian]?.CommunicationNumbers).map((type, index) => (
              <div className="flex">
                <span className="text-xs w-[40%]">{denialReasonTranslates[type.toUpperCase()]}</span>
                <span className="text-xs">
                  {phoneToMask(prescriber[veterinarian]?.CommunicationNumbers?.[type]?.Number)}
                  {!prescriber[veterinarian]?.CommunicationNumbers[index]?.Number && prescriber[veterinarian]?.CommunicationNumbers[index]}
                </span>
              </div>
            ))}
          {message.isOldScript && (
            <div className="flex flex-col">
              <>
                {veterinarian &&
                  prescriber[veterinarian]?.CommunicationNumbers?.Communication &&
                  !isArray(prescriber[veterinarian]?.CommunicationNumbers?.Communication) && (
                    <div className="flex">
                      <span className="text-xs w-[40%]">{formatMessage({ id: 'invite.contact' })}:</span>
                      <span className="text-xs">{phoneToMask(prescriber[veterinarian]?.CommunicationNumbers?.Communication?.Number)}</span>
                    </div>
                  )}
                {veterinarian &&
                  isArray(prescriber[veterinarian]?.CommunicationNumbers?.Communication) &&
                  prescriber[veterinarian]?.CommunicationNumbers?.Communication.map((communication) => (
                    <div className="flex">
                      <span className="text-xs w-[40%]">{formatMessage({ id: 'invite.contact' })}: </span>
                      <span className="text-xs">{phoneToMask(communication?.Number)}</span>
                    </div>
                  ))}
              </>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
DetailHistoryPrescriberCard.displayName = 'DetailHistoryPrescriberCard';
export default DetailHistoryPrescriberCard;
