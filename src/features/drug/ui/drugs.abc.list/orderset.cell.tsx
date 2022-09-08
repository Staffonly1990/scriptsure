import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './drugs.abc.list.module.css';
import { BeakerIcon, MenuIcon } from '@heroicons/react/outline';
import { IOrderset } from 'shared/api/orderset';

interface IOrdersetCell {
  orderset: IOrderset;
  onClick: (orderset: IOrderset) => void;
}

const OrdersetCell: FC<IOrdersetCell> = observer(({ orderset, onClick }) => {
  return (
    <div
      onClick={() => {
        onClick(orderset);
      }}
      role="presentation"
      onKeyDown={() => {
        onClick(orderset);
      }}
      className="flex items-center text-sm cursor-pointer p-2 hover:bg-gray-100"
    >
      <MenuIcon className="w-6 h-6 mr-2" />
      {orderset.name}
    </div>
  );
});

OrdersetCell.displayName = 'OrdersetCell';
export default OrdersetCell;
