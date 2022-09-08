import React, { FC, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './drugs.abc.list.module.css';
import { IDrugABC, IFavoritesDrug } from 'shared/api/drug';
import { CurrencyDollarIcon, ExclamationIcon, UserIcon } from '@heroicons/react/outline';

import { IInteractionDrugcheck } from 'shared/api/allergy';
import Tooltip from 'shared/ui/tooltip';

interface IDrugCell {
  drug: IDrugABC | IFavoritesDrug;
  noCoupon: number;
  onClick?: (drug: IDrugABC | IFavoritesDrug) => void;
}

const DrugCell: FC<IDrugCell> = observer(({ drug, noCoupon, onClick }) => {
  const drugCellClick = () => {
    if (onClick) {
      onClick(drug);
    }
  };
  const getAllergyClass = (interaction: IInteractionDrugcheck): string => {
    switch (interaction.DDI_SL) {
      case '1':
        return 'green';
      case '2':
        return 'orange';
      case '3':
        return 'red';
      default:
        return 'red';
    }
  };

  const getMedicationDescription = (medicationType: string | number) => {
    switch (medicationType as string) {
      case '0':
        return 'Supply';
      case '1':
        return 'Rx';
      case '2':
        return 'Otc';
      case '3':
        return 'Rx / Otc';
      case '9':
        return 'Unknown';
      case '10':
        return 'Supply / Rx';
      case '20':
        return 'Supply / Otc';
      case '90':
        return 'Supply / Unknown';
      default:
        return 'Unknown';
    }
  };

  return (
    <div
      onClick={drugCellClick}
      onKeyDown={drugCellClick}
      role="presentation"
      className={`flex items-center text-sm p-2 ${onClick ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
    >
      {drug.interaction && <ExclamationIcon color={getAllergyClass(drug.interaction)} className="w-6 h-6 min-w-max mr-2" />}
      {drug.allergy && (
        <Tooltip content="Patient Allergic">
          <div>
            <UserIcon color="red" className="w-6 h-6 min-w-max mr-2" />
          </div>
        </Tooltip>
      )}
      {drug.offerid && noCoupon !== 1 && (
        <Tooltip content={`Coupon Offer: ${drug.offerid}`}>
          <div>
            <CurrencyDollarIcon color="green" className="w-6 h-6 min-w-max mr-2" />
          </div>
        </Tooltip>
      )}
      <div>
        <div>{drug.MED_ROUTED_MED_ID_DESC}</div>
        {drug.MED_NAME_TYPE_CD && (
          <div>
            {drug.MED_NAME_TYPE_CD === '1' ? 'Brand' : 'Generic'}
            {` (${getMedicationDescription(drug.TypeId)})`}
          </div>
        )}
      </div>
    </div>
  );
});

DrugCell.displayName = 'DrugCell';
export default DrugCell;
