import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

interface IEncounterTable {
  header: string;
}

const EncounterTable: FC<IEncounterTable> = ({ header, children }) => {
  return (
    <div>
      <div className="w-full bg-blue-500 p-2 text-white">{header}</div>
      <div>{children}</div>
    </div>
  );
};

EncounterTable.displayName = 'EncounterTable';

export default observer(EncounterTable);
