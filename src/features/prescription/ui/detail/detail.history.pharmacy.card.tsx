import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { isArray } from 'lodash';
import { useIntl } from 'react-intl';

import { ExclamationCircleIcon } from '@heroicons/react/solid';
import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import { phoneToMask } from 'shared/lib/mask.phone';
import { prescriptionDetailModel } from '../../model';
import { denialReasonTranslates } from '../../config';
import { medicationDetailModel } from 'features/medication';

interface IDetailHistoryPharmacyCardProps {
  isMedication: boolean;
}

const DetailHistoryPharmacyCard: FC<IDetailHistoryPharmacyCardProps> = observer(({ isMedication }) => {
  const { formatMessage } = useIntl();
  const message = isMedication ? medicationDetailModel?.message : prescriptionDetailModel?.message;
  const pharmacy = message?.messageXml?.Pharmacy;
  const showPharmacy = isMedication ? medicationDetailModel.showPharmacy : prescriptionDetailModel.showPharmacy;

  return (
    <div className="shadow w-full p-[16px]">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs opacity-50 italic">{formatMessage({ id: 'settings.pharmacy' })}</span>
            <span className="flex font-medium xl:text-sm xl:opacity-50">
              {pharmacy?.BusinessName} {pharmacy?.StoreName}
            </span>
          </div>
          <Tooltip content={formatMessage({ id: 'detail.showDetail' })}>
            <Button
              variant="filled"
              shape="circle"
              color="transparent"
              onClick={() => (isMedication ? medicationDetailModel.expandPharmacy() : prescriptionDetailModel.expandPharmacy())}
            >
              <ExclamationCircleIcon className="w-6 h-6" />
            </Button>
          </Tooltip>
        </div>
        <span className="text-sm opacity-50">{phoneToMask(pharmacy?.CommunicationNumbers?.PrimaryTelephone?.Number)}</span>
        <span className="text-sm opacity-50">
          {pharmacy.Address.AddressLine1 ?? ''} {pharmacy.Address.AddressLine2 ?? ''}
        </span>
      </div>
      {showPharmacy && (
        <div className="border-t-2 flex flex-col mt-[16px] pt-[16px]">
          <div className="flex">
            <span className="text-xs w-[40%]">{formatMessage({ id: 'detail.identification' })}: </span>
            <span className="text-xs">{pharmacy?.Identification?.NCPDPID}</span>
          </div>
          <div className="flex">
            <span className="text-xs w-[40%]">{formatMessage({ id: 'demographics.measures.address' })}: </span>
            <span className="text-xs whitespace-pre-line">
              {`${pharmacy?.Address?.AddressLine1 ?? ''} ${pharmacy?.Address?.AddressLine2 ?? ''}
                  ${pharmacy?.Address?.City ?? ''}, ${pharmacy?.Address?.State ?? ''}
                  ${pharmacy?.Address?.ZipCode ?? ''} ${pharmacy?.Address?.StateProvince ?? ''}
                  ${pharmacy?.Address?.PostalCode ?? ''}`}
            </span>
          </div>
          {!message.isOldScript &&
            Object.keys(pharmacy?.CommunicationNumbers).map((type, index) => (
              <div className="flex">
                <span className="text-xs w-[40%]">{denialReasonTranslates[type.toUpperCase()]}</span>
                {pharmacy.CommunicationNumbers?.[type]?.Number && (
                  <span className="text-xs">
                    {phoneToMask(pharmacy.CommunicationNumbers?.[type]?.Number)}
                    {pharmacy?.CommunicationNumbers?.[index]?.Extension && <span>x {pharmacy?.CommunicationNumbers?.[index]?.Extension}</span>}
                  </span>
                )}
                {!pharmacy.CommunicationNumbers?.[type]?.Number && (
                  <span className="text-xs">{!pharmacy?.CommunicationNumbers?.[index]?.Number && pharmacy?.CommunicationNumbers?.[index]}</span>
                )}
              </div>
            ))}
          {message.isOldScript && (
            <div className="flex flex-col">
              <>
                {message?.messageXml?.Pharmacy?.CommunicationNumbers?.Communication &&
                  !isArray(message?.messageXml?.Pharmacy?.CommunicationNumbers?.Communication) && (
                    <div className="flex">
                      <span className="text-xs w-[40%]">{formatMessage({ id: 'invite.contact' })}: </span>
                      <span className="text-xs">{phoneToMask(message?.messageXml?.Pharmacy?.CommunicationNumbers?.Communication?.Number)}</span>
                    </div>
                  )}
                {isArray(message?.messageXml?.Pharmacy?.CommunicationNumbers?.Communication) &&
                  message.messageXml.Pharmacy.CommunicationNumbers.Communication.map((communication) => (
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
DetailHistoryPharmacyCard.displayName = 'DetailHistoryPharmacyCard';
export default DetailHistoryPharmacyCard;
