import React, { FC, MutableRefObject } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { XIcon, ExclamationIcon } from '@heroicons/react/outline';
import { IPractice } from 'shared/api/practice';
import { useIntl } from 'react-intl';

interface IModalDeactivate {
  onClose?: (value: boolean) => void;
  open: boolean;
  dateForm?: {
    inactivateDate: Date | string | undefined;
  };
  practice?: IPractice;
}

const SettingsMangeUserDeactivateModal: FC<IModalDeactivate> = observer(({ open, onClose, dateForm, practice }) => {
  const intl = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };

  const deactivateUsers = async (data) => {
    // try {
    //
    // } catch {}
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Body>
        <div className="flex justify-between items-start">
          <ExclamationIcon className="w-10 h-10 m-2 text-red-500" />
          <div className="w-3/4">
            <p className="text-xl font-semibold">{intl.formatMessage({ id: 'deactivate.all' })}</p>
            <p>
              {intl.formatMessage({ id: 'inactivate.question' })} {practice?.name} - {practice?.id}
            </p>
          </div>
          <Button variant="flat" color="gray" onClick={handleClose}>
            <XIcon className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex justify-end m-2">
          <Button color="gray" variant="outlined" className="m-2" shape="smooth" onClick={handleClose}>
            {intl.formatMessage({ id: 'cancel' })}
          </Button>
          <Button color="red" shape="smooth" className="m-2" onClick={deactivateUsers}>
            {intl.formatMessage({ id: 'deactivate.all' })}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
});
SettingsMangeUserDeactivateModal.displayName = 'SettingsMangeUserDeactivateModal';
export default SettingsMangeUserDeactivateModal;
