import React, { Dispatch, FC, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';
import { isNull } from 'lodash';

import Modal, { IModalProps } from 'shared/ui/modal';
import Button from 'shared/ui/button';
import { ICreateEditDiagnosis } from 'shared/api/diagnosis';
import Alert from 'shared/ui/alert';

import { XIcon } from '@heroicons/react/outline';
import EditDiagnosisContent from './edit.diagnosis.content';

import { diagnosisStore } from '../../model';
import { OEncounterStatus, getClearData } from '../../lib/model';
import { toJS } from 'mobx';

interface IEditDiagnosisModal extends IModalProps {
  setIsAddDiagnosisFlag?: Dispatch<SetStateAction<boolean>>;
  editable: boolean;
  updateEncounter?: () => void;
}

const EditDiagnosisModal: FC<
  Pick<IEditDiagnosisModal, 'open' | 'unmount' | 'hideBackdrop' | 'onClose' | 'setIsAddDiagnosisFlag' | 'editable' | 'updateEncounter'>
> = observer(({ open, unmount, hideBackdrop, onClose, setIsAddDiagnosisFlag, editable, updateEncounter }) => {
  const currentDiagnosis = toJS(diagnosisStore.currentEditable);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const intl = useIntl();
  const innerRef = useRef();
  const {
    register,
    getValues,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: editable && !isNull(currentDiagnosis) ? currentDiagnosis : {},
  });
  const [innerRefCurrent, setInnerRefCurrent] = useState<MutableRefObject<HTMLInputElement | undefined> | undefined>();
  const { notify } = useNotifier();

  const handleClose = () => {
    if (onClose) {
      onClose(false);
      reset();
      diagnosisStore.clearCurrentEditDiagnosis();
    }
  };

  const handleSave = async () => {
    if (errors.comment) return;
    const values = getValues();
    const preData = {
      ...values,
      associatedCodingSystem: values.associatedConceptId ? '2' : null,
      finalCodingSystem: values.finalConceptId ? '2' : null,
      diagnosisTypeId: 0,
    };

    const clearValues = getClearData(preData);
    const request: ICreateEditDiagnosis = {
      ...diagnosisStore.editDiagnosisDefaultData,
      ...clearValues,
    };

    // NoEncounter means that we don't have encounter and we need create it in addDiagnosis
    if (diagnosisStore.encountertStatus.currentPatient === OEncounterStatus.NoEncounter) {
      await diagnosisStore.addDiagnosis(request, true, editable);
    } else {
      await diagnosisStore.addDiagnosis(request, false, editable);
    }
    if (setIsAddDiagnosisFlag) {
      setIsAddDiagnosisFlag((prevData) => !prevData);
    }

    if (updateEncounter) {
      updateEncounter();
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
        {intl.formatMessage({ id: 'diagnosis.measures.added' })}
      </Alert.Notification>
    );
  };

  useEffect(() => {
    if (!innerRefCurrent?.current) {
      setInnerRefCurrent(innerRef);
    }
  }, [isMounted]);

  return (
    <Modal as="div" className="sm:!max-w-[70vw]" unmount={unmount} hideBackdrop={hideBackdrop} onClose={onClose} open={open}>
      <Modal.Header>
        <Modal.Title className="text-white">{intl.formatMessage({ id: 'diagnosis.measures.diagnosis' })}</Modal.Title>
        <Button onClick={handleClose}>
          <XIcon className="w-5 h-5 color-white" />
        </Button>
      </Modal.Header>
      <Modal.Body ref={innerRef}>
        <EditDiagnosisContent
          setIsMounted={setIsMounted}
          innerRefCurrent={innerRefCurrent}
          register={register}
          control={control}
          getValues={getValues}
          watch={watch}
          errors={errors}
        />
      </Modal.Body>
      <Modal.Actions onCancel={handleClose} onOk={handleSave} />
    </Modal>
  );
});

EditDiagnosisModal.displayName = 'EditDiagnosisModal';

export default EditDiagnosisModal;
