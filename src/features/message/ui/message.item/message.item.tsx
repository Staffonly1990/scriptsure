import React, { FC, useCallback, useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { useNotifier } from 'react-headless-notifier';
import { lastValueFrom } from 'rxjs';
import { has } from 'lodash';
import { useIntl } from 'react-intl';

import Alert from 'shared/ui/alert';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { routes } from 'shared/config';
import { useRouter } from 'shared/hooks';
import Popper from 'shared/ui/popper/popper';
import { IMessage, OTabList, updateMessagePatient } from 'shared/api/message';
import { ChatAlt2Icon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import {
  ExclamationCircleIcon,
  RefreshIcon,
  XCircleIcon,
  StopIcon,
  PlayIcon,
  CreditCardIcon,
  XIcon,
  UserAddIcon,
  SearchIcon,
  StarIcon,
  FolderIcon,
  BanIcon,
} from '@heroicons/react/outline';
import { messageStore } from '../../model';
import { AddPatientModal } from 'features/patient/add';
import { SearchPatientModal } from 'features/patient';
import { prescriptionQueue } from '../../../prescription';

interface IMessageItemProps {
  message: IMessage;
}

enum StatusColors {
  T = 'green',
  G = 'purple',
  OS = 'teal',
  U = 'pink',
  S = 'red',
  D = 'blue',
  P = 'orange',
}

enum MessageRequestCodes {
  D = 'Drug Use Evaluation',
  G = 'Generic Substitution',
  T = 'Pharmacy Suggested Alternative',
  P = 'Prior Authorization',
  U = 'Prescriber Authorization',
  OS = 'Out of Stock',
  S = 'Script Clarification',
}

const followUpRequest = {
  '1': '1st Followup Request',
  '2': '2nd Followup Request',
  '3': '3rd Followup Request',
  '4': '4th Followup Request',
  '5': '5th Followup Request',
};

enum ItemsModifyDecision {
  AA = 'Patient Unknown to the Prescriber',
  AB = 'Patient Never Under Prescriber Care',
  AC = 'Patient No Longer Under Prescriber Care',
  AD = 'Patient Has Requested Refill Too Soon',
  AE = 'Medication Never Prescribed For The Patient',
  AF = 'Patient Should Contact Prescriber First',
  AG = 'Refill Not Appropriate',
  AM = 'Patient Needs Appointment',
  AN = 'Prescriber Not Associated With This Practice Or Location',
  ZZ = 'Replace Refill Request with New Prescription',
}

const MessageItem: FC<IMessageItemProps> = ({ message }) => {
  const { formatMessage } = useIntl();
  const { notify } = useNotifier();
  const { replace } = useRouter();
  const [openModifyDecision, setOpenModifyDecision] = useState(false);
  const [openModalAddPatient, setOpenModalAddPatient] = useState(false);
  const [openModalSearchPatient, setOpenModalSearchPatient] = useState(false);

  const handleShowDetail = useCallback(() => {
    messageStore.showDetail(message);
  }, []);

  const handleModifyDecision = (value: boolean) => setOpenModifyDecision(value);

  const getMessageIconColor = (messageRequestCode: 'T' | 'G' | 'OS' | 'U' | 'S' | 'D' | 'P') => {
    return StatusColors[messageRequestCode] || 'blue';
  };

  const getMessageBackgroundColor = () => {
    if (message.reviewedUserId) return 'bg-green-200 hover:bg-opacity-50';
    return 'bg-transparent hover:bg-gray-300';
  };

  const getIcon = () => {
    if (message.messageType === 'RxChangeRequest' && message.messageStatus === 'Pending') {
      return <FolderIcon className="h-8 w-8" />;
    }

    if (message.messageType === 'RxRenewalRequest' && (message.messageStatus === 'Pending' || message.messageStatus === 'WaitingApproval')) {
      return <RefreshIcon className="h-8 w-8" />;
    }

    if (message.messageStatus.includes('Error')) {
      return <ExclamationCircleIcon className="h-8 w-8" />;
    }

    if (message.messageType === 'CancelRxResponse') {
      return <XCircleIcon className="h-8 w-8" />;
    }

    if (message.messageStatus.includes('Declined')) {
      return <StopIcon className="h-8 w-8" />;
    }

    if (message.messageStatus.includes('Success')) {
      return <PlayIcon className="h-8 w-8" />;
    }

    if (has(message, 'taskStatus')) {
      return <CreditCardIcon className="h-8 w-8" />;
    }

    if (
      message.messageType === 'NewRx' &&
      (message.messageStatus === 'WaitingApproval' || message.messageStatus === 'PendingNewRx' || message.messageStatus === 'InhouseNewRx')
    ) {
      return <ChatAlt2Icon className="h-8 w-8" />;
    }
    return null;
  };

  const getDenialReason = (reasonCode) => {
    switch (reasonCode) {
      case 'AA':
        return 'Patient Unknown to the Prescriber';
      case 'AB':
        return 'Patient Never Under Prescriber Care';
      case 'AC':
        return 'Patient No Longer Under Prescriber Care';
      case 'AD':
        return 'Patient Has Requested Refill Too Soon';
      case 'AE':
        return 'Medication Never Prescribed For The Patient';
      case 'AF':
        return 'Patient Should Contact Prescriber First';
      case 'AG':
        return 'Refill Not Appropriate';
      case 'AM':
        return 'Patient Needs Appointment';
      case 'AN':
        return 'Prescriber Not Associated With This Practice Or Location';
      case 'ZZ':
        return 'Denied New Prescription to Follow';
      default:
        return '';
    }
  };

  const getItemText = () => {
    switch (message.messageType) {
      case 'CancelRx':
        return 'Cancel';
      case 'NewRx':
        return 'New';
      case 'RxFill':
        return 'RxFill';
      case 'RxRenewalRequest':
        return 'Refill';
      case 'RxChangeRequest':
        return 'Change';
      case 'Approved':
        return 'Approved';
      case 'Declined':
        return 'Declined';
      default:
        if (message.messageType === 'Error' || message.messageStatus.includes('Error')) return 'Error';
        return '';
    }
  };

  const handleSelectSearchPatient = async (e, patient) => {
    e.preventDefault();
    if (patient) {
      await lastValueFrom(updateMessagePatient(message.requestId, patient.patientId, patient.firstName, patient.lastName)).then(() => {
        messageStore.changePatient(patient.patientId, patient.firstName, patient.lastName);
        setOpenModalSearchPatient(false);
        notify(
          <Alert.Notification
            actions={(close) => (
              <Button variant="flat" onClick={() => close()}>
                {formatMessage({ id: 'ok' })}
              </Button>
            )}
          >
            {formatMessage({ id: 'messages.patientUpdated' })}
          </Alert.Notification>
        );
      });
    }
  };

  return (
    <>
      {openModalAddPatient && (
        <AddPatientModal open={openModalAddPatient} onClose={() => setOpenModalAddPatient(false)} unmount hideBackdrop={false} editable />
      )}
      {openModalSearchPatient && (
        <SearchPatientModal
          defaultSearchValue={`${message.lastName} ${message.firstName}`}
          open={openModalSearchPatient}
          onClose={() => setOpenModalSearchPatient(false)}
          onSelect={handleSelectSearchPatient}
          unmount
          hideBackdrop={false}
          editable
        />
      )}
      <div className={cx(getMessageBackgroundColor(), 'flex flex-col py-2 px-4 justify-between xl:flex-row border-b-2 border-gray-300')}>
        <div className="flex min-h-[8rem]">
          <div className="flex items-center min-w-[6rem] justify-center">
            <Tooltip content={formatMessage({ id: 'messages.details' })}>
              <div className="flex flex-col items-center">
                <Button className="flex flex-col max-w-min" shape="circle" color={getMessageIconColor(message.messageRequestCode)} onClick={handleShowDetail}>
                  {getIcon()}
                </Button>
                <span className="text-primary">{getItemText()}</span>
              </div>
            </Tooltip>
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex white-space">
              <Tooltip content={formatMessage({ id: 'messages.openChart' })}>
                <Button
                  className="uppercase font-medium"
                  variant="flat"
                  color="black"
                  onClick={() => replace(`${routes.chart.path(message.patientId)}/dashboard`)}
                >
                  <span>{message.lastName}</span>
                  <span className="hidden md:block">
                    , {message.firstName} {moment(message.dob).format('MM/DD/YYYY')}
                  </span>
                </Button>
              </Tooltip>
              {!!message.patientId && (
                <Button className="uppercase !text-green-500 font-bold" variant="flat" color="black" onClick={() => {}}>
                  {formatMessage({ id: 'messages.openMedicationHistory' })}
                </Button>
              )}
              {!message.patientId && (
                <div className="flex">
                  <Tooltip content={formatMessage({ id: 'demographics.measures.addNew' })}>
                    <Button variant="flat" color="green" className="!p-0 ml-4" onClick={() => setOpenModalAddPatient(true)}>
                      <UserAddIcon className="h-6 w-6" />
                    </Button>
                  </Tooltip>
                  <Tooltip content={formatMessage({ id: 'messages.findExistingPatient' })}>
                    <Button variant="flat" color="green" className="!p-0 ml-4" onClick={() => setOpenModalSearchPatient(true)}>
                      <SearchIcon className="h-6 w-6" />
                    </Button>
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="flex flex-col pl-3.5 text-primary">
              <p className="text-2xl font-semibold">
                {message.drugName}{' '}
                {message.messageType === 'CancelRxResponse' && (
                  <span className="text-red-300"> - {formatMessage({ id: 'messages.prescriptionCancelled' })}</span>
                )}
                {message.messageType === 'RxChangeRequest' && <span className="text-red-300">{MessageRequestCodes[message.messageRequestCode]}</span>}
                {message.followUpRequest && <span className="text-red-300">{followUpRequest[message.followUpRequest]}</span>}
              </p>
              <p className="text-sm">
                {message.messageStatus === 'QueuedDeclined' && <span>{moment(new Date(message.updatedAt)).format('MM/DD/YYYY h:mma')} </span>}
                {message.note}
              </p>
              <p className="text-sm">{message.quantity}</p>
              <p className="text-sm">{moment(new Date(message.messageDate)).format('MM/DD/YYYY h:mma')}</p>
              {!Object.prototype.hasOwnProperty.call(message, 'taskStatus') && (
                <>
                  <p>{message.pharmacy}</p>
                  <p>
                    {message.doctorFirstName} {message.doctorLastName}({messageStore.getPracticeName(message)})
                  </p>
                </>
              )}
              {message.userId !== message.doctorId && message.userName && (
                <p>
                  <span className="font-bold text-blue-200">{formatMessage({ id: 'messages.prescriberAgent' })}: </span>
                  {message.userName}
                </p>
              )}
              {message.reviewedUserId && (
                <p>
                  <span className="font-bold text-blue-200">{formatMessage({ id: 'messages.reviewedBy' })}:</span>
                  {message.reviewedUserName} ({moment(new Date(message.reviewedDate)).format('MM/DD/YYYY h:mma')})
                </p>
              )}
              {message.requireApproval !== 3 && message.requireApproval !== null && message.note && (
                <p>
                  <span className="font-bold">{formatMessage({ id: 'messages.note' })}: </span>
                  {message.note}
                </p>
              )}
              {message.requireApproval === 3 && (
                <p>
                  <span className="font-bold">{formatMessage({ id: 'messages.denied' })}:</span>
                  {getDenialReason(message.messageResponse)}
                  {message.note}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex ml-28 mt-4 items-center xl:ml-0 xl:mt-0 xl:items-start">
          {message.messageType === 'NewRx' && message.messageStatus === 'WaitingApproval' && (
            <>
              <Button
                className="uppercase !text-white font-bold !shadow mr-4"
                variant="filled"
                color="green"
                onClick={() => prescriptionQueue.approveMessage(message)}
              >
                {formatMessage({ id: 'messages.approve' })}
              </Button>
              <div className="mt-1">
                <Tooltip content={formatMessage({ id: 'messages.deletePrescription' })}>
                  <Button variant="flat" color="gray" className="!p-0 ml-4" onClick={() => prescriptionQueue.deletePrescription(message)}>
                    <TrashIcon className="h-6 w-6" />
                  </Button>
                </Tooltip>
                <Tooltip content={formatMessage({ id: 'measures.edit' })}>
                  <Button variant="flat" color="gray" className="!p-0 ml-4" onClick={() => messageStore.editPrescription(message)}>
                    <PencilIcon className="h-6 w-6" />
                  </Button>
                </Tooltip>
              </div>
            </>
          )}

          {message.messageType === 'NewRx' && message.messageStatus === 'InhouseNewRx' && (
            <>
              <Tooltip content={formatMessage({ id: 'messages.markPrescriptionFilled' })}>
                <Button
                  className="uppercase !text-white font-bold !shadow"
                  variant="filled"
                  color="green"
                  onClick={(event) => {
                    event.stopPropagation();
                    messageStore.approveInHouse(message);
                  }}
                >
                  {formatMessage({ id: 'messages.fill' })}
                </Button>
              </Tooltip>
              <Tooltip content={formatMessage({ id: 'messages.declinePrescription' })}>
                <Button variant="flat" color="gray" className="!p-0 mx-4" onClick={() => messageStore.declineInHouse(message)}>
                  <TrashIcon className="h-6 w-6" />
                </Button>
              </Tooltip>
            </>
          )}

          {(message.requireApproval === 2 || message.requireApproval === 3) && message.messageStatus === 'WaitingApproval' && (
            <Tooltip content={formatMessage({ id: 'messages.modifyDecisionForMessage' })}>
              <Popper
                open={openModifyDecision}
                onClose={openModifyDecision ? () => handleModifyDecision(false) : undefined}
                content={
                  <div className="flex flex-col">
                    <div className="border-b-2">
                      <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.approve(message)}>
                        <FolderIcon className="w-4 h-4" />
                        <span>{formatMessage({ id: 'messages.approve' })}</span>
                      </Button>
                    </div>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AA')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AA}</span>
                    </Button>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AB')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AB}</span>
                    </Button>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AC')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AC}</span>
                    </Button>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AD')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AD}</span>
                    </Button>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AE')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AE}</span>
                    </Button>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AF')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AF}</span>
                    </Button>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AG')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AG}</span>
                    </Button>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AM')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AM}</span>
                    </Button>
                    <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AN')}>
                      <BanIcon className="w-4 h-4" />
                      <span>{ItemsModifyDecision.AN}</span>
                    </Button>
                    {message.messageType !== 'RxChangeRequest' && (
                      <div className="border-t-2">
                        <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'ZZ')}>
                          <RefreshIcon className="w-4 h-4" />
                          <span>{ItemsModifyDecision.ZZ}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                }
              >
                <>
                  <Button variant="flat" color="blue" onClick={() => handleModifyDecision(true)}>
                    <StarIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    className="uppercase font-bold !shadow mr-4"
                    variant="filled"
                    color={message.requireApproval === 2 ? 'blue' : 'red'}
                    onClick={() => prescriptionQueue.approveMessage(message)}
                  >
                    {message.requireApproval === 2 ? 'Send approval' : 'Send decline'}
                  </Button>
                </>
              </Popper>
            </Tooltip>
          )}

          {message.messageStatus.indexOf('Declined') === -1 &&
            message.messageStatus.indexOf('Error') === -1 &&
            message.messageStatus.indexOf('Success') === -1 &&
            message.messageStatus.indexOf('PendingNewRx') === -1 &&
            (message.requireApproval === 0 || message.requireApproval === null) &&
            message.messageType !== 'NewRx' &&
            message.messageStatus !== 'WaitingApproval' && (
              <>
                {!message.reviewedUserId && (
                  <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.reviewedMessage(message)}>
                    {formatMessage({ id: 'prescription.reviewed' })}
                  </Button>
                )}

                <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.approve(message)}>
                  {formatMessage({ id: 'messages.approve' })}
                </Button>
                {message.messageType === 'RxChangeRequest' && (
                  <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AL')}>
                    {formatMessage({ id: 'messages.decline' })}
                  </Button>
                )}
                {message.messageType !== 'RxChangeRequest' && (
                  <Popper
                    open={openModifyDecision}
                    onClose={openModifyDecision ? () => handleModifyDecision(false) : undefined}
                    content={
                      <div className="flex flex-col">
                        <Button
                          className="uppercase !text-white font-bold !shadow mr-4"
                          variant="filled"
                          color="white"
                          onClick={() => messageStore.decline(message, 'AA')}
                        >
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AA}</span>
                        </Button>
                        <Button
                          className="uppercase !text-white font-bold !shadow mr-4"
                          variant="filled"
                          color="white"
                          onClick={() => messageStore.decline(message, 'AB')}
                        >
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AB}</span>
                        </Button>
                        <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AC')}>
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AC}</span>
                        </Button>
                        <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AD')}>
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AD}</span>
                        </Button>
                        <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AE')}>
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AE}</span>
                        </Button>
                        <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AF')}>
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AF}</span>
                        </Button>
                        <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AG')}>
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AG}</span>
                        </Button>
                        <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AM')}>
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AM}</span>
                        </Button>
                        <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.decline(message, 'AN')}>
                          <BanIcon className="w-4 h-4 mr-2" />
                          <span>{ItemsModifyDecision.AN}</span>
                        </Button>
                        {message.messageType !== 'RxChangeRequest' && (
                          <div className="border-t-2">
                            <Button
                              className="uppercase font-bold !shadow mr-4"
                              variant="filled"
                              color="white"
                              onClick={() => messageStore.decline(message, 'ZZ')}
                            >
                              <RefreshIcon className="w-4 h-4 mr-2" />
                              <span>{ItemsModifyDecision.ZZ}</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    }
                  >
                    <>
                      <Button variant="flat" color="blue" onClick={() => handleModifyDecision(true)}>
                        <StarIcon className="w-4 h-4 mr-2" />
                      </Button>
                      <Button
                        className="uppercase font-bold !shadow mr-4"
                        variant="filled"
                        color={message.requireApproval === Number(2) ? 'blue' : 'red'}
                        onClick={() => prescriptionQueue.approveMessage(message)}
                      >
                        {message.requireApproval === Number(2) ? formatMessage({ id: 'messages.sendApproval' }) : formatMessage({ id: 'messages.sendDecline' })}
                      </Button>
                    </>
                  </Popper>
                )}
              </>
            )}

          {message.messageStatus === 'Error' && (
            <>
              {message.messageType === 'NewRx' && (
                <Button
                  className="uppercase !text-white font-bold !shadow mr-4"
                  variant="filled"
                  color="green"
                  onClick={() => messageStore.represcribe(message.practiceId, message.doctorId, message.messageId)}
                >
                  {formatMessage({ id: 'messages.represcribe' })}
                </Button>
              )}
              <Button
                className="uppercase font-bold !shadow mr-4"
                variant="filled"
                color="white"
                onClick={() => messageStore.updateMessageStatus(message.requestId, 'Error Reviewed')}
              >
                {formatMessage({ id: 'prescription.reviewed' })}
              </Button>
            </>
          )}

          {String(message.messageType) === 'NewRx' && message.messageStatus === 'Success' && message.messageResponse !== 'X' && (
            <Tooltip content={formatMessage({ id: 'messages.sendCancelPrescription' })}>
              <Button className="uppercase font-bold !shadow mr-4" variant="filled" color="white" onClick={() => messageStore.cancelPrescription(message)}>
                {formatMessage({ id: 'measures.cancel' })}
              </Button>
            </Tooltip>
          )}
          {has(message, 'taskStatus') && (
            <>
              <Tooltip content={formatMessage({ id: 'messages.removePAPendingList' })}>
                <Button variant="flat" color="gray" className="!p-0 ml-4" onClick={() => messageStore.completePa(message)}>
                  <XIcon className="h-6 w-6" />
                  <span>{formatMessage({ id: 'messages.complete' })}</span>
                </Button>
              </Tooltip>
              <Button variant="flat" color="gray" className="!p-0 ml-4" onClick={() => messageStore.openTask(message)}>
                {formatMessage({ id: 'messages.open' })}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
MessageItem.displayName = 'MessageItem';

export default MessageItem;
