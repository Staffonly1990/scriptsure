import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import prescriptionDetailModel from '../../prescription/model/prescription.detail.model';
import DetailInformation from '../../prescription/ui/detail/detail.information/detail.information';
import DetailHistoryItem from '../../prescription/ui/detail/detail.history.item';
import { medicationDetailModel } from '../model';
import Modal from 'shared/ui/modal/modal';
import Button from 'shared/ui/button';
import { MenuIcon } from '@heroicons/react/solid';
import { MessageView } from '../../message';

const MedicationDetail: FC = observer(() => {
  const { formatMessage } = useIntl();
  const onClose = useCallback(() => {
    medicationDetailModel.showModal(false);
    prescriptionDetailModel.showPrescriptionDetail = !prescriptionDetailModel.showPrescriptionDetail;
  }, []);

  return (
    <Modal unmount open={medicationDetailModel.show} onClose={onClose} className="w-full !max-w-[50rem]">
      <Modal.Header className="text-white">
        <Modal.Title as="h2">
          Prescription Detail
          {medicationDetailModel.message.messageType === 'RxChangeRequest' && <span> - {formatMessage({ id: 'messages.changeRequest' })}</span>}
          {medicationDetailModel.message.messageType === 'NewRx' && <span> - {formatMessage({ id: 'messages.newPrescription' })}</span>}
          {medicationDetailModel.message.messageType === 'CancelRx' && <span> - {formatMessage({ id: 'cancel prescription' })}</span>}
          {medicationDetailModel.message.messageType === 'RxRenewalRequest' && <span> - {formatMessage({ id: 'prescription.refillRequest' })}</span>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {prescriptionDetailModel.showXmlDetailModal.show && (
          <MessageView
            show={prescriptionDetailModel.showXmlDetailModal.show}
            onClose={() => {
              prescriptionDetailModel.showXmlDetailModal.show = false;
            }}
            messages={prescriptionDetailModel.showXmlDetailModal.messages}
          />
        )}
        <div className="flex flex-col">
          <div className="text-xs flex flex-col xl:flex-row xl:justify-between xl:text-base">
            <span>
              {formatMessage({ id: 'prescription.message' })}: {medicationDetailModel.message.messageId}
            </span>
            <span>
              {formatMessage({ id: 'messages.messageDate' })}: {medicationDetailModel.message.messageDate}
            </span>
          </div>
          <div>
            {!medicationDetailModel.message.isOldScript &&
              medicationDetailModel.message.messageStatus !== 'Pending' &&
              medicationDetailModel.message.messageStatus !== 'WaitingApproval' &&
              medicationDetailModel?.message?.messageHistory &&
              medicationDetailModel.message?.messageHistory.length > 0 && (
                <div className="shadow flex flex-col p-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl">{formatMessage({ id: 'prescription.activity' })}</span>
                    <Button variant="filled" onClick={prescriptionDetailModel.showMore}>
                      <MenuIcon className="w-5 h-5 mr-1" />
                      <span className="uppercase">
                        {prescriptionDetailModel.showMoreDetail
                          ? formatMessage({ id: 'prescription.showLess' })
                          : formatMessage({ id: 'prescription.showMore' })}
                      </span>
                    </Button>
                  </div>
                  {medicationDetailModel.message?.messageHistory &&
                    medicationDetailModel.message.messageHistory.length === 0 &&
                    medicationDetailModel?.message?.messageType !== 'RxFill' && <span>{formatMessage({ id: 'prescription.noStatusReported' })}</span>}
                  {medicationDetailModel.message?.messageHistory &&
                    medicationDetailModel.message.messageHistory.length === 0 &&
                    medicationDetailModel.message.messageType === 'RxFill' && (
                      <div className="flex flex-col">
                        <span>
                          {medicationDetailModel.message.messageType} - {formatMessage({ id: 'prescription.prescriptionFaxed' })}
                        </span>
                        <span className="text-xs">{medicationDetailModel.message.messageDate}</span>
                        <div className="text-xs">
                          {medicationDetailModel.message.messageXml?.FillStatus?.Filled && (
                            <>
                              <span>{formatMessage({ id: 'prescription.patientPickedPrescription' })}</span>
                              <span>{medicationDetailModel.message.messageXml.FillStatus.Filled?.Note}</span>
                            </>
                          )}
                          {medicationDetailModel.message.messageXml.FillStatus?.NotFilled && (
                            <>
                              <span>{formatMessage({ id: 'prescription.patientNotPickedDrugReturnedStock' })}</span>
                              <span>{medicationDetailModel.message.messageXml.FillStatus.NotFilled?.Note}</span>
                            </>
                          )}
                          {medicationDetailModel.message.messageXml.FillStatus?.PartialFill && (
                            <>
                              <span>{formatMessage({ id: 'prescription.patientUpPartialPrescription' })}</span>
                              <span>{medicationDetailModel.message.messageXml.FillStatus.PartialFill?.Note}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  <div className="flex flex-col pb-1rem">
                    {prescriptionDetailModel.getMessageHistoryFilter(medicationDetailModel.message.messageHistory).map((messageHistory) => (
                      <DetailHistoryItem messageHistory={messageHistory} isMedication />
                    ))}
                  </div>
                </div>
              )}
          </div>
          {medicationDetailModel.message?.messageXml && <DetailInformation isMedication />}
        </div>
      </Modal.Body>
      <div className="px-6 pt-4 pb-2 gap-1">
        <Button variant="filled" color="blue" onClick={onClose}>
          {formatMessage({ id: 'cancel' })}
        </Button>
      </div>
    </Modal>
  );
});

MedicationDetail.displayName = 'MedicationDetail';
export default MedicationDetail;
