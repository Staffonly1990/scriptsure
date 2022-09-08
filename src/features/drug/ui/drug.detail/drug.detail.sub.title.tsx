import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ExclamationIcon, XIcon, PlusIcon } from '@heroicons/react/outline';
import styles from './drug.detail.module.css';
import Button from 'shared/ui/button';
import Dropdown from 'shared/ui/dropdown';

interface IDrugDetailSubTitle {
  details?: JSX.Element[];
  addFormat?: JSX.Element[];
  sideView: number;
}

const DrugDetailSubTitle: FC<IDrugDetailSubTitle> = observer(({ details, addFormat, sideView }) => {
  const title = (side: number) => {
    switch (side) {
      case 0:
        return 'Formats';
      case 1:
        return 'Indication Drugs';
      case 2:
        return 'Compound';
      case 3:
        return 'Order Set';
      default:
        return '';
    }
  };
  return (
    <div className="p-3 bg-blue-500 flex justify-between items-center">
      <span className="text-2xl text-white">{title(sideView)}</span>
      <div>
        {details && (
          <Dropdown placement="bottom-end" list={details}>
            <Button className="text-white" color="blue">
              <ExclamationIcon className="w-6 h-6 mr-2" />
              <span>DETAILS</span>
            </Button>
          </Dropdown>
        )}
        {addFormat && (
          <Dropdown placement="bottom-end" list={addFormat}>
            <Button className="text-white" color="blue">
              <PlusIcon className="w-6 h-6 mr-2" />
              <span>ADD FORMAT</span>
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
});

DrugDetailSubTitle.displayName = 'DrugDetailSubTitle';
export default DrugDetailSubTitle;
