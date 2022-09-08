import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { ClipboardIcon, XIcon } from '@heroicons/react/outline';
import { useNotifier } from 'react-headless-notifier';
import { isNil } from 'lodash';

import Modal, { IModalProps } from 'shared/ui/modal';
import Button from 'shared/ui/button';
import Alert from 'shared/ui/alert';
import { IAllergyCreatePayload, IAllergyUpdatePayload } from 'shared/api/allergy';
import { OActionStatus } from 'shared/lib/model';

import { encounterModel } from 'features/encounter';
import { AllergyEditingModal, allergyStore, useAllergyEntity } from 'features/allergy';
import { patientModel } from 'features/patient';
import EncounterContent from './encounter.content';
import { ICreateDiagnosis, IPatientEncounter } from '../../../../shared/api/diagnosis';
import moment from 'moment';
import { diagnosisStore } from '../../../diagnosis';
import { OEncounterStatus } from '../../../diagnosis/lib/model';

interface IEncountersModal extends IModalProps {
  modalPatientId: number | string;
}

const EncountersModal: FC<Pick<IEncountersModal, 'open' | 'unmount' | 'onClose' | 'modalPatientId'>> = observer(
  ({ open, unmount, onClose, modalPatientId }) => {
    const intl = useIntl();
    // this state we use for change deps in use effect
    const [represcribeAllFlag, setReprescribeAllFlag] = useState<number>(0);
    const [isEncounterUpdateFlag, setIsEncounterUpdateFlag] = useState<boolean>(false);
    // i use this after all actions (edit, delete, reuse)
    const handleUpdateEncounter = () => {
      setIsEncounterUpdateFlag((prevData) => !prevData);
    };
    const encounterList = toJS(encounterModel.allEncountersList);
    const getInitialData = async () => {
      await encounterModel.getAllEncounters(modalPatientId);
    };

    const entity = useAllergyEntity();
    const { notify } = useNotifier();

    const handleClose = () => {
      if (onClose) {
        onClose(false);
      }
    };

    const handleAddEncounters = async () => {
      await encounterModel.getCurrentEncounter(Number(modalPatientId), true, false);
      handleUpdateEncounter();
    };

    const handleReuseDiagnosis = async (el: IPatientEncounter) => {
      const { archive, conceptId, codingSystem, isCondition, name, patientId } = el;
      const request: ICreateDiagnosis = {
        archive,
        conceptId,
        codingSystem,
        isCondition,
        name,
        patientId,
        startDate: moment().toDate(),
      };

      // NoEncounter means that we don't have encounter and we need create it in addDiagnosis
      if (diagnosisStore.encountertStatus.currentPatient === OEncounterStatus.NoEncounter) {
        await diagnosisStore.addDiagnosis(request, true, false);
      } else {
        await diagnosisStore.addDiagnosis(request, false, false);
      }
    };

    useEffect(() => {
      const status = toJS(encounterModel.status.modalStack);
      const modalStack = toJS(encounterModel.modalStack);
      const stack = toJS(encounterModel.diagnosisStack);

      // status pending means that now we have stack with reused modal
      if (status === OActionStatus.Pending) {
        setReprescribeAllFlag(modalStack.length);
        // status Fulfilled means that now we don't have stack with reused modal
      } else if (status === OActionStatus.Fulfilled) {
        const data = stack.map((el) => {
          return handleReuseDiagnosis(el);
        });
        Promise.all(data);
        encounterModel.setInitialModalStackStatus();
        handleUpdateEncounter();
      } else {
        getInitialData();
      }
    }, [isEncounterUpdateFlag]);
    return (
      <Modal className="sm:!max-w-[50vw]" open={open} unmount={unmount}>
        <Modal.Header>
          <Modal.Title className="text-white">{intl.formatMessage({ id: 'measures.encounters' })}</Modal.Title>
          <Button color="transparent" shape="smooth" variant="filled" onClick={handleClose} className="uppercase">
            <XIcon className="w-6 h-6" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          {encounterList.length ? (
            <div className="flex flex-col gap-2">
              {encounterList.map((encounter) => {
                const { createdAt, Soap, Allergies, Diagnoses, Education, Prescriptions, userName } = encounter;
                return (
                  <EncounterContent
                    key={createdAt?.toString()}
                    createdAt={createdAt}
                    Soap={Soap}
                    Allergies={Allergies}
                    Diagnoses={Diagnoses}
                    Education={Education}
                    Prescriptions={Prescriptions}
                    userName={userName}
                    updateEncounter={handleUpdateEncounter}
                    entity={entity}
                    represcribeAllFlag={represcribeAllFlag}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex items-center p-8 gap-5 border border-gray-300">
              <ClipboardIcon className="w-20 h-20" />
              <div className="flex flex-col gap-2">
                <span className="text-4xl text-gray-300">{intl.formatMessage({ id: 'encounters.measures.noHistory' })}</span>
                <div>
                  <Button onClick={handleAddEncounters} className="uppercase" variant="filled" color="green">
                    {intl.formatMessage({ id: 'encounters.measures.addEncounter?' })}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <AllergyEditingModal
            open={entity.editing}
            defaultValues={{
              name: entity.allergy?.name,
              onsetDate: entity.allergy?.onsetDate ?? '',
              endDate: entity.allergy?.endDate ?? '',
              allergyType: entity.allergy?.allergyType,
              adverseEventCode: entity.allergy?.adverseEventCode,
              reactionId: !isNil(entity.allergy?.reactionId) ? String(entity.allergy?.reactionId) : undefined,
              severityCode: !isNil(entity.allergy?.severityCode) ? String(entity.allergy?.severityCode) : undefined,
              comment: entity.allergy?.comment,
            }}
            onSubmit={async (data) => {
              const allergy = { ...entity.allergy, ...data };
              if (allergy) {
                try {
                  if (entity.adding) {
                    await allergyStore.addAllergy(allergy as IAllergyCreatePayload);
                    if (allergyStore.errors.addAllergy) throw new Error(allergyStore.errors.addAllergy);
                    allergyStore.resetSearch();
                  } else {
                    await allergyStore.updateAllergy(allergy as IAllergyUpdatePayload);
                    if (allergyStore.errors.updateAllergy) throw new Error(allergyStore.errors.updateAllergy);
                  }
                  await allergyStore.getAllergyHistory();
                  await patientModel.refreshPatientAllergies();
                  entity.dismiss();
                  handleUpdateEncounter();
                } catch (e: unknown) {
                  notify(
                    <Alert.Notification shape="smooth" type="error" color="red" border closable>
                      {(e as Error).message}
                    </Alert.Notification>
                  );
                }
              }
            }}
            onCancel={() => {
              if (entity.adding) allergyStore.resetSearch();
              entity.dismiss();
            }}
          />
          <Modal className="sm:!max-w-md" open={entity.confirmed} unmount onClose={() => entity.dismiss()}>
            <Modal.Header>
              <Modal.Title as="h5" className="title text-white">
                {intl.formatMessage({ id: 'measures.delete' })}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {entity.allergy?.archive === 0 && (
                <>
                  {intl.formatMessage({ id: 'encounters.measures.youSureDelete' })} {entity.allergy.name}?
                </>
              )}
              {entity.allergy?.archive === 1 && (
                <>
                  {intl.formatMessage({ id: 'encounters.measures.youSureArchive' })} {entity.allergy.name}?
                </>
              )}
            </Modal.Body>

            <Modal.Actions
              onOk={async () => {
                const allergy: Nullable<IAllergyUpdatePayload> = entity.toggle();
                if (allergy) {
                  try {
                    await allergyStore.updateAllergy(allergy);
                    await allergyStore.getAllergyHistory();
                    await patientModel.refreshPatientAllergies();
                    handleUpdateEncounter();
                  } catch {}
                }
                entity.dismiss();
              }}
              onCancel={() => entity.dismiss()}
            />
          </Modal>
        </Modal.Body>
        <Modal.Actions onOk={handleClose} onCancel={handleClose} />
      </Modal>
    );
  }
);

EncountersModal.displayName = 'EncountersModal';

export default EncountersModal;
