import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './drugs.abc.list.module.css';
import { ICompoundObject } from 'shared/api/compound';
import { BeakerIcon } from '@heroicons/react/outline';

interface ICompoundCell {
  compound: ICompoundObject;
  onClick: (compound: ICompoundObject) => void;
}

const CompoundCell: FC<ICompoundCell> = observer(({ compound, onClick }) => {
  return (
    <div
      onClick={() => {
        onClick(compound);
      }}
      role="presentation"
      onKeyDown={() => {
        onClick(compound);
      }}
      className="flex items-center text-sm cursor-pointer p-2 hover:bg-gray-100"
    >
      <BeakerIcon className="w-6 h-6 mr-2" />
      {compound.name}
    </div>
  );
});

CompoundCell.displayName = 'CompoundCell';
export default CompoundCell;
