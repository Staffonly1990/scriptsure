import React, { FC, useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { IPatientEncounter } from 'shared/api/diagnosis';
import { IAllergy } from 'shared/api/allergy';
import moment from 'moment';
import { useGetSet } from 'react-use';
import { flowResult, toJS } from 'mobx';

import { RefreshIcon } from '@heroicons/react/solid';

import { IEducation } from 'shared/api/education';
import { ISoapNote } from 'shared/api/soap';
import { IPrescription } from 'shared/api/prescription';
import Button from 'shared/ui/button';
import Accordion from 'shared/ui/accordion';

import { EditDiagnosisModal } from 'features/diagnosis';
import NotificationDiagnosisModal from 'features/diagnosis/ui/notification.diagnosis';
import PopUpNote from 'features/notes/ui/pop.up.note';
import { chartNotes } from 'features/notes/model';

import EncounterTable from './encounter.table';
import EncounterDiagnosisTable from './encounter.diagnosis.table';
import EncounterNoteTable from './encounter.note.table';
import EncounterEducationTable from './encounter.education.table';
import ProblemModal from './problem.modal';
import DeleteEducationModal from './delete.education.modal';
import EncounterAllergiesTable from './encounter.allergies.table';
import { encounterModel } from '../../model';
import { OActionStatus } from '../../../../shared/lib/model';
import { educationStore } from '../../../education';

interface IEncounterContent {
  createdAt?: Date;
  userName?: string;
  Diagnoses?: IPatientEncounter[];
  Allergies?: IAllergy[];
  Education?: IEducation[];
  Prescriptions?: IPrescription[];
  Soap?: ISoapNote[];
  updateEncounter: () => void;
  entity: any;
  represcribeAllFlag: number;
}

interface IDeleteInformation {
  patientId?: number;
  encounterId?: number;
  conceptId?: string;
  codingSystem?: number;
  name?: string;
  startDate?: string | Date;
}

interface IEducationEncounterId {
  encounterId: number;
  name: string;
}

const EncounterContent: FC<IEncounterContent> = observer(
  ({ createdAt, userName, Diagnoses, Allergies, Soap, Prescriptions, Education, updateEncounter, entity, represcribeAllFlag }) => {
    const [educationEncounterId, setEducationEncounterId] = useState<IEducationEncounterId>({
      encounterId: 0,
      name: '',
    });
    const [deleteInformation, setDeleteInformation] = useState<IDeleteInformation>({});
    const time = moment(createdAt).format('MMM D, YYYY');
    const intl = useIntl();
    // Establish New Encounter on Each 24 Hours
    const isCurrent = useMemo(() => moment(createdAt).format('MM/DD/YYYY') === moment(new Date()).format('MM/DD/YYYY'), [createdAt]);

    const isEmptyArrays = Diagnoses?.length === 0 && Allergies?.length === 0 && Soap?.length === 0 && Prescriptions?.length === 0 && Education?.length === 0;

    const [isOpenEdit, setIsOpenEdit] = useGetSet<boolean>(false);
    const toggleIsOpenEncounters = (state?: boolean) => {
      const currentState = isOpenEdit();
      setIsOpenEdit(state ?? !currentState);
    };

    const [isOpenDelete, setIsOpenDelete] = useGetSet<boolean>(false);
    const toggleIsOpenDelete = (state?: boolean) => {
      const currentState = isOpenDelete();
      setIsOpenDelete(state ?? !currentState);
    };

    const [isOpenNote, setIsOpenNote] = useGetSet<boolean>(false);
    const toggleIsOpenNote = (state?: boolean) => {
      const currentState = isOpenNote();
      setIsOpenNote(state ?? !currentState);
    };

    const [isProblem, setIsProblem] = useGetSet<boolean>(false);
    const toggleIsProblem = (state?: boolean) => {
      const currentState = isProblem();
      setIsProblem(state ?? !currentState);
    };

    const [isDeleteEducation, setIsDeleteEducation] = useGetSet<boolean>(false);
    const toggleIsDeleteEducation = (state?: boolean) => {
      const currentState = isDeleteEducation();
      setIsDeleteEducation(state ?? !currentState);
    };

    const pickList = async () => {
      try {
        await flowResult(chartNotes.pickList());
      } catch {}
    };

    const getNote = async (soapId?: number) => {
      try {
        await flowResult(chartNotes.getNote(soapId));
        setIsOpenNote(true);
      } catch {}
    };

    const handleReuseEducation = async (value: IEducation) => {
      await educationStore.setArchiveEducation(value);
      if (toJS(educationStore.errors.message && toJS(educationStore.errors.id))) {
        toggleIsProblem(true);
      } else {
        updateEncounter();
      }
    };

    const handleReprescribeAll = () => {
      const modalStack: {}[] = [...Soap!, ...Education!];
      encounterModel.setInitialStack(modalStack, Diagnoses!);
      if (modalStack.length) {
        // @ts-ignore
        if (modalStack[0].soapId !== undefined) {
          // @ts-ignore
          getNote(modalStack[0].soapId);
          encounterModel.decrementModalStack();
        } else {
          handleReuseEducation(modalStack[0]);
          encounterModel.decrementModalStack();
        }
      } else {
        encounterModel.decrementModalStack();
        updateEncounter();
      }
    };

    useEffect(() => {
      const status = toJS(encounterModel.status.modalStack);
      const modalStack = toJS(encounterModel.modalStack);

      // status pending means that now we have stack with reused modal
      if (status === OActionStatus.Pending && modalStack.length === represcribeAllFlag) {
        // @ts-ignore
        if (modalStack[0].soapId !== undefined) {
          // @ts-ignore
          getNote(modalStack[0].soapId);
          encounterModel.decrementModalStack();
        } else {
          handleReuseEducation(modalStack[0]);
          encounterModel.decrementModalStack();
        }
      }
    }, [represcribeAllFlag]);

    const isNote = toJS(chartNotes.selectedNote) && isOpenNote();

    return (
      <>
        <Accordion time={time} userName={userName} label={isCurrent ? <Accordion.Label color="blue" /> : null}>
          <div className="flex flex-col gap-2 mt-4">
            {Boolean(Diagnoses?.length) && (
              <EncounterDiagnosisTable
                data={Diagnoses}
                isCurrent={isCurrent}
                toggleIsOpenEncounters={toggleIsOpenEncounters}
                setDeleteInformation={setDeleteInformation}
                toggleIsOpenDelete={toggleIsOpenDelete}
                updateEncounter={updateEncounter}
              />
            )}
            {Boolean(Allergies?.length) && <EncounterAllergiesTable data={Allergies} isCurrent={isCurrent} entity={entity} />}
            {Boolean(Education?.length) && (
              <EncounterEducationTable
                data={Education}
                isCurrent={isCurrent}
                toggleIsProblem={toggleIsProblem}
                toggleIsDeleteEducation={toggleIsDeleteEducation}
                setEducationEncounterId={setEducationEncounterId}
              />
            )}
            {Boolean(Prescriptions?.length) && (
              <EncounterTable header={intl.formatMessage({ id: 'measures.prescriptions' })}>
                {Prescriptions?.map((el, index) => {
                  const { Message } = el;
                  return (
                    <div key={index.toString(36)}>
                      {Message?.drugName && Message.instruction && (
                        <div className="flex justify-between items-center p-2">
                          <div>
                            <span>
                              <b>{Message?.drugName ?? ''}</b> {Message?.instruction ?? ''}
                            </span>
                            {Message?.note && <p className="pl-4">Pharmacy Comment: {Message?.note}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </EncounterTable>
            )}
            {Boolean(Soap?.length) && <EncounterNoteTable isCurrent={isCurrent} data={Soap} setIsOpenNote={setIsOpenNote} />}
            {!isEmptyArrays && !isCurrent && (
              <div className="flex justify-end">
                <Button onClick={handleReprescribeAll}>
                  <RefreshIcon className="w-5 h-5" />
                  <span className="ml-2">{intl.formatMessage({ id: 'encounters.measures.represcribeAll' })}</span>
                </Button>
              </div>
            )}
          </div>
        </Accordion>
        {isOpenEdit() && (
          <EditDiagnosisModal open={isOpenEdit()} onClose={toggleIsOpenEncounters} unmount hideBackdrop={false} editable updateEncounter={updateEncounter} />
        )}
        <DeleteEducationModal
          onClose={toggleIsDeleteEducation}
          open={isDeleteEducation()}
          unmount
          hideBackdrop={false}
          updateEncounter={updateEncounter}
          educationEncounterId={educationEncounterId}
        />
        <NotificationDiagnosisModal
          isDelete
          open={isOpenDelete()}
          onClose={toggleIsOpenDelete}
          unmount
          hideBackdrop={false}
          diagnosisInformation={deleteInformation}
          updateEncounter={updateEncounter}
        />
        <ProblemModal hideBackdrop={false} unmount onClose={toggleIsProblem} open={isProblem()} updateEncounter={updateEncounter} />
        {isNote && (
          <PopUpNote
            method="POST"
            closeClick={() => {
              updateEncounter();
              toggleIsOpenNote(false);
            }}
            note={chartNotes.selectedNote}
            openClick={pickList}
            headerTitle="createFollowup"
            isEncounter
          />
        )}
      </>
    );
  }
);

EncounterContent.displayName = 'EncounterContent';

export default EncounterContent;
