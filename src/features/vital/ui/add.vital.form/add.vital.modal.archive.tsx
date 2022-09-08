import React, { FC, SetStateAction, Dispatch } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import Alert from 'shared/ui/alert';
import { observer } from 'mobx-react-lite';
import { VitalStore } from '../../model';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';

interface IModalArchive {
  isArchived: { vitalId: string; loinc: string; archive: boolean };
  onClose?: (value: boolean) => void;
  open: boolean;
  setIsAddVitalsFlag: Dispatch<SetStateAction<boolean>>;
}

const AddVitalModalArchive: FC<IModalArchive> = observer(({ open, onClose, isArchived, setIsAddVitalsFlag }) => {
  const intl = useIntl();
  const { notify } = useNotifier();
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  const handleArchiveVital = async () => {
    handleClose();
    await VitalStore.setArchiveVital(isArchived);
    setIsAddVitalsFlag((prevData) => !prevData);
    notify(
      <Alert.Notification
        actions={(close) => (
          <Button variant="flat" onClick={() => close()}>
            {intl.formatMessage({
              id: 'measures.ok',
            })}
          </Button>
        )}
      >
        <p>
          {intl.formatMessage({
            id: 'vital.measures.modal.vitalsArchived',
          })}
        </p>
      </Alert.Notification>
    );
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header as="h5" className="bg-primary text-2xl">
        {intl.formatMessage({
          id: 'measures.archive',
        })}
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>
            {intl.formatMessage({
              id: 'vital.measures.modal.sureArchive',
            })}
          </p>
          <div className="flex justify-end">
            <Button variant="flat" size="lg" className="uppercase" type="button" onClick={handleClose}>
              {intl.formatMessage({
                id: 'measures.cancel',
              })}
            </Button>
            <Button variant="flat" size="lg" className="uppercase" type="submit" onClick={handleArchiveVital}>
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
AddVitalModalArchive.displayName = 'AddVitalModalArchive';
export default AddVitalModalArchive;
