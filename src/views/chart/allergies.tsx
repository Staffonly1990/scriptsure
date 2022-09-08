import React, { FC, useEffect, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNotifier } from 'react-headless-notifier';
import { observer } from 'mobx-react-lite';
import { ArchiveIcon, PencilAltIcon, ExclamationIcon } from '@heroicons/react/outline';
import { isNil } from 'lodash';

import { useRouter } from 'shared/hooks';
import { IAllergy, IAllergyUpdatePayload, IAllergyCreatePayload } from 'shared/api/allergy';
import Modal from 'shared/ui/modal';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import Alert from 'shared/ui/alert';
import { patientModel } from 'features/patient';
import { userModel } from 'features/user';
import { allergyStore, useAllergyEntity, AllergiesToolbar, AllergiesSheet, AllergiesSearch, AllergyEditingModal } from 'features/allergy';

/**
 * @view ChartAllergies
 */
const ChartAllergiesView: FC = () => {
  const intl = useIntl();
  const {
    match: { url },
    query: { patientId },
  } = useRouter<{ patientId: string | number }>();
  const { notify } = useNotifier();

  const initializeAllergyHistory = useCallback(async () => {
    try {
      await Promise.all([allergyStore.getAllergyHistory(), allergyStore.getAdverseEvents(), allergyStore.getSeverities(), allergyStore.getReactions()]);
    } catch {}
  }, []);

  useEffect(() => {
    initializeAllergyHistory();
  }, []);

  const entity = useAllergyEntity();

  const list = useMemo(() => {
    switch (allergyStore.historyValue) {
      case 'active':
        return [...allergyStore.allergyHistory.activeList];
      case 'inactive':
        return [...allergyStore.allergyHistory.inactiveList];
      case 'archived':
        return [...allergyStore.allergyHistory.archivedList];
      case null:
      default:
        return [...allergyStore.allergyHistory.list];
    }
  }, [allergyStore.historyValue, allergyStore.allergyHistory]);

  return (
    <>
      <div className="p-1 sm:p-2 bg-secondary text-secondary">
        <AllergiesToolbar />
      </div>

      <div className="p-1 sm:p-2">
        <div className="flex items-center space-x-2">
          <AllergiesSearch
            onSelect={async (value, classification) => {
              await patientModel.getCurrentEncounter(patientModel.currentPatient?.patientId as number, true);
              entity.add(
                {
                  userName: `${userModel.data?.user?.firstName} ${userModel.data?.user?.lastName}`,
                  userId: userModel.data?.user?.id,
                  doctorId: userModel.data?.currentPrescriber?.id,
                  doctorName: userModel.data?.currentPrescriber?.fullName,
                  patientId: patientModel.currentPatient?.patientId as number,
                  onsetDate: new Date().toJSON(),
                  encounterId: patientModel.currentPatient?.encounterId,
                },
                classification
              );
              allergyStore.resetSearch();
            }}
          />
          <Button
            variant="filled"
            shape="smooth"
            color="blue"
            size="sm"
            onClick={async () => {
              const allergy: Partial<IAllergy> = {
                userName: `${userModel.data?.user?.firstName} ${userModel.data?.user?.lastName}`,
                userId: userModel.data?.user?.id,
                doctorId: userModel.data?.currentPrescriber?.id,
                doctorName: userModel.data?.currentPrescriber?.fullName,
                patientId: patientModel.currentPatient?.patientId as number,
                allergyType: 100,
                reactionId: undefined,
                severityCode: undefined,
                adverseEventCode: undefined,
                comment: undefined,
                onsetDate: undefined,
                endDate: undefined,
                name: intl.formatMessage({ id: 'allergies.measures.noKnownAllergies' }),
                archive: 0,
              };
              try {
                await allergyStore.addAllergy(allergy as IAllergyCreatePayload);
                if (allergyStore.errors.addAllergy) throw new Error(allergyStore.errors.addAllergy);
                await allergyStore.getAllergyHistory();
                await patientModel.refreshPatientAllergies();
              } catch (e: unknown) {
                notify(
                  <Alert.Notification shape="smooth" type="error" color="red" border closable>
                    {(e as Error).message}
                  </Alert.Notification>
                );
              }
            }}
          >
            {intl.formatMessage({ id: 'allergies.measures.noKnownAllergies' })}
          </Button>
        </div>

        {list?.length > 0 && (
          <AllergiesSheet
            className="my-4"
            data={list}
            actions={{
              // eslint-disable-next-line react/display-name
              Header: () => {
                return <span className="sr-only">{intl.formatMessage({ id: 'measures.actions' })}</span>;
              },
              // eslint-disable-next-line react/display-name
              Cell: observer(({ row: { original } }) => {
                if (+original.allergyType === 100) return null;
                return (
                  <div className="flex flex-nowrap items-center space-x-2">
                    <Tooltip content={intl.formatMessage({ id: 'measures.edit' })}>
                      <Button
                        variant="flat"
                        shape="circle"
                        color="blue"
                        onClick={async () => {
                          await patientModel.getCurrentEncounter(patientModel.currentPatient?.patientId as number, true);
                          entity.edit({
                            ...original,
                            userName: `${userModel.data?.user?.firstName} ${userModel.data?.user?.lastName}`,
                            userId: userModel.data?.user?.id,
                            doctorId: userModel.data?.currentPrescriber?.id,
                            doctorName: userModel.data?.currentPrescriber?.fullName,
                            patientId: original.patientId ?? (patientModel.currentPatient?.patientId as number),
                            encounterId: patientModel.currentPatient?.encounterId,
                          });
                        }}
                      >
                        <PencilAltIcon className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content={intl.formatMessage({ id: 'measures.archive' })}>
                      <Button variant="flat" shape="circle" color="blue" onClick={() => entity.confirm(original)}>
                        <ArchiveIcon className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </div>
                );
              }),
            }}
          />
        )}
        {!list?.length && (
          <div className="flex items-center space-x-4 my-4 p-4 rounded bg-secondary text-secondary">
            <ExclamationIcon className="w-10 h-10" />
            <span>{intl.formatMessage({ id: 'allergies.measures.searchNeAllergy' })}</span>
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
      </div>

      <Modal className="sm:!max-w-md" open={entity.confirmed} unmount onClose={() => entity.dismiss()}>
        <Modal.Header>
          <Modal.Title as="h5" className="title text-white">
            {intl.formatMessage({ id: 'measures.archive' })}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {entity.allergy?.archive === 0 && <>{intl.formatMessage({ id: 'allergies.measures.sureAllergy' })}</>}
          {entity.allergy?.archive === 1 && <>{intl.formatMessage({ id: 'allergies.measures.sureDelAllergy' })}</>}
        </Modal.Body>

        <Modal.Actions
          onOk={async () => {
            const allergy: Nullable<IAllergyUpdatePayload> = entity.toggle();
            if (allergy) {
              try {
                await allergyStore.updateAllergy(allergy);
                await allergyStore.getAllergyHistory();
                await patientModel.refreshPatientAllergies();
              } catch {}
            }
            entity.dismiss();
          }}
          onCancel={() => entity.dismiss()}
        />
      </Modal>
    </>
  );
};
ChartAllergiesView.displayName = 'ChartAllergiesView';

export default observer(ChartAllergiesView);
