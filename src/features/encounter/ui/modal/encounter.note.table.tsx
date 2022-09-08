import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react-lite';
import { RefreshIcon } from '@heroicons/react/solid';

import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { ISoapNote } from 'shared/api/soap';

import { chartNotes } from 'features/notes/model';
import EncounterTable from './encounter.table';

interface IEncounterNoteTable {
  data?: ISoapNote[];
  isCurrent: boolean;
  setIsOpenNote: (value: boolean) => void;
}

const EncounterNoteTable: FC<IEncounterNoteTable> = ({ data, isCurrent, setIsOpenNote }) => {
  const intl = useIntl();
  const getNote = async (soapId?: number) => {
    try {
      await flowResult(chartNotes.getNote(soapId));
      setIsOpenNote(true);
    } catch {}
  };

  return (
    <EncounterTable header={intl.formatMessage({ id: 'measures.notes' })}>
      {data?.map((el, index) => {
        const { title, soapId } = el;
        return (
          <div key={index.toString(36)} className="flex justify-between items-center p-2">
            <span>{title}</span>
            {!isCurrent && (
              <div>
                <Tooltip content={intl.formatMessage({ id: 'measures.reuse' })}>
                  <Button onClick={() => getNote(soapId)} color="white">
                    <RefreshIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        );
      })}
    </EncounterTable>
  );
};

EncounterNoteTable.displayName = 'EncounterNoteTable';

export default observer(EncounterNoteTable);
