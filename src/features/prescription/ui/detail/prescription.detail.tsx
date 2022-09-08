import React, { FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';

import Modal from 'shared/ui/modal';
import Button from 'shared/ui/button';
import { ArrowCircleLeftIcon, ArrowCircleRightIcon, MenuIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../model';
import DetailHistoryItem from './detail.history.item';
import { MessageView } from 'features/message';
import { medicationDetailModel } from 'features/medication';
import MedicationDetail from '../../../medication/ui/medication.detail';
import Alert from 'shared/ui/alert';
import DetailInformation from './detail.information/detail.information';

interface IPrescriptionDetailProps {
  show: boolean;
  isMedication?: boolean;
}

const typesModal = {
  VALIDATION: {
    textContent: 'The medication is a controlled substance, and must be approved by the prescribing physician',
    title: 'Validation',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  PHARMACY_SERVICE_LEVEL: {
    textContent: 'Pharmacy is unable to receive the message type',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  PHARMACY_CONTROLLED: {
    textContent: 'Pharmacy is unable to receive controlled substances',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  REPLACE_PRESCRIPTION: {
    textContent: 'Replace renewal response is only permissible for controlled substance renewals. Please select another denial reason.',
    title: 'Replace Prescription',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  REPLACE: {
    textContent: 'Pharmacy is unable to receive a replace type message for controlled substances. Please deny the message, then prescribe a new prescription.',
    title: 'Replace',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  PATIENT: {
    textContent: 'Patient must be attached to the message before it can be approved. Click green icon  next to patient name to attach patient to message.',
    title: 'PATIENT',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  CANCEL_PRESCRIPTION: {
    title: 'Cancel Prescription',
    textContent: 'Would you like to send a cancel prescription request for the original new prescription that was sent to pharmacy?',
    handleCancel: () => {
      prescriptionDetailModel.cancelPrescriptionConfirm(false);
      prescriptionDetailModel.showModal = null;
    },
    handleOk: () => {
      prescriptionDetailModel.cancelPrescriptionConfirm(true);
      prescriptionDetailModel.showModal = null;
    },
  },
  REFILL_MAX_LENGTH: {
    textContent: 'Refill max length is 2 digits',
    title: 'Refill',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  REFILL_CLASS: {
    textContent: 'Controlled substances sent electronically cannot have refills greater than 5',
    title: 'Refill',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  REFILL_CLASS_II: {
    textContent: 'Class-II controlled substances sent electronically refills cannot be greater than 1',
    title: 'Refill',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  REFILL_DECIMAL: {
    textContent: 'Refill may not contain a decimal place',
    title: 'Refill',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  SERVICE_LEVEL: {
    textContent: 'Prescriber is unable to send new prescriptions to the pharmacy',
    title: 'Service Level',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
  PHARMACY_NOTE: {
    textContent: 'Pharmacy note must be less than 70 characters',
    title: 'Pharmacy Note',
    handleOk: () => {
      prescriptionDetailModel.showModal = null;
    },
  },
};

const PrescriptionDetail: FC<StyledComponentProps<IPrescriptionDetailProps>> = observer(({ show, isMedication }) => {
  const { formatMessage } = useIntl();

  const { notify } = useNotifier();
  const {
    register,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      ssPharmacyNote: '',
      ssRefill: 0,
      ssPriorAuthorization: '',
      ssPrescriberAuthorization: '',
    },
  });

  useEffect(() => {
    if (!prescriptionDetailModel.notify) return;
    const onClose = () => {
      prescriptionDetailModel.notify = '';
    };
    notify(
      <Alert.Notification onClose={onClose} shape="smooth" color="green" border closable>
        {prescriptionDetailModel.notify}
      </Alert.Notification>
    );
  }, [prescriptionDetailModel.notify]);

  const onClose = useCallback(() => {
    prescriptionDetailModel.showPrescriptionDetail = false;
  }, []);

  const onSubmit = () => {
    if (isValid) {
      prescriptionDetailModel.send(errors);
    }
  };

  return (
    <>
      {prescriptionDetailModel.showModal && (
        <Modal as="div" className="" hideBackdrop open>
          {typesModal[prescriptionDetailModel.showModal].title && (
            <Modal.Header>
              <Modal.Title>{typesModal[prescriptionDetailModel.showModal].title}</Modal.Title>
            </Modal.Header>
          )}
          <Modal.Body>{typesModal[prescriptionDetailModel.showModal].textContent}</Modal.Body>
          <div className="px-6 pt-4 pb-2 gap-1">
            {typesModal[prescriptionDetailModel.showModal].handleOk && (
              <Button variant="filled" color="blue" onClick={typesModal[prescriptionDetailModel.showModal].handleOk}>
                {formatMessage({ id: 'ok' })}
              </Button>
            )}
            {typesModal[prescriptionDetailModel.showModal].handleCancel && (
              <Button variant="filled" color="blue" onClick={typesModal[prescriptionDetailModel.showModal].handleCancel}>
                {formatMessage({ id: 'no' })}
              </Button>
            )}
          </div>
        </Modal>
      )}
      {medicationDetailModel.show && <MedicationDetail />}
      <Modal open={show} onClose={onClose} className="w-full !max-w-[60rem]">
        <Modal.Header className="text-white">
          <Modal.Title as="h2">
            {formatMessage({ id: 'prescription.detail' })}
            {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageType === 'RxChangeRequest' && (
              <span> - {formatMessage({ id: 'messages.changeRequest' })}</span>
            )}
            {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageType === 'NewRx' && (
              <span> - {formatMessage({ id: 'messages.newPrescription' })}</span>
            )}
            {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageType === 'CancelRx' && (
              <span> - {formatMessage({ id: 'cancel prescription' })}</span>
            )}
            {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageType === 'RxRenewalRequest' && (
              <span> - {formatMessage({ id: 'prescription.refillRequest' })}</span>
            )}
          </Modal.Title>
          {!isMedication && prescriptionDetailModel.messages.length > 1 && (
            <div className="items-center hidden xl:flex">
              <Button onClick={prescriptionDetailModel.previousMessage}>
                <ArrowCircleLeftIcon className="w-5 h-5" />
              </Button>
              <span>{prescriptionDetailModel.currentMessageTitle}</span>
              <Button onClick={prescriptionDetailModel.nextMessage}>
                <ArrowCircleRightIcon className="w-5 h-5" />
              </Button>
            </div>
          )}
        </Modal.Header>
        <Modal.Body className="h-[calc(100%-116px)] overflow-y-scroll">
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
                {formatMessage({ id: 'prescription.message' })}: {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageId}
              </span>
              <span>
                {formatMessage({ id: 'messages.messageDate' })}: {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageDate}
              </span>
            </div>
            <div>
              {!(isMedication ? medicationDetailModel : prescriptionDetailModel).message.isOldScript &&
                (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageStatus !== 'Pending' &&
                (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageStatus !== 'WaitingApproval' &&
                (isMedication
                  ? medicationDetailModel?.message?.messageHistory && medicationDetailModel.message?.messageHistory.length > 0
                  : prescriptionDetailModel?.message?.messageHistory && prescriptionDetailModel.message?.messageHistory.length > 0) && (
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
                    {(isMedication
                      ? medicationDetailModel.message?.messageHistory && medicationDetailModel.message.messageHistory.length === 0
                      : prescriptionDetailModel.message?.messageHistory && prescriptionDetailModel.message.messageHistory.length === 0) &&
                      (isMedication ? medicationDetailModel : prescriptionDetailModel)?.message?.messageType !== 'RxFill' && (
                        <span>{formatMessage({ id: 'prescription.noStatusReported' })}</span>
                      )}
                    {(isMedication
                      ? medicationDetailModel.message?.messageHistory && medicationDetailModel.message.messageHistory.length === 0
                      : prescriptionDetailModel.message?.messageHistory && prescriptionDetailModel.message.messageHistory.length === 0) &&
                      (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageType === 'RxFill' && (
                        <div className="flex flex-col">
                          <span>
                            {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageType} -
                            {formatMessage({ id: 'prescription.prescriptionFaxed' })}
                          </span>
                          <span className="text-xs">{(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageDate}</span>
                          <div className="text-xs">
                            {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml?.FillStatus?.Filled && (
                              <>
                                <span>{formatMessage({ id: 'prescription.patientPickedPrescription' })}</span>
                                <span>{(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml.FillStatus.Filled?.Note}</span>
                              </>
                            )}
                            {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml.FillStatus?.NotFilled && (
                              <>
                                <span>{formatMessage({ id: 'prescription.patientNotPickedDrugReturnedStock' })}</span>
                                <span>{(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml.FillStatus.NotFilled?.Note}</span>
                              </>
                            )}
                            {(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml.FillStatus?.PartialFill && (
                              <>
                                <span>{formatMessage({ id: 'prescription.patientUpPartialPrescription' })}</span>
                                <span>{(isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml.FillStatus.PartialFill?.Note}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    <div className="flex flex-col pb-1rem">
                      {prescriptionDetailModel
                        .getMessageHistoryFilter((isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageHistory)
                        .map((messageHistory) => (
                          <DetailHistoryItem messageHistory={messageHistory} isMedication={!!isMedication} />
                        ))}
                    </div>
                  </div>
                )}
            </div>
            {!isMedication && prescriptionDetailModel.message?.messageXml && (
              <DetailInformation register={register} errors={errors} trigger={trigger} getValues={getValues} isMedication={!!isMedication} />
            )}
          </div>
        </Modal.Body>
        <div className="px-6 pt-4 pb-2 gap-1">
          <Button variant="filled" color="blue" onClick={onClose}>
            {formatMessage({ id: 'cancel' })}
          </Button>
          {!isMedication &&
            prescriptionDetailModel.message?.messageStatus?.indexOf('Error') === -1 &&
            prescriptionDetailModel.message.messageStatus.indexOf('Success') === -1 &&
            prescriptionDetailModel.response.length > 0 &&
            prescriptionDetailModel.response !== 'ZZ' &&
            !prescriptionDetailModel.stopSend &&
            ((prescriptionDetailModel.message?.messageXml?.MessageRequestCode !== 'G' &&
              prescriptionDetailModel.message?.messageXml?.MessageRequestCode !== 'T' &&
              prescriptionDetailModel.message?.messageXml?.MessageRequestCode !== 'D' &&
              prescriptionDetailModel.message?.messageXml?.MessageRequestCode !== 'S' &&
              prescriptionDetailModel.message?.messageXml?.MessageRequestCode !== 'OS' &&
              prescriptionDetailModel.response === 'A') ||
              prescriptionDetailModel.response !== 'A') && (
              <Button variant="filled" color="blue" disabled={prescriptionDetailModel.isProcessing} onClick={onSubmit}>
                {formatMessage({ id: 'prescription.send' })}
              </Button>
            )}
          {!isMedication && prescriptionDetailModel.message.messageStatus === 'Error' && (
            <Button
              variant="filled"
              color="blue"
              onClick={() => prescriptionDetailModel.updateMessageStatus(prescriptionDetailModel.message.requestId, 'Error Reviewed')}
            >
              {formatMessage({ id: 'prescription.reviewed' })}
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
});
PrescriptionDetail.displayName = 'PrescriptionDetail';
export default PrescriptionDetail;
