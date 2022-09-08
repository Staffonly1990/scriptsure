import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { CheckCircleIcon, XCircleIcon, CurrencyDollarIcon, ExclamationIcon, UserIcon } from '@heroicons/react/solid';
import { IInteractionDrugcheck } from 'shared/api/allergy';
import Tooltip from 'shared/ui/tooltip';
import { ISearchDrug } from 'shared/api/drug';

interface IDrugSearchList {
  showDrugs: boolean;
  showIndications: boolean;
  searchDrugs: {
    drugs?: ISearchDrug[];
    indications?: {
      DXID: number;
      MED_ROUTED_MED_ID_DESC: string;
    }[];
  };
  openDetailsDrug: (drug: ISearchDrug) => void;
  openDetailsDrugIndication: (indication: { DXID: number; MED_ROUTED_MED_ID_DESC: string }) => void;
  noCoupon: number;
}

const DrugSearchList: FC<IDrugSearchList> = observer(({ searchDrugs, openDetailsDrug, noCoupon, showDrugs, showIndications, openDetailsDrugIndication }) => {
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

  const getAllergyClass = (interaction: IInteractionDrugcheck): string => {
    switch (interaction.DDI_SL) {
      case '1':
        return 'green';
      case '2':
        return 'orange';
      case '3':
        return 'red';
      default:
        return '';
    }
  };

  return (
    <div className="flex w-full">
      {showDrugs && (
        <div className="min-w-1/2 w-full">
          <div className="p-4 bg-blue-500 text-white">{`Drugs ${searchDrugs.drugs?.length ?? 0}`}</div>
          <div className="max-h-96 text-sm overflow-auto">
            <ul className="divide-y divide-gray-200">
              {searchDrugs.drugs?.map((drug) => (
                <li
                  onKeyDown={() => {
                    openDetailsDrug(drug);
                  }}
                  role="presentation"
                  onClick={() => {
                    openDetailsDrug(drug);
                  }}
                  className="hover:bg-gray-200 cursor-pointer flex items-center py-1"
                >
                  {drug.interaction && <ExclamationIcon color={getAllergyClass(drug.interaction)} className="w-6 h-6 min-w-max ml-2" />}
                  {drug.MED_STATUS_CD === '0' ? (
                    <CheckCircleIcon color="green" className="w-6 h-6 min-w-max mx-2" />
                  ) : (
                    <XCircleIcon color="red" className="w-6 h-6 min-w-max mx-2" />
                  )}
                  {drug.offerid && noCoupon !== 1 && (
                    <Tooltip content={`Coupon Offer: ${drug.offerid}`}>
                      <div>
                        <CurrencyDollarIcon color="green" className="w-6 h-6 min-w-max mr-2" />
                      </div>
                    </Tooltip>
                  )}
                  <div>
                    <div className={`${drug.DrugGroup ? 'text-blue-400' : null}`}>
                      {drug.MED_ROUTED_MED_ID_DESC && <span className="font-bold">{`${drug.MED_ROUTED_MED_ID_DESC.toUpperCase()}`}</span>}
                      {drug.GenericName && <span>{` (${drug.GenericName})`}</span>}
                    </div>

                    {drug.MED_NAME_TYPE_CD && (
                      <div>
                        {drug.MED_NAME_TYPE_CD === '1' ? 'Brand' : 'Generic'}
                        {` (${getMedicationDescription(drug.TypeId)})`}
                      </div>
                    )}

                    {drug.MED_STATUS_CD === '0' ? <div>ACTIVE</div> : <div className="text-red-600">INACTIVE</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {showIndications && (
        <div className="min-w-1/2 w-full">
          <div className="p-4 text-white bg-red-500">{`Indications ${searchDrugs.indications?.length ?? 0}`}</div>
          <div className="max-h-96 overflow-auto">
            <ul className="divide-y divide-gray-200">
              {searchDrugs.indications?.map((indication) => (
                <li
                  onClick={() => {
                    openDetailsDrugIndication(indication);
                  }}
                  onKeyDown={() => {
                    openDetailsDrugIndication(indication);
                  }}
                  role="presentation"
                  className="hover:bg-gray-200 cursor-pointer flex items-center p-2"
                >
                  {indication.MED_ROUTED_MED_ID_DESC}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});

DrugSearchList.displayName = 'DrugSearchList';
export default DrugSearchList;
