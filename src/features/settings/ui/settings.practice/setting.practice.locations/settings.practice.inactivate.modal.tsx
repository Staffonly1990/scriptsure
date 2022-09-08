import React, { FC } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import { practiceModel } from 'features/practice';
import { toJS } from 'mobx';

interface IModalInactivate {
  onClose?: (value: boolean) => void;
  open: boolean;
}

const SettingsPracticeInactivateModal: FC<IModalInactivate> = observer(({ open, onClose }) => {
  const intl = useIntl();
  const practice = toJS(practiceModel.currentAdminPractice);

  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  const handleInactivatePractice = async () => {
    try {
      if (practice) await practiceModel.updateCurrentAdminPractice(practice.id, { ...practice, practiceStatus: 1 });
    } catch {}
    handleClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header as="h5" className="!text-white text-2xl">
        {practice?.name}
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>
            {intl.formatMessage({
              id: 'practice.inactivate.question',
            })}
          </p>
          <div className="flex justify-end">
            <Button variant="flat" size="lg" className="uppercase" type="button" onClick={handleClose}>
              {intl.formatMessage({
                id: 'measures.cancel',
              })}
            </Button>
            <Button variant="flat" size="lg" className="uppercase" type="submit" onClick={handleInactivatePractice}>
              {intl.formatMessage({
                id: 'measures.ok',
              })}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});
SettingsPracticeInactivateModal.displayName = 'SettingsPracticeInactivateModal';
export default SettingsPracticeInactivateModal;
