import React, { Dispatch, FC, SetStateAction } from 'react';
import { observer } from 'mobx-react-lite';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';

import Alert from 'shared/ui/alert';
import Button from 'shared/ui/button';
import Modal, { IModalProps } from 'shared/ui/modal';
import { ICreateDiagnosis } from 'shared/api/diagnosis';

import { diagnosisStore } from '../../model';
import { OEncounterStatus } from '../../lib/model';

interface IDeleteDiagnosisModal extends IModalProps {
  diagnosisInformation: {
    patientId?: number;
    encounterId?: number;
    conceptId?: string;
    codingSystem?: number;
    name?: string;
    startDate?: string | Date;
  };
  isDelete: boolean;
  setIsAddDiagnosisFlag?: Dispatch<SetStateAction<boolean>>;
  isEncounter: boolean;
  updateEncounter?: () => void;
}

const NotificationDiagnosisModal: FC<
  Pick<
    IDeleteDiagnosisModal,
    'open' | 'unmount' | 'hideBackdrop' | 'onClose' | 'diagnosisInformation' | 'isDelete' | 'setIsAddDiagnosisFlag' | 'updateEncounter'
  >
> = observer(({ open, unmount, hideBackdrop, onClose, diagnosisInformation, isDelete, setIsAddDiagnosisFlag, updateEncounter }) => {
  const { notify } = useNotifier();
  const intl = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };

  const handleOpen = async () => {
    const { patientId, encounterId, conceptId, codingSystem, startDate, name } = diagnosisInformation;
    if (isDelete) {
      await diagnosisStore.deleteDiagnosis(patientId!, encounterId!, conceptId!, codingSystem!);
      if (updateEncounter) {
        updateEncounter();
      }
    } else {
      const request: ICreateDiagnosis = {
        codingSystem: 2,
        archive: false,
        isCondition: false,
        startDate: startDate!,
        conceptId: conceptId!,
        name: name!,
      };

      // NoEncounter means that we don't have encounter and we need create it in addDiagnosis
      if (diagnosisStore.encountertStatus.currentPatient === OEncounterStatus.NoEncounter) {
        await diagnosisStore.addDiagnosis(request, true, false);
      } else {
        await diagnosisStore.addDiagnosis(request, false, false);
      }
      if (setIsAddDiagnosisFlag) {
        setIsAddDiagnosisFlag((prevData) => !prevData);
      }
    }
    handleClose();
    notify(
      <Alert.Notification
        actions={(close) => (
          <Button variant="flat" onClick={() => close()}>
            {intl.formatMessage({ id: 'measures.ok' })}
          </Button>
        )}
      >
        {intl.formatMessage({ id: 'diagnosis.measures.diagnosisHasBeen' })}{' '}
        {isDelete ? intl.formatMessage({ id: 'measures.removed' }) : intl.formatMessage({ id: 'measures.added' })}
      </Alert.Notification>
    );
  };

  return (
    <Modal as="div" className="sm:!max-w-[20vw]" onClose={onClose} unmount={unmount} open={open} hideBackdrop={hideBackdrop}>
      <Modal.Body>
        <p className="font-bold">
          {isDelete ? intl.formatMessage({ id: 'measures.delete' }) : intl.formatMessage({ id: 'measures.add' })}{' '}
          {intl.formatMessage({ id: 'measures.diagnosis' })}
        </p>
        {isDelete ? (
          <span>
            {intl.formatMessage({ id: 'measures.wantDelete' })} {diagnosisInformation.conceptId}?
          </span>
        ) : (
          <span>
            {intl.formatMessage({ id: 'measures.addCode' })} {diagnosisInformation.conceptId}
          </span>
        )}
      </Modal.Body>
      <Modal.Actions onCancel={handleClose} onOk={handleOpen} />
    </Modal>
  );
});

NotificationDiagnosisModal.displayName = 'NotificationDiagnosisModal';

export default NotificationDiagnosisModal;
