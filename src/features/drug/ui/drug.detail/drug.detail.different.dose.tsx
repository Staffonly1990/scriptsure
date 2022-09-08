import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ExclamationIcon, XIcon, PlusIcon } from '@heroicons/react/outline';
import styles from './drug.detail.module.css';
import Button from 'shared/ui/button';
import Dropdown from 'shared/ui/dropdown';

interface IDrugDetailDifferentDose {
  differentDoses?: JSX.Element[];
}

const DrugDetailDifferentDose: FC<IDrugDetailDifferentDose> = observer(({ differentDoses }) => {
  return (
    <Dropdown list={differentDoses ?? []} placement="bottom-start">
      <Button color="green">
        <PlusIcon className="w-6 h-6 mr-2" />
        <span>Select a Different Dose</span>
      </Button>
    </Dropdown>
  );
});

DrugDetailDifferentDose.displayName = 'DrugDetailDifferentDose';
export default DrugDetailDifferentDose;
