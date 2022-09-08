import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { BeakerIcon, MenuIcon } from '@heroicons/react/outline';

import Button from 'shared/ui/button';

const DrugSearchCustom: FC = () => {
  const { formatMessage } = useIntl();

  const createOrder = () => {};
  const createMedication = () => {};

  return (
    <div className="flex item-center">
      <Button color="green" shape="smooth" className="uppercase mx-2" onClick={createOrder}>
        <MenuIcon className="w-6 h-6" />
        <span className="hidden md:inline-block">{formatMessage({ id: 'create.order.set' })}</span>
      </Button>
      <Button color="green" shape="smooth" className="uppercase mx-2" onClick={createMedication}>
        <BeakerIcon className="w-6 h-6" />
        <span className="hidden md:inline-block">{formatMessage({ id: 'create.compound.medication' })}</span>
      </Button>
    </div>
  );
};

DrugSearchCustom.displayName = 'DrugSearchCustom';
export default DrugSearchCustom;
