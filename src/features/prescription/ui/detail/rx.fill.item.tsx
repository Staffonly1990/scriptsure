import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import { ExclamationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import { reasonCodes } from '../../config';

interface IRxFillItemItemProps {
  RxFill: any;
  messageHistory: any;
  mediumMessageDate: string;
}

const RxFillItem: FC<IRxFillItemItemProps> = ({ RxFill, messageHistory, mediumMessageDate }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div className="w-full flex justify-between min-h-[4rem] items-center bg-blue-500 px-[16px] text-white">
        <div className="flex items-center text-xl">
          <span className="w-4">{messageHistory.order}</span>
          <span>{messageHistory.messageType}</span>
          {RxFill?.FillStatus?.Dispensed && <span>{formatMessage({ id: 'prescription.patientPickedPrescription' })}</span>}
          {RxFill?.FillStatus?.NotDispensed && <span>{formatMessage({ id: 'prescription.patientNotPickedDrugReturnedStock' })}</span>}
          {RxFill?.FillStatus?.PartiallyDispensed && <span>{formatMessage({ id: 'prescription.patientUpPartialPrescription' })}</span>}
          {RxFill?.FillStatus?.Transferred && <span>{formatMessage({ id: 'rx.change.prescriptionTransferredPharmacy' })}</span>}
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
            {RxFill?.FillStatus?.Dispensed?.ReasonCode && (
              <span className="font-bold text-xl">
                {formatMessage({ id: 'rx.change.reason' })}: {reasonCodes[RxFill.FillStatus.Dispensed.ReasonCode]}
              </span>
            )}
            {RxFill?.FillStatus?.NotDispensed?.ReasonCode && (
              <span className="font-bold text-xl">
                {formatMessage({ id: 'rx.change.reason' })}: {reasonCodes[RxFill.FillStatus.NotDispensed.ReasonCode]}
              </span>
            )}
            {RxFill?.FillStatus?.PartiallyDispensed?.ReasonCode && (
              <span className="font-bold text-xl">
                {formatMessage({ id: 'rx.change.reason' })}: {reasonCodes[RxFill.FillStatus.PartiallyDispensed.ReasonCode]}
              </span>
            )}
            {RxFill?.FillStatus?.Transferred?.ReasonCode && (
              <span className="font-bold text-xl">
                {formatMessage({ id: 'rx.change.reason' })}: {reasonCodes[RxFill.FillStatus.Transferred.ReasonCode]}
              </span>
            )}
            <span className="font-bold">{RxFill.MedicationPrescribed.DrugDescription} </span>
            <div className="flex items-center">
              #{RxFill.MedicationDispensed.Quantity.Value}
              {RxFill?.FillStatus?.PartiallyDispensed && (
                <span className="ml-[20px] text-red-500">
                  {formatMessage({ id: 'rx.change.warning' })}
                  {prescriptionDetailModel.totalDispensed(RxFill?.MedicationPrescribed?.Quantity?.Value, RxFill?.MedicationDispensed?.Quantity?.Value)}{' '}
                  {formatMessage({ id: 'rx.change.originalPrescriptionDispensed' })}
                </span>
              )}
            </div>
            {RxFill?.FillStatus?.Dispensed?.Note && (
              <span className="font-bold text-xl">
                {formatMessage({ id: 'original.pharmacyNote' })}: {RxFill.FillStatus.Dispensed.Note}
              </span>
            )}
            {RxFill?.FillStatus?.NotDispensed?.Note && (
              <span className="font-bold text-xl">
                {formatMessage({ id: 'original.pharmacyNote' })}: {RxFill.FillStatus.NotDispensed.Note}
              </span>
            )}
            {RxFill?.FillStatus?.PartiallyDispensed?.Note && (
              <span className="font-bold text-xl">
                {formatMessage({ id: 'original.pharmacyNote' })}: {RxFill.FillStatus.PartiallyDispensed.Note}
              </span>
            )}
            {RxFill?.FillStatus?.Transferred?.Note && (
              <span className="font-bold text-xl">
                {formatMessage({ id: 'original.pharmacyNote' })}: {RxFill.FillStatus.Transferred.Note}
              </span>
            )}
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'messages.messageDate' })}: </span>
              <span>{mediumMessageDate}</span>
            </div>
          </div>
          <div>
            {messageHistory?.statusMessages?.map((status) => (
              <>
                {status?.messageXml?.Message?.Body && Object.prototype.hasOwnProperty.call(status.messageXml.Message.Body, 'Status') && (
                  <div className="flex flex-col m-[20px] mt-[10px] shadow">
                    <span className="font-bold bg-blue-500 p-[16px] text-white">{formatMessage({ id: 'measures.status' })}</span>
                    <span className="m-[20px] text-xs">
                      {status.messageXml.Message.Body.Status.Code === '000' && prescriptionDetailModel.getDenialReason('000')}
                      {status.messageXml.Message.Body.Status.Code === '010' && prescriptionDetailModel.getDenialReason('010')}
                      {status.messageXml.Message.Body.Status?.Note ?? ''}
                    </span>
                  </div>
                )}
                {status.messageXml.Message?.Body?.Verify && (
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

RxFillItem.displayName = 'RxFillItem';
export default RxFillItem;
