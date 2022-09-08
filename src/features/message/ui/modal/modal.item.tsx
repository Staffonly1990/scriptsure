import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { ONameModals, ONameModalsType } from 'shared/api/message';
import Button from 'shared/ui/button';
import { TrashIcon } from '@heroicons/react/solid';

interface IMessageItemProps {
  title: ONameModalsType | string;
  item: any;
  deleteOne: (removeId: number) => void;
}

const ModalItem: FC<IMessageItemProps> = ({ title, item, deleteOne }) => {
  const { formatMessage } = useIntl();
  if (title === ONameModals.Practice) {
    return (
      <div className="flex bg-lightgray justify-between p-2" key={String(item.name) + String(item.id)}>
        <div className="flex flex-col">
          <span className="!text-xs">{item.name}</span>
          <span className="!text-xs">{item.addressLine1}</span>
          <span className="!text-xs">
            {item.city}, {item.state}
          </span>
        </div>
        <div>
          <Button className="!text-md" variant="flat" shape="smooth" color="red" onClick={() => deleteOne(item.id)}>
            <TrashIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-lightgray justify-between p-2" key={String(item.lastName) + String(item.firstName)}>
      <div className="flex flex-col">
        <span className="!text-xs">
          {item.lastName}, {item.firstName}
        </span>
        <span className="!text-xs">{item.userType}</span>
        <span className="!text-xs">
          {formatMessage({ id: 'prescriber.measures.npi' })}: {item.npi}
        </span>
      </div>
      <div>
        <Button className="!text-md" variant="flat" shape="smooth" color="red" onClick={() => deleteOne(item.id)}>
          <TrashIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
ModalItem.displayName = 'ModalItem';

export default ModalItem;
