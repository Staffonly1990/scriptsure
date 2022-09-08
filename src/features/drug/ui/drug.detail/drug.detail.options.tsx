import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ExclamationIcon, PencilIcon, CogIcon } from '@heroicons/react/outline';
import styles from './drug.detail.module.css';
import Dropdown from 'shared/ui/dropdown';
import Button from 'shared/ui/button';

interface IDrugDetailOptions {
  setAllergyClick?: () => void;
  setCurrentMedication?: JSX.Element[];
  cog: JSX.Element[];
}

const DrugDetailOptions: FC<IDrugDetailOptions> = observer(({ setAllergyClick, setCurrentMedication, cog }) => {
  return (
    <div className="py-3 flex items-center">
      {setAllergyClick && (
        <Button onClick={setAllergyClick} className="mr-2" color="blue">
          <ExclamationIcon className="w-6 h-6" />
          <span>Set Allergy</span>
        </Button>
      )}
      <Dropdown placement="bottom-start" list={setCurrentMedication ?? []}>
        <Button className="mr-2" color="blue">
          <PencilIcon className="w-6 h-6" />
          <span>Set Current Medication</span>
        </Button>
      </Dropdown>
      <Dropdown list={cog}>
        <Button className="mr-2" variant="flat" shape="circle" color="blue">
          <CogIcon className="w-6 h-6" />
        </Button>
      </Dropdown>
    </div>
  );
});

DrugDetailOptions.displayName = 'DrugDetailOptions';
export default DrugDetailOptions;
