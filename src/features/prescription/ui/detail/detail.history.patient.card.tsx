import React, { FC, useMemo } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { isArray } from 'lodash';
import { useIntl } from 'react-intl';

import { medicationDetailModel } from 'features/medication';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import { phoneToMask } from 'shared/lib/mask.phone';
import { prescriptionDetailModel } from '../../model';
import { denialReasonTranslates } from '../../config';

interface IDetailHistoryPatientCardProps {
  isMedication: boolean;
}

const DetailHistoryPatientCard: FC<IDetailHistoryPatientCardProps> = observer(({ isMedication }) => {
  const { formatMessage } = useIntl();
  const message = isMedication ? medicationDetailModel?.message : prescriptionDetailModel?.message;
  const showPatient = isMedication ? medicationDetailModel.showPatient : prescriptionDetailModel.showPatient;
  const human = message?.human;
  const patient = message?.messageXml?.Patient;

  const dateOfBirth = useMemo(() => {
    if (human && patient?.[human]) {
      return moment(patient?.[human]?.DateOfBirth.Date).format('MM/DD/YYYY') || '';
    }

    return '';
  }, [human]);

  const gender = useMemo(() => {
    if (human && patient?.[human]?.Gender) {
      switch (patient?.[human]?.Gender) {
        case 'M':
          return formatMessage({ id: 'user.gender.identity.male' });
        case 'F':
          return formatMessage({ id: 'user.gender.identity.female' });
        case 'U':
          return formatMessage({ id: 'user.gender.identity.unknown' });
        default:
          return formatMessage({ id: 'user.gender.identity.unknown' });
      }
    }

    return formatMessage({ id: 'user.gender.identity.unknown' });
  }, [human, formatMessage]);

  return (
    <div className="shadow w-full p-[16px]">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          {human && patient[human] && (
            <div className="flex flex-col">
              <span className="text-xs opacity-50 italic">{formatMessage({ id: 'add.patient.patient' })}</span>
              <Tooltip content={`${patient[human]?.Name?.FirstName ?? ''} ${patient[human]?.Name?.LastName ?? ''}`}>
                <span className="flex font-medium xl:text-sm xl:opacity-50">{`${patient[human]?.Name?.FirstName ?? ''} ${
                  patient[human]?.Name?.LastName ?? ''
                }`}</span>
              </Tooltip>
            </div>
          )}
          <Tooltip content={formatMessage({ id: 'detail.showDetail' })}>
            <Button
              variant="filled"
              shape="circle"
              color="transparent"
              onClick={() => (isMedication ? medicationDetailModel.expandPatient() : prescriptionDetailModel.expandPatient())}
            >
              <ExclamationCircleIcon className="w-6 h-6" />
            </Button>
          </Tooltip>
        </div>
        {human && (
          <span className="text-sm opacity-50">
            {dateOfBirth} ({message.messageXml.Patient?.[human]?.Gender ?? ''})
          </span>
        )}
        {human && (
          <span className="text-sm opacity-50">
            {formatMessage({ id: 'sheet.chartId' })}: {patient?.[human]?.Identification?.MedicalRecordIdentificationNumberEHR ?? ''}
          </span>
        )}
      </div>
      {showPatient && (
        <div className="border-t-2 flex flex-col mt-[16px] pt-[16px]">
          <div className="flex">
            <span className="text-xs w-[40%]">{formatMessage({ id: 'demographics.measures.gender' })}: </span>
            <span className="text-xs">{gender}</span>
          </div>
          {human && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'demographics.measures.dob' })}: </span>
              <span className="text-xs">{dateOfBirth}</span>
            </div>
          )}
          {human && patient?.[human] && (
            <div className="flex">
              <span className="text-xs w-[40%]">{formatMessage({ id: 'demographics.measures.address' })}: </span>
              <span className="text-xs whitespace-pre-line">
                {`${patient[human]?.Address?.AddressLine1 ?? ''} ${patient[human]?.Address?.AddressLine2 ?? ''}
                  ${patient[human]?.Address?.City ?? ''}, ${patient[human]?.Address?.State ?? ''}
                  ${patient[human]?.Address?.ZipCode ?? ''} ${patient[human]?.Address?.StateProvince ?? ''}
                  ${patient[human]?.Address?.PostalCode ?? ''}`}
              </span>
            </div>
          )}
          {human &&
            !message.isOldScript &&
            Object.keys(patient[human]?.CommunicationNumbers).map((type, index) => (
              <div className="flex">
                <span className="text-xs w-[40%]">{denialReasonTranslates[type.toUpperCase()]}</span>
                <span className="text-xs">
                  {phoneToMask(patient[human]?.CommunicationNumbers?.[type]?.Number)}
                  {!patient[human]?.CommunicationNumbers[index]?.Number && patient[human]?.CommunicationNumbers[index]}
                </span>
              </div>
            ))}
          {message.isOldScript && (
            <div className="flex flex-col">
              <>
                {human && patient[human]?.CommunicationNumbers?.Communication && !isArray(patient[human]?.CommunicationNumbers?.Communication) && (
                  <div className="flex">
                    <span className="text-xs w-[40%]">{formatMessage({ id: 'invite.contact' })}:</span>
                    <span className="text-xs">{phoneToMask(patient[human]?.CommunicationNumbers?.Communication?.Number)}</span>
                  </div>
                )}
                {human &&
                  isArray(patient[human]?.CommunicationNumbers?.Communication) &&
                  patient[human]?.CommunicationNumbers?.Communication.map((communication) => (
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
DetailHistoryPatientCard.displayName = 'DetailHistoryPatientCard';
export default DetailHistoryPatientCard;
