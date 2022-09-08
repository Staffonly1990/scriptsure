import React, { FC, SetStateAction, Dispatch } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import Alert from 'shared/ui/alert';
import { IEducation } from 'shared/api/education/education.types';
import { observer } from 'mobx-react-lite';
import { useNotifier } from 'react-headless-notifier';

import { educationStore } from '../model';
import { useIntl } from 'react-intl';

interface IModalArchive {
  isArchived: IEducation;
  onClose?: (value: boolean) => void;
  open: boolean;
  setIsAddEdFlag: Dispatch<SetStateAction<boolean>>;
}
const ArchiveEducationModal: FC<IModalArchive> = observer(({ open, onClose, isArchived, setIsAddEdFlag }) => {
  const intl = useIntl();
  const { notify } = useNotifier();
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  const handleArchiveEducation = async () => {
    handleClose();
    await educationStore.setArchiveEducation(isArchived);
    setIsAddEdFlag((prevData) => !prevData);
    notify(
      <Alert.Notification
        actions={(close) => (
          <Button variant="flat" onClick={() => close()}>
            {intl.formatMessage({ id: 'measures.ok' })}
          </Button>
        )}
      >
        {intl.formatMessage({ id: 'education.measures.archive' })}
      </Alert.Notification>
    );
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header as="h5" className="bg-primary text-2xl">
        {intl.formatMessage({ id: 'measures.archive' })}
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>{intl.formatMessage({ id: 'education.measures.sureArchive' })}</p>
          <div className="flex justify-end">
            <Button variant="flat" size="lg" className="uppercase" type="button" onClick={handleClose}>
              {intl.formatMessage({ id: 'measures.cancel' })}
            </Button>
            <Button variant="flat" size="lg" className="uppercase" type="submit" onClick={handleArchiveEducation}>
              {intl.formatMessage({ id: 'measures.ok' })}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});
ArchiveEducationModal.displayName = 'ArchiveEducationModal';
export default ArchiveEducationModal;
