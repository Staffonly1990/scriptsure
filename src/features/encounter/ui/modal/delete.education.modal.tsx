import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { useNotifier } from 'react-headless-notifier';

import Modal, { IModalProps } from 'shared/ui/modal';
import Alert from 'shared/ui/alert';
import Button from 'shared/ui/button';

import { educationStore } from 'features/education';

interface IEducationEncounterId {
  encounterId: number;
  name: string;
}

interface IDeleteEducationModal extends IModalProps {
  updateEncounter: () => void;
  educationEncounterId: IEducationEncounterId;
}

const DeleteEducationModal: FC<Pick<IDeleteEducationModal, 'open' | 'onClose' | 'hideBackdrop' | 'unmount' | 'updateEncounter' | 'educationEncounterId'>> =
  observer(({ open, onClose, hideBackdrop, unmount, updateEncounter, educationEncounterId }) => {
    const intl = useIntl();
    const { notify } = useNotifier();

    const handleClose = () => {
      if (onClose) {
        onClose(false);
      }
    };

    const handleDelete = async () => {
      await educationStore.deleteEducation(educationEncounterId.encounterId);
      updateEncounter();
      handleClose();
      notify(
        <Alert.Notification
          actions={(close) => (
            <Button variant="flat" onClick={() => close()}>
              {intl.formatMessage({ id: 'measures.ok' })}
            </Button>
          )}
        >
          {intl.formatMessage({ id: 'encounters.measures.diagnosisDeleted' })}
        </Alert.Notification>
      );
    };

    return (
      <Modal as="div" unmount={unmount} hideBackdrop={hideBackdrop} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="text-white">{intl.formatMessage({ id: 'measures.delete' })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>
            {intl.formatMessage({ id: 'encounters.measures.sureDeleteEducation' })} {educationEncounterId.name} ?
          </span>
        </Modal.Body>
        <Modal.Actions onCancel={handleClose} onOk={handleDelete} />
      </Modal>
    );
  });

DeleteEducationModal.displayName = 'DeleteEducationModal';

export default DeleteEducationModal;
