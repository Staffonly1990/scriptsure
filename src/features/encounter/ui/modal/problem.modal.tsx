import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { educationStore } from 'features/education';
import { toJS } from 'mobx';

const ProblemModal: FC<Pick<any, 'open' | 'unmount' | 'hideBackdrop' | 'onClose' | 'updateEncounter'>> = observer(
  ({ open, unmount, hideBackdrop, onClose, updateEncounter }) => {
    const intl = useIntl();
    const id = toJS(educationStore.errors.id);
    const message = toJS(educationStore.errors.message);
    const handleClose = () => {
      onClose(false);
      educationStore.clearEducationStatus();
      updateEncounter();
    };
    return (
      <Modal as="div" className="sm:!max-w-md" open={open} unmount={unmount} hideBackdrop={hideBackdrop}>
        <Modal.Header>
          <Modal.Title>{intl.formatMessage({ id: 'measures.problem' })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{id}</p>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Actions onOk={handleClose} onCancel={handleClose} />
      </Modal>
    );
  }
);

ProblemModal.displayName = 'ProblemModal';

export default ProblemModal;
