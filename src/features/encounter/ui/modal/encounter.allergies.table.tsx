import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { DotsVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';

import { IAllergy } from 'shared/api/allergy';
import Dropdown from 'shared/ui/dropdown/dropdown';
import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';

import EncounterTable from './encounter.table';
import { patientModel } from 'features/patient';
import { userModel } from 'features/user';

interface IEncounterAllergiesTable {
  data?: IAllergy[];
  isCurrent: boolean;
  entity: any;
}

const EncounterAllergiesTable: FC<IEncounterAllergiesTable> = observer(({ data, isCurrent, entity }) => {
  const handleEdit = async (el: IAllergy) => {
    await patientModel.getCurrentEncounter(patientModel.currentPatient?.patientId as number, true);
    entity.edit({
      ...el,
      userName: `${userModel.data?.user?.firstName} ${userModel.data?.user?.lastName}`,
      userId: userModel.data?.user?.id,
      doctorId: userModel.data?.currentPrescriber?.id,
      doctorName: userModel.data?.currentPrescriber?.fullName,
      patientId: el.patientId ?? (patientModel.currentPatient?.patientId as number),
      encounterId: patientModel.currentPatient?.encounterId,
    });
  };
  const intl = useIntl();

  const handleDelete = (el: IAllergy) => {
    entity.confirm(el);
  };

  return (
    <EncounterTable header={intl.formatMessage({ id: 'allergies.measures.allergy' })}>
      {data?.map((el, index) => {
        const { name, allergyType } = el;
        return (
          <div key={index.toString(36)} className="flex justify-between items-center p-2">
            <span>{name}</span>
            {isCurrent && allergyType !== 100 && (
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
            )}
          </div>
        );
      })}
    </EncounterTable>
  );
});

EncounterAllergiesTable.displayName = 'EncounterAllergiesTable';

export default EncounterAllergiesTable;
