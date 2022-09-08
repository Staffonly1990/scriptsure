import React, { Dispatch, FC, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { RefreshIcon, TrashIcon } from '@heroicons/react/solid';

import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { IEducation } from 'shared/api/education';

import { educationStore } from 'features/education';
import EncounterTable from './encounter.table';

interface IEducationEncounterId {
  encounterId: number;
  name: string;
}

interface IEncounterEducationTable {
  data?: IEducation[];
  toggleIsProblem: (value: boolean) => void;
  isCurrent: boolean;
  toggleIsDeleteEducation: (value: boolean) => void;
  setEducationEncounterId: Dispatch<SetStateAction<IEducationEncounterId>>;
}

const EncounterEducationTable: FC<IEncounterEducationTable> = ({ data, toggleIsProblem, isCurrent, toggleIsDeleteEducation, setEducationEncounterId }) => {
  const intl = useIntl();
  const handleReuse = async (value: IEducation) => {
    await educationStore.setArchiveEducation(value);

    // if we have error response we need open modal with message about problem
    if (toJS(educationStore.errors.message && toJS(educationStore.errors.id))) {
      toggleIsProblem(true);
    }
  };

  const handleDelete = (encounterId?: number, name?: string) => {
    if (encounterId && name) {
      const payload = {
        name,
        encounterId,
      };
      setEducationEncounterId(payload);
      toggleIsDeleteEducation(true);
    }
  };

  return (
    <EncounterTable header={intl.formatMessage({ id: 'measures.education' })}>
      {data?.map((el, index) => {
        const { name } = el;
        return (
          <div key={index.toString(36)} className="flex justify-between items-center p-2">
            <span>{name}</span>
            <div>
              {isCurrent ? (
                <Tooltip content="Delete">
                  <Button onClick={() => handleDelete(el.educationId, name)} color="white">
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip content={intl.formatMessage({ id: 'measures.reuse' })}>
                  <Button onClick={() => handleReuse(el)} color="white">
                    <RefreshIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        );
      })}
    </EncounterTable>
  );
};

EncounterEducationTable.displayName = 'EncounterEducationTable';

export default observer(EncounterEducationTable);
