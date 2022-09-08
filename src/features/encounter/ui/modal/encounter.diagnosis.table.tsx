import React, { Dispatch, FC, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { DotsVerticalIcon, PencilIcon, RefreshIcon, TrashIcon } from '@heroicons/react/solid';

import Dropdown from 'shared/ui/dropdown/dropdown';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { ICreateDiagnosis, IPatientEncounter } from 'shared/api/diagnosis';

import { diagnosisStore } from 'features/diagnosis';
import { OEncounterStatus } from 'features/diagnosis/lib/model';
import EncounterTable from './encounter.table';

interface IDeleteInformation {
  patientId?: number;
  encounterId?: number;
  conceptId?: string;
  codingSystem?: number;
  name?: string;
  startDate?: string | Date;
}

interface IEncounterDiagnosisTable {
  data?: IPatientEncounter[];
  isCurrent: boolean;
  toggleIsOpenEncounters: (value: boolean) => void;
  setDeleteInformation: Dispatch<SetStateAction<IDeleteInformation>>;
  toggleIsOpenDelete: (value: boolean) => void;
  updateEncounter: () => void;
}

const EncounterDiagnosisTable: FC<IEncounterDiagnosisTable> = ({
  data,
  isCurrent,
  toggleIsOpenEncounters,
  setDeleteInformation,
  toggleIsOpenDelete,
  updateEncounter,
}) => {
  const intl = useIntl();
  const handleEdit = (value: IPatientEncounter) => {
    diagnosisStore.setCurrentEditable(value);
    toggleIsOpenEncounters(true);
  };

  const handleDelete = (el: IPatientEncounter) => {
    const { patientId, name, conceptId, encounterId, startDate, codingSystem } = el;
    const payload: IDeleteInformation = {
      patientId,
      name,
      conceptId,
      encounterId,
      startDate,
      codingSystem,
    };
    setDeleteInformation(payload);
    toggleIsOpenDelete(true);
  };

  const handleReuse = async (el: IPatientEncounter) => {
    const { archive, conceptId, codingSystem, isCondition, name, patientId } = el;
    // this request we need for containt some date, because for creating diagnosis we don't need all data from element
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
    updateEncounter();
  };
  return (
    <EncounterTable header={intl.formatMessage({ id: 'measures.diagnosis' })}>
      {data?.map((el, index) => {
        const { conceptId, name } = el;
        return (
          <div key={index.toString(36)} className="flex justify-between items-center p-2">
            <div className="flex max-w-[32vw]">
              <span>
                <b>{conceptId}</b> {name}
              </span>
            </div>
            {isCurrent ? (
              <>
                <div className="lg:hidden">
                  <Dropdown
                    list={[
                      <Dropdown.Item onClick={() => handleEdit(el)}>{intl.formatMessage({ id: 'measures.edit' })}</Dropdown.Item>,
                      <Dropdown.Item onClick={() => handleDelete(el)}>{intl.formatMessage({ id: 'measures.delete' })}</Dropdown.Item>,
                    ]}
                  >
                    <Button variant="flat" shape="circle" color="black" size="xs">
                      <DotsVerticalIcon className="w-4 h-4" />
                    </Button>
                  </Dropdown>
                </div>
                <div className="flex-grow justify-end gap-1 hidden lg:flex">
                  <Tooltip content={intl.formatMessage({ id: 'measures.delete' })}>
                    <Button onClick={() => handleDelete(el)} variant="filled" shape="circle" color="white">
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </Tooltip>
                  <Tooltip content={intl.formatMessage({ id: 'measures.edit' })}>
                    <Button onClick={() => handleEdit(el)} variant="filled" shape="circle" color="white">
                      <PencilIcon className="w-5 h-5" />
                    </Button>
                  </Tooltip>
                </div>
              </>
            ) : (
              <Tooltip content={intl.formatMessage({ id: 'measures.reuse' })}>
                <Button onClick={() => handleReuse(el)} color="white">
                  <RefreshIcon className="w-5 h-5" />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      })}
    </EncounterTable>
  );
};

EncounterDiagnosisTable.displayName = 'EncounterDiagnosisTable';

export default EncounterDiagnosisTable;
