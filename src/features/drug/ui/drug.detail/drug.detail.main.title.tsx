import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { PrinterIcon } from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import styles from './drug.detail.module.css';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import Dropdown from 'shared/ui/dropdown';

interface IDrugDetailMainTitle {
  removeFavorit?: () => void;
  addFavorit?: () => void;
  isFavorite: boolean;
  pharmacologyText?: string;
  print?: () => void;
  dgnames?: JSX.Element[];
  drugName?: string;
}

const DrugDetailMainTitle: FC<IDrugDetailMainTitle> = observer(({ isFavorite, pharmacologyText, removeFavorit, addFavorit, print, dgnames, drugName }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h5 className="text-3xl">{drugName ?? ''}</h5>
          <Dropdown list={dgnames ?? []}>
            <Tooltip content="Print Information Sheet">
              <Button onClick={print} variant="flat" shape="circle" color="gray">
                <PrinterIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          </Dropdown>
        </div>
        {isFavorite ? (
          <Button onClick={removeFavorit} className="ml-10">
            <HeartIcon className="w-6 h-6" />
            <span className="ml-2">REMOVE FAVORITE</span>
          </Button>
        ) : (
          <Button onClick={addFavorit} className="ml-10">
            <HeartIcon className="w-6 h-6" />
            <span className="ml-2">ADD FAVORITE</span>
          </Button>
        )}
      </div>
      <div
        className={`text-sm w-full after:bg-gray-300 
      ${styles.pharmacology}`}
      >
        {pharmacologyText}
      </div>
    </div>
  );
});

DrugDetailMainTitle.displayName = 'DrugDetailMainTitle';
export default DrugDetailMainTitle;
