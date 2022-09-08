import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { isArray } from 'lodash';

import { prescriptionDetailModel } from '../../../model';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { reasonCodes } from '../../../config';
import { medicationDetailModel } from 'features/medication';

interface IHistoricalGenealogyOlderProps {
  isMedication: boolean;
}

const HistoricalGenealogyOlder: FC<IHistoricalGenealogyOlderProps> = observer(({ isMedication }) => {
  return (
    <div className="flex flex-col self-start w-full p-[16px] shadow">
      <span className="xl:text-xl xl:font-bold">Activity</span>
      <div className="py-[8px]">
        {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageHistory?.map((messageHistory) => (
          <div className="p-[8px] flex flex-col">
            <span className="text-xl">{messageHistory.messageType}</span>
            <span className="text-xs">{moment(new Date(messageHistory.messageDate)).format('MMM D, YYYY hh:mm:ss A')}</span>
            {messageHistory.messageXml?.Message?.Body?.RxChangeResponse && (
              <div className="text-xs flex">
                {messageHistory.messageXml.Message.Body.RxChangeResponse?.Response?.Approved && (
                  <div className="flex flex-col text-xs">
                    <span>Approved {messageHistory.messageXml.Message.Body.RxChangeResponse.Response.Approved.Note}</span>
                    <span>{messageHistory.messageXml.Message.Body.RxChangeResponse?.[prescriptionDetailModel.message.prescription]?.DrugDescription}</span>
                    <span>#{messageHistory.messageXml.Message.Body.RxChangeResponse?.[prescriptionDetailModel.message.prescription]?.Quantity?.Value}</span>
                    <span>{messageHistory.messageXml.Message.Body.RxChangeResponse?.[prescriptionDetailModel.message.prescription]?.Directions}</span>
                  </div>
                )}
                {messageHistory.messageXml.Message.Body.RxChangeResponse?.Response?.ApprovedWithChanges && (
                  <div className="flex flex-col">
                    <span>Approved {messageHistory.messageXml.Message.Body.RxChangeResponse.Response.ApprovedWithChanges.Note}</span>
                    <span>{messageHistory.messageXml.Message.Body.RxChangeResponse?.[prescriptionDetailModel.message.prescription]?.DrugDescription}</span>
                    <span>#{messageHistory.messageXml.Message.Body.RxChangeResponse?.[prescriptionDetailModel.message.prescription]?.Quantity?.Value}</span>
                    <span>{messageHistory.messageXml.Message.Body.RxChangeResponse?.[prescriptionDetailModel.message.prescription]?.Directions}</span>
                  </div>
                )}

                {messageHistory.messageXml.Message.Body.RxChangeResponse?.Response?.Denied && (
                  <div className="flex flex-col">
                    <span>
                      Declined {messageHistory.messageXml.Message.Body.RxChangeResponse.Response?.DenialTitle}
                      {messageHistory.messageXml.Message.Body.RxChangeResponse.Response.Denied.Note}
                    </span>
                  </div>
                )}
              </div>
            )}

            {messageHistory.messageXml?.Message?.Body?.RxRenewalResponse && (
              <div className="text-xs flex">
                {messageHistory.messageXml.Message.Body.RxRenewalResponse?.Response?.Approved && (
                  <span>Approved {messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.Approved.Note}</span>
                )}
                {messageHistory.messageXml.Message.Body.RxRenewalResponse?.Response?.ApprovedWithChanges && (
                  <span>Approved {messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.ApprovedWithChanges.Note}</span>
                )}
                {messageHistory.messageXml.Message.Body.RxRenewalResponse?.Response?.Denied && (
                  <span>
                    Declined {messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.DenialTitle}{' '}
                    {messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.Denied.DenialReason}
                  </span>
                )}
                {messageHistory.messageXml.Message.Body.RxRenewalResponse?.Response?.Replace && (
                  <span>
                    Replace Refill Request with New Prescription {messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.DenialTitle}{' '}
                    {messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.Replace.Note}
                  </span>
                )}
              </div>
            )}

            {messageHistory.messageXml?.Message?.Body?.CancelRxResponse && (
              <div className="text-xs flex">
                {messageHistory.messageXml.Message.Body.CancelRxResponse?.Response?.Approved && (
                  <span>Approved {messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Approved.Note}</span>
                )}
                {messageHistory.messageXml.Message.Body.CancelRxResponse?.Response?.ApprovedWithChanges && (
                  <span>Approved {messageHistory.messageXml.Message.Body.CancelRxResponse.Response.ApprovedWithChanges.Note}</span>
                )}
                {messageHistory.messageXml.Message.Body.CancelRxResponse?.Response?.Denied && (
                  <div className="flex flex-col">
                    {messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.DenialReason && (
                      <div className="flex text-xs items-center">
                        <span>Declined {messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.DenialReason}</span>
                        <ExclamationCircleIcon className="w-6 h-6" />
                      </div>
                    )}
                    {messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReferenceNumber && (
                      <span>Reference Number: {messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReferenceNumber}</span>
                    )}
                    {messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReasonCode && (
                      <div className="flex items-center">
                        <span className="xl:w-[40%]">Denial Reason: </span>
                        <div className="flex flex-col">
                          {isArray(messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReasonCode) &&
                            messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReasonCode.map((denial) => (
                              <span>{reasonCodes[denial]}</span>
                            ))}
                        </div>
                        <div className="flex flex-col">
                          {messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReasonCode &&
                            !isArray(messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReasonCode) && (
                              <span>{reasonCodes[messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReasonCode]}</span>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {messageHistory.messageXml?.Message?.Body?.Status && (
              <div className="text-xs flex">
                {messageHistory.messageXml.Message.Body.Status.Code === '000' && prescriptionDetailModel.getDenialReason('000')}
                {messageHistory.messageXml.Message.Body.Status.Code === '010' && prescriptionDetailModel.getDenialReason('010')}
                {messageHistory.messageXml.Message.Body.Status?.Note ?? ''}
              </div>
            )}

            {messageHistory.messageXml?.Message?.Body?.RxFill && (
              <div className="text-xs flex">
                {messageHistory.messageXml.Message.Body.RxFill.FillStatus.Dispensed && (
                  <div className="flex flex-col">
                    Patient has picked up prescription {messageHistory.messageXml.Message.Body.RxFill.FillStatus.Dispensed.Note}
                  </div>
                )}
                {messageHistory.messageXml.Message.Body.RxFill.FillStatus.NotDispensed && (
                  <div className="flex flex-col">
                    Patient has not picked up prescription, drug returned to stock {messageHistory.messageXml.Message.Body.RxFill.FillStatus.NotDispensed.Note}
                  </div>
                )}
                {messageHistory.messageXml.Message.Body.RxFill.FillStatus.PartiallyDispensed && (
                  <div className="flex flex-col">
                    Patient has picked up partial fill of prescription {messageHistory.messageXml.Message.Body.RxFill.FillStatus.PartiallyDispensed.Note}
                  </div>
                )}
              </div>
            )}

            {messageHistory.messageXml?.Message?.Body?.Verify && (
              <div className="text-xs flex">
                {messageHistory.messageXml.Message.Body.Verify.VerifyStatus.Code === '010' && prescriptionDetailModel.getDenialReason('010')}
              </div>
            )}

            {messageHistory.messageXml?.Message?.Body?.Error && (
              <div className="text-xs flex items-center">
                <span>
                  {messageHistory.messageXml.Message.Body.Error.Code} - {messageHistory.messageXml.Message.Body.Error.Description}
                </span>
                <ExclamationCircleIcon className="w-6 h-6" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

HistoricalGenealogyOlder.displayName = 'HistoricalGenealogyOlder';
export default HistoricalGenealogyOlder;
